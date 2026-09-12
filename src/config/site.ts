export const site = {
  name: 'Karen YMM',
  legalName: 'Karen YMM',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://karen-ymm-kurumsal.kubimert3133.chatgpt.site',
  phone: '',
  email: '',
  address: '',
  workingHours: '',
  socials: [] as { label: string; url: string }[],
  contactEndpoint: process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || '',
  description:
    'Karen YMM; yeminli mali müşavirlik, tam tasdik, vergi danışmanlığı, KDV iadesi, denetim ve mali danışmanlık alanlarında profesyonel hizmetler sunar.',
};
