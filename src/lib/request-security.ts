import 'server-only';

export function isSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    const supplied = new URL(origin);
    const requestUrl = new URL(request.url);
    const host = (
      request.headers.get('x-forwarded-host') ||
      request.headers.get('host') ||
      requestUrl.host
    )
      .split(',')[0]
      .trim();
    const protocol = (request.headers.get('x-forwarded-proto') || requestUrl.protocol.slice(0, -1))
      .split(',')[0]
      .trim();
    return supplied.host === host && supplied.protocol === `${protocol}:`;
  } catch {
    return false;
  }
}
