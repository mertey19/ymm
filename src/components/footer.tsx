import Link from '@/components/site-link';
import { ArrowUpRight } from 'lucide-react';
import { Wordmark } from './header';
import { site as siteDefaults } from '@/config/site';
import { publicContent } from '@/lib/cms';
import { corporateLinks, publicationLinks } from '@/data/navigation';
export async function Footer() {
  const { settings, services } = await publicContent();
  const site = { ...siteDefaults, ...settings };
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link href="/" title="Anasayfa">
              <Wordmark />
            </Link>
            <p>
              Yeminli Mali Müşavirlik, vergi, denetim ve danışmanlık alanlarında profesyonel
              çözümler.
            </p>
            <span className="footer-motto">Güven. Bağımsızlık. Uzmanlık.</span>
          </div>
          <div>
            <h2>Kurumsal</h2>
            {[
              ...corporateLinks.filter(
                (x) => !x.label.includes('Misyon') && !x.label.includes('Ortak'),
              ),
              { label: 'Kariyer', href: '/kariyer' },
            ].map((x) => (
              <Link key={x.href} href={x.href}>
                {x.label}
              </Link>
            ))}
          </div>
          <div>
            <h2>Hizmetlerimiz</h2>
            {services.slice(0, 5).map((x) => (
              <Link key={x.slug} href={`/hizmetler/${x.slug}`}>
                {x.shortTitle}
              </Link>
            ))}
          </div>
          <div>
            <h2>Yayınlar</h2>
            {publicationLinks.map((x) => (
              <Link key={x.href} href={x.href}>
                {x.label}
              </Link>
            ))}
          </div>
          <div>
            <h2>İletişim</h2>
            {site.phone ? (
              <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a>
            ) : (
              <p className="footer-pending">Telefon bilgisi hazırlanıyor.</p>
            )}
            {site.email ? (
              <a href={`mailto:${site.email}`}>{site.email}</a>
            ) : (
              <p className="footer-pending">E-posta bilgisi hazırlanıyor.</p>
            )}
            {site.address && <p>{site.address}</p>}
            <Link href="/iletisim" className="footer-contact">
              İletişim sayfası
              <ArrowUpRight size={14} />
            </Link>
            {site.socials.map((s) => (
              <a href={s.url} key={s.url} rel="noopener noreferrer" target="_blank">
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Karen YMM. Tüm hakları saklıdır.</p>
          <div>
            <Link href="/kvkk">KVKK</Link>
            <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link>
            <Link href="/cerez-politikasi">Çerez Politikası</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

