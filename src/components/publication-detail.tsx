import Link from 'next/link';
import { publications, type Publication } from '@/data/publications';
import { PageHero, PublicationCard, SectionHeading } from './ui';
import { Share } from './share';
import { JsonLd } from '@/lib/seo';
import { site } from '@/config/site';
export function PublicationDetail({ publication: p }: { publication: Publication }) {
  const list = publications.filter((x) => x.kind === p.kind);
  const index = list.findIndex((x) => x.slug === p.slug);
  const previous = list[index - 1];
  const next = list[index + 1];
  const label = p.kind === 'sirkulerler' ? 'Sirkülerler' : 'Makaleler';
  return (
    <>
      <PageHero
        eyebrow={p.category.toLocaleUpperCase('tr-TR')}
        title={p.title}
        description={p.description}
        crumbs={[{ label, href: `/${p.kind}` }, { label: p.title }]}
      />
      <section className="section">
        <div className="container">
          <article className="article-layout">
            <div className="article-header-meta">
              <span>Kurumsal yayıncı: Karen YMM</span>
              <time dateTime={p.date}>
                {new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long', timeZone: 'UTC' }).format(
                  new Date(p.date),
                )}
              </time>
              <span>{p.category}</span>
            </div>
            {p.demo && (
              <div className="sample-notice">
                Örnek içerik — yayın sistemi gösterimi. Belirtilen tarih örnek kayda aittir. Bu
                içerik güncel mevzuat duyurusu veya belirli bir işlem için danışmanlık görüşü
                değildir.
              </div>
            )}
            {p.body.map((s) => (
              <section key={s.heading}>
                <h2>{s.heading}</h2>
                <p>{s.text}</p>
              </section>
            ))}
            <Share title={p.title} />
            <nav className="post-navigation" aria-label="Yayınlar arasında gezinme">
              {previous ? (
                <Link href={`/${previous.kind}/${previous.slug}`}>
                  <small>← Önceki yayın</small>
                  {previous.title}
                </Link>
              ) : (
                <Link href={`/${p.kind}`}>
                  <small>← Arşive dön</small>Tüm {label}
                </Link>
              )}
              {next ? (
                <Link href={`/${next.kind}/${next.slug}`}>
                  <small>Sonraki yayın →</small>
                  {next.title}
                </Link>
              ) : (
                <Link href={`/${p.kind}`}>
                  <small>Arşivi incele →</small>Tüm {label}
                </Link>
              )}
            </nav>
          </article>
        </div>
      </section>
      <section className="section surface">
        <div className="container">
          <SectionHeading eyebrow="OKUMAYA DEVAM EDİN" title="İlgili Yayınlar" />
          <div className="publication-grid">
            {list
              .filter((x) => x.slug !== p.slug)
              .map((x) => (
                <PublicationCard key={x.slug} item={x} />
              ))}
          </div>
        </div>
      </section>
      {!p.demo && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: p.title,
            description: p.description,
            datePublished: p.date,
            author: { '@type': 'Organization', name: site.name },
            publisher: { '@id': `${site.url}/#organization` },
            mainEntityOfPage: new URL(`/${p.kind}/${p.slug}/`, site.url).href,
            articleSection: p.category,
          }}
        />
      )}
    </>
  );
}
