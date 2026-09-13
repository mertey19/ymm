import { cookies } from 'next/headers';
import { adminCookie, digest, sessionCookie } from '@/lib/admin-auth';
import { database } from '@/lib/cms';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin)
    return Response.json({ error: 'Geçersiz istek kaynağı.' }, { status: 403 });
  try {
    const token = (await cookies()).get(adminCookie)?.value;
    if (token)
      await database()
        .prepare('DELETE FROM admin_sessions WHERE token_hash = ?')
        .bind(await digest(token))
        .run();
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
