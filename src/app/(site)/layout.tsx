import { Header } from '@/components/header';
import { navigation } from '@/data/navigation';
import { Footer } from '@/components/footer';
import { site } from '@/config/site';
import { publicContent } from '@/lib/cms';
import { JsonLd } from '@/lib/seo';
export const dynamic = 'force-dynamic';
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { settings, services } = await publicContent();
  const company = { ...site, ...settings };
  const items = navigation.map((item) =>
    item.label === 'Hizmetlerimiz'
      ? {
          ...item,
          children: [
            { label: 'Tüm Hizmetlerimiz', href: '/hizmetlerimiz' },
            ...services.map((s) => ({ label: s.title, href: `/hizmetler/${s.slug}` })),
          ],
        }
      : item,
  );
  return (
    <>
      <a className="skip-link" href="#main">
        İçeriğe geç
      </a>
      <Header items={items} />
      <main id="main">{children}</main>
      <Footer />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Organization',
              '@id': `${site.url}/#organization`,
              name: site.name,
              legalName: site.legalName,
              url: site.url,
              ...(company.email ? { email: company.email } : {}),
              ...(company.phone ? { telephone: company.phone } : {}),
              sameAs: site.socials.map((s) => s.url),
            },
            {
              '@type': 'ProfessionalService',
              '@id': `${site.url}/#service`,
              name: site.name,
              url: site.url,
              description: site.description,
              parentOrganization: { '@id': `${site.url}/#organization` },
              ...(company.address ? { address: company.address } : {}),
            },
          ],
        }}
      />
    </>
  );
}
