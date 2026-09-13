import type { MetadataRoute } from 'next';
import { site } from '@/config/site';
import { pages } from '@/data/pages';
import { publicContent } from '@/lib/cms';
export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { services, publications } = await publicContent();
  return [
    { url: `${site.url}/`, priority: 1 },
    ...pages
      .filter((p) => !p.noindex)
      .map((p) => ({ url: `${site.url}/${p.path}/`, priority: 0.7 })),
    ...services.map((s) => ({ url: `${site.url}/hizmetler/${s.slug}/`, priority: 0.8 })),
    ...publications
      .filter((p) => !p.demo)
      .map((p) => ({
        url: `${site.url}/${p.kind}/${p.slug}/`,
        lastModified: p.date,
        priority: 0.6,
      })),
  ];
}
