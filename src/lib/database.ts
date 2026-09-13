import 'server-only';
import { mkdirSync } from 'node:fs';
import type { Client } from '@libsql/client';

declare global {
  // Reuse the client and schema promise across warm Vercel function invocations.
  var karenDatabaseClient: Promise<Client> | undefined;
  var karenDatabaseSchema: Promise<void> | undefined;
}

function databaseConfig() {
  const configuredUrl = process.env.TURSO_DATABASE_URL?.trim();
  if (configuredUrl)
    return { url: configuredUrl, authToken: process.env.TURSO_AUTH_TOKEN?.trim() || undefined };

  if (process.env.VERCEL)
    throw new Error('TURSO_DATABASE_URL is unavailable in the Vercel environment');

  mkdirSync('.sites-runtime', { recursive: true });
  return { url: 'file:.sites-runtime/vercel-local.db' };
}

export function hasDatabaseConfiguration() {
  return !process.env.VERCEL || Boolean(process.env.TURSO_DATABASE_URL?.trim());
}

async function createDatabaseClient() {
  const config = databaseConfig();
  if (config.url.startsWith('file:')) {
    const { createClient } = await import('@libsql/client');
    return createClient(config);
  }
  const { createClient } = await import('@libsql/client/web');
  return createClient(config);
}

async function initializeSchema(client: Client) {
  await client.batch(
    [
      `CREATE TABLE IF NOT EXISTS content (
        id INTEGER PRIMARY KEY,
        document TEXT NOT NULL,
        revision INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS admin_sessions (
        token_hash TEXT PRIMARY KEY,
        expires_at INTEGER NOT NULL,
        password_version TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS login_attempts (
        key TEXT PRIMARY KEY,
        count INTEGER NOT NULL,
        expires_at INTEGER NOT NULL
      )`,
      'CREATE INDEX IF NOT EXISTS admin_sessions_expiry ON admin_sessions(expires_at)',
      'CREATE INDEX IF NOT EXISTS login_attempts_expiry ON login_attempts(expires_at)',
    ],
    'write',
  );
}

export async function database() {
  globalThis.karenDatabaseClient ??= createDatabaseClient();
  const client = await globalThis.karenDatabaseClient;
  globalThis.karenDatabaseSchema ??= initializeSchema(client);
  await globalThis.karenDatabaseSchema;
  return client;
}
