import type { Metadata } from 'next';
import '@fontsource-variable/manrope';
import '@fontsource-variable/inter';
import './globals.css';
import './hero.css';
import { site, socialImage } from '@/config/site';
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Karen YMM | Yeminli Mali Müşavirlik, Vergi ve Danışmanlık',
    template: '%s | Karen YMM',
  },
  description: site.description,
  icons: { icon: '/favicon.svg' },
  openGraph: { locale: 'tr_TR', siteName: site.name, type: 'website', images: [socialImage] },
  twitter: { card: 'summary_large_image', images: [socialImage.url] },
  robots: { index: site.isIndexable, follow: true },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
