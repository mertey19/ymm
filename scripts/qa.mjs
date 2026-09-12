import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const base = process.env.QA_URL || 'http://localhost:3000';
await fs.mkdir('test-results', { recursive: true });
async function findRoutes(dir, prefix = '') {
  const routes = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && !entry.name.startsWith('_'))
      routes.push(...(await findRoutes(path.join(dir, entry.name), `${prefix}/${entry.name}`)));
    else if (entry.name === 'index.html') routes.push(prefix || '/');
  }
  return routes;
}
const routes = (await findRoutes('out')).filter((route) => route !== '/404');
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const report = {
  routes: [],
  responsive: [],
  interactions: [],
  accessibility: [],
  errors: [],
  warnings: [],
};
page.on('pageerror', (e) => report.errors.push(e.message));
page.on('console', (m) => {
  if (m.type() === 'error') report.errors.push(m.text());
  if (m.type() === 'warning') report.warnings.push(m.text());
});
function check(condition, message) {
  if (!condition) throw new Error(message);
  report.interactions.push(message);
}
try {
  for (const route of routes) {
    const response = await page.goto(base + route, { waitUntil: 'networkidle' });
    const info = await page.evaluate(() => ({
      title: document.title,
      h1: document.querySelectorAll('h1').length,
      canonical: document.querySelector('link[rel=canonical]')?.getAttribute('href'),
      description: document.querySelector('meta[name=description]')?.getAttribute('content'),
      overflow: document.documentElement.scrollWidth > innerWidth,
      broken: [...document.images]
        .filter((i) => !i.complete || i.naturalWidth === 0)
        .map((i) => i.src),
      emptyLinks: [...document.querySelectorAll('a')].filter(
        (a) => !a.getAttribute('href') || a.getAttribute('href') === '#',
      ).length,
    }));
    report.routes.push({ route, status: response.status(), ...info });
    if (
      response.status() !== 200 ||
      info.h1 !== 1 ||
      !info.canonical ||
      !info.description ||
      info.overflow ||
      info.broken.length ||
      info.emptyLinks
    )
      throw new Error(`Route failed: ${route} ${JSON.stringify(info)}`);
  }
  for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ['/', '/iletisim', '/hizmetler/tam-tasdik', '/sirkulerler']) {
      await page.goto(base + route, { waitUntil: 'networkidle' });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      report.responsive.push({ width, route, overflow });
      if (overflow) throw new Error(`Overflow ${width} ${route}`);
    }
    await page.goto(base, { waitUntil: 'networkidle' });
    if ([320, 375, 768, 1440, 1920].includes(width))
      await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base);
  await page.getByRole('button', { name: 'Kurumsal', exact: true }).click();
  check(
    await page.getByRole('link', { name: 'Misyon ve Vizyon', exact: true }).isVisible(),
    'Desktop dropdown opens',
  );
  await page.getByRole('link', { name: 'Misyon ve Vizyon', exact: true }).click();
  await page.waitForURL('**/kurumsal/misyon-vizyon/');
  check(page.url().includes('/kurumsal/misyon-vizyon'), 'Dropdown navigation works');
  await page.getByRole('button', { name: 'Hizmetlerimiz', exact: true }).focus();
  await page.keyboard.press('Enter');
  check(
    (await page
      .getByRole('button', { name: 'Hizmetlerimiz', exact: true })
      .getAttribute('aria-expanded')) === 'true',
    'Keyboard dropdown opens',
  );
  await page.keyboard.press('Escape');
  check(
    (await page
      .getByRole('button', { name: 'Hizmetlerimiz', exact: true })
      .getAttribute('aria-expanded')) === 'false',
    'Escape closes dropdown',
  );
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole('button', { name: 'Menüyü aç', exact: true }).click();
  check(
    await page.getByRole('navigation', { name: 'Ana menü', exact: true }).isVisible(),
    'Mobile menu opens',
  );
  await page.getByRole('button', { name: 'Hizmetlerimiz', exact: true }).click();
  await page.getByRole('link', { name: 'Tam Tasdik Hizmetleri', exact: true }).first().click();
  await page.waitForURL('**/hizmetler/tam-tasdik/');
  check(page.url().includes('/hizmetler/tam-tasdik'), 'Mobile nested navigation works');
  check(
    await page.getByRole('button', { name: 'Menüyü aç', exact: true }).isVisible(),
    'Mobile menu closes after navigation',
  );
  await page.goto(base + '/sirkulerler');
  await page.getByLabel('Yayınlarda ara').fill('KDV');
  check((await page.locator('.publication-card').count()) === 1, 'Search filters publications');
  await page.getByLabel('Kategori', { exact: true }).selectOption('SGK');
  check(
    await page.getByRole('heading', { name: 'Aramanıza uygun yayın bulunamadı' }).isVisible(),
    'Empty search state works',
  );
  await page.getByRole('button', { name: 'Tüm yayınları göster', exact: true }).click();
  check((await page.locator('.publication-card').count()) === 3, 'Reset restores publications');
  await page.goto(base + '/iletisim');
  await page.getByRole('button', { name: 'Gönder', exact: true }).click();
  check(
    (await page.locator('[aria-invalid=true]').count()) >= 4,
    'Required field validation works',
  );
  await page.getByLabel('Ad Soyad *', { exact: true }).fill('Test Kullanıcısı');
  await page.getByLabel('E-posta *', { exact: true }).fill('test@example.com');
  await page.getByLabel('Konu *', { exact: true }).selectOption('Genel Bilgi');
  await page
    .getByLabel('Mesajınız *', { exact: true })
    .fill('Bu iletişim formunun doğrulama kontrolü için test mesajıdır.');
  await page.locator('#contact-consent').check();
  let posts = 0;
  page.on('request', (r) => {
    if (r.method() === 'POST') posts++;
  });
  await page.getByRole('button', { name: 'Gönder', exact: true }).click();
  check(
    await page
      .locator('.form-status[role="alert"]')
      .textContent()
      .then((t) => t.includes('Mesajınız gönderilmedi')),
    'Unconfigured form honestly reports no delivery',
  );
  check(posts === 0, 'Unconfigured form sends no personal data');
  await page.goto(base + '/hizmetler/tam-tasdik');
  await page.locator('.accordion summary').first().click();
  check(
    (await page.locator('.accordion details').first().getAttribute('open')) !== null,
    'Service FAQ accordion works',
  );
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(base + '/makaleler/finansal-kararlarda-raporlama');
  await page.getByRole('button', { name: 'Bağlantıyı kopyala' }).click();
  await expect(page.locator('.share-row [role="status"]')).toHaveText('Bağlantı kopyalandı.');
  check(
    (await page.locator('.share-row [role="status"]').textContent()) === 'Bağlantı kopyalandı.',
    'Publication link copy works',
  );
  for (const route of [
    '/',
    '/iletisim',
    '/sirkulerler',
    '/hizmetler/tam-tasdik',
    '/kurumsal/hakkimizda',
  ]) {
    await page.goto(base + route, { waitUntil: 'networkidle' });
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    report.accessibility.push({
      route,
      violations: result.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
      })),
    });
  }
  check(report.errors.length === 0, 'No console or runtime errors');
  check(report.warnings.length === 0, 'No console warnings');
  check(
    report.accessibility.every((result) => result.violations.length === 0),
    'WCAG A/AA automated checks pass',
  );
} catch (error) {
  report.failure = String(error);
  process.exitCode = 1;
} finally {
  await fs.writeFile('test-results/qa-report.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
}
