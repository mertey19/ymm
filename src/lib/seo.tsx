import type { Metadata } from 'next';
import { site } from '@/config/site';
export function metadataFor(
  title: string,
  description: string,
  path: string,
  noindex = false,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: path,
      siteName: site.name,
      locale: 'tr_TR',
      type: 'website',
    },
    twitter: { card: 'summary', title, description },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
export function BreadcrumbSchema({ items }: { items: { name: string; path: string }[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [{ name: 'Anasayfa', path: '/' }, ...items].map((x, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: x.name,
          item: new URL(x.path, site.url).href,
        })),
      }}
    />
  );
}
