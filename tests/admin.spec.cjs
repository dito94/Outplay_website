// End-to-end check of the admin demo (/admin/) against a built site served under the real base path.
// Usage: DIST=<build dir> node tests/admin.spec.cjs   (optional: PORT=4415, LANG_UNDER_TEST=bg)
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE = '/Outplay_website/';
const DIST = process.env.DIST ? path.resolve(process.env.DIST) : path.resolve(__dirname, '..', 'dist');
const PORT = Number(process.env.PORT || 4415);
const KEYS = {
  inquiries: 'outplay.inquiries.v1',
  overrides: 'outplay.overrides.v1',
  faq: 'outplay.faq.v1',
  session: 'outplay.admin.session.v1',
};
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json',
};

const server = http
  .createServer((req, res) => {
    const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (!p.startsWith(BASE)) { res.writeHead(404); return res.end(); }
    let f = path.join(DIST, p.slice(BASE.length));
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f)) { res.writeHead(404); return res.end('404'); }
    res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  })
  .listen(PORT);

const origin = `http://localhost:${PORT}`;
const ADMIN = `${origin}${BASE}admin/`;
const results = [];
async function step(name, fn) {
  try {
    await fn();
    results.push({ name, ok: true });
    console.log(`  ok   ${name}`);
  } catch (e) {
    results.push({ name, ok: false, err: e });
    console.log(`  FAIL ${name}\n       ${String(e.message || e).split('\n').join('\n       ')}`);
  }
}
const store = (page, key) => page.evaluate((k) => JSON.parse(localStorage.getItem(k) || 'null'), key);

