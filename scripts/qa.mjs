import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import { pages } from '../src/data/pages.ts';
import { services } from '../src/data/services.ts';
import { publications } from '../src/data/publications.ts';
const base = process.env.QA_URL || 'http://127.0.0.1:3002';
await fs.mkdir('test-results', { recursive: true });
const routes = ['/',...pages.map(p=>`/${p.path}/`),...services.map(s=>`/hizmetler/${s.slug}/`)];
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
        .filter((i) => i.loading !== 'lazy' && (!i.complete || i.naturalWidth === 0))
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
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ['/', '/iletisim', '/hizmetler/tam-tasdik', '/sirkulerler']) {
      await page.goto(base + route, { waitUntil: 'networkidle' });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      report.responsive.push({ width, route, overflow });
      if (overflow) throw new Error(`Overflow ${width} ${route}`);
    }
    await page.goto(base, { waitUntil: 'networkidle' });
    if ([360, 390, 768, 1024, 1440].includes(width))
      await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base, {waitUntil:'networkidle'});
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
  await expect(page.getByRole('button', {name:'Hizmetlerimiz',exact:true})).toBeFocused();
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
  await page.goto(base + '/sirkulerler/', {waitUntil:'networkidle'});
  await expect(page.locator('.publication-card')).toHaveCount(0);
  await expect(page.getByLabel('Yayınlarda ara')).toHaveCount(0);
  for (const publication of publications) {
    const result = await context.request.get(base + '/' + publication.kind + '/' + publication.slug + '/');
    check(result.status() === 404, 'Demo URL returns 404: ' + publication.slug);
  }
  await page.goto(base + '/iletisim/', {waitUntil:'networkidle'});
  await expect(page.locator('form')).toHaveCount(0);
  await expect(page.locator('.contact-item')).toHaveCount(0);
  check(true, 'Unconfigured contact blocks and form are hidden');
  await page.goto(base, {waitUntil:'networkidle'});
  await expect(page.locator('.publication-card, .cta-section, .header-cta, .hero-secondary')).toHaveCount(0);
  check(await page.locator('meta[name=robots]').getAttribute('content').then(v=>v.includes('noindex')), 'Preview is noindex');
  check((await (await context.request.get(base+'/robots.txt')).text()).includes('Disallow: /'), 'Preview robots disallows crawling');
  check(!(await (await context.request.get(base+'/sitemap.xml')).text()).includes('<loc>'), 'Preview sitemap has no URLs');
  await page.locator('.hero-explore').click();
  await expect(page).toHaveURL(/#uzmanlik$/);
  check(true, 'Hero anchor works');
  const imageInfo = await page.locator('.hero-image img').evaluate(img=>({src:img.currentSrc,srcset:img.srcset}));
  check(imageInfo.src.includes('hero-') && imageInfo.srcset.includes('480w'), 'Browser uses prepared responsive WebP assets');
  for (const attribute of ['property="og:image"','name="twitter:image"']) {
    check((await page.locator('meta['+attribute+']').getAttribute('content')).endsWith('/og.png'), 'Social image metadata: '+attribute);
  }
  const social = await context.request.get(base+'/og.png'); check(social.status()===200, 'Social image resolves');
  check((await context.request.get(base+'/favicon.svg')).status()===200, 'Favicon resolves');
  await page.goto(base + '/hizmetler/tam-tasdik');
  await page.locator('.accordion summary').first().click();
  check(
    (await page.locator('.accordion details').first().getAttribute('open')) !== null,
    'Service FAQ accordion works',
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
  await page.emulateMedia({reducedMotion:'reduce'});
  check(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior==='auto'), 'Reduced motion disables smooth scrolling');
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
