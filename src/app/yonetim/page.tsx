import { adminIdentity } from '@/lib/admin-auth';
import Link from '@/components/site-link';
import { readContent } from '@/lib/cms';
import { AdminPanel } from '@/components/admin-panel';
import './admin.css';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Yönetim Paneli', robots: { index: false, follow: false } };
export default async function AdminPage() {
  const { user, allowed } = await adminIdentity();
  if (!allowed)
    return (
      <main className="admin-login">
        <div>
          <p className="eyebrow">KAREN YMM / YÖNETİM</p>
          <h1>{user ? 'Erişim yetkiniz bulunmuyor' : 'İçeriklerinizi yönetin.'}</h1>
          <p>
            {user
              ? 'Bu alan yalnızca site sahibine açıktır. Siteyi oluşturduğunuz ChatGPT hesabıyla giriş yapın.'
              : 'Site sahibi ChatGPT hesabınızla güvenli şekilde devam edin.'}
          </p>
          <a
            className="button"
            href={
              user
                ? '/signout-with-chatgpt?return_to=%2Fyonetim%2F'
                : '/signin-with-chatgpt?return_to=%2Fyonetim%2F'
            }
            target="_top"
          >
            {user ? 'Hesap değiştir' : 'ChatGPT ile giriş yap'}
          </a>
          <Link href="/">Siteye dön →</Link>
        </div>
      </main>
    );
  return <AdminPanel initial={await readContent()} name={user!.displayName} />;
}

