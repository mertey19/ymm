import { adminIdentity } from '@/lib/admin-auth';
import { readContent, writeContent } from '@/lib/cms';
import { cmsSchema } from '@/lib/cms-schema';
export const dynamic = 'force-dynamic';
const json = (data: unknown, status = 200) =>
  Response.json(data, {
    status,
    headers: { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' },
  });
export async function GET() {
  try {
    const { allowed, user } = await adminIdentity();
    if (!allowed) return json({ error: 'Yönetici erişimi gerekli.' }, user ? 403 : 401);
    return json(await readContent());
  } catch (error) {
    console.error('CMS read failed', error);
    return json({ error: 'İçerikler yüklenemedi. Lütfen tekrar deneyin.' }, 503);
  }
}
export async function PUT(request: Request) {
  try {
    const { allowed, user } = await adminIdentity();
    // Consume the bounded upload before returning a rejection so the local Worker
    // transport does not retain an unfinished request stream on a reused connection.
    const reader = request.body?.getReader();
    if (!reader) return json({ error: 'İçerik gerekli.' }, 400);
    let size = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 1000000) {
        await reader.cancel();
        return json({ error: 'İçerik en fazla 1 MB olabilir.' }, 413);
      }
      chunks.push(value);
    }
    if (!allowed) return json({ error: 'Yönetici erişimi gerekli.' }, user ? 403 : 401);
    if (request.headers.get('origin') !== new URL(request.url).origin)
      return json({ error: 'Geçersiz istek kaynağı.' }, 403);
    if (!request.headers.get('content-type')?.includes('application/json'))
      return json({ error: 'JSON gerekli.' }, 415);
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    let input;
    try {
      input = JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      return json({ error: 'Geçersiz JSON.' }, 400);
    }
    if (!input || typeof input !== 'object') return json({ error: 'İçerik gerekli.' }, 400);
    const parsed = cmsSchema.safeParse(input.data);
    if (!parsed.success || !Number.isSafeInteger(input.revision) || input.revision < 0)
      return json(
        {
          error: parsed.success ? 'Geçersiz sürüm.' : validationMessage(parsed.error.issues[0]),
        },
        400,
      );
    const state = await writeContent(parsed.data, input.revision);
    if (!state)
      return json(
        {
          error:
            'Başka bir sekmede değişiklik kaydedildi. İçeriğinizi kopyalayıp sayfayı yenileyin; ardından yeniden uygulayın.',
        },
        409,
      );
    return json(state);
  } catch (error) {
    console.error('CMS save failed', error);
    return json(
      { error: 'Kaydedilemedi. Yazdıklarınız bu sayfada korunuyor; yeniden deneyin.' },
      503,
    );
  }
}
function validationMessage(issue: { path: (string | number)[]; code: string; message: string }) {
  const labels: Record<string, string> = {
    settings: 'Site & iletişim',
    services: 'Hizmetler',
    publications: 'Yayınlar',
    team: 'Ekip',
    heroTitle: 'Anasayfa başlığı',
    heroDescription: 'Anasayfa açıklaması',
    aboutTitle: 'Hakkımızda başlığı',
    aboutText: 'Hakkımızda metni',
    phone: 'Telefon',
    email: 'E-posta',
    address: 'Adres',
    workingHours: 'Çalışma saatleri',
    title: 'Başlık',
    shortTitle: 'Kısa başlık',
    intro: 'Açıklama',
    scope: 'Hizmet kapsamı',
    benefits: 'Faydalar',
    audience: 'Kimler için',
    faq: 'Sık sorulan sorular',
    question: 'Soru',
    answer: 'Yanıt',
    slug: 'Sayfa adresi',
    category: 'Kategori',
    date: 'Tarih',
    body: 'İçerik',
    heading: 'Bölüm başlığı',
    text: 'Metin',
    name: 'Ad soyad',
    bio: 'Özgeçmiş',
    description: 'Kısa açıklama',
  };
  const path = issue.path
    .map((x) => (typeof x === 'number' ? `${x + 1}. kayıt` : labels[x] || 'Alan'))
    .join(' / ');
  return `${path}: ${issue.code === 'custom' ? issue.message : 'Bu alanı kontrol edin. Zorunlu alanları doldurun, geçerli değerler kullanın ve metni alan sınırları içinde tutun.'}`;
}
