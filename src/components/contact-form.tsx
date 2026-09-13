'use client';
import { useState, type FormEvent } from 'react';
import Link from '@/components/site-link';
import { ArrowUpRight, LoaderCircle } from 'lucide-react';
import { site } from '@/config/site';
import { validateContact, type ContactValues } from '@/lib/contact';
const initial: ContactValues = {
  name: '',
  email: '',
  phone: '',
  company: '',
  subject: '',
  message: '',
  consent: false,
  website: '',
};
export function ContactForm({
  subjects,
  endpoint = site.contactEndpoint,
}: {
  subjects: string[];
  endpoint?: string;
}) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactValues, string>>>({});
  const [state, setState] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [feedback, setFeedback] = useState('');
  function update(key: keyof ContactValues, value: string | boolean) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    if (state !== 'loading') {
      setState('idle');
      setFeedback('');
    }
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === 'loading') return;
    if (values.website) {
      setState('error');
      setFeedback('Mesajınız gönderilemedi.');
      return;
    }
    const found = validateContact(values);
    setErrors(found);
    if (Object.keys(found).length) {
      setState('error');
      setFeedback('Lütfen işaretli alanları kontrol edin.');
      document.getElementById(`contact-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    if (!endpoint) {
      setState('error');
      setFeedback(
        'Mesajınız gönderilmedi. Çevrimiçi iletişim hizmeti henüz kullanıma açılmadı. Lütfen iletişim bilgilerimiz yayımlandığında doğrudan bize ulaşın.',
      );
      return;
    }
    setState('loading');
    setFeedback('Mesajınız gönderiliyor…');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
        signal: AbortSignal.timeout(15000),
      });
      const result = (await response.json()) as { success?: boolean };
      if (!response.ok || result.success !== true) throw new Error('delivery-failed');
      setState('success');
      setFeedback('Mesajınız alındı. İletişim talebiniz için teşekkür ederiz.');
      setValues(initial);
    } catch {
      setState('error');
      setFeedback('Mesajınızın iletildiği doğrulanamadı. Lütfen daha sonra tekrar deneyin.');
    }
  }
  const fields = [
    { key: 'name', label: 'Ad Soyad', type: 'text', auto: 'name', required: true, max: 120 },
    { key: 'email', label: 'E-posta', type: 'email', auto: 'email', required: true, max: 254 },
    { key: 'phone', label: 'Telefon', type: 'tel', auto: 'tel', required: false, max: 25 },
    {
      key: 'company',
      label: 'Şirket',
      type: 'text',
      auto: 'organization',
      required: false,
      max: 200,
    },
  ] as const;
  return (
    <form className="contact-form" onSubmit={submit} noValidate aria-busy={state === 'loading'}>
      <h2>Birlikte değerlendirelim</h2>
      <p className="form-note">İhtiyacınızı paylaşın. * işaretli alanlar zorunludur.</p>
      {!endpoint && (
        <div className="sample-notice">
          Çevrimiçi mesaj gönderimi henüz kullanıma açılmamıştır. Bu form üzerinden bilgi iletilmez.
        </div>
      )}
      <div className="form-fields">
        {fields.map((f) => (
          <div className="field" key={f.key}>
            <label htmlFor={`contact-${f.key}`}>
              {f.label}
              {f.required ? ' *' : ' (isteğe bağlı)'}
            </label>
            <input
              id={`contact-${f.key}`}
              name={f.key}
              type={f.type}
              autoComplete={f.auto}
              maxLength={f.max}
              required={f.required}
              value={values[f.key]}
              disabled={state === 'loading'}
              onChange={(e) => update(f.key, e.target.value)}
              aria-invalid={!!errors[f.key]}
              aria-describedby={errors[f.key] ? `error-${f.key}` : undefined}
            />
            {errors[f.key] && (
              <p className="field-error" id={`error-${f.key}`}>
                {errors[f.key]}
              </p>
            )}
          </div>
        ))}
        <div className="field full">
          <label htmlFor="contact-subject">Konu *</label>
          <select
            name="subject"
            id="contact-subject"
            required
            value={values.subject}
            disabled={state === 'loading'}
            onChange={(e) => update('subject', e.target.value)}
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? 'error-subject' : undefined}
          >
            <option value="">Konu seçin</option>
            {subjects.map((subject) => (
              <option key={subject}>{subject}</option>
            ))}
            <option>Genel Bilgi</option>
            <option>Kariyer</option>
          </select>
          {errors.subject && (
            <p className="field-error" id="error-subject">
              {errors.subject}
            </p>
          )}
        </div>
        <div className="field full">
          <label htmlFor="contact-message">Mesajınız *</label>
          <textarea
            id="contact-message"
            name="message"
            required
            minLength={20}
            maxLength={5000}
            value={values.message}
            disabled={state === 'loading'}
            onChange={(e) => update('message', e.target.value)}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'error-message' : undefined}
          />
          {errors.message && (
            <p className="field-error" id="error-message">
              {errors.message}
            </p>
          )}
        </div>
      </div>
      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor="contact-website">Web sitesi</label>
        <input
          id="contact-website"
          name="website"
          value={values.website}
          onChange={(e) => update('website', e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <label className="consent" htmlFor="contact-consent">
        <input
          type="checkbox"
          id="contact-consent"
          checked={values.consent}
          required
          disabled={state === 'loading'}
          onChange={(e) => update('consent', e.target.checked)}
          aria-invalid={!!errors.consent}
          aria-describedby={errors.consent ? 'error-consent' : undefined}
        />
        <span>
          <Link href="/kvkk" target="_blank" rel="noopener noreferrer">
            KVKK Aydınlatma Metni
          </Link>
          ’ni okudum. İletişim talebim kapsamında bilgilendirildim. *
        </span>
      </label>
      {errors.consent && (
        <p className="field-error" id="error-consent">
          {errors.consent}
        </p>
      )}
      {feedback && (
        <p
          className={`form-status ${state === 'success' ? 'success' : ''}`}
          role={state === 'error' ? 'alert' : 'status'}
        >
          {feedback}
        </p>
      )}
      <button className="button" type="submit" disabled={state === 'loading'}>
        {state === 'loading' ? (
          <>
            Gönderiliyor
            <LoaderCircle size={17} />
          </>
        ) : (
          <>
            Gönder
            <ArrowUpRight size={17} />
          </>
        )}
      </button>
    </form>
  );
}
