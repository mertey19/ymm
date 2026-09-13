import { env } from 'cloudflare:workers';
import { cookies } from 'next/headers';
import { database } from './cms';
export const adminCookie = 'karen_admin';
export const sessionLifetime = 8 * 60 * 60;
const encoder = new TextEncoder();
export const toHex = (bytes: ArrayBuffer | Uint8Array) =>
  Array.from(new Uint8Array(bytes))
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
export async function digest(value: string) {
  return toHex(await crypto.subtle.digest('SHA-256', encoder.encode(value)));
}
function passwordConfig() {
  const encoded = (env as unknown as { ADMIN_PASSWORD_HASH?: string }).ADMIN_PASSWORD_HASH;
  if (!encoded || !/^100000:[a-f0-9]{32}:[a-f0-9]{64}$/.test(encoded))
    throw new Error('Admin password configuration is unavailable');
  return encoded;
}
export async function verifyPassword(password: string) {
  const config = passwordConfig();
  const [iterations, salt, expected] = config.split(':');
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
    'deriveBits',
  ]);
  const actual = toHex(
    await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        hash: 'SHA-256',
        iterations: Number(iterations),
        salt: Uint8Array.from(salt.match(/../g)!, (x) => parseInt(x, 16)),
      },
      key,
      256,
    ),
  );
  let difference = 0;
  for (let i = 0; i < expected.length; i++)
    difference |= actual.charCodeAt(i) ^ expected.charCodeAt(i);
  return difference === 0;
}
export async function adminIdentity() {
  const token = (await cookies()).get(adminCookie)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return { allowed: false, user: null };
  const session = await database()
    .prepare('SELECT expires_at, password_version FROM admin_sessions WHERE token_hash = ?')
    .bind(await digest(token))
    .first<{ expires_at: number; password_version: string }>();
  const allowed =
    !!session &&
    session.expires_at > Date.now() &&
    session.password_version === (await digest(passwordConfig()));
  return { allowed, user: allowed ? { displayName: 'admin' } : null };
}
export async function issueSession() {
  const token = toHex(crypto.getRandomValues(new Uint8Array(32)));
  const now = Date.now(),
    db = database();
  await db.batch([
    db.prepare('DELETE FROM admin_sessions WHERE expires_at <= ?').bind(now),
    db
      .prepare(
        'INSERT INTO admin_sessions (token_hash, expires_at, password_version) VALUES (?, ?, ?)',
      )
      .bind(await digest(token), now + sessionLifetime * 1000, await digest(passwordConfig())),
  ]);
  return token;
}
export async function allowLoginAttempt(request: Request) {
  const now = Date.now(),
    windowEnd = now + 15 * 60 * 1000;
  const key = await digest(request.headers.get('cf-connecting-ip') || 'local');
  const db = database();
  await db.prepare('DELETE FROM login_attempts WHERE expires_at <= ?').bind(now).run();
  const row = await db
    .prepare(
      'INSERT INTO login_attempts (key, count, expires_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = count + 1 RETURNING count',
    )
    .bind(key, windowEnd)
    .first<{ count: number }>();
  return !!row && row.count <= 10;
}
export function sessionCookie(token: string, request: Request, maxAge = sessionLifetime) {
  const url = new URL(request.url);
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  return `${adminCookie}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${url.protocol === 'https:' || !local ? '; Secure' : ''}`;
}
