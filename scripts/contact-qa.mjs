// Runs the actual form component against intercepted requests, never a real recipient.
import { build } from 'esbuild';
import { createServer } from 'node:http';
import fs from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
await fs.mkdir('test-results', { recursive: true });
const output = await build({
  stdin: {
    contents: `import React from 'react'; import {createRoot} from 'react-dom/client'; import {ContactForm} from './src/components/contact-form';
    import {PublicationBrowser} from './src/components/publication-browser'; import {publications} from './src/data/publications';
    createRoot(document.getElementById('root')).render(location.pathname === '/publications' ? <PublicationBrowser items={publications.filter(p=>p.kind==='sirkulerler')} /> : <ContactForm subjects={['Tam Tasdik']} endpoint={location.pathname === '/disabled' ? '' : '/mock/contact'} />);`,
    loader: 'tsx',
    resolveDir: process.cwd(),
  },
  bundle: true,
  write: false,
  jsx: 'automatic',
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.NEXT_PUBLIC_SITE_URL': '""',
    'process.env.NEXT_PUBLIC_CONTACT_ENDPOINT': '""',
  },
});
const css = await fs.readFile('src/app/globals.css', 'utf8');
const server = createServer((req, res) => {
  if (req.url === '/app.js') {
    res.setHeader('Content-Type', 'application/javascript');
    res.end(output.outputFiles[0].text);
  } else if (req.url === '/style.css') {
    res.setHeader('Content-Type', 'text/css');
    res.end(css);
  } else if (req.method === 'POST') {
    res.writeHead(500);
    res.end('Unmocked POST is prohibited');
  } else {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(
      '<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>İletişim formu yerel testi</title><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/style.css"></head><body><main style="max-width:760px;margin:auto;padding:20px"><h1>İletişim</h1><div id="root"></div></main><script src="/app.js"></script></body></html>',
    );
  }
});
await new Promise((resolve) => server.listen(3003, '127.0.0.1', resolve));
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
const results = [];
const record = (name) => results.push(name);
const fill = async () => {
  await page.getByLabel('Ad Soyad *', { exact: true }).fill('Test Kullanıcısı');
  await page.getByLabel('E-posta *', { exact: true }).fill('test@example.com');
  await page.getByLabel('Konu *', { exact: true }).selectOption('Genel Bilgi');
  await page
    .getByLabel('Mesajınız *', { exact: true })
    .fill('Yalnızca yerel form doğrulaması için test mesajıdır.');
  await page.locator('#contact-consent').check();
};
try {
  await page.goto('http://127.0.0.1:3003/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Gönder', exact: true }).click();
  await expect(page.locator('[aria-invalid=true]')).toHaveCount(5);
  await expect(page.locator('#contact-name')).toBeFocused();
  record('Required fields and error focus');
  await fill();
  await page.locator('#contact-email').fill('invalid');
  await page.getByRole('button', { name: 'Gönder', exact: true }).click();
  await expect(page.locator('#error-email')).toBeVisible();
  record('Invalid email');
  await fill();
  let intercepted = 0;
  let release;
  await page.route('**/mock/contact', async (route) => {
    intercepted++;
    await new Promise((resolve) => (release = resolve));
    await route.fulfill({ status: 200, json: { success: true } });
  });
  await page.getByRole('button', { name: 'Gönder', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Gönderiliyor' })).toBeDisabled();
  await expect(page.locator('#contact-name')).toBeDisabled();
  record('Loading disables inputs and duplicate submissions');
  await expect.poll(() => intercepted).toBe(1);
  release();
  await expect(page.getByRole('status')).toContainText('Mesajınız alındı');
  await expect(page.locator('#contact-name')).toHaveValue('');
  record('Confirmed success resets fields');
  await page.unroute('**/mock/contact');
  for (const scenario of ['server-error', 'false-success', 'network-error']) {
    await page.route('**/mock/contact', (route) =>
      scenario === 'network-error'
        ? route.abort()
        : route.fulfill({
            status: scenario === 'server-error' ? 500 : 200,
            json: { success: false },
          }),
    );
    await fill();
    await page.getByRole('button', { name: 'Gönder', exact: true }).click();
    await expect(page.locator('.form-status[role=alert]')).toContainText(
      'iletildiği doğrulanamadı',
    );
    await expect(page.locator('#contact-name')).toHaveValue('Test Kullanıcısı');
    record(scenario + ' retains values and reports failure');
    await page.unroute('**/mock/contact');
  }
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({ path: `test-results/form-${width}.png`, fullPage: true });
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
        .violations,
    ).toEqual([]);
  }
  record('Form responsive and axe checks at five widths');
  await page.goto('http://127.0.0.1:3003/disabled', { waitUntil: 'networkidle' });
  let posts = 0;
  page.on('request', (r) => {
    if (r.method() === 'POST') posts++;
  });
  await fill();
  await page.getByRole('button', { name: 'Gönder', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Mesajınız gönderilmedi');
  expect(posts).toBe(0);
  record('Disabled endpoint sends no request');
  await page.goto('http://127.0.0.1:3003/publications', { waitUntil: 'networkidle' });
  await expect(page.locator('.publication-card')).toHaveCount(3);
  await page.getByLabel('Yayınlarda ara').fill('KDV');
  await expect(page.locator('.publication-card')).toHaveCount(1);
  await page.getByLabel('Kategori', { exact: true }).selectOption('SGK');
  await expect(
    page.getByRole('heading', { name: 'Aramanıza uygun yayın bulunamadı' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Tüm yayınları göster', exact: true }).click();
  await expect(page.locator('.publication-card')).toHaveCount(3);
  record('Publication search, category and reset tested in isolated demo fixture');
  expect(errors).toEqual([]);
  await fs.writeFile('test-results/contact-qa.json', JSON.stringify({ results, errors }, null, 2));
  console.log('PASS', results);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
