import { build } from 'esbuild';
import { mkdtemp, readFile, writeFile, rename, rm, cp } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Build locally pinned, offline browser assets. Replace the whole directory so old chunks cannot accumulate.
const root = dirname(fileURLToPath(import.meta.url));
const staging = await mkdtemp(join(root, '.vendor-build-'));
const destination = join(root, 'vendor'), backup = join(staging, 'previous');
let moved = false;
try {
  const output = join(staging, 'next');
  await build({ absWorkingDir: root, entryPoints: ['vendor-entry.mjs'], bundle: true, format: 'esm', minify: true,
    outdir: output, entryNames: 'renderers', legalComments: 'linked' });
  await cp(join(root, 'node_modules/@mermaid-js/tiny/dist/mermaid.tiny.js'), join(output, 'mermaid.tiny.js'));
  // Keep the upstream MIT notice beside the unmodified distribution.
  const license = await readFile(join(root, 'node_modules/@mermaid-js/tiny/LICENSE'), 'utf8');
  await writeFile(join(output, 'mermaid.tiny.LICENSE.txt'), license);
  try { await rename(destination, backup); moved = true; } catch (error) { if (error.code !== 'ENOENT') throw error; }
  try { await rename(output, destination); }
  catch (error) { if (moved) { await rename(backup, destination); moved = false; } throw error; }
} finally {
  await rm(staging, { recursive: true, force: true });
}
