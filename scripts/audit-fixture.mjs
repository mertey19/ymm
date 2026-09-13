// Isolated local D1 fixture; never replaces the user's .dev.vars or normal database.
import { mkdir, writeFile, readdir, access } from 'node:fs/promises';
import { pbkdf2Sync, randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
await mkdir('.sites-runtime/audit', { recursive: true });
// Refuse to reset an existing fixture; reuse it or choose a new isolated directory.
try {
  await access('.sites-runtime/audit/initialized');
  console.log('Existing audit fixture preserved.');
  process.exit(0);
} catch {}
const salt = randomBytes(16);
const hash = pbkdf2Sync('Local-Test-Password-Only', salt, 100000, 32, 'sha256');
await writeFile(
  '.sites-runtime/audit/test.vars',
  `ADMIN_PASSWORD_HASH=100000:${salt.toString('hex')}:${hash.toString('hex')}\n`,
);
for (const file of (await readdir('drizzle')).filter((f) => f.endsWith('.sql')).sort()) {
  const result = spawnSync(
    process.execPath,
    [
      '--import',
      './scripts/sites-env.mjs',
      './node_modules/wrangler/bin/wrangler.js',
      'd1',
      'execute',
      'DB',
      '--config',
      'dist/server/wrangler.json',
      '--local',
      '--persist-to',
      '.sites-runtime/audit/state',
      '--file',
      `drizzle/${file}`,
    ],
    { stdio: 'inherit' },
  );
  if (result.status !== 0) process.exit(result.status || 1);
}
await writeFile('.sites-runtime/audit/initialized', 'Local QA only\n');
