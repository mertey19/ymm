'use client';
/* Dispatch-owned sign-out and unsaved-edit navigation require full page loads. */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-location-assign-relative-destination -- Reload server-authenticated state after revoking the session. */
import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Building2,
  FileText,
  LayoutDashboard,
  LogOut,
  Plus,
  Save,
  Settings2,
  Users,
  BriefcaseBusiness,
  Check,
  Trash2,
} from 'lucide-react';
import type { CmsDocument, CmsState } from '@/lib/cms-schema';

const sections = [
  { id: 'overview', label: 'Genel bakış', icon: LayoutDashboard },
  { id: 'settings', label: 'Site & iletişim', icon: Settings2 },
  { id: 'services', label: 'Hizmetler', icon: BriefcaseBusiness },
  { id: 'publications', label: 'Yayınlar', icon: FileText },
  { id: 'team', label: 'Ekip & ortaklar', icon: Users },
] as const;
type Section = (typeof sections)[number]['id'];
function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = 'text',
  hint,
  required = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label className="admin-field">
      <span>
        {label}
        {required ? ' *' : ''}
      </span>
      {multiline ? (
        <textarea
          required={required}
          rows={5}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          required={required}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {hint && <small>{hint}</small>}
    </label>
  );
}
export function AdminPanel({ initial, name }: { initial: CmsState; name: string }) {
  useEffect(() => {
    document.querySelector('.admin-shell')?.setAttribute('data-ready', 'true');
  }, []);
  const [state, setState] = useState(initial),
    [saved, setSaved] = useState(JSON.stringify(initial.data));
  const [section, setSection] = useState<Section>('overview'),
    [selected, setSelected] = useState(0),
    [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(''),
    [failed, setFailed] = useState(false);
  const data = state.data,
    dirty = JSON.stringify(data) !== saved;
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  function edit(next: CmsDocument) {
    setState((s) => ({ ...s, data: next }));
    setNotice('');
  }
  function navigate(next: Section) {
    setSection(next);
    setSelected(0);
    setSearch('');
  }
  async function logout() {
    if (
      dirty &&
      !window.confirm('Kaydedilmemiş değişiklikleriniz var. Çıkış yapmak istiyor musunuz?')
    )
      return;
    try {
      const response = await fetch('/api/admin/logout/', { method: 'POST' });
      if (!response.ok) throw new Error();
      window.location.assign('/yonetim/');
    } catch {
      setFailed(true);
      setNotice('Çıkış yapılamadı. Lütfen yeniden deneyin.');
    }
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setNotice('');
    setFailed(false);
    try {
      const res = await fetch('/api/admin/content/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
        signal: AbortSignal.timeout(20000),
      });
      const result = (await res.json()) as CmsState & { error?: string };
      if (!res.ok) throw new Error(result.error || 'Kaydedilemedi.');
      setState(result);
      setSaved(JSON.stringify(result.data));
      setNotice('Değişiklikler kaydedildi. Yayımdaki içerikler siteye yansıdı.');
    } catch (error) {
      setFailed(true);
      setNotice(
        error instanceof Error && error.name !== 'TimeoutError' && error.name !== 'TypeError'
          ? error.message
          : 'Sunucuya ulaşılamadı. Yazdıklarınız korunuyor; lütfen yeniden deneyin.',
      );
    } finally {
      setBusy(false);
    }
  }
  const updateSettings = (key: keyof CmsDocument['settings'], value: string) =>
    edit({ ...data, settings: { ...data.settings, [key]: value } });
  const service = data.services[selected];
  const publication = data.publications[selected];
  const member = data.team[selected];
  function updateService(key: string, value: unknown) {
    edit({
      ...data,
      services: data.services.map((s, i) => (i === selected ? { ...s, [key]: value } : s)),
    });
  }
  function updatePublication(key: string, value: unknown) {
    edit({
      ...data,
      publications: data.publications.map((p, i) =>
        i === selected
          ? { ...p, [key]: value, ...(key === 'demo' && value ? { published: false } : {}) }
          : p,
      ),
    });
  }
  function updateMember(key: string, value: unknown) {
    edit({ ...data, team: data.team.map((p, i) => (i === selected ? { ...p, [key]: value } : p)) });
  }
  const published = data.publications.filter((p) => p.published).length;
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/yonetim/">
          <Building2 size={30} />
          <span>
            KAREN YMM<small>YÖNETİM PANELİ</small>
          </span>
        </a>
        <div className="admin-nav-label">ÇALIŞMA ALANI</div>
        <nav aria-label="Yönetim menüsü">
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => navigate(s.id)}
              aria-current={section === s.id ? 'page' : undefined}
            >
              <s.icon size={19} />
              {s.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <span className="admin-avatar">{name.slice(0, 1).toLocaleUpperCase('tr')}</span>
          <div>
            <strong>Site yöneticisi</strong>
            <small>{name}</small>
          </div>
          <button type="button" onClick={logout} aria-label="Çıkış yap">
            <LogOut size={18} />
          </button>
        </div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <span>
            <span className="admin-live-dot" /> Karen YMM sitesi
          </span>
          <a href="/" target="_blank" rel="noreferrer">
            Siteyi görüntüle <ArrowUpRight size={16} />
          </a>
        </header>
        <form onSubmit={save}>
          <fieldset className="admin-form-fields" disabled={busy}>
            <main className="admin-main" id="main">
              <div className="admin-heading">
                <div>
                  <p className="eyebrow">İÇERİK YÖNETİMİ</p>
                  <h1>{sections.find((s) => s.id === section)?.label}</h1>
                  <p>
                    {section === 'overview'
                      ? 'Sitenizin içeriklerini tek bir yerden güncel tutun.'
                      : 'Düzenlemelerinizi tamamladıktan sonra değişiklikleri kaydedin.'}
                  </p>
                </div>
                <button className="admin-save" disabled={busy || !dirty} type="submit">
                  {busy ? <span className="admin-spinner" /> : <Save size={17} />}{' '}
                  {busy ? 'Kaydediliyor…' : 'Değişiklikleri kaydet'}
                </button>
              </div>
              <div className="admin-save-state" role="status">
                {dirty ? (
                  'Kaydedilmemiş değişiklikler var.'
                ) : (
                  <>
                    <Check size={14} />{' '}
                    {state.updatedAt
                      ? `Son kayıt: ${new Date(state.updatedAt).toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}`
                      : 'Mevcut site içerikleri yüklendi.'}
                  </>
                )}
              </div>
              {notice && (
                <div
                  className={`admin-notice ${failed ? 'is-error' : ''}`}
                  role={failed ? 'alert' : 'status'}
                >
                  {notice}
                </div>
              )}
              {section === 'overview' && (
                <>
                  <div className="admin-stats">
                    {[
                      {
                        label: 'Hizmet',
                        value: data.services.length,
                        icon: BriefcaseBusiness,
                        target: 'services',
                      },
                      {
                        label: 'Yayımdaki içerik',
                        value: published,
                        icon: FileText,
                        target: 'publications',
                      },
                      {
                        label: 'Taslak yayın',
                        value: data.publications.length - published,
                        icon: FileText,
                        target: 'publications',
                      },
                      {
                        label: 'Yayımdaki ekip üyesi',
                        value: data.team.filter((m) => m.published).length,
                        icon: Users,
                        target: 'team',
                      },
                    ].map((c) => (
                      <button
                        key={c.label}
                        type="button"
                        onClick={() => navigate(c.target as Section)}
                      >
                        <c.icon size={22} />
                        <strong>{c.value}</strong>
                        <span>{c.label}</span>
                        <ArrowUpRight size={16} />
                      </button>
                    ))}
                  </div>
                  <div className="admin-overview-grid">
                    <section className="admin-card">
                      <div className="admin-card-heading">
                        <div>
                          <h2>İçerikle başlayın</h2>
                          <p>Yeni bir yayın hazırlayın veya mevcut bilgileri güncelleyin.</p>
                        </div>
                      </div>
                      {sections.slice(1).map((s) => (
                        <button
                          className="admin-quick-link"
                          type="button"
                          key={s.id}
                          onClick={() => navigate(s.id)}
                        >
                          <s.icon size={21} />
                          <span>
                            {s.label}
                            <small>
                              {s.id === 'settings'
                                ? 'Anasayfa metinleri ve iletişim bilgileriniz'
                                : s.id === 'services'
                                  ? 'Hizmet açıklamaları, kapsam ve sorular'
                                  : s.id === 'publications'
                                    ? 'Makaleler, sirkülerler ve taslaklar'
                                    : 'Doğrulanmış isimler, unvanlar ve özgeçmişler'}
                            </small>
                          </span>
                          <ArrowUpRight size={18} />
                        </button>
                      ))}
                    </section>
                    <section className="admin-card admin-guide">
                      <span className="admin-pill">YAYIN AKIŞI</span>
                      <h2>
                        Hazırlayın.
                        <br />
                        Kontrol edin.
                        <br />
                        Yayımlayın.
                      </h2>
                      <p>
                        Yeni yayınlar taslak olarak başlar. Hazır olduğunda “Yayında” seçeneğini
                        açıp kaydedin.
                      </p>
                      <div className="admin-note">
                        İletişim formunun e-posta gönderimi henüz bağlı değil. Bu panelde telefon,
                        adres ve e-posta bilgilerini güncelleyebilirsiniz.
                      </div>
                    </section>
                  </div>
                </>
              )}
              {section === 'settings' && (
                <div className="admin-editor-grid">
                  <section className="admin-card">
                    <h2>Anasayfa & hakkımızda</h2>
                    <Field
                      label="Anasayfa başlığı"
                      value={data.settings.heroTitle}
                      onChange={(v) => updateSettings('heroTitle', v)}
                    />
                    <Field
                      label="Anasayfa açıklaması"
                      multiline
                      value={data.settings.heroDescription}
                      onChange={(v) => updateSettings('heroDescription', v)}
                    />
                    <Field
                      label="Hakkımızda başlığı"
                      value={data.settings.aboutTitle}
                      onChange={(v) => updateSettings('aboutTitle', v)}
                    />
                    <Field
                      label="Hakkımızda metni"
                      multiline
                      hint="Paragrafları boş bir satırla ayırın."
                      value={data.settings.aboutText}
                      onChange={(v) => updateSettings('aboutText', v)}
                    />
                  </section>
                  <section className="admin-card">
                    <h2>İletişim bilgileri</h2>
                    <p>Bu bilgiler iletişim sayfasında ve site alt bölümünde görünür.</p>
                    <Field
                      label="Telefon"
                      required={false}
                      type="tel"
                      value={data.settings.phone}
                      onChange={(v) => updateSettings('phone', v)}
                    />
                    <Field
                      label="E-posta"
                      required={false}
                      type="email"
                      value={data.settings.email}
                      onChange={(v) => updateSettings('email', v)}
                    />
                    <Field
                      label="Adres"
                      required={false}
                      multiline
                      value={data.settings.address}
                      onChange={(v) => updateSettings('address', v)}
                    />
                    <Field
                      label="Çalışma saatleri"
                      required={false}
                      value={data.settings.workingHours}
                      onChange={(v) => updateSettings('workingHours', v)}
                    />
                    <div className="admin-note">
                      Boş bırakılan alanlar ziyaretçilere gösterilmez. Doğrulanmış bir iletişim
                      kanalı eklediğinizde ilgili iletişim çağrıları da görünür olur.
                    </div>
                  </section>
                </div>
              )}
              {section === 'services' && (
                <div className="admin-list-editor">
                  <section className="admin-card admin-records">
                    <h2>
                      Hizmetler <span>{data.services.length}</span>
                    </h2>
                    {data.services.map((s, i) => (
                      <button
                        type="button"
                        key={s.slug}
                        aria-pressed={selected === i}
                        onClick={() => setSelected(i)}
                      >
                        {s.shortTitle}
                        <small>/hizmetler/{s.slug}</small>
                      </button>
                    ))}
                  </section>
                  {service && (
                    <section className="admin-card">
                      <div className="admin-card-heading">
                        <h2>Hizmeti düzenle</h2>
                        <a href={`/hizmetler/${service.slug}/`} target="_blank" rel="noreferrer">
                          Sayfayı aç ↗
                        </a>
                      </div>
                      <Field
                        label="Başlık"
                        value={service.title}
                        onChange={(v) => updateService('title', v)}
                      />
                      <Field
                        label="Kısa başlık"
                        value={service.shortTitle}
                        onChange={(v) => updateService('shortTitle', v)}
                      />
                      <Field
                        label="Açıklama"
                        multiline
                        value={service.intro}
                        onChange={(v) => updateService('intro', v)}
                      />
                      <Field
                        label="Hizmet kapsamı"
                        multiline
                        hint="Her maddeyi ayrı satıra yazın."
                        value={service.scope.join('\n')}
                        onChange={(v) => updateService('scope', v.split('\n'))}
                      />
                      <Field
                        label="Faydalar"
                        multiline
                        hint="Her maddeyi ayrı satıra yazın."
                        value={service.benefits.join('\n')}
                        onChange={(v) => updateService('benefits', v.split('\n'))}
                      />
                      <Field
                        label="Kimler için?"
                        multiline
                        value={service.audience}
                        onChange={(v) => updateService('audience', v)}
                      />
                      <h3>Sık sorulan sorular</h3>
                      {service.faq.map((q, i) => (
                        <div className="admin-subsection" key={i}>
                          <Field
                            label={`Soru ${i + 1}`}
                            value={q.question}
                            onChange={(v) =>
                              updateService(
                                'faq',
                                service.faq.map((x, j) => (j === i ? { ...x, question: v } : x)),
                              )
                            }
                          />
                          <Field
                            label="Yanıt"
                            multiline
                            value={q.answer}
                            onChange={(v) =>
                              updateService(
                                'faq',
                                service.faq.map((x, j) => (j === i ? { ...x, answer: v } : x)),
                              )
                            }
                          />
                          <button
                            className="admin-delete"
                            type="button"
                            onClick={() =>
                              updateService(
                                'faq',
                                service.faq.filter((_, j) => j !== i),
                              )
                            }
                          >
                            Soruyu kaldır
                          </button>
                        </div>
                      ))}
                      <button
                        className="admin-secondary"
                        type="button"
                        onClick={() =>
                          updateService('faq', [...service.faq, { question: '', answer: '' }])
                        }
                      >
                        <Plus size={16} /> Soru ekle
                      </button>
                    </section>
                  )}
                </div>
              )}
              {section === 'publications' && (
                <div className="admin-list-editor">
                  <section className="admin-card admin-records">
                    <div className="admin-card-heading">
                      <h2>Yayınlar</h2>
                      <button
                        className="admin-secondary"
                        type="button"
                        onClick={() => {
                          setSelected(data.publications.length);
                          setSearch('');
                          edit({
                            ...data,
                            publications: [
                              ...data.publications,
                              {
                                slug: `yeni-yayin-${Date.now()}`,
                                title: 'Yeni yayın',
                                description: '',
                                category: 'Vergi',
                                date: new Date().toISOString().slice(0, 10),
                                kind: 'makaleler',
                                demo: false,
                                published: false,
                                body: [{ heading: 'Giriş', text: '' }],
                              },
                            ],
                          });
                        }}
                      >
                        <Plus size={16} /> Yeni
                      </button>
                    </div>
                    <Field label="Yayın ara" required={false} value={search} onChange={setSearch} />
                    {data.publications.map(
                      (p, i) =>
                        p.title
                          .toLocaleLowerCase('tr')
                          .includes(search.toLocaleLowerCase('tr')) && (
                          <button
                            type="button"
                            key={i}
                            aria-pressed={selected === i}
                            onClick={() => setSelected(i)}
                          >
                            {p.title}
                            <small>
                              {p.kind === 'makaleler' ? 'Makale' : 'Sirküler'} ·{' '}
                              {p.published ? 'Yayında' : 'Taslak'}
                              {p.demo ? ' · Örnek' : ''}
                            </small>
                          </button>
                        ),
                    )}
                    {!data.publications.length && (
                      <p>Henüz yayın yok. İlk taslağınızı oluşturun.</p>
                    )}
                  </section>
                  {publication && (
                    <section className="admin-card">
                      <div className="admin-card-heading">
                        <h2>Yayını düzenle</h2>
                        <span className="admin-pill">
                          {publication.published ? 'Yayında' : 'Taslak'}
                        </span>
                      </div>
                      <Field
                        label="Başlık"
                        value={publication.title}
                        onChange={(v) => updatePublication('title', v)}
                      />
                      <div className="admin-two-fields">
                        <label className="admin-field">
                          <span>Yayın türü</span>
                          <select
                            value={publication.kind}
                            onChange={(e) => updatePublication('kind', e.target.value)}
                          >
                            <option value="makaleler">Makale</option>
                            <option value="sirkulerler">Sirküler</option>
                          </select>
                        </label>
                        <Field
                          label="Tarih"
                          type="date"
                          value={publication.date}
                          onChange={(v) => updatePublication('date', v)}
                        />
                      </div>
                      <Field
                        label="Sayfa adresi"
                        hint="Küçük harf, rakam ve tire kullanın. Yayımdaki adresi değiştirmek eski bağlantıyı geçersiz kılar."
                        value={publication.slug}
                        onChange={(v) => updatePublication('slug', v)}
                      />
                      <Field
                        label="Kategori"
                        value={publication.category}
                        onChange={(v) => updatePublication('category', v)}
                      />
                      <Field
                        label="Kısa açıklama / SEO açıklaması"
                        multiline
                        value={publication.description}
                        onChange={(v) => updatePublication('description', v)}
                      />
                      <h3>İçerik bölümleri</h3>
                      {publication.body.map((b, i) => (
                        <div className="admin-subsection" key={i}>
                          <Field
                            label={`Bölüm ${i + 1} başlığı`}
                            value={b.heading}
                            onChange={(v) =>
                              updatePublication(
                                'body',
                                publication.body.map((x, j) =>
                                  j === i ? { ...x, heading: v } : x,
                                ),
                              )
                            }
                          />
                          <Field
                            label="Metin"
                            multiline
                            value={b.text}
                            onChange={(v) =>
                              updatePublication(
                                'body',
                                publication.body.map((x, j) => (j === i ? { ...x, text: v } : x)),
                              )
                            }
                          />
                          {publication.body.length > 1 && (
                            <button
                              className="admin-delete"
                              type="button"
                              onClick={() =>
                                updatePublication(
                                  'body',
                                  publication.body.filter((_, j) => j !== i),
                                )
                              }
                            >
                              Bölümü kaldır
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        className="admin-secondary"
                        type="button"
                        onClick={() =>
                          updatePublication('body', [
                            ...publication.body,
                            { heading: '', text: '' },
                          ])
                        }
                      >
                        <Plus size={16} /> Bölüm ekle
                      </button>
                      <div className="admin-publishing">
                        <label>
                          <input
                            type="checkbox"
                            checked={publication.published}
                            disabled={publication.demo}
                            onChange={(e) => updatePublication('published', e.target.checked)}
                          />{' '}
                          Yayında — kaydedildiğinde sitede görünür
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={publication.demo}
                            onChange={(e) => {
                              updatePublication('demo', e.target.checked);
                            }}
                          />{' '}
                          Örnek içerik olarak işaretle
                        </label>
                        {publication.published && (
                          <a
                            href={`/${publication.kind}/${publication.slug}/`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Kaydedilmiş yayını aç ↗
                          </a>
                        )}
                      </div>
                      <button
                        className="admin-delete"
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              'Bu yayını kaldırmak istiyor musunuz? Silme işlemi kaydettiğinizde uygulanır.',
                            )
                          ) {
                            edit({
                              ...data,
                              publications: data.publications.filter((_, i) => i !== selected),
                            });
                            setSelected(0);
                          }
                        }}
                      >
                        <Trash2 size={15} /> Yayını sil
                      </button>
                    </section>
                  )}
                </div>
              )}
              {section === 'team' && (
                <div className="admin-list-editor">
                  <section className="admin-card admin-records">
                    <div className="admin-card-heading">
                      <h2>Ekip & ortaklar</h2>
                      <button
                        className="admin-secondary"
                        type="button"
                        onClick={() => {
                          setSelected(data.team.length);
                          edit({
                            ...data,
                            team: [
                              ...data.team,
                              {
                                id: crypto.randomUUID(),
                                name: 'Yeni ekip üyesi',
                                title: '',
                                bio: '',
                                partner: false,
                                published: false,
                              },
                            ],
                          });
                        }}
                      >
                        <Plus size={16} /> Ekle
                      </button>
                    </div>
                    {data.team.map((m, i) => (
                      <button
                        type="button"
                        key={m.id}
                        aria-pressed={selected === i}
                        onClick={() => setSelected(i)}
                      >
                        {m.name}
                        <small>
                          {m.published ? 'Yayında' : 'Taslak'} ·{' '}
                          {m.partner ? 'Ortak' : 'Ekip üyesi'}
                        </small>
                      </button>
                    ))}
                    {!data.team.length && (
                      <div className="admin-empty">
                        <Users size={32} />
                        <p>İlk ekip üyenizi ekleyin.</p>
                        <small>Yalnızca doğrulanmış mesleki bilgileri yayımlayın.</small>
                      </div>
                    )}
                  </section>
                  {member && (
                    <section className="admin-card">
                      <h2>Ekip üyesini düzenle</h2>
                      <Field
                        label="Ad soyad"
                        value={member.name}
                        onChange={(v) => updateMember('name', v)}
                      />
                      <Field
                        label="Unvan"
                        value={member.title}
                        onChange={(v) => updateMember('title', v)}
                      />
                      <Field
                        label="Özgeçmiş"
                        multiline
                        required={false}
                        value={member.bio}
                        onChange={(v) => updateMember('bio', v)}
                      />
                      <div className="admin-publishing">
                        <label>
                          <input
                            type="checkbox"
                            checked={member.partner}
                            onChange={(e) => updateMember('partner', e.target.checked)}
                          />{' '}
                          Ortaklar sayfasında da göster
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={member.published}
                            onChange={(e) => updateMember('published', e.target.checked)}
                          />{' '}
                          Yayında
                        </label>
                      </div>
                      <button
                        className="admin-delete"
                        type="button"
                        onClick={() => {
                          if (window.confirm('Bu ekip üyesini kaldırmak istiyor musunuz?')) {
                            edit({ ...data, team: data.team.filter((_, i) => i !== selected) });
                            setSelected(0);
                          }
                        }}
                      >
                        <Trash2 size={15} /> Üyeyi kaldır
                      </button>
                    </section>
                  )}
                </div>
              )}
              {dirty && (
                <div className="admin-bottom-save">
                  <span>Değişiklikler henüz kaydedilmedi.</span>
                  <button type="submit" className="admin-save" disabled={busy}>
                    <Save size={16} />
                    {busy ? 'Kaydediliyor…' : 'Kaydet'}
                  </button>
                </div>
              )}
            </main>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
