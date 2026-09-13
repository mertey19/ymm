import { hasContactChannels } from '@/config/site';
import type { CmsDocument } from './cms-schema';
// Used by both metadata and sitemap so empty sections cannot become indexable by accident.
export function pageIsIndexable(page: { path: string; noindex?: boolean }, content: CmsDocument) {
  if (page.path === 'iletisim') return hasContactChannels(content.settings);
  if (page.path === 'ekibimiz') return content.team.some((t) => t.published);
  if (page.path === 'kurumsal/ortaklarimiz')
    return content.team.some((t) => t.published && t.partner);
  if (['makaleler', 'sirkulerler'].includes(page.path))
    return content.publications.some((p) => p.kind === page.path && p.published && !p.demo);
  return !page.noindex;
}
