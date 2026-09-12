# Karen YMM

Next.js App Router, TypeScript, Tailwind CSS 4 ve Lucide ile hazırlanmış kurumsal site. Sayfalar statik olarak önceden oluşturulur; CMS veya sunucu zorunluluğu yoktur.

## Çalıştırma

Node.js 20.9 veya üzeri. `npm ci`, ardından `npm run dev`. Üretim: `npm run build`, ardından `npm start`. Statik çıktı `out/` klasöründedir. Sunucu dizin indekslerini ve özel `404.html` sayfasını desteklemelidir.

## Kontrol

`npm run lint`, `npm run typecheck`, `npm run build`. Tarayıcı QA: sunucu 3000 portunda çalışırken `npm run test:qa` (ilk kullanım: `npx playwright install chromium`). Rapor ve ekran görüntüleri `test-results/` altında oluşturulur.

Üretim performans ölçümü: `npx serve out -l 3001 --no-clipboard`, ardından `npm run test:performance`. `QA_URL` ortam değişkeniyle test hedefi değiştirilebilir. Ölçümleri diğer yoğun tarayıcı testleriyle aynı anda çalıştırmayın. Yerel Lighthouse sonuçları barındırma ortamı ve gerçek kullanıcı ölçümlerinin yerine geçmez.

`postbuild`, Next.js 16.3'ün Windows çıktısında iç içe RSC dosyalarında bıraktığı platform ayraçları için tarayıcının istediği noktalı dosya adlarını hazırlar. Bu uyumluluk işlemi vendor kodunu değiştirmez; Linux'ta gerekmediğinde işlem yapmaz.

## Merkezi içerik

- `src/config/site.ts`: şirket adı, telefon, e-posta, adres, çalışma saatleri, sosyal hesaplar, site adresi ve gönderim endpoint'i.
- `src/data/services.ts`: dokuz hizmetin kapsamı, faydaları, hedef kitlesi ve SSS.
- `src/data/navigation.ts`: ortak menüler.
- `src/data/company.ts`: değerler, süreç, katkılar ve kolay değiştirilebilir örnek sektör seçenekleri. Sektörler gerçek müşteri veya uzmanlık iddiası olarak sunulmaz.
- `src/data/team.ts`: `published: false` örnek kişi. Doğrulanmış bilgiler gelmeden görünmez.
- `src/data/publications.ts`: örnek sirküler ve makaleler. `demo: true` açıkça etiketlenir, noindex alır, sitemap ve Article şemasına dahil edilmez. Gerçek içerik, tarih ve editoryal onay sonrası `demo: false` yapıldığında Article şeması ve sitemap otomatik etkinleşir.
- `src/data/pages.ts`: sayfa başlıkları, açıklamalar ve indeksleme tercihleri.

## Yayına hazırlıkta şirketten gerekenler

Telefon, e-posta, adres, çalışma saatleri, doğrulanmış ekip/ortak profilleri, gerçek yayınlar ve şirketin veri süreçlerine uygun nihai KVKK/gizlilik metinleri henüz sağlanmadı. Bu alanlar uydurulmadı; uygun boş durumlar kullanıldı. Doğrulanmış bilgiler eklendiğinde ilgili `noindex` değerlerini gözden geçirin.

Form, endpoint boşken hiçbir ağ isteği yapmaz ve gönderim gerçekleşmiş gibi davranmaz. Endpoint etkinleştirilmeden önce sunucuda aynı doğrulamalar, istek boyutu sınırı, oran sınırlaması, spam koruması, origin/CORS denetimi, saklama/silme politikası ve gerçek alıcı yapılandırılmalıdır. `website` alanı bot tuzağıdır. Sunucu yalnızca gerçekten kaydedilen/teslim alınan talepler için `{ "success": true }` dönmelidir. İstemci doğrulaması sunucu güvenliği değildir. API anahtarları hiçbir zaman `NEXT_PUBLIC_` alanına yazılmamalıdır.

## SEO ve erişilebilirlik

Özgün sayfa metadatası, canonical, Open Graph, sitemap, robots, Organization/ProfessionalService/BreadcrumbList şemaları; gerçek yayınlar için Article. Şehir, adres ve yetki belgesi uydurulmadı. Semantik başlıklar, klavye menüsü, native details akordeonları, focus-visible, azaltılmış hareket tercihi ve gerçek form etiketleri mevcut.

## Görsel kaynaklar

- Hero: Edgar / snapshot_journey, https://unsplash.com/photos/modern-building-with-geometric-lines-and-glass-XALyj0z5bgw — Unsplash License https://unsplash.com/license
- Toplantı odası: Breather, https://unsplash.com/photos/X5Hjlv7nZU4 — CC0 kaynak kaydı: https://commons.wikimedia.org/wiki/File:Bright_conference_room_(Unsplash).jpg

Her iki fotoğraf temsilidir; Karen YMM'nin gerçek ofisi olarak sunulmaz. WebP türevleri yerel sunulur. Manrope ve Inter fontları yerel paketlerden yüklenir. Referans siteler yalnızca bilgi mimarisi için incelendi: https://www.vdd.com.tr/ , https://kuleliymm.com/hizmetlerimiz , https://www.analizymm.com/ . Metin veya tasarım kopyalanmadı.
