import { cookies } from 'next/headers';
import { adminCookie, digest, sessionCookie } from '@/lib/admin-auth';
import { database } from '@/lib/database';
import { isSameOrigin } from '@/lib/request-security';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  if (!isSameOrigin(request))
    return Response.json({ error: 'Geçersiz istek kaynağı.' }, { status: 403 });
  try {
    const token = (await cookies()).get(adminCookie)?.value;
    if (token)
      await (
        await database()
      ).execute({
        sql: 'DELETE FROM admin_sessions WHERE token_hash = ?',
        args: [await digest(token)],
      });
    return Response.json(
      { success: true },
      {
        headers: {
          'Cache-Control': 'private, no-store',
          'Set-Cookie': sessionCookie('', request, 0),
        },
      },
    );
  } catch (error) {
    console.error('Admin logout unavailable', error);
    return Response.json({ error: 'Çıkış yapılamadı. Yeniden deneyin.' }, { status: 503 });
  }
}
