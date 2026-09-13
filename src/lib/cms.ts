import { services } from '@/data/services';
import { publications } from '@/data/publications';
import { site } from '@/config/site';
import type { CmsDocument, CmsState } from './cms-schema';
import { database, hasDatabaseConfiguration } from './database';
export const defaultContent: CmsDocument = {
  settings: {
    phone: site.phone,
    email: site.email,
    address: site.address,
    workingHours: site.workingHours,
    heroTitle: 'Vergi ve Finansal Süreçlerinizde Güvenilir Çözüm Ortağınız.',
    heroDescription:
      'Karen YMM; yeminli mali müşavirlik, vergi, tasdik, denetim ve mali danışmanlık alanlarında işletmelerin ihtiyaçlarına özel, güvenilir ve sürdürülebilir çözümler sunar.',
    aboutTitle: 'Her İşletmeye Özgü, İlkelere Bağlı Bir Yaklaşım',
    aboutText:
      'Karen YMM; yeminli mali müşavirlik, vergi, tasdik, denetim ve mali danışmanlık alanlarında işletmelerin ihtiyaçlarını bütüncül bir bakışla ele alır. Çalışmalarımızın başlangıç noktası, işinizi ve kararlarınızın mali boyutunu anlamaktır.\n\nMesleki etik ve bağımsızlık anlayışıyla, değerlendirmelerimizi bilgi ve belgelere dayandırırız. Süreçlerin her aşamasında sorumlulukların açık olmasına, düzenli iletişime ve gizliliğe önem veririz.\n\nMevzuattaki ve iş dünyasındaki gelişmeleri izler; bulgularımızı işletmenizin anlayabileceği, değerlendirebileceği ve uygulayabileceği bir çerçevede paylaşırız.',
  },
  services,
  publications: publications.map((p) => ({ ...p, published: false })),
  team: [],
};
export async function readContent(): Promise<CmsState> {
  const result = await (
    await database()
  ).execute('SELECT document, revision, updated_at FROM content WHERE id = 1');
  const row = result.rows[0] as unknown as
    { document: string; revision: number; updated_at: string } | undefined;
  const state: CmsState = row
    ? { data: JSON.parse(row.document), revision: row.revision, updatedAt: row.updated_at }
    : { data: defaultContent, revision: 0, updatedAt: null };
  // Existing demo records remain editable, but are always treated as drafts.
  state.data.publications = state.data.publications.map((p) =>
    p.demo ? { ...p, published: false } : p,
  );
  return state;
}
export async function publicContent() {
  const { data } = hasDatabaseConfiguration()
    ? await readContent()
    : { data: defaultContent };
  return {
    ...data,
    publications: data.publications
      .filter((p) => p.published && !p.demo)
      .sort((a, b) => b.date.localeCompare(a.date)),
    team: data.team.filter((t) => t.published),
  };
}
export async function writeContent(data: CmsDocument, revision: number) {
  const updatedAt = new Date().toISOString();
  const db = await database();
  // Compare-and-swap prevents two open editor tabs from silently overwriting each other.
  const result =
    revision === 0
      ? await db.execute({
          sql: 'INSERT INTO content (id, document, revision, updated_at) VALUES (1, ?, 1, ?) ON CONFLICT(id) DO NOTHING',
          args: [JSON.stringify(data), updatedAt],
        })
      : await db.execute({
          sql: 'UPDATE content SET document = ?, revision = revision + 1, updated_at = ? WHERE id = 1 AND revision = ?',
          args: [JSON.stringify(data), updatedAt, revision],
        });
  if (result.rowsAffected !== 1) return null;
  return { data, revision: revision + 1, updatedAt };
}
