import { build } from 'esbuild';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import fs from 'node:fs/promises';
await fs.mkdir('test-results', { recursive: true });
for (const [name, url] of [
  ['preview', ''],
  ['configured', 'https://domain-test.example/'],
]) {
  const outfile = path.resolve(`test-results/seo-${name}.mjs`);
  await build({
    stdin: {
      contents: `export {site} from './src/config/site'; export {metadataFor} from './src/lib/seo'; export {default as robots} from './src/app/robots'; export {pageIsIndexable} from './src/lib/page-visibility';`,
      resolveDir: process.cwd(),
      loader: 'tsx',
    },
    outfile,
    bundle: true,
    platform: 'node',
    format: 'esm',
    jsx: 'automatic',
    define: {
      'process.env.NEXT_PUBLIC_SITE_URL': JSON.stringify(url),
      'process.env.NEXT_PUBLIC_CONTACT_ENDPOINT': '""',
    },
  });
  const { site, metadataFor, robots, pageIsIndexable } = await import(pathToFileURL(outfile).href);
  const meta = metadataFor('Hizmet', 'Açıklama', '/hizmetler/tam-tasdik/');
  assert.equal(meta.alternates.canonical, site.url + '/hizmetler/tam-tasdik/');
  assert.equal(meta.openGraph.url, meta.alternates.canonical);
  assert.equal(meta.openGraph.images[0].url, site.url + '/og.png');
  assert.equal(meta.twitter.images[0], site.url + '/og.png');
  assert.equal(meta.robots.index, Boolean(url));
  assert.equal(metadataFor('Taslak', 'Açıklama', '/taslak/', true).robots.index, false);
  assert.equal(
    url ? robots().sitemap : robots().rules.disallow,
    url ? site.url + '/sitemap.xml' : '/',
  );
  const content = { settings: { phone: '', email: '', address: '' }, team: [], publications: [] };
  assert.equal(pageIsIndexable({ path: 'iletisim' }, content), false);
  assert.equal(pageIsIndexable({ path: 'makaleler', noindex: true }, content), false);
  content.publications.push({ kind: 'makaleler', demo: true, published: true });
  assert.equal(pageIsIndexable({ path: 'makaleler' }, content), false);
  content.publications[0].demo = false;
  assert.equal(pageIsIndexable({ path: 'makaleler', noindex: true }, content), true);
  content.settings.email = 'test@example.com';
  assert.equal(pageIsIndexable({ path: 'iletisim' }, content), true);
  console.log('PASS:', name, 'canonical, OG, Twitter, robots and content visibility');
}
const dimensions = await sharp('public/og.png').metadata();
assert.equal(dimensions.width, 1200);
assert.equal(dimensions.height, 630);
console.log('PASS: social image is exactly 1200×630');
