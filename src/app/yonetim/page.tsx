import { adminIdentity } from '@/lib/admin-auth';
import { readContent } from '@/lib/cms';
import { AdminPanel } from '@/components/admin-panel';
import { AdminLogin } from '@/components/admin-login';
import './admin.css';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Yönetim Paneli', robots: { index: false, follow: false } };
export default async function AdminPage() {
  const { allowed } = await adminIdentity();
  return allowed ? <AdminPanel initial={await readContent()} name="admin" /> : <AdminLogin />;
}
