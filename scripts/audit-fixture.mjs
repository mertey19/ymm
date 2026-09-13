// Creates an isolated local libSQL database for repeatable Vercel-runtime QA.
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { pbkdf2Sync, randomBytes } from 'node:crypto';

await mkdir('.sites-runtime/audit', { recursive: true });
await rm('.sites-runtime/audit/vercel-test.db', { force: true });
await rm('.sites-runtime/audit/vercel-test.db-shm', { force: true });
await rm('.sites-runtime/audit/vercel-test.db-wal', { force: true });

const salt = randomBytes(16);
const hash = pbkdf2Sync('Local-Test-Password-Only', salt, 100000, 32, 'sha256');
await writeFile(
  '.sites-runtime/audit/test.env',
  [
    'TURSO_DATABASE_URL=file:.sites-runtime/audit/vercel-test.db',
    `ADMIN_PASSWORD_HASH=100000:${salt.toString('hex')}:${hash.toString('hex')}`,
    '',
  ].join('\n'),
);
console.log('Fresh isolated libSQL QA database configured.');
