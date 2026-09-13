# Karen YMM — teslim öncesi kontrol

13 Eylül 2026. Uygulama Vercel'in standart Next.js Node.js çalışma ortamında ve Turso/libSQL veritabanıyla canlıya alındı. `https://ymm-tau.vercel.app/` üzerinde site, panel girişi, yetkili içerik okuması ve oturum kapatma doğrulandı. Bu son denetimde push, deploy veya canlı veri değişikliği yapılmadı; aşağıdaki sonuçlar izole yerel test veritabanından ve salt okunur canlı kontrollerden alındı.

## Düzeltilenler

- **Alan adı / SEO:** Eski `chatgpt.site` adresi güncel kaynakta veya canlı metadata çıktısında bulunmuyor. `src/config/site.ts`, `.env.example`, `src/lib/seo.tsx`, `src/lib/page-visibility.ts`, layout, sayfa metadata, robots ve sitemap ortak yapılandırmayı kullanıyor. Canonical ve Open Graph URL'leri canlı Vercel adresiyle tutarlı. Önceki karara göre nihai özel alan adı henüz belirlenmediğinden `noindex`, robots `Disallow: /` ve boş sitemap bilinçli olarak etkin. Onaylanan HTTPS alan adı daha sonra `NEXT_PUBLIC_SITE_URL` ile ayarlanıp yeniden build edilmelidir. Boş iletişim/ekip/yayın sayfalarının indeks politikası metadata ve sitemap için aynı kurala bağlı.
- **Sosyal paylaşım:** `public/og.png` tam **1200×630**. Open Graph ve Twitter büyük kart metadata bağlantıları aynı dosyaya gidiyor. Favicon HTTP 200. Yapılandırılmış veride bilinmeyen hukuki unvan, adres, telefon, değerlendirme veya mesleki ruhsat eklenmedi.
- **Demo ve panel:** `src/lib/cms.ts`, `cms-schema.ts`, `admin-panel.tsx`: örnek yayınlar silinmeden taslak olarak ele alınıyor; doğrudan adresleri 404. Önceden veritabanına “yayında” kaydedilmiş demolar da gizleniyor. Panel ve API örnek içeriğin yayımlanmasını engelliyor. Gerçek içerik ayrıca hazırlanıp örnek işareti kaldırıldığında yayımlanabilir.
- **İçerik / iletişim:** Anasayfa hizmetler → yaklaşım → çalışma süreci sırasına sadeleştirildi. Tekrarlayan bölümler, boş yayın alanları, doğrulanmamış ekip bağlantıları, boş telefon/e-posta/adres satırları ve karşılığı olmayan iletişim çağrıları gizlendi. Footer sütunları mevcut içeriğe uyarlanıyor. Gerçek bir gönderim adresi yapılandırılana kadar form ziyaretçiye gösterilmiyor; kısa durum açıklaması var. İlgili dosyalar: `src/app/(site)/page.tsx`, site layout, `header`, `footer`, `institutional-pages`, `service-detail`, `publication-browser`, `ui` bileşenleri.
- **Görseller / erişilebilirlik:** `responsive-image.tsx` gerçek WebP varyantlarını doğrudan `srcset` ile sunuyor; runtime’ın ek görüntü yönlendirmesine ihtiyaç kalmadı. Hero öncelikli, aşağıdaki görsel lazy-load; boyutlar ve yerleşim alanları tanımlı. Hizmet/yayın listelerinde başlık sırası düzeltildi; footer bağlantıları en az 44 px dokunma yüksekliğine çıkarıldı (`globals.css`). Vercel uyarlaması için yalnızca `@libsql/client` üretim bağımlılığı eklendi.
- **Vercel altyapısı:** `src/lib/database.ts`, içerik ve yönetici oturumlarını Turso/libSQL üzerinde saklıyor; tablolar ilk istekte tekrar çalıştırılabilir SQL ile kuruluyor. `database-citrine-house` kaynağı Production, Preview ve Development ortamlarına bağlı; yönetici şifre özeti Production ve Preview'da secret olarak tanımlı. Canlı giriş, yetkili içerik okuması ve çıkış 200 yanıtıyla doğrulandı. Yerel geliştirme ayrı bir dosya veritabanı kullanıyor.

## Test kanıtları

Testler standart Next.js production build üzerinde, ayrı yerel libSQL veritabanında (`.sites-runtime/audit/vercel-test.db`, port 3002) çalıştı. Kullanıcının `.dev.vars` dosyası ve normal yerel veritabanı değiştirilmedi.

