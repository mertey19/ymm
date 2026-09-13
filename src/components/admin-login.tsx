'use client';
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-location-assign-relative-destination -- Reload server-authenticated state after setting the HttpOnly cookie. */
import { useState } from 'react';
import { LockKeyhole, ArrowRight, Eye, EyeOff } from 'lucide-react';
export function AdminLogin() {
  const [username, setUsername] = useState(''),
    [password, setPassword] = useState(''),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [visible, setVisible] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/admin/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        signal: AbortSignal.timeout(20000),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error || 'Giriş yapılamadı.');
        setPassword('');
        setBusy(false);
        return;
      }
      window.location.assign('/yonetim/');
    } catch {
      setError('Bağlantı kurulamadı. Lütfen yeniden deneyin.');
      setBusy(false);
    }
  }
  return (
    <main className="admin-login">
      <div>
        <span className="admin-login-icon">
          <LockKeyhole size={25} />
        </span>
        <p className="eyebrow">KAREN YMM / YÖNETİM</p>
        <h1>Yönetici girişi</h1>
        <p>İçeriklerinizi yönetmek için hesabınıza giriş yapın.</p>
        <form onSubmit={submit}>
          <fieldset className="admin-form-fields" disabled={busy}>
            <label className="admin-field">
              <span>Kullanıcı adı</span>
              <input
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label className="admin-field">
              <span>Şifre</span>
              <span className="admin-password">
                <input
                  type={visible ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  maxLength={256}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setVisible(!visible)}
                  aria-label={visible ? 'Şifreyi gizle' : 'Şifreyi göster'}
                >
                  {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>
            {error && (
              <p className="admin-notice is-error" role="alert">
                {error}
              </p>
            )}
            <button className="admin-save admin-login-submit" type="submit">
              {busy ? 'Giriş yapılıyor…' : 'Giriş yap'}
              <ArrowRight size={16} />
            </button>
          </fieldset>
        </form>
        <a href="/">← Siteye dön</a>
        <p className="admin-login-footnote">Güvenli yönetim alanı · Oturum süresi 8 saat</p>
      </div>
    </main>
  );
}
