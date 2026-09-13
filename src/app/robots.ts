import type { MetadataRoute } from 'next';
import { site } from '@/config/site';
export const dynamic = 'force-static';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: site.isIndexable
      ? { userAgent: '*', allow: '/', disallow: ['/yonetim/', '/api/'] }
      : { userAgent: '*', disallow: '/' },
    ...(site.isIndexable ? { sitemap: `${site.url}/sitemap.xml` } : {}),
  };
}
