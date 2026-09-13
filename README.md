# Karen YMM

Next.js App Router kaynakları, TypeScript, Tailwind CSS 4 ve Lucide ile hazırlanmış kurumsal site. Sites üzerindeki sunucu çalışması için Vinext adaptörü ve Cloudflare D1 kullanır. İçerik sayfaları istekte veritabanından oluşturulur; `/yonetim/` panelindeki kayıtlar yeniden dağıtım gerektirmeden siteye yansır.

## Çalıştırma

Node.js 22.13 veya üzeri. `npm ci`, ardından `npm run build`. Yerel veritabanına `drizzle/` altındaki her yeni SQL dosyasını sırasıyla bir kez uygulayın:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_wide_aqueduct.sql
```

Yerel geliştirme için git dışında kalan `.dev.vars` dosyasında `ADMIN_PASSWORD_HASH` ayarlayın; `npm run dev -- --port 3000 --hostname 127.0.0.1` ile başlatın. Değer biçimi `100000:<16 bayt salt hex>:<32 bayt PBKDF2-SHA256 hex>` şeklindedir. Yerel testler yalnızca `Local-Test-Password-Only` adlı test şifresinin özetiyle çalışır; bu şifre üretimde kullanılmaz. Üretim çıktısı `dist/` altındadır; `npm start -- --port 3001` yerel Worker önizlemesi sunar. Üretim Sites üzerinden yayımlanır; statik dosya sunucusu yeterli değildir. İkinci şema migrasyonu `0001_slow_madripoor.sql` de sırasıyla uygulanmalıdır.

## Yönetim paneli ve yetkilendirme

`/yonetim/`: genel bakış, anasayfa/hakkımızda metinleri, iletişim bilgileri, mevcut hizmetlerin kapsam/fayda/SSS düzenlemesi, makale/sirküler ekleme-düzenleme-silme, taslak/yayın durumu, ekip/ortak kayıtları.

Kullanıcı adı `admin`; şifre özeti üretim Sites ortam değişkenlerinde `ADMIN_PASSWORD_HASH` adıyla gizli tutulur. Gerçek şifre kaynak kodda, Git geçmişinde veya istemci paketinde bulunmaz. PBKDF2-SHA256, 100.000 iterasyon ve rastgele 16 bayt salt kullanılır. Başarılı giriş 8 saatlik rastgele oturum oluşturur; D1 yalnızca oturum anahtarının SHA-256 özetini saklar. Çerez HttpOnly, SameSite=Strict ve üretimde Secure olur. Çıkış sunucudaki kaydı iptal eder. Şifre özeti değiştirildiğinde eski oturumlar geçersizleşir. Başarılı girişler dahil IP başına 15 dakikada 10 deneme sınırı vardır.

Sites kimlik başlıkları artık panel yetkisi vermez; her yönetim isteğinde uygulamanın kendi oturumu doğrulanır. Sites'in mevcut özel erişim ayarı korunmuştur ve bu dış erişim kapısı panel şifresinden bağımsızdır. `administrators` tablosu ilk geliştirme migrasyonundan kalmıştır ve artık yetkilendirmede kullanılmaz. Başka barındırmaya taşınırken HTTPS, güvenilir gerçek istemci IP başlığı, aynı origin denetimi ve D1 uyumlu kalıcı veri erişimi korunmalıdır.

Her API okuma/yazması sunucuda yetki denetimi yapar; yazmalar aynı origin ve JSON gerektirir. İçerik doğrulaması, 1 MB istek sınırı ve sürüm karşılaştırmalı kayıt vardır. Eşzamanlı değişiklikler 409 ile reddedilir. Kayıt hatalarında form verisi korunur. Veritabanı hatası, sahte kayıt başarısı veya boş içerik yerine tekrar denenebilir hata gösterir. Taslaklar halka açık sorgulara ve sitemap'e dahil edilmez. İçerik HTML olarak çalıştırılmaz; React tarafından kaçırılır.

Şema `db/schema.ts`, sürümlü migrasyonlar `drizzle/` altındadır; `npm run db:generate` yeni migrasyon üretir. Uygulanmış migrasyonlar değiştirilmez. İlk içerik düzenlenene kadar eski sitenin doğrulanmış başlangıç içerikleri kullanılır. Üretim veritabanı sürümler arasında korunur; Git geri alma işlemi veritabanı içeriğini geri almaz.

## Kontrol

`npm run lint`, `npm run typecheck`, `npm run build`. Tarayıcı QA: sunucu 3000 portunda çalışırken `npm run test:qa` (ilk kullanım: `npx playwright install chromium`). Rapor ve ekran görüntüleri `test-results/` altında oluşturulur.

Panel doğrulaması: yerel geliştirme sunucusunda `node scripts/admin-qa.mjs`. Bu test yalnızca yerel veritabanını değiştirir, sonra başlangıç içeriğini geri koyar; üretime yönlendirilmemelidir. Anonim erişim, sahte başlık, origin, doğrulama, çakışma, kayıt/yenileme, taslak/yayın/silme, sitemap ve responsive/axe kontrollerini kapsar.

Önceki statik dışa aktarıma ait `normalize-static-export.mjs` artık çalıştırılmaz. Aktif dağıtım Worker ve D1 gerektirir.

## Merkezi içerik

- `src/config/site.ts`: şirket adı, telefon, e-posta, adres, çalışma saatleri, sosyal hesaplar, site adresi ve gönderim endpoint'i.
- `src/data/services.ts`: dokuz hizmetin kapsamı, faydaları, hedef kitlesi ve SSS.
- `src/data/navigation.ts`: ortak menüler.
- `src/data/company.ts`: değerler, süreç, katkılar ve kolay değiştirilebilir örnek sektör seçenekleri. Sektörler gerçek müşteri veya uzmanlık iddiası olarak sunulmaz.
- Ekip ve ortak kayıtları panel üzerinden D1'e kaydedilir; ilk durumda boş liste kullanılır. `src/data/team.ts` önceki statik sürümün kullanılmayan örneğidir.
- `src/data/publications.ts`: örnek sirküler ve makaleler. `demo: true` açıkça etiketlenir, noindex alır, sitemap ve Article şemasına dahil edilmez. Gerçek içerik, tarih ve editoryal onay sonrası `demo: false` yapıldığında Article şeması ve sitemap otomatik etkinleşir.
- `src/data/pages.ts`: sayfa başlıkları, açıklamalar ve indeksleme tercihleri.

## Yayına hazırlıkta şirketten gerekenler

Telefon, e-posta, adres, çalışma saatleri, doğrulanmış ekip/ortak profilleri, gerçek yayınlar ve şirketin veri süreçlerine uygun nihai KVKK/gizlilik metinleri henüz sağlanmadı. Bu alanlar uydurulmadı; uygun boş durumlar kullanıldı. Doğrulanmış bilgiler eklendiğinde ilgili `noindex` değerlerini gözden geçirin.

Form, endpoint boşken hiçbir ağ isteği yapmaz ve gönderim gerçekleşmiş gibi davranmaz. Endpoint etkinleştirilmeden önce sunucuda aynı doğrulamalar, istek boyutu sınırı, oran sınırlaması, spam koruması, origin/CORS denetimi, saklama/silme politikası ve gerçek alıcı yapılandırılmalıdır. `website` alanı bot tuzağıdır. Sunucu yalnızca gerçekten kaydedilen/teslim alınan talepler için `{ "success": true }` dönmelidir. İstemci doğrulaması sunucu güvenliği değildir. API anahtarları hiçbir zaman `NEXT_PUBLIC_` alanına yazılmamalıdır.

## SEO ve erişilebilirlik

Yönetim alanı noindex'tir; robots dosyası yönetim/API yollarını hariç tutar. Bu kurallar erişim güvenliğinin yerine geçmez. Aktif yetkilendirme sunucudadır. Şirketin iletişim bilgileri güncellendiğinde Organization/ProfessionalService şemaları da güncellenir.

Özgün sayfa metadatası, canonical, Open Graph, sitemap, robots, Organization/ProfessionalService/BreadcrumbList şemaları; gerçek yayınlar için Article. Şehir, adres ve yetki belgesi uydurulmadı. Semantik başlıklar, klavye menüsü, native details akordeonları, focus-visible, azaltılmış hareket tercihi ve gerçek form etiketleri mevcut.

## Görsel kaynaklar

- Hero: Edgar / snapshot_journey, https://unsplash.com/photos/modern-building-with-geometric-lines-and-glass-XALyj0z5bgw — Unsplash License https://unsplash.com/license
- Toplantı odası: Breather, https://unsplash.com/photos/X5Hjlv7nZU4 — CC0 kaynak kaydı: https://commons.wikimedia.org/wiki/File:Bright_conference_room_(Unsplash).jpg

Her iki fotoğraf temsilidir; Karen YMM'nin gerçek ofisi olarak sunulmaz. WebP türevleri yerel sunulur. Manrope ve Inter fontları yerel paketlerden yüklenir. Referans siteler yalnızca bilgi mimarisi için incelendi: https://www.vdd.com.tr/ , https://kuleliymm.com/hizmetlerimiz , https://www.analizymm.com/ . Metin veya tasarım kopyalanmadı.
`SiteLink` normal belge gezinmesi kullanır: kurumsal sayfalar her açılışta güncel CMS içeriğini alır. Bu seçim, mevcut Vinext beta sürümünün üretim RSC bağlantı/prefetch hatasını vendor koduna dokunmadan önler.
