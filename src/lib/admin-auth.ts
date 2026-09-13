import { env } from 'cloudflare:workers';
import { getChatGPTUser } from './chatgpt-auth';
import { database } from './cms';

export async function adminIdentity() {
  const user = await getChatGPTUser();
  if (!user) return { user: null, allowed: false };
  const db = database();
  const existing = await db
    .prepare('SELECT user_id FROM administrators WHERE id = 1')
    .first<{ user_id: string }>();
  if (existing) return { user, allowed: existing.user_id === user.userId };
  // Bootstrap only from the owner email configured by the hosting control plane.
  // Thereafter the site's stable authenticated user ID owns administration.
  const ownerEmail = (env as unknown as { ADMIN_OWNER_EMAIL?: string }).ADMIN_OWNER_EMAIL;
  if (!ownerEmail || user.email.toLowerCase() !== ownerEmail.toLowerCase())
    return { user, allowed: false };
  await db
    .prepare('INSERT INTO administrators (id, user_id) VALUES (1, ?) ON CONFLICT(id) DO NOTHING')
    .bind(user.userId)
    .run();
  const owner = await db
    .prepare('SELECT user_id FROM administrators WHERE id = 1')
    .first<{ user_id: string }>();
  return { user, allowed: owner?.user_id === user.userId };
}
