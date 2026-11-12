import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { startServer } from './review-server.mjs';
const exec = promisify(execFile);
const cli = fileURLToPath(new URL('./review.mjs', import.meta.url));

async function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'review-http-'));
  const file = join(root, 'design.md'), directory = join(root, 'session');
  writeFileSync(file, '# Design\n\nQueue the job.\n');
  const server = await startServer({ file, directory, port: 0 });
  t.after(async () => { await server.close(); rmSync(root, { recursive: true, force: true }); });
  const call = async (path, body, token = server.info.token) => {
    const response = await fetch(`${server.info.baseUrl}${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: { 'X-Review-Token': token, 'Content-Type': 'application/json' },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    return { status: response.status, data: await response.json() };
  };
  return { file, directory, server, call };
}

test('HTTP → waiting CLI → publish → end preserves context and process-independent feedback', async t => {
  const { file, directory, server, call } = await fixture(t);
  const state = (await call('/api/state')).data;
  assert.equal((await fetch(server.info.baseUrl)).status, 200);
  const draft = await call('/api/draft', { hash: state.document.hash, round: 1, revision: 0,
    comments: [{ id: 'comment-one', text: 'Explain when.', target: {
      kind: 'paragraph', startLine: 3, endLine: 3, quote: 'Queue the job.' } }] });
  assert.equal(draft.status, 200);
  const waiting = exec(process.execPath, [cli, 'wait', directory], { timeout: 10000 });
  const sent = await call('/api/send', { hash: state.document.hash, round: 1, revision: 1, requestId: 'request-one' });
  assert.equal(sent.status, 200);
  const delivered = JSON.parse((await waiting).stdout);
  assert.equal(delivered.comments[0].context.source, 'Queue the job.');
  assert.equal(delivered.id, sent.data.id);
  const again = JSON.parse((await exec(process.execPath, [cli, 'wait', directory])).stdout);
  assert.equal(again.id, delivered.id);
  writeFileSync(file, '# Design\n\nQueue the job at 07:30.\n');
  const published = JSON.parse((await exec(process.execPath, [cli, 'publish', directory, '--batch', delivered.id])).stdout);
  assert.equal(published.round, 2);
  assert.equal((await call('/api/state')).data.draft.comments.length, 0);
  const ended = await call('/api/end', { hash: published.document.hash, round: 2, revision: 0, discard: false });
  assert.equal(ended.data.type, 'ended');
  const terminal = JSON.parse((await exec(process.execPath, [cli, 'wait', directory])).stdout);
  assert.equal(terminal.type, 'ended');
  await exec(process.execPath, [cli, 'stop', directory]);
  assert.equal(existsSync(directory), false);
});

test('HTTP authorization and invalid body failures preserve draft state', async t => {
  const { server, call } = await fixture(t);
  assert.equal((await call('/api/state', undefined, 'wrong')).status, 403);
  const cross = await fetch(`${server.info.baseUrl}/api/end`, { method: 'POST',
    headers: { 'X-Review-Token': server.info.token, Origin: 'https://example.org' }, body: '{}' });
  assert.equal(cross.status, 403);
  const bad = await fetch(`${server.info.baseUrl}/api/send`, { method: 'POST',
    headers: { 'X-Review-Token': server.info.token }, body: 'not json' });
  assert.equal(bad.status, 400);
  assert.equal((await call('/api/state')).data.phase, 'reviewing');
});

test('a second server cannot become a concurrent writer of the same session', async t => {
  const { file, directory } = await fixture(t);
  await assert.rejects(async () => {
    const other = await startServer({ file, directory });
    await other.close();
  }, /already running/i);
});
