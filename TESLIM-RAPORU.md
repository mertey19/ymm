# Karen YMM — teslim öncesi kontrol

13 Eylül 2026. Değişiklikler yerel projeye uygulandı. Push, deploy veya canlı veritabanında değişiklik yapılmadı.

## Düzeltilenler

- **Alan adı / SEO:** Eski `chatgpt.site` canonical adresi canlı Vercel sayfasında ve kaynak kodda doğrulandı. `src/config/site.ts`, `.env.example`, `src/lib/seo.tsx`, `src/lib/page-visibility.ts`, layout, sayfa metadata, robots ve sitemap artık ortak yapılandırmayı kullanıyor. Nihai alan adı henüz belirlenmediğinden Vercel adresi yalnızca önizleme tabanı; `noindex`, robots `Disallow: /` ve boş sitemap etkin. Onaylanan HTTPS alan adı daha sonra `NEXT_PUBLIC_SITE_URL` ile ayarlanıp yeniden build edilmelidir. Boş iletişim/ekip/yayın sayfalarının indeks politikası metadata ve sitemap için aynı kurala bağlı.
- **Sosyal paylaşım:** `public/og.png` tam **1200×630**. Open Graph ve Twitter büyük kart metadata bağlantıları aynı dosyaya gidiyor. Favicon HTTP 200. Yapılandırılmış veride bilinmeyen hukuki unvan, adres, telefon, değerlendirme veya mesleki ruhsat eklenmedi.
- **Demo ve panel:** `src/lib/cms.ts`, `cms-schema.ts`, `admin-panel.tsx`: örnek yayınlar silinmeden taslak olarak ele alınıyor; doğrudan adresleri 404. Önceden veritabanına “yayında” kaydedilmiş demolar da gizleniyor. Panel ve API örnek içeriğin yayımlanmasını engelliyor. Gerçek içerik ayrıca hazırlanıp örnek işareti kaldırıldığında yayımlanabilir.
- **İçerik / iletişim:** Anasayfa hizmetler → yaklaşım → çalışma süreci sırasına sadeleştirildi. Tekrarlayan bölümler, boş yayın alanları, doğrulanmamış ekip bağlantıları, boş telefon/e-posta/adres satırları ve karşılığı olmayan iletişim çağrıları gizlendi. Footer sütunları mevcut içeriğe uyarlanıyor. Gerçek bir gönderim adresi yapılandırılana kadar form ziyaretçiye gösterilmiyor; kısa durum açıklaması var. İlgili dosyalar: `src/app/(site)/page.tsx`, site layout, `header`, `footer`, `institutional-pages`, `service-detail`, `publication-browser`, `ui` bileşenleri.
- **Görseller / erişilebilirlik:** `responsive-image.tsx` gerçek WebP varyantlarını doğrudan `srcset` ile sunuyor; runtime’ın ek görüntü yönlendirmesine ihtiyaç kalmadı. Hero öncelikli, aşağıdaki görsel lazy-load; boyutlar ve yerleşim alanları tanımlı. Hizmet/yayın listelerinde başlık sırası düzeltildi; footer bağlantıları en az 44 px dokunma yüksekliğine çıkarıldı (`globals.css`). Yeni bağımlılık eklenmedi; mevcut normal bağlantılar ve yönetim paneli mimarisi korundu.

## Test kanıtları

Testler production build üzerinde, ayrı yerel D1 veritabanında (`.sites-runtime/audit/state`, port 3002) çalıştı. Kullanıcının `.dev.vars` dosyası ve normal yerel veritabanı değiştirilmedi.

