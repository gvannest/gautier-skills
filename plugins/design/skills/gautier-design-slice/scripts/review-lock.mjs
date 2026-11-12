import { openSync, readFileSync, writeFileSync, unlinkSync, closeSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

/** One writer per session directory, recoverable after that writer exits. */
export function acquireSessionLock(directory) {
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const path = join(directory, 'server.lock'), nonce = randomUUID();
  if (!existsSync(join(directory, 'state.json')) && readdirSync(directory).some(name => name !== 'server.lock')) {
    throw new Error('Use an empty directory or an owned review session.');
  }
  for (let attempt = 0; attempt < 2; attempt++) {
    let fd;
    try { fd = openSync(path, 'wx', 0o600); }
    catch (error) {
      if (error.code !== 'EEXIST') throw error;
      let lock;
      try { lock = JSON.parse(readFileSync(path, 'utf8')); }
      catch { throw new Error('Session is being started. Try again.'); }
      if (lock.owner !== 'gautier-design-review' || !Number.isSafeInteger(lock.pid) || lock.pid <= 0) {
        throw new Error('An unrecognized session lock exists; use another directory.');
      }
      try { process.kill(lock.pid, 0); }
      catch (processError) {
        if (processError.code === 'ESRCH') { unlinkSync(path); continue; }
        throw processError;
      }
      throw new Error('Review session already running.');
    }
    try { writeFileSync(fd, JSON.stringify({ owner: 'gautier-design-review', pid: process.pid, nonce })); }
    finally { closeSync(fd); }
    return () => {
      try { if (JSON.parse(readFileSync(path, 'utf8')).nonce === nonce) unlinkSync(path); }
      catch (error) { if (error.code !== 'ENOENT') throw error; }
    };
  }
  throw new Error('Could not claim the session. Try again.');
}
