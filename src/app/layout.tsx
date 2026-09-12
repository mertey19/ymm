import type { Metadata } from 'next';
import '@fontsource-variable/manrope';
import '@fontsource-variable/inter';
import './globals.css';
import { Header } from '@/components/header';
import { navigation } from '@/data/navigation';
import { Footer } from '@/components/footer';
import { site } from '@/config/site';
import { JsonLd } from '@/lib/seo';
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Karen YMM | Yeminli Mali Müşavirlik, Vergi ve Danışmanlık',
    template: '%s | Karen YMM',
  },
  description: site.description,
  icons: { icon: '/favicon.svg' },
  openGraph: { locale: 'tr_TR', siteName: site.name, type: 'website' },
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <a className="skip-link" href="#main">
          İçeriğe geç
        </a>
        <Header items={navigation} />
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
                ...(site.email ? { email: site.email } : {}),
                ...(site.phone ? { telephone: site.phone } : {}),
                sameAs: site.socials.map((s) => s.url),
              },
              {
                '@type': 'ProfessionalService',
                '@id': `${site.url}/#service`,
                name: site.name,
                url: site.url,
                description: site.description,
                parentOrganization: { '@id': `${site.url}/#organization` },
                ...(site.address ? { address: site.address } : {}),
              },
            ],
          }}
        />
      </body>
    </html>
  );
}
