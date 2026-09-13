import {chromium,expect,request} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const origin='http://127.0.0.1:3001';
const browser=await chromium.launch();const context=await browser.newContext();const page=await context.newPage();
const api=await request.newContext();const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
  expect((await api.get(origin+'/api/admin/content/',{headers:{'oai-authenticated-user-id':'local_seedy','oai-authenticated-user-email':'seedy@sites.test'}})).status()).toBe(401);
  await page.goto(origin+'/yonetim/',{waitUntil:'networkidle'});
  await page.screenshot({path:'test-results/admin-login.png'});
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  await page.getByLabel('Kullanıcı adı',{exact:true}).fill('admin');await page.getByLabel('Şifre',{exact:true}).fill('Local-Test-Password-Only');
  await page.getByRole('button',{name:'Giriş yap',exact:true}).click();await page.locator('.admin-shell[data-ready=true]').waitFor();
  const cookie=(await context.cookies()).find(x=>x.name==='karen_admin');expect(cookie.httpOnly).toBe(true);expect(cookie.sameSite).toBe('Strict');
  expect((await context.request.get(origin+'/api/admin/content/')).status()).toBe(200);
  await page.getByRole('button',{name:'Çıkış yap',exact:true}).click();await expect(page.getByRole('heading',{name:'Yönetici girişi'})).toBeVisible();
  expect((await api.get(origin+'/api/admin/content/',{headers:{Cookie:`karen_admin=${cookie.value}`}})).status()).toBe(401);
  expect((await api.post(origin+'/api/admin/login/',{headers:{Origin:'https://wrong.example'},data:{username:'admin',password:'wrong'}})).status()).toBe(403);
  let last;for(let i=0;i<11;i++)last=await api.post(origin+'/api/admin/login/',{headers:{Origin:origin},data:{username:'admin',password:'wrong'}});
  expect(last.status()).toBe(429);expect(last.headers()['retry-after']).toBe('900');
  expect((await api.get(origin+'/')).status()).toBe(200);expect(errors).toEqual([]);
  console.log('PASS: production password login, HttpOnly cookie, owner-header rejection, logout/replay, cross-origin rejection, brute-force limit, accessible login and public site availability.');
}finally{await browser.close();await api.dispose();}
