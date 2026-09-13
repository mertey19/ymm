// Set only after the final public domain has been confirmed. Preview stays noindex.
const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
function resolveSiteUrl() {
  if (!configuredUrl) return 'https://ymm-tau.vercel.app';
  const url = new URL(configuredUrl);
  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  )
    throw new Error('NEXT_PUBLIC_SITE_URL must be an HTTPS origin without a path or credentials.');
  return url.origin;
}
export const site = {
  name: 'Karen YMM',
  url: resolveSiteUrl(),
  isIndexable: Boolean(configuredUrl),
  phone: '',
  email: '',
  address: '',
  workingHours: '',
  socials: [] as { label: string; url: string }[],
  contactEndpoint: process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || '',
  description:
    'Karen YMM; yeminli mali müşavirlik, tam tasdik, vergi danışmanlığı, KDV iadesi, denetim ve mali danışmanlık alanlarında profesyonel hizmetler sunar.',
};
export function hasContactChannels(settings: { phone: string; email: string; address: string }) {
  return Boolean(
    settings.phone.trim() ||
    settings.email.trim() ||
    settings.address.trim() ||
    site.contactEndpoint,
  );
}
export const socialImage = {
  url: `${site.url}/og.png`,
  width: 1200,
  height: 630,
  alt: 'Karen YMM — Yeminli Mali Müşavirlik, Vergi, Tasdik, Denetim ve Danışmanlık',
};
