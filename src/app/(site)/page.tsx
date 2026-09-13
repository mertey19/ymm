import { ResponsiveImage } from '@/components/responsive-image';
import Link from '@/components/site-link';
import {
  ArrowDown,
  ArrowUpRight,
  BadgeCheck,
  ChartNoAxesCombined,
  FileCheck2,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import { CTA, PublicationCard, SectionHeading, ServiceCards, TextLink } from '@/components/ui';
import { publicContent } from '@/lib/cms';
import { processSteps } from '@/data/company';
import { metadataFor } from '@/lib/seo';
import { site, hasContactChannels } from '@/config/site';
export const metadata = {
  ...metadataFor('Yeminli Mali Müşavirlik, Vergi ve Danışmanlık', site.description, '/'),
  title: { absolute: 'Karen YMM | Yeminli Mali Müşavirlik, Vergi ve Danışmanlık' },
};
export default async function Home() {
  const { settings, services, publications } = await publicContent();
  const featuredServices = services.slice(0, 6);
  const articles = publications.filter((p) => p.kind === 'makaleler').slice(0, 3);
  const circulars = publications.filter((p) => p.kind === 'sirkulerler').slice(0, 3);
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> KAREN YMM · YEMİNLİ MALİ MÜŞAVİRLİK
          </p>
          <h1>{settings.heroTitle}</h1>
          <p className="hero-description">{settings.heroDescription}</p>
          <div className="hero-actions">
            <Link className="button button-white" href="/hizmetlerimiz">
              Hizmetlerimizi İnceleyin
              <ArrowUpRight size={18} />
            </Link>
            {hasContactChannels(settings) && (
              <Link className="hero-secondary" href="/iletisim">
                Karen YMM ile İletişime Geçin
                <ArrowUpRight size={16} />
              </Link>
            )}
          </div>
          <a className="hero-explore" href="#uzmanlik">
            <ArrowDown size={16} />
            UZMANLIĞIMIZI KEŞFEDİN
          </a>
        </div>
        <div className="hero-image" aria-hidden="true">
          <ResponsiveImage name="hero" alt="" priority sizes="100vw" />
        </div>
      </section>
      <div className="trust-band">
        <div className="container">
          {[
            { icon: BadgeCheck, title: 'Yeminli Mali Müşavirlik' },
            { icon: Scale, title: 'Vergi Danışmanlığı' },
            { icon: FileCheck2, title: 'Tasdik ve Denetim' },
            { icon: ChartNoAxesCombined, title: 'Kurumsal Finans' },
          ].map((x) => (
            <div key={x.title}>
              <x.icon size={25} strokeWidth={1.25} />
              <span>{x.title}</span>
            </div>
          ))}
        </div>
      </div>
      <section className="section surface" id="uzmanlik">
        <div className="container">
          <SectionHeading
            eyebrow="HİZMETLERİMİZ"
            title="Uzmanlık Alanlarımız"
            description="İşletmenizin vergi ve finansal süreçlerini doğru, güvenilir ve mevzuata uygun şekilde yönetmenize destek oluyoruz."
          >
            <TextLink href="/hizmetlerimiz">Tüm Hizmetlerimiz</TextLink>
          </SectionHeading>
          <ServiceCards items={featuredServices} />
        </div>
      </section>
      <section className="section about-section">
        <div className="container about-grid">
          <div className="about-image">
            <ResponsiveImage
              name="about"
              alt="Gün ışığı alan sade ve profesyonel toplantı odası"
              sizes="(max-width: 767px) 100vw, 42vw"
            />
            <div className="about-image-label">
              <span>KAREN YMM</span>
              <p>
                İşinizi anlarız.
                <br />
                Geleceğinizi önemseriz.
              </p>
            </div>
          </div>
          <div className="about-copy">
            <p className="eyebrow">KAREN YMM HAKKINDA</p>
            <h2>
              Finansal Süreçlerde
              <br />
              Güvenilir ve
              <br />
              Profesyonel Yaklaşım
            </h2>
            <p>
              Her işletmenin kendine özgü bir hikâyesi ve farklı ihtiyaçları vardır. Karen YMM
              olarak mali süreçlerinizi bu anlayışla ele alır, işinizi tanıyarak size uygun bir
              çalışma yaklaşımı geliştiririz.
            </p>
            <p>
              Mesleki etik, bağımsızlık ve gizlilik ilkelerini çalışmalarımızın merkezinde tutarız.
              Mevzuatı düzenli takip eder; karmaşık konuları açık, anlaşılır ve uygulanabilir
              değerlendirmelere dönüştürürüz.
            </p>
            <div className="about-values">
              {['Güven', 'Bağımsızlık', 'Uzmanlık'].map((x) => (
                <span key={x}>
                  <ShieldCheck size={18} />
                  {x}
                </span>
              ))}
            </div>
            <TextLink href="/kurumsal/hakkimizda">Karen YMM’yi Tanıyın</TextLink>
          </div>
        </div>
      </section>
      <section className="section surface">
        <div className="container">
          <SectionHeading
            eyebrow="ADIM ADIM, BİRLİKTE"
            title="Çalışma Yaklaşımımız"
            description="İlk görüşmeden sürekli takibe, açık ve planlı bir süreç."
          />
          <div className="process-grid">
            {processSteps.map((x, i) => (
              <article key={x.title}>
                <span>0{i + 1}</span>
                <h3>{x.title}</h3>
                <p>{x.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      {circulars.length > 0 && (
        <section className="section surface">
          <div className="container">
            <SectionHeading
              eyebrow="MEVZUAT VE VERGİ GÜNDEMİ"
              title="Güncel Sirkülerler"
              description="Vergi ve mevzuat gelişmeleri için bilgi paylaşım alanımız."
            >
              <TextLink href="/sirkulerler">Tüm Sirkülerleri Gör</TextLink>
            </SectionHeading>
            <div className="publication-grid">
              {circulars.map((x) => (
                <PublicationCard key={x.slug} item={x} />
              ))}
            </div>
          </div>
        </section>
      )}
      {articles.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading eyebrow="BİLGİ VE BAKIŞ AÇISI" title="Karen YMM’den Güncel İçerikler">
              <TextLink href="/makaleler">Tüm Makaleler</TextLink>
            </SectionHeading>
            <div className="publication-grid editorial">
              {articles.map((x) => (
                <PublicationCard key={x.slug} item={x} />
              ))}
            </div>
          </div>
        </section>
      )}
      <CTA enabled={hasContactChannels(settings)} />
    </>
  );
}
