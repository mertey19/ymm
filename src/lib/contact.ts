export type ContactValues = {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  consent: boolean;
  website: string;
};
export function validateContact(v: ContactValues) {
  const errors: Partial<Record<keyof ContactValues, string>> = {};
  if (v.name.trim().length < 2) errors.name = 'Lütfen adınızı ve soyadınızı yazın.';
  if (v.name.length > 120) errors.name = 'Ad soyad en fazla 120 karakter olabilir.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email) || v.email.length > 254)
    errors.email = 'Geçerli bir e-posta adresi yazın.';
  if (v.phone && !/^[+()\d\s-]{7,25}$/.test(v.phone))
    errors.phone = 'Geçerli bir telefon numarası yazın.';
  if (!v.subject.trim()) errors.subject = 'Lütfen bir konu seçin.';
  if (v.company.length > 200) errors.company = 'Şirket adı en fazla 200 karakter olabilir.';
  if (v.message.trim().length < 20) errors.message = 'Lütfen en az 20 karakterlik bir mesaj yazın.';
  if (v.message.length > 5000) errors.message = 'Mesajınız en fazla 5000 karakter olabilir.';
  if (!v.consent) errors.consent = 'Devam etmek için aydınlatma metnini okuduğunuzu onaylayın.';
  return errors;
}
