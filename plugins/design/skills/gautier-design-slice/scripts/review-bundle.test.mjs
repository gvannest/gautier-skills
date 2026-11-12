import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const assets = fileURLToPath(new URL('../assets/review/', import.meta.url));
test('shipped offline libraries fit the small review-app footprint', () => {
  const vendor = join(assets, 'vendor'), files = readdirSync(vendor);
  assert.ok(files.length <= 5, `Expected at most 5 vendor files, found ${files.length}.`);
  const bytes = files.reduce((sum, name) => sum + statSync(join(vendor, name)).size, 0);
  assert.ok(bytes < 3000000, `Expected less than 3 MB of vendor assets, found ${bytes} bytes.`);
});