| Kontrol | Sonuç |
| --- | --- |
| `npm run typecheck`, `npm run lint`, `npm run build` | Başarılı |
| `npm run test:qa` | 24 sayfa HTTP 200; 20 ekran/sayfa kontrolü; 28 davranış kontrolü; 6 demo adresi 404 |
| Ekran genişlikleri | 360, 390, 768, 1024, 1440 px; yatay taşma yok |
| Menü, klavye, Escape/odak, mobil gezinme, akordeon, anasayfa bağlantısı | Başarılı |
| Axe WCAG A/AA | 5 halka açık sayfada 0 ihlal; panel ve form kontrolleri de geçti |
| `node scripts/contact-qa.mjs` | Zorunlu alan, e-posta, yükleniyor, doğrulanmış başarı, HTTP/ağ hatası, sahte başarı yanıtını reddetme, alanları koruma; 5 genişlikte form; yayın arama/filtre/sıfırlama geçti |
| `node scripts/seo-qa.mjs` | Önizleme ve test alan adıyla canonical/OG/Twitter/robots/içerik görünürlüğü; görsel ölçüsü geçti |
| `node scripts/admin-qa.mjs` | Giriş, kayıt/yenileme, eski revizyon çatışması, taslak/yayın/silme, demo engeli, responsive/erişilebilirlik geçti |
| `node scripts/admin-auth-qa.mjs` | Yetkisiz erişim, sahte kimlik başlığı, HttpOnly oturum, CSRF, çıkış/eski çerezi reddetme, giriş denemesi sınırı geçti |
| Tarayıcı konsolu | Halka açık sayfalarda 0 hata, 0 uyarı |

Form istekleri tarayıcıda taklit edildi; gerçek alıcıya mesaj gönderilmedi. Ekran görüntüleri Chromium ile alındı ve hero, hizmet kartları, footer ile form gözle incelendi. Bu sonuçlar fiziksel telefon veya Safari/Firefox testi değildir.

Lighthouse, yerel production anasayfasında ölçüldü; saha verisi değildir:

| Profil | Performans | Erişilebilirlik | İyi uygulamalar | SEO |
| --- | ---: | ---: | ---: | ---: |
| Mobil | 98 | 100 | 100 | 69 |
| Masaüstü | 100 | 100 | 100 | 69 |

SEO puanını düşüren kontrol, beklenen **indeksleme engeli**. Nihai alan adı ve yayın hazırlığı tamamlanınca bu politika kaldırılarak yeniden ölçülmeli. Ölçümler cihaz/yüke göre değişebilir.

Kanıtlar: `test-results/qa-report.json`, `contact-qa.json`, `lighthouse-mobile.html`, `lighthouse-desktop.html` ve aynı klasördeki ekran görüntüleri. Test çıktıları Git dışında tutuluyor. Yerel fixture hazırlama aracı `scripts/audit-fixture.mjs`; var olan fixture’ı sıfırlamaz. Panel testlerindeki parola yalnızca bu izole test ortamına aittir.

## Eksikler ve yayın engelleri

1. **Nihai alan adı belirlenmedi.** İndekslemeye açılış, alan adı / DNS / HTTPS kontrolü ve o adreste yeniden SEO testi bekliyor.
2. **Hedef barındırma uyumu:** Canlı adres Vercel; mevcut kaynak ise Vinext / Cloudflare Worker ve D1 kullanıyor (`vite.config.ts`, `.openai/hosting.json`, `src/lib/cms.ts`). Bu backend Vercel’de doğrudan çalışmaz. Vercel hedefleniyorsa veritabanı ve oturum erişimi uyarlanmalı; aksi halde mevcut Worker/D1 barındırması kullanılmalı. Bu denetimde altyapı taşınmadı ve canlıya çıkılmadı.
3. **Şirket bilgileri:** Doğrulanmış telefon, e-posta, adres, çalışma saatleri, tam hukuki unvan; isteniyorsa gerçek ekip/ortak özgeçmişleri ve gerçek yayınlar gerekli. Eksik ekip ve yayınlar genel yayını zorunlu olarak engellemez; ilgili alanlar gizli kalabilir.
4. **İletişim:** Gerçek alıcı, gönderim endpoint’i, sunucuda doğrulama/spam ve hız sınırları ile gerçek veri akışına uygun KVKK/gizlilik metinleri tamamlanmadan form etkinleştirilmemeli. Gerçek e-posta teslimatı test edilmedi.
5. **Son canlı kontrol:** Vercel’de görülen eski canonical bu yerel değişiklikle kendiliğinden güncellenmez. Kullanıcı talimatı gereği deploy yapılmadığı için yeni sürümün canlı domain, DNS, CDN ve üretim sırlarıyla uçtan uca testi yapılmadı. Mevcut Vinext beta derlemesi route sınıflandırması hakkında bilgilendirme veriyor; yerel endpoint testleri başarılı.
