import { services } from './services';
export type NavigationItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};
export const corporateLinks = [
  { label: 'Hakkımızda', href: '/kurumsal/hakkimizda' },
  { label: 'Misyon ve Vizyon', href: '/kurumsal/misyon-vizyon' },
  { label: 'Değerlerimiz', href: '/kurumsal/degerlerimiz' },
  { label: 'Ortaklarımız', href: '/kurumsal/ortaklarimiz' },
  { label: 'Ekibimiz', href: '/ekibimiz' },
];
export const publicationLinks = [
  { label: 'Sirkülerler', href: '/sirkulerler' },
  { label: 'Makaleler', href: '/makaleler' },
  { label: 'Duyurular', href: '/duyurular' },
];
export const navigation = [
  { label: 'Anasayfa', href: '/' },
  { label: 'Kurumsal', href: '/kurumsal/hakkimizda', children: corporateLinks },
  {
    label: 'Hizmetlerimiz',
    href: '/hizmetlerimiz',
    children: [
      { label: 'Tüm Hizmetlerimiz', href: '/hizmetlerimiz' },
      ...services.map((s) => ({ label: s.title, href: `/hizmetler/${s.slug}` })),
    ],
  },
  { label: 'Yayınlar', href: '/sirkulerler', children: publicationLinks },
  { label: 'Kariyer', href: '/kariyer' },
  { label: 'İletişim', href: '/iletisim' },
];
