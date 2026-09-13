import type { AnchorHTMLAttributes } from 'react';

// Full document navigation keeps CMS pages fresh and avoids the retained
// Vinext beta's broken production RSC prefetch/link module.
export default function SiteLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} />;
}
