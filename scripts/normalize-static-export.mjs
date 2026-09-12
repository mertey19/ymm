import { readdir, copyFile, access } from 'node:fs/promises';
import path from 'node:path';

// Next 16.3's exporter replaces POSIX separators but leaves Windows separators
// in nested RSC segment names. The browser always requests dot-separated names.
// Add portable aliases without modifying Next.js or removing its original output.
const root = path.resolve('out');
let aliases = 0;
async function filesIn(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await filesIn(file)));
    else files.push(file);
  }
  return files;
}
async function normalize(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.name.startsWith('__next.')) {
      for (const source of await filesIn(fullPath)) {
        const name = path.relative(directory, source).split(path.sep).join('.');
        const target = path.join(directory, name);
        try {
          await access(target);
        } catch {
          await copyFile(source, target);
          aliases++;
        }
      }
    } else if (entry.name !== '_next') await normalize(fullPath);
  }
}
await normalize(root);
console.log(`Static export: ${aliases} Windows RSC aliases prepared.`);
