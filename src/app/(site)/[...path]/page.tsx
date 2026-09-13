import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { pages } from '@/data/pages';
import { publicContent } from '@/lib/cms';
import {
  About,
  Career,
  Contact,
  MissionVision,
  Policy,
  TeamPage,
  Values,
} from '@/components/institutional-pages';
import { CTA, EmptyState, PageHero, ServiceCards } from '@/components/ui';
import { PublicationBrowser } from '@/components/publication-browser';
import { PublicationDetail } from '@/components/publication-detail';
import { ServiceDetail } from '@/components/service-detail';
import { BreadcrumbSchema, metadataFor } from '@/lib/seo';
type Props = { params: Promise<{ path: string[] }> };
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { services, publications } = await publicContent();
  const { path } = await params;
  const route = path.join('/');
  const service = services.find((s) => route === `hizmetler/${s.slug}`);
  if (service) return metadataFor(service.title, service.intro, `/${route}/`);
  const publication = publications.find((p) => route === `${p.kind}/${p.slug}`);
  if (publication)
    return {
      ...metadataFor(publication.title, publication.description, `/${route}/`, publication.demo),
      openGraph: {
        type: 'article',
        title: publication.title,
        description: publication.description,
        url: `/${route}/`,
        publishedTime: publication.date,
        locale: 'tr_TR',
      },
    };
  const page = pages.find((p) => p.path === route);
  if (page)
    return metadataFor(
      page.label === 'Hakkımızda' ? 'Hakkımızda — Deneyim ve Güvenle' : page.title,
      page.description,
      `/${route}/`,
      page.noindex,
    );
  return { title: 'Sayfa Bulunamadı', robots: { index: false } };
}
export default async function ContentPage({ params }: Props) {
  const { services, publications } = await publicContent();
  const { path } = await params;
  const route = path.join('/');
  const service = services.find((s) => route === `hizmetler/${s.slug}`);
  if (service)
    return (
      <>
        <BreadcrumbSchema
          items={[
            { name: 'Hizmetlerimiz', path: '/hizmetlerimiz/' },
            { name: service.title, path: `/${route}/` },
          ]}
        />
        <ServiceDetail service={service} />
      </>
    );
  const publication = publications.find((p) => route === `${p.kind}/${p.slug}`);
  if (publication)
    return (
      <>
        <BreadcrumbSchema
          items={[
            {
              name: publication.kind === 'sirkulerler' ? 'Sirkülerler' : 'Makaleler',
              path: `/${publication.kind}/`,
            },
            { name: publication.title, path: `/${route}/` },
          ]}
        />
        <PublicationDetail publication={publication} />
      </>
    );
  const page = pages.find((p) => p.path === route);
  if (!page) notFound();
  let content: React.ReactNode;
  switch (route) {
    case 'kurumsal/hakkimizda':
      content = <About />;
      break;
    case 'kurumsal/misyon-vizyon':
      content = <MissionVision />;
      break;
    case 'kurumsal/degerlerimiz':
      content = <Values />;
      break;
    case 'kurumsal/ortaklarimiz':
      content = <TeamPage isPartners />;
      break;
    case 'ekibimiz':
      content = <TeamPage />;
      break;
    case 'hizmetlerimiz':
      content = <ServiceCards items={services} />;
      break;
    case 'sirkulerler':
    case 'makaleler':
      content = <PublicationBrowser items={publications.filter((p) => p.kind === route)} />;
      break;
    case 'duyurular':
      content = (
        <EmptyState
          title="Yeni duyurularımız burada olacak"
          description="Yayımlanmış bir kurumsal duyuru bulunmuyor. Karen YMM ile ilgili gelişmeler bu alanda paylaşılacaktır."
        />
      );
      break;
    case 'iletisim':
      content = <Contact />;
      break;
    case 'kariyer':
      content = <Career />;
      break;
    default:
      content = <Policy kind={route} />;
  }
  return (
    <>
      <BreadcrumbSchema items={[{ name: page.label, path: `/${route}/` }]} />
      <PageHero
        eyebrow={page.label.toLocaleUpperCase('tr-TR')}
        title={page.title}
        description={page.description}
      />
      <section className="section">
        <div className="container">{content}</div>
      </section>
      {!['iletisim', 'kvkk', 'gizlilik-politikasi', 'cerez-politikasi'].includes(route) && <CTA />}
    </>
  );
}