| Kontrol | Sonuç |
| --- | --- |
| `npm run typecheck`, `npm run lint`, `npm run build` | Başarılı |
| `npm run test:qa` | İzole production sunucusunda ve canlı Vercel adresinde ayrı ayrı geçti: 24 sayfa HTTP 200; 20 ekran/sayfa kontrolü; 28 davranış kontrolü; 6 demo adresi 404 |
| Ekran genişlikleri | 360, 390, 768, 1024, 1440 px; yatay taşma yok |
| Menü, klavye, Escape/odak, mobil gezinme, akordeon, anasayfa bağlantısı | Başarılı |
| Axe WCAG A/AA | 5 halka açık sayfada 0 ihlal; panel ve form kontrolleri de geçti |
| `node scripts/contact-qa.mjs` | Zorunlu alan, e-posta, yükleniyor, doğrulanmış başarı, HTTP/ağ hatası, sahte başarı yanıtını reddetme, alanları koruma; 5 genişlikte form; yayın arama/filtre/sıfırlama geçti |
| `node scripts/seo-qa.mjs` | Önizleme ve test alan adıyla canonical/OG/Twitter/robots/içerik görünürlüğü; görsel ölçüsü geçti |
| `node scripts/admin-qa.mjs` | Giriş, kayıt/yenileme, eski revizyon çatışması, taslak/yayın/silme, demo engeli, responsive/erişilebilirlik geçti |
| `node scripts/admin-auth-qa.mjs` | Yetkisiz erişim, sahte kimlik başlığı, HttpOnly oturum, CSRF, çıkış/eski çerezi reddetme, giriş denemesi sınırı geçti |
| `npm audit --omit=dev` | Üretim bağımlılıklarında 0 güvenlik açığı |
| Canlı uçtan uca kontrol (önceki yayın doğrulaması) | Anasayfa, panel, giriş, yetkili içerik okuması ve çıkış HTTP 200 |
| Tarayıcı konsolu | Halka açık sayfalarda 0 hata, 0 uyarı |

Form istekleri tarayıcıda taklit edildi; gerçek alıcıya mesaj gönderilmedi. Ekran görüntüleri Chromium ile alındı ve hero, hizmet kartları, footer ile form gözle incelendi. Bu sonuçlar fiziksel telefon veya Safari/Firefox testi değildir.

Lighthouse, yerel production anasayfasında ölçüldü; saha verisi değildir:

| Profil | Performans | Erişilebilirlik | İyi uygulamalar | SEO |
| --- | ---: | ---: | ---: | ---: |
| Mobil | 90 | 100 | 100 | 69 |
| Masaüstü | 100 | 100 | 100 | 69 |

Mobil ölçümde FCP 2,1 saniye, LCP 3,4 saniye, toplam engelleme süresi 50 ms ve CLS 0,004 çıktı. Kalan ölçülebilir fırsat Next/React ortak chunk'larında yaklaşık 300 ms kullanılmayan JavaScript. SEO puanını düşüren kontrol, beklenen **indeksleme engeli**. Nihai alan adı ve yayın hazırlığı tamamlanınca bu politika kaldırılarak yeniden ölçülmeli. Ölçümler cihaz/yüke göre değişebilir.

Kanıtlar: `test-results/qa-report.json`, `contact-qa.json`, `lighthouse-mobile.html`, `lighthouse-desktop.html` ve aynı klasördeki ekran görüntüleri. 360, 768 ve 1440 px anasayfa; 390 px form ve panel görüntüleri ayrıca gözle incelendi. Test çıktıları Git dışında tutuluyor. Yerel fixture hazırlama aracı `scripts/audit-fixture.mjs`, yalnızca kendisine ait denetim veritabanını yeniler; normal yerel ve canlı veritabanına dokunmaz. Panel testlerindeki parola yalnızca bu izole test ortamına aittir.

## Eksikler ve yayın engelleri

1. **Nihai alan adı belirlenmedi.** İndekslemeye açılış, alan adı / DNS / HTTPS kontrolü ve o adreste yeniden SEO testi bekliyor.
2. **Şirket bilgileri:** Doğrulanmış telefon, e-posta, adres, çalışma saatleri, tam hukuki unvan; isteniyorsa gerçek ekip/ortak özgeçmişleri ve gerçek yayınlar gerekli. Eksik ekip ve yayınlar genel yayını engellemez; ilgili alanlar ve işlevsiz çağrılar gizli kalıyor.
3. **İletişim:** Gerçek alıcı, gönderim endpoint'i, sunucuda doğrulama/spam ve hız sınırları ile gerçek veri akışına uygun KVKK/gizlilik metinleri tamamlanmadan form etkinleştirilmemeli. Gerçek e-posta teslimatı test edilmedi ve test mesajı gönderilmedi.
4. **Tarayıcı kapsamı:** Chromium ve emülasyonla kontrol edildi; fiziksel telefon, Safari ve Firefox testi yapılmadı.

Turso, yönetim paneli, production build veya mevcut Vercel dağıtımı açısından kalan teknik yayın engeli yoktur. İndekslemeye açılmanın engeli nihai alan adı kararıdır.