/** First public page (of the candidates) that contains `selector` */
async function findPage(page, candidates, selector) {
  for (const route of candidates) {
    const res = await page.goto(origin + route, { waitUntil: 'domcontentloaded' });
    if (res && res.status() < 400 && (await page.locator(selector).count())) return route;
  }
  return null;
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

  const now = new Date().toISOString();
  const seeded = {
    id: 'test-inquiry-1',
    createdAt: now,
    lang: 'bg',
    productId: 'balance',
    family: 'pergola',
    dims: { width: 4.5, depth: 3.2, height: 2.6 },
    options: { roofType: 'lamellas', mounting: 'wall', extras: ['led', 'heaters'], propertyType: 'home', colour: 'RAL 7016' },
    contact: { name: 'Тест Клиентов', phone: '0888 111 222', email: 'test@example.com', city: 'София', channel: 'viber' },
    message: 'Тестово съобщение от автоматичния тест.',
    files: ['terasa.jpg'],
    status: 'new',
  };

  console.log(`Admin demo test → ${ADMIN}`);

  await step('login: wrong credentials show an inline error, right ones open the dashboard', async () => {
    await page.goto(ADMIN, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    assert.ok(await page.locator('[data-login]').isVisible(), 'login card visible');
    assert.equal(await page.locator('[data-app]').isVisible(), false, 'app hidden before login');
    await page.fill('#adm-user', 'demo');
    await page.fill('#adm-pass', 'wrong');
    await page.click('.adm-login-submit');
    const err = (await page.textContent('#adm-login-error')).trim();
    assert.equal(err, 'Грешно потребителско име или парола.');
    assert.equal(await page.getAttribute('#adm-pass', 'aria-invalid'), 'true');
    assert.equal(await store(page, KEYS.session), null, 'no session after a wrong password');
    assert.equal(await page.locator('[data-app]').isVisible(), false);
    await page.fill('#adm-pass', 'demo');
    await page.click('.adm-login-submit');
    await page.locator('[data-view="dashboard"]').waitFor({ state: 'visible' });
    assert.ok(await store(page, KEYS.session), 'session stored');
    assert.equal(await page.textContent('#adm-login-error'), '', 'error cleared');
  });

  await step('dashboard: stats, latest inquiries (examples) and quick links', async () => {
    assert.equal((await page.textContent('#adm-h-dashboard')).trim(), 'Табло');
    assert.equal(await page.locator('.adm-stat').count(), 5);
    assert.equal((await page.locator('.adm-stat').nth(2).locator('.adm-stat-value').textContent()).trim(), '17');
    assert.equal(await page.locator('.adm-latest-row').count(), 4, '4 example rows');
    assert.equal(await page.locator('.adm-latest .adm-badge-example').count(), 4, 'examples are marked');
    assert.ok(await page.locator('.adm-quick a[href="#products"]').isVisible());
    assert.ok(await page.locator('[data-nav="dashboard"][aria-current="page"]').count());
    assert.equal(await store(page, KEYS.inquiries), null, 'examples are never written to storage');
  });

  await step('inquiries: a seeded StoredInquiry appears with correct size and area', async () => {
    await page.evaluate(([k, inq]) => localStorage.setItem(k, JSON.stringify([inq])), [KEYS.inquiries, seeded]);
    await page.goto(ADMIN + '#inquiries', { waitUntil: 'networkidle' });
    const row = page.locator(`tr[data-open-inq="${seeded.id}"]`);
    await row.waitFor();
    assert.equal((await row.locator('.c-dims').textContent()).trim(), '4,5 × 3,2 м · 14,4 м²');
    assert.equal((await row.locator('.c-prod').textContent()).trim(), 'Balance');
    assert.equal((await row.locator('.c-chan').textContent()).trim(), 'Viber');
    assert.equal((await row.locator('.adm-pill').textContent()).trim(), 'Ново');
    assert.equal(await row.locator('.adm-badge-example').count(), 0, 'real row is not marked as example');
    assert.equal(await page.locator('tbody tr').count(), 5, '1 real + 4 examples');
    assert.equal((await page.textContent('[data-nav="inquiries"] [data-new-count]')).trim(), '2');
  });

  await step('inquiries: search and status filter', async () => {
    await page.fill('[data-inq-search]', 'тест');
    assert.equal(await page.locator('tbody tr').count(), 1);
    await page.fill('[data-inq-search]', 'zzz-no-match');
    assert.ok(await page.locator('.adm-empty').isVisible(), 'empty state');
    await page.click('[data-clear-filters]');
    await page.click('[data-filter="quoted"]');
    assert.equal(await page.locator('tbody tr').count(), 1);
    await page.click('[data-filter="all"]');
    assert.equal(await page.locator('tbody tr').count(), 5);
  });

  await step('inquiries: detail panel shows mapped options and contact links; status change persists', async () => {
    await page.click(`tr[data-open-inq="${seeded.id}"] .adm-rowlink`);
    const dw = page.locator('[data-adm-drawer]');
    await dw.waitFor({ state: 'visible' });
    assert.equal((await dw.locator('#adm-dw-title').textContent()).trim(), seeded.contact.name);
    const text = await dw.textContent();
    for (const s of ['4,5 м', '3,2 м', '2,6 м', '14,4 м²', 'Алуминиеви ламели', 'Прикрепена към сграда', 'LED / RGB осветление, Отоплителни тела', 'Дом', 'RAL 7016', 'terasa.jpg', seeded.message]) {
      assert.ok(text.includes(s), `drawer contains "${s}"`);
    }
    assert.equal(await dw.locator('a[href="tel:+359888111222"]').count(), 1);
    assert.equal(await dw.locator('a[href^="viber://chat?number=%2B359888111222"]').count(), 1);
    assert.equal(await dw.locator('a[href^="mailto:test@example.com"]').count(), 1);
    await dw.locator('label.chip:has(input[value="in-progress"])').click();
    const saved = await store(page, KEYS.inquiries);
    assert.equal(saved[0].status, 'in-progress', 'status persisted via updateInquiry');
    assert.equal((await page.locator(`tr[data-open-inq="${seeded.id}"] .adm-pill`).textContent()).trim(), 'В процес');
    assert.ok(await dw.locator('.adm-toast').first().isVisible(), 'toast inside the panel');
    await dw.locator('[data-copy-inq]').click();
    await page.waitForTimeout(100);
    assert.equal((await dw.locator('[data-copy-inq] span').textContent()).trim(), 'Копирано');
    assert.equal(await dw.locator('[data-delete-inq]').count(), 1, 'real rows can be deleted');
    await page.keyboard.press('Escape');
    await dw.waitFor({ state: 'hidden' });
    // example rows: no delete button, status kept in memory only
    await page.click('tr[data-open-inq="example-1"] .adm-rowlink');
    assert.equal(await dw.locator('[data-delete-inq]').count(), 0, 'examples cannot be deleted');
    await page.keyboard.press('Escape');
  });

  let productRoute = null;
  await step('products: edit the BG name, save, and see it on the public product page', async () => {
    await page.goto(ADMIN + '#products/balance', { waitUntil: 'networkidle' });
    await page.locator('#adm-f-name-bg').waitFor();
    assert.ok(await page.locator('[data-ed-save]').isDisabled(), 'save disabled while clean');
    await page.fill('#adm-f-name-bg', 'Balance Плюс');
    assert.equal((await page.textContent('[data-pv-f="name"]')).trim(), 'Balance Плюс', 'live preview');
    assert.ok(await page.locator('[data-orig="name-bg"]').isVisible(), 'original value hint');
    await page.click('[data-ed-save]');
    const toast = page.locator('.adm-toasts .adm-toast').last();
    await toast.waitFor();
    assert.ok((await toast.textContent()).includes('Запазено — промените се виждат на сайта в този браузър'));
    assert.ok((await toast.locator('a').getAttribute('href')).endsWith('/products/bioclimatic-pergolas/balance/'));
    const ov = await store(page, KEYS.overrides);
    assert.equal(ov.balance.name.bg, 'Balance Плюс');
    assert.equal(ov.balance.name.en, undefined, 'unchanged EN name is not stored');
    productRoute = await findPage(
      page,
      [`${BASE}products/bioclimatic-pergolas/balance/`, `${BASE}products/bioclimatic-pergolas/`, `${BASE}products/`, BASE],
      '[data-pid="balance"][data-pfield="name"]',
    );
    assert.ok(productRoute, 'a public page with product name markers exists');
    await page.waitForLoadState('networkidle');
    const names = await page.locator('[data-pid="balance"][data-pfield="name"]').allTextContents();
    assert.ok(names.length && names.every((n) => n.trim() === 'Balance Плюс'), `override applied on ${productRoute}: ${names.join(' | ')}`);
  });

  await step('products: hide a product and it disappears from public cards', async () => {
    await page.goto(ADMIN + '#products', { waitUntil: 'networkidle' });
    const sw = page.locator('[data-toggle-vis="flat"]');
    assert.equal(await sw.getAttribute('aria-checked'), 'true');
    await sw.click();
    assert.equal(await page.locator('[data-toggle-vis="flat"]').getAttribute('aria-checked'), 'false');
    assert.ok(await page.locator('[data-product="flat"] .adm-badge-hidden').isVisible());
    assert.equal((await store(page, KEYS.overrides)).flat.hidden, true);
    const listRoute = await findPage(page, [`${BASE}products/`, `${BASE}products/bioclimatic-pergolas/`, BASE], '[data-pcard][data-pid="flat"]');
    assert.ok(listRoute, 'a public page with product cards exists');
    await page.waitForLoadState('networkidle');
    const cards = page.locator('[data-pcard][data-pid="flat"]');
    const n = await cards.count();
    for (let i = 0; i < n; i++) assert.equal(await cards.nth(i).isVisible(), false, `flat card hidden on ${listRoute}`);
    assert.ok(await page.locator('[data-pcard][data-pid="balance"]').first().isVisible(), 'other cards stay visible');
  });

  await step('faq: edit a question inline (stored in KEYS.faq)', async () => {
    await page.goto(ADMIN + '#faq', { waitUntil: 'networkidle' });
    await page.locator('[data-faq-edit="choosing-0"]').click();
    await page.fill('#adm-fq-choosing-0-bg', 'Balance или Infinity — каква е разликата?');
    await page.click('[data-faq-form="choosing-0"] button[type="submit"]');
    const fe = await store(page, KEYS.faq);
    assert.equal(fe['choosing-0'].q.bg, 'Balance или Infinity — каква е разликата?');
    assert.ok((await page.textContent('[data-faq="choosing-0"]')).includes('Balance или Infinity — каква е разликата?'));
  });

  await step('reset: in-page confirmation clears overrides, FAQ edits and stored inquiries', async () => {
    await page.goto(ADMIN + '#dashboard', { waitUntil: 'networkidle' });
    assert.ok((await page.textContent('.adm-changes')).includes('Balance Плюс'), 'recent changes list the edit');
    let nativeDialog = false;
    page.once('dialog', (d) => { nativeDialog = true; d.dismiss(); });
    await page.click('.adm-banner [data-action="reset"]');
    const cf = page.locator('[data-adm-confirm]');
    await cf.waitFor({ state: 'visible' });
    assert.equal(nativeDialog, false, 'no window.confirm');
    assert.ok(await cf.locator('[data-cf-check] input').isChecked(), 'delete inquiries ticked by default');
    await cf.locator('[data-cf-ok]').click();
    await cf.waitFor({ state: 'hidden' });
    assert.equal(await store(page, KEYS.overrides), null);
    assert.equal(await store(page, KEYS.faq), null);
    assert.equal(await store(page, KEYS.inquiries), null);
    assert.ok(await store(page, KEYS.session), 'still signed in');
    assert.equal(await page.locator('.adm-latest-row').count(), 4, 'only examples remain');
    await page.goto(origin + productRoute, { waitUntil: 'networkidle' });
    const names = await page.locator('[data-pid="balance"][data-pfield="name"]').allTextContents();
    assert.ok(names.every((n) => n.trim() === 'Balance'), 'public page back to the original name');
  });

  await step('logout returns to the sign-in screen; EN admin renders', async () => {
    await page.goto(ADMIN, { waitUntil: 'networkidle' });
    await page.click('.adm-side [data-action="logout"]');
    await page.locator('[data-login]').waitFor({ state: 'visible' });
    assert.equal(await store(page, KEYS.session), null);
    await page.goto(`${origin}${BASE}en/admin/`, { waitUntil: 'networkidle' });
    assert.equal((await page.textContent('.adm-login-submit')).trim(), 'Sign in');
    await page.fill('#adm-user', 'demo');
    await page.fill('#adm-pass', 'demo');
    await page.click('.adm-login-submit');
    await page.goto(`${origin}${BASE}en/admin/#inquiries`, { waitUntil: 'networkidle' });
    assert.equal((await page.locator('tr[data-open-inq="example-1"] .c-dims').textContent()).trim(), '4.5 × 3.2 m · 14.4 m²');
  });

  await step('no console errors', async () => {
    assert.deepEqual([...new Set(errors)], []);
  });

  await browser.close();
  server.close();
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  process.exit(failed.length ? 1 : 0);
})();
