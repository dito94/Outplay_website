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
  customProducts: 'outplay.customProducts.v1',
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

/** PNG of the given size, drawn on a canvas in the page (a stand-in for a phone photo) */
async function makePng(page, w, h, color) {
  const b64 = await page.evaluate(([w, h, c]) => {
    const cv = document.createElement('canvas');
    cv.width = w;
    cv.height = h;
    const x = cv.getContext('2d');
    const g = x.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, c);
    g.addColorStop(1, '#1d1f22');
    x.fillStyle = g;
    x.fillRect(0, 0, w, h);
    x.fillStyle = 'rgba(255,255,255,.85)';
    x.fillRect(w * 0.1, h * 0.55, w * 0.8, h * 0.06);
    return cv.toDataURL('image/png').split(',')[1];
  }, [w, h, color]);
  return Buffer.from(b64, 'base64');
}

/**
 * Runs the custom-product injection on the current page. Uses the page's own <CustomProducts /> when Base
 * includes it; otherwise bundles src/lib/custom-products.ts (same code) and runs it with `cfg`.
 */
let harnessCode = null;
async function injectCustomProducts(page, cfg) {
  if (await page.locator('#cp-data').count()) return 'component';
  if (!harnessCode) {
    const { build } = await import('rolldown');
    const out = await build({
      input: path.resolve(__dirname, '..', 'src/lib/custom-products.ts'),
      output: { format: 'iife', name: 'CPX' },
      write: false,
    });
    harnessCode = out.output[0].code;
  }
  await page.addScriptTag({ content: `${harnessCode}\nCPX.injectCustomProducts(${JSON.stringify(cfg)});` });
  return 'harness';
}

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


  const CP = 'c-pergola-test';
  let cpCfg = null;
  await step('custom product: create with photos (resized, reordered) and texts in BG/EN', async () => {
    const pngs = [
      await makePng(page, 2000, 1200, '#c9a227'),
      await makePng(page, 1800, 1200, '#2b6f8f'),
      await makePng(page, 1200, 1600, '#7a3b2e'),
    ];
    await page.goto(ADMIN + '#products', { waitUntil: 'networkidle' });
    await page.click('[data-view="products"] a[href="#products/new"]');
    await page.locator('#adm-h-custom').waitFor();
    assert.equal((await page.textContent('#adm-h-custom')).trim(), 'Нов продукт');
    await page.selectOption('#adm-cp-cat', 'sun-protection');
    assert.equal(await page.inputValue('#adm-cp-fam'), 'zip', 'inquiry type follows the category');
    await page.selectOption('#adm-cp-cat', 'bioclimatic-pergolas');
    assert.equal(await page.inputValue('#adm-cp-fam'), 'pergola');
    await page.click('[data-cp-save]');
    assert.equal((await page.textContent('[data-cp-err="name-bg"]')).trim(), 'Въведете име на продукта на български.');
    assert.equal(await store(page, KEYS.customProducts), null, 'nothing saved without a name');
    await page.fill('#adm-cp-name-bg', 'Пергола Тест');
    await page.fill('#adm-cp-tagline-bg', 'Светлина и сянка с едно движение.');
    await page.fill('#adm-cp-summary-bg', 'Тестова пергола, добавена от админ демото.');
    await page.fill('#adm-cp-description-bg', 'Първи абзац на описанието.\n\nВтори абзац на описанието.');
    await page.fill('#adm-cp-features-bg', 'Алуминиева конструкция\nLED осветление');
    await page.click('[data-fkey="cp-spec-add-bg"]');
    await page.fill('[data-fkey="cp-spec-0-label-bg"]', 'Материал');
    await page.fill('[data-fkey="cp-spec-0-value-bg"]', 'Алуминий');
    await page.click('#adm-cptab-en');
    await page.fill('#adm-cp-name-en', 'Test Pergola');
    assert.equal((await page.textContent('[data-cpv-f="name"]')).trim(), 'Test Pergola', 'preview follows the EN tab');
    assert.equal((await page.textContent('[data-cpv-f="tagline"]')).trim(), 'Светлина и сянка с едно движение.', 'empty EN falls back to BG');
    await page.click('#adm-cptab-bg');
    await page.setInputFiles(
      '#adm-cp-file',
      pngs.map((buffer, i) => ({ name: `snimka-${i + 1}.png`, mimeType: 'image/png', buffer })),
    );
    await page.waitForFunction(() => document.querySelectorAll('.adm-thumb').length === 3);
    const before = await page.$$eval('.adm-thumb img', (els) => els.map((e) => e.src));
    assert.ok(before.every((src) => src.startsWith('data:image/jpeg')), 'converted to JPEG');
    await page.click('[data-cp-img-main="2"]');
    const after = await page.$$eval('.adm-thumb img', (els) => els.map((e) => e.src));
    assert.equal(after[0], before[2], 'third photo became the main one');
    const dims = await page.evaluate(async (srcs) => {
      return Promise.all(
        srcs.map(async (src) => {
          const im = new Image();
          im.src = src;
          await im.decode();
          return [im.naturalWidth, im.naturalHeight];
        }),
      );
    }, after);
    assert.deepEqual(dims.map((d) => Math.max(...d)), [1600, 1600, 1600], `long edge resized to 1600: ${JSON.stringify(dims)}`);
    await page.click('[data-cp-save]');
    await page.waitForFunction((id) => location.hash === `#products/${id}`, CP);
    const toast = page.locator('.adm-toasts .adm-toast').last();
    assert.ok((await toast.textContent()).includes('Продуктът е добавен'));
    const [cp] = await store(page, KEYS.customProducts);
    assert.equal(cp.id, CP);
    assert.equal(cp.category, 'bioclimatic-pergolas');
    assert.equal(cp.family, 'pergola');
    assert.equal(cp.name.en, 'Test Pergola');
    assert.equal(cp.images.length, 3);
    assert.equal(cp.images[0], after[0]);
    assert.equal(cp.sections[0].paragraphs.length, 2);
    assert.deepEqual(cp.features.map((f) => f.bg), ['Алуминиева конструкция', 'LED осветление']);
    assert.deepEqual(cp.specs[0], { label: { bg: 'Материал', en: '' }, value: { bg: 'Алуминий', en: '' } });
    assert.equal((await page.textContent('#adm-h-custom')).trim(), 'Пергола Тест', 'editor reopened on the saved product');
  });

  await step('custom product: listed in its category with a "Нов" badge and counted on the dashboard', async () => {
    await page.goto(ADMIN + '#products', { waitUntil: 'networkidle' });
    const row = page.locator(`[data-product="${CP}"]`);
    assert.ok(await row.locator('.adm-badge-new').isVisible());
    const group = page.locator('.adm-group', { has: page.locator('#adm-pg-bioclimatic-pergolas') });
    assert.equal(await group.locator(`[data-product="${CP}"]`).count(), 1, 'in the pergola group');
    assert.equal((await group.locator('.adm-group-n').textContent()).trim(), '8 продукта');
    await page.goto(ADMIN + '#dashboard', { waitUntil: 'networkidle' });
    assert.equal((await page.locator('.adm-stat').nth(2).locator('.adm-stat-value').textContent()).trim(), '18');
  });

  await step('custom product: public page /products/item/ renders it from this browser', async () => {
    await page.goto(`${origin}${BASE}products/item/?id=${CP}`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('h1').count(), 1, (await page.$$eval('h1', (hs) => hs.map((h) => h.outerHTML.slice(0, 160)))).join(' || '));
    assert.equal((await page.textContent('h1')).trim(), 'Пергола Тест');
    assert.ok((await page.title()).startsWith('Пергола Тест'));
    assert.ok((await page.getAttribute('.ci-crumbs a[href$="/products/bioclimatic-pergolas/"]', 'href')) !== null, 'category crumb');
    assert.ok((await page.getAttribute('.ci-hero-img img', 'src')).startsWith('data:image/jpeg'));
    assert.equal((await page.textContent('.ci-tagline')).trim(), 'Светлина и сянка с едно движение.');
    assert.equal(await page.locator('#overview .prose p').count(), 2);
    assert.deepEqual((await page.locator('#specs .ticks li').allTextContents()).map((x) => x.trim()), ['Алуминиева конструкция', 'LED осветление']);
    assert.equal((await page.textContent('#specs .spec-table th')).trim(), 'Материал');
    assert.equal(await page.locator('#gallery .ci-tile').count(), 1, 'hero + overview photo + 1 gallery photo');
    assert.ok((await page.getAttribute('#inquiry a.btn', 'href')).endsWith(`/contact/?product=${CP}#inquiry`));
    assert.deepEqual(await page.$$eval('[data-sn-link]', (as) => as.map((a) => a.dataset.snLink)), ['overview', 'specs', 'gallery', 'inquiry']);
    await page.click('#gallery .ci-tile-link');
    const lb = page.locator('[data-lb]');
    await lb.waitFor({ state: 'visible' });
    assert.ok((await lb.locator('[data-lb-img]').getAttribute('src')).startsWith('data:image/jpeg'), 'lightbox shows the photo');
    await page.keyboard.press('Escape');
    await page.goto(`${origin}${BASE}en/products/item/?id=${CP}`, { waitUntil: 'networkidle' });
    assert.equal((await page.textContent('h1')).trim(), 'Test Pergola');
    assert.equal((await page.textContent('.ci-tagline')).trim(), 'Светлина и сянка с едно движение.', 'EN falls back to BG');
    await page.goto(`${origin}${BASE}products/item/?id=c-missing`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal((await page.textContent('h1')).trim(), 'Продуктът не е наличен в този браузър');
    assert.equal(await page.locator(`.ci-missing-box a[href="${BASE}products/"]`).count(), 1);
    assert.equal(await page.locator(`.ci-missing-box a[href="${BASE}admin/"]`).count(), 1);
    assert.equal(await page.locator('[data-subnav]').isVisible(), false);
  });

  let injectMode = '';
  await step('custom product: card in its category grid on /products/ and the category page, links in the menus', async () => {
    await page.goto(`${origin}${BASE}products/`, { waitUntil: 'networkidle' });
    if (!(await page.locator('#cp-data').count())) {
      // catalogue map read from the products index before anything is injected
      const map = await page.$$eval('[data-group]', (secs) => {
        const cats = {};
        const byCat = {};
        secs.forEach((sec) => {
          const c = sec.dataset.group;
          byCat[c] = [];
          sec.querySelectorAll('[data-pcard][data-pid]').forEach((el) => {
            cats[el.dataset.pid] = c;
            byCat[c].push(el.dataset.pid);
          });
        });
        return { cats, byCat };
      });
      cpCfg = { ...map, item: { bg: `${BASE}products/item/`, en: `${BASE}en/products/item/` } };
    }
    injectMode = await injectCustomProducts(page, cpCfg);
    const card = page.locator(`[data-group="bioclimatic-pergolas"] [data-pcard][data-pid="${CP}"]`);
    assert.equal(await card.count(), 1, 'card in the pergola grid');
    assert.equal(await page.locator(`[data-pcard][data-pid="${CP}"]`).count(), 1, 'and nowhere else');
    assert.ok(await card.isVisible());
    assert.equal((await card.locator('[data-pfield="name"]').textContent()).trim(), 'Пергола Тест');
    assert.ok((await card.locator('a[data-pfield="name"]').getAttribute('href')).endsWith(`/products/item/?id=${CP}`));
    assert.ok((await card.locator('img').getAttribute('src')).startsWith('data:image/jpeg'));
    assert.equal(await card.locator('img').getAttribute('srcset'), null);
    assert.equal((await page.textContent('[data-filter-btn="bioclimatic-pergolas"] .seg-n')).trim(), '8');
    assert.equal(await page.locator(`.mega-col a[data-custom-link="${CP}"]`).count(), 1, 'mega-menu link');
    const megaCol = page.locator('.mega-col', { has: page.locator(`a[data-custom-link="${CP}"]`) });
    assert.ok((await megaCol.locator('.mega-cat').getAttribute('href')).endsWith('/products/bioclimatic-pergolas/'));
    assert.equal(await page.locator(`.drawer-cats a[data-custom-link="${CP}"]`).count(), 1, 'drawer link');
    await page.goto(`${origin}${BASE}products/bioclimatic-pergolas/`, { waitUntil: 'networkidle' });
    await injectCustomProducts(page, cpCfg);
    assert.equal(await page.locator(`[data-pcard][data-pid="${CP}"]`).count(), 1, 'card on the category page');
    await page.goto(`${origin}${BASE}products/bioclimatic-pergolas/balance/`, { waitUntil: 'networkidle' });
    await injectCustomProducts(page, cpCfg);
    assert.equal(await page.locator(`[data-pcard][data-pid="${CP}"]`).count(), 0, 'related-products strip untouched');
    await page.goto(`${origin}${BASE}products/glass-systems/`, { waitUntil: 'networkidle' });
    await injectCustomProducts(page, cpCfg);
    assert.equal(await page.locator(`[data-pcard][data-pid="${CP}"]`).count(), 0, 'not in other categories');
  });

  await step('custom product: hiding keeps it off the listings; delete asks in-page', async () => {
    await page.goto(ADMIN + '#products', { waitUntil: 'networkidle' });
    await page.click(`[data-toggle-vis="${CP}"]`);
    assert.equal((await store(page, KEYS.customProducts))[0].hidden, true);
    await page.goto(`${origin}${BASE}products/`, { waitUntil: 'networkidle' });
    await injectCustomProducts(page, cpCfg);
    assert.equal(await page.locator(`[data-pcard][data-pid="${CP}"]`).count(), 0, 'hidden product has no card');
    await page.goto(`${origin}${BASE}products/item/?id=${CP}`, { waitUntil: 'networkidle' });
    assert.ok(await page.locator('.ci-notice').isVisible(), 'direct link shows a hidden notice');
    await page.goto(ADMIN + `#products/${CP}`, { waitUntil: 'networkidle' });
    await page.click('[data-cp-delete]');
    const cf = page.locator('[data-adm-confirm]');
    await cf.waitFor({ state: 'visible' });
    await cf.locator('[data-cf-ok]').click();
    await page.waitForFunction(() => location.hash === '#products');
    assert.deepEqual(await store(page, KEYS.customProducts), []);
    assert.equal(await page.locator(`[data-product="${CP}"]`).count(), 0);
  });

  await step('custom product: a full browser storage is reported clearly and nothing is lost', async () => {
    await page.goto(ADMIN + '#products/new', { waitUntil: 'networkidle' });
    await page.fill('#adm-cp-name-bg', 'Пълна памет');
    await page.setInputFiles('#adm-cp-file', [{ name: 'a.png', mimeType: 'image/png', buffer: await makePng(page, 1600, 1000, '#556b2f') }]);
    await page.waitForFunction(() => document.querySelectorAll('.adm-thumb').length === 1);
    await page.evaluate(() => {
      let n = 0;
      for (const size of [262144, 16384, 1024, 64]) {
        const chunk = 'x'.repeat(size);
        try {
          for (;;) localStorage.setItem(`outplay.junk.${n++}`, chunk);
        } catch {
          /* this chunk size no longer fits */
        }
      }
    });
    await page.click('[data-cp-save]');
    const err = (await page.textContent('[data-cp-error]')).trim();
    assert.ok(err.startsWith('Няма достатъчно място в паметта на браузъра'), err);
    assert.equal(await page.locator('.adm-thumb').count(), 1, 'the draft keeps its photo');
    await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('outplay.junk.')).forEach((k) => localStorage.removeItem(k)));
    await page.click('[data-cp-save]');
    await page.waitForFunction(() => location.hash.startsWith('#products/c-'));
    assert.equal((await store(page, KEYS.customProducts)).length, 1, 'saves once there is room');
  });

  await step('reset: in-page confirmation clears overrides, FAQ edits, added products and stored inquiries', async () => {
    await page.goto(ADMIN + '#dashboard', { waitUntil: 'networkidle' });
    assert.ok((await page.textContent('.adm-changes')).includes('Balance Плюс'), 'recent changes list the edit');
    let nativeDialog = false;
    page.once('dialog', (d) => { nativeDialog = true; d.dismiss(); });
    await page.click('.adm-banner [data-action="reset"]');
    const cf = page.locator('[data-adm-confirm]');
    await cf.waitFor({ state: 'visible' });
    assert.equal(nativeDialog, false, 'no window.confirm');
    assert.ok(await cf.locator('[data-cf-check] input').isChecked(), 'delete inquiries ticked by default');
    assert.ok((await cf.locator('#adm-cf-text').textContent()).includes('добавени продукти'), 'dialog mentions added products');
    await cf.locator('[data-cf-ok]').click();
    await cf.waitFor({ state: 'hidden' });
    assert.equal(await store(page, KEYS.overrides), null);
    assert.equal(await store(page, KEYS.faq), null);
    assert.equal(await store(page, KEYS.inquiries), null);
    assert.equal(await store(page, KEYS.customProducts), null, 'added products removed');
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
  if (injectMode) console.log(`  (public-page injection tested via ${injectMode === 'component' ? '<CustomProducts /> in the page' : 'a bundle of src/lib/custom-products.ts; Base does not include <CustomProducts /> yet'})`);
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  process.exit(failed.length ? 1 : 0);
})();
