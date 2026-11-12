import { createHash, randomUUID } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, renameSync, existsSync, statSync, unlinkSync, rmdirSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

export class ReviewError extends Error {
  constructor(message, status = 409) { super(message); this.status = status; }
}
export function atomicJSON(path, data) {
  const temporary = `${path}.tmp`;
  writeFileSync(temporary, JSON.stringify(data), { mode: 0o600 });
  renameSync(temporary, path);
}
function snapshot(path) {
  let source;
  try {
    if (statSync(path).size > 2 * 1024 * 1024) throw new Error('Document exceeds 2 MB.');
    source = readFileSync(path, 'utf8');
  } catch (error) { throw new ReviewError(`Source unavailable: ${error.message}`); }
  return { path, source, hash: createHash('sha256').update(source).digest('hex') };
}
function required(condition, message, status = 409) {
  if (!condition) throw new ReviewError(message, status);
}
function headingAt(lines, line) {
  let heading = '', fence = false;
  for (const value of lines.slice(0, line)) {
    if (/^\s*(```|~~~)/.test(value)) fence = !fence;
    if (!fence && /^#{1,6}\s/.test(value)) heading = value.replace(/^#+\s*/, '');
  }
  return heading;
}
function normalizeComments(comments, document) {
  required(Array.isArray(comments) && comments.length <= 100, 'At most 100 comments per batch.', 400);
  const lines = document.source.split('\n'), seen = new Set();
  return comments.map(comment => {
    required(comment && typeof comment.id === 'string' && comment.id.length <= 100 && !seen.has(comment.id),
      'Invalid or duplicate comment ID.', 400);
    seen.add(comment.id);
    required(typeof comment.text === 'string' && comment.text.trim() && comment.text.length <= 12000,
      'Comment must contain between 1 and 12000 characters.', 400);
    const target = comment.target;
    required(target && ['text', 'paragraph', 'node', 'edge', 'diagram'].includes(target.kind), 'Invalid comment selection.', 400);
    const { startLine, endLine } = target;
    required(Number.isInteger(startLine) && Number.isInteger(endLine) && startLine > 0 &&
      endLine >= startLine && endLine <= lines.length, 'Invalid selection source lines.', 400);
    for (const key of ['quote', 'label', 'elementId']) {
      required(target[key] === undefined || (typeof target[key] === 'string' && target[key].length <= 20000),
        'Invalid selection label.', 400);
    }
    for (const key of ['startTextOffset', 'endTextOffset']) {
      required(target[key] === undefined || (Number.isSafeInteger(target[key]) && target[key] >= 0 && target[key] <= 2000000),
        'Invalid text selection offset.', 400);
    }
    const excerpt = lines.slice(startLine - 1, endLine).join('\n');
    if (['node', 'edge', 'diagram'].includes(target.kind)) {
      required(/^\s*(`{3,}|~{3,})mermaid\b/m.test(excerpt), 'Diagram selection must name a Mermaid block.', 400);
    }
    return { id: comment.id, text: comment.text.trim(), target: {
      kind: target.kind, startLine, endLine, quote: target.quote ?? '',
      ...(target.startTextOffset !== undefined ? { startTextOffset: target.startTextOffset, endTextOffset: target.endTextOffset } : {}),
      ...(target.elementId ? { elementId: target.elementId } : {}), ...(target.label ? { label: target.label } : {}),
    }, context: { heading: headingAt(lines, startLine - 1), source: excerpt,
      before: lines.slice(Math.max(0, startLine - 4), startLine - 1).join('\n'),
      after: lines.slice(endLine, endLine + 3).join('\n') } };
  });
}

