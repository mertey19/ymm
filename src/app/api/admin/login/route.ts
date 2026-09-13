import { allowLoginAttempt, issueSession, sessionCookie, verifyPassword } from '@/lib/admin-auth';
import { isSameOrigin } from '@/lib/request-security';
export const dynamic = 'force-dynamic';
const reply = (data: unknown, status = 200, extra: Record<string, string> = {}) =>
  Response.json(data, { status, headers: { 'Cache-Control': 'private, no-store', ...extra } });
export async function POST(request: Request) {
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply({ error: 'Kullanıcı adı ve şifre gerekli.' }, 400);
    let raw = '',
      size = 0;
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 4096) {
        await reader.cancel();
        return reply({ error: 'İstek çok büyük.' }, 413);
      }
      raw += decoder.decode(value, { stream: true });
    }
    raw += decoder.decode();
    if (!isSameOrigin(request)) return reply({ error: 'Geçersiz istek kaynağı.' }, 403);
    if (!request.headers.get('content-type')?.includes('application/json'))
      return reply({ error: 'Geçersiz istek.' }, 415);
    if (!(await allowLoginAttempt(request)))
      return reply(
        { error: 'Çok fazla giriş denemesi yapıldı. 15 dakika sonra yeniden deneyin.' },
        429,
        { 'Retry-After': '900' },
      );
    let input;
    try {
      input = JSON.parse(raw);
    } catch {
      return reply({ error: 'Geçersiz istek.' }, 400);
    }
    if (
      typeof input?.username !== 'string' ||
      typeof input?.password !== 'string' ||
      input.password.length > 256
    )
      return reply({ error: 'Kullanıcı adı veya şifre hatalı.' }, 401);
    const passwordOK = await verifyPassword(input.password);
    if (input.username !== 'admin' || !passwordOK)
      return reply({ error: 'Kullanıcı adı veya şifre hatalı.' }, 401);
    return reply({ success: true }, 200, {
      'Set-Cookie': sessionCookie(await issueSession(), request),
    });
  } catch (error) {
    console.error('Admin login unavailable', error);
    return reply({ error: 'Giriş şu anda kullanılamıyor. Lütfen yeniden deneyin.' }, 503);
  }
}
