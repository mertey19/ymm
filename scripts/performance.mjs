import { chromium } from '@playwright/test';
import lighthouse from 'lighthouse';
import { writeFile, mkdir } from 'node:fs/promises';

await mkdir('test-results', { recursive: true });
const base = process.env.QA_URL || 'http://localhost:3001';
const browser = await chromium.launch({ args: ['--remote-debugging-port=9223'] });
try {
  for (const desktop of [false, true]) {
    const name = desktop ? 'desktop' : 'mobile';
    const result = await lighthouse(base, {
      port: 9223,
      output: ['json', 'html'],
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      ...(desktop
        ? {
            formFactor: 'desktop',
            screenEmulation: {
              mobile: false,
              width: 1440,
              height: 1000,
              deviceScaleFactor: 1,
              disabled: false,
            },
            throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 },
          }
        : {}),
    });
    await writeFile(`test-results/lighthouse-${name}.json`, result.report[0]);
    await writeFile(`test-results/lighthouse-${name}.html`, result.report[1]);
    console.log(
      name,
      JSON.stringify(
        Object.fromEntries(
          Object.entries(result.lhr.categories).map(([key, value]) => [
            key,
            Math.round(value.score * 100),
          ]),
        ),
      ),
    );
  }
} finally {
  await browser.close();
}
