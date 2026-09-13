import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const origin='http://127.0.0.1:3000';
const browser=await chromium.launch();
const context=await browser.newContext();
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await fs.mkdir('test-results',{recursive:true});
let initial;
async function api(path,options={}){return context.request.fetch(origin+path,options);}
async function put(state,extra={}){return api('/api/admin/content/',{method:'PUT',headers:{Origin:origin,...extra},data:state});}
try {
  expect((await api('/api/admin/content/')).status()).toBe(401);
  expect((await api('/api/admin/content/',{headers:{'oai-authenticated-user-id':'local_seedy','oai-authenticated-user-email':'seedy@sites.test'}})).status()).toBe(401);
  expect((await put({data:{},revision:0})).status()).toBe(401);
  await page.goto(origin+'/yonetim/');await expect(page.getByRole('link',{name:'ChatGPT ile giriş yap'})).toBeVisible();
  await page.getByRole('link',{name:'ChatGPT ile giriş yap'}).click();await expect(page.getByRole('heading',{name:'Genel bakış',exact:true})).toBeVisible();
  await page.locator('.admin-shell[data-ready=true]').waitFor();
  initial=await (await api('/api/admin/content/')).json();
  expect((await put(initial,{Origin:'https://untrusted.example'})).status()).toBe(403);
  expect((await put({revision:initial.revision,data:{}})).status()).toBe(400);
  await page.getByRole('button',{name:'Site & iletişim',exact:true}).click();
  await page.getByLabel('Anasayfa başlığı').fill('QA ile doğrulanan anasayfa başlığı');
  await page.getByRole('button',{name:'Değişiklikleri kaydet',exact:true}).click();
  await expect(page.getByText('Değişiklikler kaydedildi. Yayımdaki içerikler siteye yansıdı.')).toBeVisible();
  expect((await put(initial)).status()).toBe(409);
  await page.reload();await page.locator('.admin-shell[data-ready=true]').waitFor();await page.getByRole('button',{name:'Site & iletişim',exact:true}).click();await expect(page.getByLabel('Anasayfa başlığı')).toHaveValue('QA ile doğrulanan anasayfa başlığı');
  const publicPage=await context.newPage();await publicPage.goto(origin);await expect(publicPage.locator('h1')).toHaveText('QA ile doğrulanan anasayfa başlığı');await publicPage.close();
  let state=await (await api('/api/admin/content/')).json();
  const draft={slug:'qa-kalici-yayin',title:'QA kalıcı yayın',description:'Yayınlama akışı doğrulaması.',category:'Kontrol',date:'2026-09-13',kind:'makaleler',demo:false,published:false,body:[{heading:'Kontrol',text:'Bu içerik yalnızca yerel test verisidir.'}]};
  state.data.publications.push(draft);let response=await put(state);expect(response.status()).toBe(200);state=await response.json();
  expect((await api('/makaleler/qa-kalici-yayin/')).status()).toBe(404);
  state.data.publications.at(-1).published=true;response=await put(state);expect(response.status()).toBe(200);state=await response.json();
  const html=await (await api('/makaleler/qa-kalici-yayin/')).text();expect(html).toContain('QA kalıcı yayın');expect(html).toContain('Bu içerik yalnızca yerel test verisidir.');
  expect(await (await api('/sitemap.xml')).text()).toContain('/makaleler/qa-kalici-yayin/');
  state.data.publications.pop();response=await put(state);expect(response.status()).toBe(200);expect((await api('/makaleler/qa-kalici-yayin/')).status()).toBe(404);
  await page.reload();await page.locator('.admin-shell[data-ready=true]').waitFor();
  for(const width of [390,768,1440]){
    await page.setViewportSize({width,height:1000});
    await expect(page.getByRole('heading',{name:'Genel bakış',exact:true})).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.screenshot({path:`test-results/admin-${width}.png`,fullPage:true});
    const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  }
  for(const name of ['Site & iletişim','Hizmetler','Yayınlar','Ekip & ortaklar']){
    await page.getByRole('button',{name,exact:true}).first().click();
    const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(axe.violations.map(v=>v.id)).toEqual([]);
  }
  expect(errors).toEqual([]);
  console.log('PASS: anonymous/spoofed access, CSRF, validation, save/reload, public rendering, stale edit, draft/publish/delete, sitemap, responsive and accessibility.');
} finally {
  if(initial){const latest=await (await api('/api/admin/content/')).json();const restored=await put({...initial,revision:latest.revision});if(restored.status()!==200)throw new Error('Test data restore failed');}
  await browser.close();
}