/** Owns one document's reviewed snapshot, durable draft and acknowledged publication lifecycle. */
export class ReviewSession {
  constructor(file, directory, { serverLock = false } = {}) {
    this.directory = resolve(directory);
    this.file = resolve(file);
    this.path = join(this.directory, 'state.json');
    mkdirSync(this.directory, { recursive: true, mode: 0o700 });
    if (existsSync(this.path)) {
      this.state = JSON.parse(readFileSync(this.path, 'utf8'));
      required(this.state.schema === 1 && this.state.owner === 'gautier-design-review' && this.state.document.path === this.file,
        'Directory is not an owned session for this document.');
    } else {
      required(readdirSync(this.directory).every(name => serverLock && name === 'server.lock'),
        'Use an empty directory or an owned review session.');
      this.state = { schema: 1, owner: 'gautier-design-review', id: randomUUID(), phase: 'reviewing', round: 1, sequence: 0,
        document: snapshot(this.file), draft: { revision: 0, comments: [] }, pending: null, lastPublished: null };
      this.persist();
    }
  }
  persist() {
    try { atomicJSON(this.path, this.state); }
    catch (error) {
      if (existsSync(this.path)) this.state = JSON.parse(readFileSync(this.path, 'utf8'));
      throw error;
    }
  }
  view() {
    let current = null, sourceError = null;
    try { current = snapshot(this.file); } catch (error) { sourceError = error.message; }
    return structuredClone({ ...this.state, stale: !current || current.hash !== this.state.document.hash,
      currentHash: current?.hash ?? null, sourceError });
  }
  assertReviewing() { required(this.state.phase === 'reviewing', 'Comments already sent, or the review has ended.'); }
  assertVersion(input) {
    required(input.hash === this.state.document.hash && input.round === this.state.round, 'This review version changed. Reload the page.');
  }
  assertDraftVersion(input) {
    this.assertVersion(input);
    required(input.revision === this.state.draft.revision, 'The draft changed in another tab. Reload to get its comments.');
  }
  saveDraft(input) {
    this.assertReviewing(); this.assertVersion(input);
    required(input.revision === this.state.draft.revision, 'The draft changed in another tab. Reload to get its comments.');
    const comments = normalizeComments(input.comments, this.state.document);
    this.state.draft = { revision: input.revision + 1, comments };
    this.persist(); return this.view();
  }
  submit(input) {
    required(typeof input.requestId === 'string' && input.requestId.length <= 100, 'Submission needs a request ID.', 400);
    if (this.state.pending?.requestId === input.requestId) return structuredClone(this.state.pending);
    this.assertReviewing(); this.assertVersion(input);
    required(input.revision === this.state.draft.revision, 'The draft changed in another tab. Reload to get its comments.');
    const current = this.view();
    required(!current.sourceError, current.sourceError ?? 'Source unavailable.');
    required(!current.stale, 'Source changed. Reload the document before sending comments.');
    required(this.state.draft.comments.length > 0, 'Add a comment before sending.');
    this.state.sequence++;
    this.state.pending = { type: 'comments', id: randomUUID(), sequence: this.state.sequence, requestId: input.requestId,
      document: { path: this.file, hash: this.state.document.hash, round: this.state.round },
      comments: structuredClone(this.state.draft.comments) };
    this.state.phase = 'submitted'; this.persist();
    return structuredClone(this.state.pending);
  }
  nextEvent(after = 0) {
    if (this.state.phase === 'ended') return { type: 'ended', sequence: this.state.sequence, document: { path: this.file } };
    return this.state.pending && this.state.pending.sequence > after ? structuredClone(this.state.pending) : null;
  }
  publish(batchId) {
    if (batchId && batchId === this.state.lastPublished) return this.view();
    required(this.state.phase === 'submitted' && this.state.pending?.id === batchId, 'Publish requires the pending batch ID.');
    const document = snapshot(this.file);
    this.state.lastPublished = batchId;
    this.newRound(document); return this.view();
  }
  refresh(discard = false, expected) {
    this.assertReviewing();
    if (expected) this.assertDraftVersion(expected);
    required(discard || this.state.draft.comments.length === 0, 'Send or explicitly discard the pending comments first.');
    this.newRound(snapshot(this.file)); return this.view();
  }
  newRound(document) {
    this.state.document = document; this.state.round++; this.state.phase = 'reviewing';
    this.state.draft = { revision: 0, comments: [] }; this.state.pending = null; this.persist();
  }
  end(discard = false, expected) {
    if (expected) this.assertDraftVersion(expected);
    required(discard || (!this.state.pending && !this.state.draft.comments.length), 'Pending comments must be sent or explicitly discarded.');
    if (this.state.phase !== 'ended') this.state.sequence++;
    this.state.phase = 'ended'; this.state.pending = null; this.state.draft.comments = []; this.persist();
    return this.nextEvent();
  }
  cleanup() {
    required(this.state.phase === 'ended', 'End the review before cleanup.');
    for (const name of ['state.json', 'state.json.tmp', 'session.json', 'session.json.tmp']) {
      try { unlinkSync(join(this.directory, name)); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    }
    try { rmdirSync(this.directory); } catch (error) { if (!['ENOENT', 'ENOTEMPTY'].includes(error.code)) throw error; }
  }
}
