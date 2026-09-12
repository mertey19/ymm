import type { MetadataRoute } from 'next';
import { site } from '@/config/site';
import { pages } from '@/data/pages';
import { services } from '@/data/services';
import { publications } from '@/data/publications';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
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
