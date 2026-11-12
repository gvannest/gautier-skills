import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ReviewSession } from './review-session.mjs';

const source = '# Design\n\nThe worker claims a job.\n\n```mermaid\nflowchart LR\n  A[Queue] --> B[Worker]\n```\n';
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'review-test-'));
  const file = join(root, 'design.md');
  writeFileSync(file, source);
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return { root, file, session: new ReviewSession(file, join(root, 'session')) };
}
function comment(id = 'c1') {
  return { id, text: 'Explain the claim rule.', target: { kind: 'paragraph', startLine: 3, endLine: 3,
    quote: 'The worker claims a job.' } };
}
function save(session, comments = [comment()]) {
  const state = session.view();
  return session.saveDraft({ hash: state.document.hash, round: state.round, revision: state.draft.revision, comments });
}
function send(session, requestId = 'send-1') {
  const state = session.view();
  return session.submit({ hash: state.document.hash, round: state.round, revision: state.draft.revision, requestId });
}

test('handoff carries authoritative source context and is durable until publish', t => {
  const { session, file, root } = fixture(t);
  save(session);
  const batch = send(session);
  assert.equal(batch.type, 'comments');
  assert.equal(batch.comments[0].context.source, 'The worker claims a job.');
  assert.equal(batch.comments[0].context.heading, 'Design');
  assert.equal(batch.document.path, file);
  assert.equal(session.nextEvent(0).id, batch.id);
  const recovered = new ReviewSession(file, join(root, 'session'));
  assert.deepEqual(recovered.nextEvent(0), batch);
  writeFileSync(file, source.replace('claims a job', 'claims the next available job'));
  assert.equal(recovered.view().document.source, source);
  assert.equal(recovered.view().stale, true);
  assert.throws(() => recovered.publish('wrong-batch'), /batch/i);
  recovered.publish(batch.id);
  const next = recovered.view();
  assert.equal(next.phase, 'reviewing');
  assert.equal(next.round, 2);
  assert.equal(next.draft.comments.length, 0);
  assert.match(next.document.source, /next available/);
  assert.equal(recovered.nextEvent(batch.sequence), null);
  assert.equal(readFileSync(file, 'utf8'), source.replace('claims a job', 'claims the next available job'));
});

test('retries deduplicate one submission and optimistic revisions reject tab conflicts', t => {
  const { session } = fixture(t);
  const old = session.view();
  save(session);
  assert.throws(() => session.saveDraft({ hash: old.document.hash, round: 1, revision: old.draft.revision,
    comments: [comment('another-tab')] }), /another tab/i);
  const first = send(session);
  assert.equal(send(session).id, first.id);
  assert.throws(() => send(session, 'different'), /already sent/i);
  session.publish(first.id);
  session.publish(first.id);
  assert.equal(session.view().round, 2);
});

test('changed or missing source prevents sending without losing pending comments', t => {
  const { session, file } = fixture(t);
  save(session);
  writeFileSync(file, '# Changed\n');
  assert.equal(session.view().stale, true);
  assert.throws(() => send(session), /changed/i);
  assert.throws(() => session.refresh(false), /discard/i);
  assert.equal(session.view().draft.comments[0].text, 'Explain the claim rule.');
  rmSync(file);
  assert.throws(() => send(session), /unavailable/i);
  assert.equal(session.view().document.source, source);
  writeFileSync(file, '# Changed\n');
  session.refresh(true);
  assert.equal(session.view().draft.comments.length, 0);
  assert.equal(session.view().document.source, '# Changed\n');
});

test('ending refuses pending work, exposes an end event and cleans only owned files', t => {
  const { session, root } = fixture(t);
  save(session);
  assert.throws(() => session.end(false), /pending/i);
  send(session);
  assert.throws(() => session.end(false), /pending/i);
  const ended = session.end(true);
  assert.equal(ended.type, 'ended');
  assert.equal(session.nextEvent(0).type, 'ended');
  writeFileSync(join(root, 'session', 'unrelated.txt'), 'keep');
  session.cleanup();
  assert.equal(readFileSync(join(root, 'session', 'unrelated.txt'), 'utf8'), 'keep');
});

test('invalid selections and blank comments cannot enter the batch', t => {
  const { session } = fixture(t);
  for (const bad of [ { ...comment(), text: ' ' },
    { ...comment(), target: { kind: 'paragraph', startLine: 90, endLine: 100 } },
    { ...comment(), target: { kind: 'edge', startLine: 3, endLine: 3, quote: 'made up' } },
    { ...comment(), target: { ...comment().target, kind: 'unknown' } } ]) {
    assert.throws(() => save(session, [bad]), /comment|selection|diagram/i);
  }
  assert.throws(() => save(session, [comment(), comment()]), /duplicate/i);
  assert.equal(session.view().draft.comments.length, 0);
});

test('a failed durable write cannot consume or replace saved feedback', t => {
  const { session, root } = fixture(t);
  save(session);
  const obstruction = join(root, 'session', 'state.json.tmp');
  mkdirSync(obstruction);
  assert.throws(() => send(session));
  assert.equal(session.view().phase, 'reviewing');
  assert.equal(session.nextEvent(0), null);
  assert.equal(session.view().draft.comments.length, 1);
  rmSync(obstruction, { recursive: true });
  assert.equal(send(session).sequence, 1);
});

test('stale destructive confirmations cannot discard newer comments', t => {
  const { session } = fixture(t);
  const original = session.view();
  const expected = { hash: original.document.hash, round: original.round, revision: original.draft.revision };
  save(session);
  assert.throws(() => session.refresh(true, expected), /another tab/i);
  assert.throws(() => session.end(true, expected), /another tab/i);
  assert.equal(session.view().draft.comments.length, 1);
});

test('unrelated existing session directories are never claimed or cleaned', t => {
  const root = mkdtempSync(join(tmpdir(), 'review-owned-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const file = join(root, 'doc.md'), directory = join(root, 'personal');
  writeFileSync(file, '# Document'); mkdirSync(directory); writeFileSync(join(directory, 'server.log'), 'keep this');
  assert.throws(() => new ReviewSession(file, directory), /empty|owned/i);
  assert.equal(readFileSync(join(directory, 'server.log'), 'utf8'), 'keep this');
});

test('repeated selected text retains its exact rendered offsets in the batch', t => {
  const { session } = fixture(t);
  const selected = { ...comment(), target: { ...comment().target, kind: 'text', startTextOffset: 12, endTextOffset: 18 } };
  save(session, [selected]);
  const target = send(session).comments[0].target;
  assert.equal(target.startTextOffset, 12);
  assert.equal(target.endTextOffset, 18);
});
