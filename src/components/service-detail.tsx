import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { services, type Service } from '@/data/services';
import { processSteps } from '@/data/company';
import { Accordion, CheckList, CTA, PageHero } from './ui';
export function ServiceDetail({ service: s }: { service: Service }) {
  return (
    <>
      <PageHero
        eyebrow="HİZMETLERİMİZ"
        title={s.title}
        description={s.intro}
        crumbs={[{ label: 'Hizmetlerimiz', href: '/hizmetlerimiz' }, { label: s.shortTitle }]}
      />
      <section className="section">
        <div className="container detail-grid">
          <div className="detail-body">
            <section>
              <h2>Hizmetin Kapsamı</h2>
              <p>
                Çalışmanın kapsamını işletmenizin ihtiyaçlarına göre belirler, sorumlulukları ve
                izlenecek adımları başlangıçta netleştiririz.
              </p>
              <CheckList items={s.scope} />
            </section>
            <section>
              <h2>Sağlanan Faydalar</h2>
              <CheckList items={s.benefits} />
            </section>
            <section>
              <h2>Süreç Nasıl İlerler?</h2>
              <div className="process-grid">
                {processSteps.map((x, i) => (
                  <article key={x.title}>
                    <span>0{i + 1}</span>
                    <h3>{x.title}</h3>
                    <p>{x.text}</p>
                  </article>
                ))}
              </div>
            </section>
            <section>
              <h2>Kimler İçin Uygundur?</h2>
              <p>{s.audience}</p>
            </section>
            <section>
              <h2>Sık Sorulan Sorular</h2>
              <Accordion items={s.faq.map((f) => ({ title: f.question, text: f.answer }))} />
            </section>
          </div>
          <aside className="service-sidebar" aria-label="Diğer hizmetler">
            <h2>Karen YMM Hizmetleri</h2>
            {services.map((x) => (
              <Link
                key={x.slug}
                href={`/hizmetler/${x.slug}`}
                aria-current={x.slug === s.slug ? 'page' : undefined}
              >
                {x.shortTitle}
                <ArrowUpRight size={14} />
              </Link>
            ))}
            <div className="sidebar-cta">
              <h3>Uzmanlarımızla Görüşün</h3>
              <p>İşletmenize uygun çalışma kapsamını birlikte belirleyelim.</p>
              <Link className="button" href={`/iletisim?konu=${encodeURIComponent(s.title)}`}>
                İletişime Geçin
                <ArrowUpRight size={17} />
              </Link>
            </div>
          </aside>
        </div>
      </section>
      <CTA />
    </>
  );
}
