import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, mkdtempSync, cpSync, symlinkSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const assets = dirname(fileURLToPath(import.meta.url));
function inventory(directory) {
  return Object.fromEntries(readdirSync(directory).sort().map(name => [name,
    createHash('sha256').update(readFileSync(join(directory, name))).digest('hex')]));
}
test('rebuilding is deterministic and removes obsolete generated chunks', t => {
  const directory = mkdtempSync(join(tmpdir(), 'review-bundle-build-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  for (const name of ['package.json', 'vendor-entry.mjs', 'build-vendor.mjs']) cpSync(join(assets, name), join(directory, name));
  symlinkSync(join(assets, 'node_modules'), join(directory, 'node_modules'), 'dir');
  execFileSync(process.execPath, [join(directory, 'build-vendor.mjs')], { cwd: directory });
  const before = inventory(join(directory, 'vendor'));
  writeFileSync(join(directory, 'vendor', 'old-chunk.js'), 'obsolete');
  execFileSync(process.execPath, [join(directory, 'build-vendor.mjs')], { cwd: directory });
  assert.deepEqual(inventory(join(directory, 'vendor')), before);
});
