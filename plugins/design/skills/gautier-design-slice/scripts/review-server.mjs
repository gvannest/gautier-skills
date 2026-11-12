import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import { readFileSync, realpathSync } from 'node:fs';
import { dirname, resolve, sep, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ReviewSession, ReviewError, atomicJSON } from './review-session.mjs';
import { acquireSessionLock } from './review-lock.mjs';

const assets = fileURLToPath(new URL('../assets/review/', import.meta.url));
const mime = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2' };
function send(response, status, value) {
  if (response.destroyed || response.writableEnded) return;
  response.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  response.end(JSON.stringify(value));
}
async function body(request) {
  const chunks = []; let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 1024 * 1024) throw new ReviewError('Request is too large.', 413);
    chunks.push(chunk);
  }
  try {
    const value = JSON.parse(Buffer.concat(chunks).toString());
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error();
    return value;
  } catch { throw new ReviewError('Expected a JSON object.', 400); }
}
function serveFile(response, root, relative, imagesOnly = false) {
  try {
    const base = realpathSync(root), path = realpathSync(resolve(base, relative));
    const extension = extname(path).toLowerCase();
    if (!path.startsWith(base + sep) || !mime[extension] || (imagesOnly && !mime[extension].startsWith('image/'))) {
      return send(response, 404, { error: 'File not available.' });
    }
    response.writeHead(200, { 'Content-Type': `${mime[extension]}; charset=utf-8`, 'Cache-Control': 'no-cache' });
    response.end(readFileSync(path));
  } catch { send(response, 404, { error: 'File not available.' }); }
}

/** Loopback adapter for a single document session; never writes the Markdown source. */
export async function startServer({ file, directory, port = 0 }) {
  const release = acquireSessionLock(directory);
  let session;
  try { session = new ReviewSession(file, directory, { serverLock: true }); }
  catch (error) { release(); throw error; }
  const token = randomBytes(24).toString('hex');
  const waiting = new Set(); let baseUrl, closing = false;
  function notify() {
    for (const waiter of [...waiting]) {
      const event = session.nextEvent(waiter.after);
      if (event) { clearTimeout(waiter.timer); waiting.delete(waiter); send(waiter.response, 200, event); }
    }
  }
  async function handler(request, response) {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'no-referrer');
    try {
      const url = new URL(request.url, baseUrl);
      if (request.headers.host !== new URL(baseUrl).host) return send(response, 403, { error: 'Local host required.' });
      if (url.pathname.startsWith('/api/')) {
        const origin = request.headers.origin;
        if (request.headers['x-review-token'] !== token || (origin && origin !== baseUrl)) {
          return send(response, 403, { error: 'Review session authorization required.' });
        }
        if (request.method === 'GET' && url.pathname === '/api/state') return send(response, 200, session.view());
        if (request.method === 'GET' && url.pathname === '/api/wait') {
          const after = Number(url.searchParams.get('after') ?? 0);
          if (!Number.isSafeInteger(after) || after < 0) throw new ReviewError('Invalid event sequence.', 400);
          const event = session.nextEvent(after);
          if (event) return send(response, 200, event);
          const waiter = { response, after };
          waiter.timer = setTimeout(() => { waiting.delete(waiter); send(response, 200, { type: 'waiting' }); }, 20000);
          waiting.add(waiter);
          response.on('close', () => { clearTimeout(waiter.timer); waiting.delete(waiter); });
          return;
        }
        if (request.method !== 'POST') return send(response, 404, { error: 'Unknown operation.' });
        const input = await body(request); let result;
        switch (url.pathname) {
          case '/api/draft': result = session.saveDraft(input); break;
          case '/api/send': result = session.submit(input); break;
          case '/api/publish': result = session.publish(input.batchId); break;
          case '/api/refresh': result = session.refresh(input.discard === true, input); break;
          case '/api/end': result = session.end(input.discard === true, input); break;
          default: return send(response, 404, { error: 'Unknown operation.' });
        }
        notify(); send(response, 200, result);
        if (url.pathname === '/api/end') void close();
        return;
      }
      if (request.method !== 'GET') return send(response, 405, { error: 'Read-only asset.' });
      if (url.pathname === '/') return serveFile(response, assets, 'index.html');
      if (url.pathname.startsWith('/assets/')) return serveFile(response, assets, decodeURIComponent(url.pathname.slice(8)));
      if (url.pathname.startsWith('/document-assets/')) {
        return serveFile(response, dirname(session.file), decodeURIComponent(url.pathname.slice(17)), true);
      }
      send(response, 404, { error: 'Not found.' });
    } catch (error) { send(response, error.status ?? 500, { error: error.message }); }
  }
  const server = createServer((request, response) => { void handler(request, response); });
  try {
    await new Promise((resolveReady, reject) => {
      server.once('error', reject);
      server.listen(port, '127.0.0.1', resolveReady);
    });
  } catch (error) { release(); throw error; }
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  const info = { schema: 1, id: session.state.id, pid: process.pid, file: session.file,
    directory: session.directory, baseUrl, token, url: `${baseUrl}/#token=${token}` };
  atomicJSON(join(session.directory, 'session.json'), info);
  function close() {
    if (closing) return Promise.resolve();
    closing = true;
    for (const waiter of waiting) { clearTimeout(waiter.timer); send(waiter.response, 200, { type: 'waiting' }); }
    waiting.clear();
    return new Promise(done => { server.close(() => { release(); done(); }); server.closeIdleConnections(); });
  }
  return { info, session, close };
}
