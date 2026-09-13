# Karen YMM

Next.js App Router, TypeScript ve Tailwind CSS ile hazırlanmış kurumsal site ve içerik yönetim paneli. Vercel'in Node.js çalışma ortamını, kalıcı içerik ve yönetici oturumları için Turso/libSQL'i kullanır.

## Yerel çalışma

Node.js 22.13 veya üzeri gerekir.

```sh
npm ci
npm run dev -- --port 3000
```

`TURSO_DATABASE_URL` tanımlı değilken yerel geliştirme verileri `.sites-runtime/vercel-local.db` dosyasına yazılır. Şema ilk istekte güvenli biçimde oluşturulur.

Yönetim paneli `/yonetim/` adresindedir. Kullanıcı adı `admin` olarak sabittir. Şifre kaynak koda yazılmaz; `.env.local` içinde yalnızca PBKDF2 özeti tutulur:

```env
ADMIN_PASSWORD_HASH=100000:<16-bayt-salt-hex>:<32-bayt-pbkdf2-sha256-hex>
```

## Vercel kurulumu

1. Vercel projesinin Marketplace bölümünden Turso entegrasyonunu ekleyin. Entegrasyon projeye `TURSO_DATABASE_URL` ve `TURSO_AUTH_TOKEN` değişkenlerini sağlar.
2. Vercel Environment Variables bölümüne `ADMIN_PASSWORD_HASH` değerini secret olarak ekleyin.
3. Nihai alan adı belirlendiğinde `NEXT_PUBLIC_SITE_URL=https://alan-adiniz.example` değişkenini ekleyin.
4. Değişkenlerin uygulanması için projeyi yeniden dağıtın. Uygulama gerekli tabloları ilk istekte `CREATE TABLE IF NOT EXISTS` ile oluşturur.

Turso bağlantısı eklenmeden yapılan Vercel dağıtımında kurumsal sayfalar başlangıç içeriğiyle açılır. Panelin giriş ekranı görünür, ancak veri ve oturum güvenliği için giriş isteği `503` döndürür. Böylece geçici bir dosya veritabanına yazılıp veri kaybı yaşanmaz.

## Panel ve güvenlik

Panel; anasayfa ve hakkımızda metinlerini, iletişim bilgilerini, hizmet ayrıntılarını, yayınları ve ekip kayıtlarını düzenler. Taslak yayınlar halka açık sayfalara ve sitemap'e eklenmez.

Başarılı giriş 8 saatlik rastgele bir oturum oluşturur. Veritabanında yalnızca oturum anahtarının SHA-256 özeti saklanır. Çerez `HttpOnly`, `SameSite=Strict` ve üretimde `Secure` özelliklerini taşır. Şifre özeti değişince mevcut oturumlar geçersiz olur. IP başına 15 dakikada 10 giriş denemesi sınırı vardır. Yazma isteklerinde aynı origin, JSON, 1 MB sınırı, şema doğrulaması ve revizyon karşılaştırması uygulanır; eşzamanlı değişiklikler `409` ile reddedilir.

## Yapılandırma

- `TURSO_DATABASE_URL`: Turso/libSQL veritabanı adresi.
- `TURSO_AUTH_TOKEN`: uzak Turso veritabanının erişim anahtarı.
- `ADMIN_PASSWORD_HASH`: yönetici şifresinin PBKDF2-SHA256 özeti.
- `NEXT_PUBLIC_SITE_URL`: doğrulanmış nihai HTTPS alan adı. Boşken önizleme sitesi `noindex` kalır.
- `NEXT_PUBLIC_CONTACT_ENDPOINT`: iletişim formunu teslim alan doğrulanmış sunucu endpoint'i. Boşken form gönderimi açılmaz.

API anahtarlarını hiçbir zaman `NEXT_PUBLIC_` değişkenlerinde tutmayın.

## Kontrol

```sh
npm run typecheck
npm run lint
npm run build
npm run test:setup
```

Production build'i izole test ortamıyla 3002 portunda başlattıktan sonra:

```sh
npm run test:qa
node scripts/admin-qa.mjs
node scripts/admin-auth-qa.mjs
node scripts/contact-qa.mjs
node scripts/seo-qa.mjs
```

`npm run test:setup`, Git dışında kalan `.sites-runtime/audit/vercel-test.db` veritabanını ve rastgele test şifresini hazırlar. Panel testleri yalnızca bu izole veritabanını değiştirir.

## Merkezi içerik

- `src/config/site.ts`: şirket adı, iletişim bilgileri, sosyal hesaplar ve site adresi.
- `src/data/services.ts`: hizmet kapsamları, faydalar, hedef kitle ve SSS.
- `src/data/navigation.ts`: ortak menüler.
- `src/data/company.ts`: değerler, süreç ve örnek sektör seçenekleri.
- `src/data/publications.ts`: başlangıçtaki örnek yayınlar. `demo: true` kayıtları taslak kalır ve indekslenmez.
- `src/data/pages.ts`: sayfa başlıkları, açıklamalar ve indeksleme tercihleri.
- `src/lib/database.ts`: Vercel/Turso istemcisi ve tekrar çalıştırılabilir şema kurulumu.

Telefon, e-posta, adres, çalışma saatleri, ekip profilleri, gerçek yayınlar ve nihai KVKK/gizlilik metinleri doğrulanmış bilgiler geldikçe panelden tamamlanmalıdır. İletişim formu açılmadan önce alıcı endpoint'inde sunucu doğrulaması, spam ve hız sınırları ile saklama/silme politikası uygulanmalıdır.

## Görsel kaynaklar

- Hero: Edgar / snapshot_journey, https://unsplash.com/photos/modern-building-with-geometric-lines-and-glass-XALyj0z5bgw
- Toplantı odası: Breather, https://commons.wikimedia.org/wiki/File:Bright_conference_room_(Unsplash).jpg

Fotoğraflar temsilidir; Karen YMM'nin gerçek ofisi olarak sunulmaz. WebP türevleri ve fontlar yerel sunulur.
