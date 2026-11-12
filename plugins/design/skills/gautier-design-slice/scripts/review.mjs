#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import { ReviewSession } from './review-session.mjs';
import { startServer } from './review-server.mjs';

const entry = fileURLToPath(import.meta.url), args = process.argv.slice(2);
const command = args.shift(), target = args.shift();
const option = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const print = value => console.log(JSON.stringify(value));
const read = path => JSON.parse(readFileSync(path, 'utf8'));
async function request(info, path, input) {
  const response = await fetch(`${info.baseUrl}${path}`, { method: input === undefined ? 'GET' : 'POST',
    headers: { 'X-Review-Token': info.token, 'Content-Type': 'application/json' },
    ...(input === undefined ? {} : { body: JSON.stringify(input) }), signal: AbortSignal.timeout(25000) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? `Request failed (${response.status}).`);
  return data;
}
async function start() {
  if (!target) throw new Error('Provide a Markdown file.');
  const file = resolve(target), directory = resolve(option('--session-dir') ?? mkdtempSync(join(tmpdir(), 'gautier-review-')));
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const metadata = join(directory, 'session.json');
  if (existsSync(metadata)) {
    const old = read(metadata);
    if (old.file !== file) throw new Error('Session belongs to a different document.');
    try { await request(old, '/api/state'); print(old); return; } catch { /* Resume saved session. */ }
  }
  const child = spawn(process.execPath, [entry, 'serve', file, '--session-dir', directory,
    '--port', option('--port') ?? '0'], { detached: true, stdio: ['ignore', 'ignore', 'pipe'] });
  child.unref(); child.stderr.unref();
  let failure, startupError = '';
  child.stderr.on('data', chunk => { startupError += chunk.toString(); });
  child.on('error', error => { failure = error; });
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    if (failure) throw failure;
    if (existsSync(metadata)) {
      const info = read(metadata);
      if (info.pid === child.pid) { print(info); return; }
    }
    if (child.exitCode !== null) break;
    await delay(50);
  }
  // Another concurrent starter may have acquired the same session first.
  if (existsSync(metadata)) {
    const info = read(metadata);
    try { await request(info, '/api/state'); print(info); return; } catch { /* Report our startup failure. */ }
  }
  throw new Error(startupError.trim() || 'Server did not start. Try a new session directory.');
}
async function main() {
  if (!command || command === '--help') {
    console.log(`Local Markdown review (Node.js 20+)\n\n` +
      `start FILE [--session-dir DIR] [--port PORT]  Start/resume; returns URL and session directory\n` +
      `wait DIR [--after SEQUENCE]                 Wait for a comment batch or end signal\n` +
      `publish DIR --batch ID                      Acknowledge feedback; publish completed edits\n` +
      `refresh DIR [--discard]                     Reload an unsent review from the source\n` +
      `stop DIR [--discard]                        End server; remove owned temporary files`);
    return;
  }
  if (command === 'start') return start();
  if (!target) throw new Error('Provide the session directory.');
  if (command === 'serve') {
    const running = await startServer({ file: resolve(target), directory: option('--session-dir'), port: Number(option('--port') ?? 0) });
    process.on('SIGTERM', () => { void running.close(); });
    process.on('SIGINT', () => { void running.close(); });
    return;
  }
  const directory = resolve(target), statePath = join(directory, 'state.json');
  const state = read(statePath), info = read(join(directory, 'session.json'));
  const expected = { hash: state.document.hash, round: state.round, revision: state.draft.revision };
  if (command === 'wait') {
    const after = Number(option('--after') ?? 0);
    if (!Number.isSafeInteger(after) || after < 0) throw new Error('Invalid event sequence.');
    for (;;) {
      const saved = read(statePath);
      if (saved.phase === 'ended') { print({ type: 'ended', sequence: saved.sequence, document: { path: saved.document.path } }); return; }
      const event = await request(info, `/api/wait?after=${after}`);
      if (event.type !== 'waiting') { print(event); return; }
    }
  }
  if (command === 'publish' || command === 'refresh') {
    const value = command === 'publish' ? await request(info, '/api/publish', { batchId: option('--batch') }) :
      await request(info, '/api/refresh', { ...expected, discard: args.includes('--discard') });
    print({ type: command === 'publish' ? 'published' : 'refreshed', round: value.round,
      document: { path: value.document.path, hash: value.document.hash } }); return;
  }
  if (command === 'stop') {
    if (state.phase !== 'ended') await request(info, '/api/end', { ...expected, discard: args.includes('--discard') });
    const session = new ReviewSession(state.document.path, directory);
    session.cleanup(); print({ type: 'stopped', directory }); return;
  }
  throw new Error(`Unknown command: ${command}`);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
