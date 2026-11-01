// End-to-end checks for the inquiry form, the search palette and the /search/ page.
// Usage: DIST=<build dir> [SHOTS=<dir>] node tests/inquiry.spec.cjs
// Serves the build under the real base path, drives Chromium with Playwright and exits 1 on any failure.
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE = '/Outplay_website/';
const DIST = path.resolve(process.env.DIST || path.join(__dirname, '..', 'dist'));
const SHOTS = process.env.SHOTS ? path.resolve(process.env.SHOTS) : null;
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json',
  '.ico': 'image/x-icon',
};

// 1x1 PNG
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
  'base64',
);

let passed = 0;
const failures = [];
function check(cond, msg) {
  if (cond) passed++;
  else failures.push(msg);
  console.log(`${cond ? '  ok ' : '  FAIL'} ${msg}`);
}
async function shot(page, name, full = false) {
  if (!SHOTS) return;
  fs.mkdirSync(SHOTS, { recursive: true });
  await page.screenshot({ path: path.join(SHOTS, `${name}.png`), fullPage: full });
}

const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (!p.startsWith(BASE)) { res.writeHead(404); return res.end(); }
  let f = path.join(DIST, p.slice(BASE.length));
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end('404'); }
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});

server.listen(0, async () => {
  const origin = `http://localhost:${server.address().port}`;
  const browser = await chromium.launch();
  // Block third-party requests (map iframe) so the run is deterministic offline
  const newCtx = async (opts = {}) => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
    await ctx.route(/^https?:\/\/(?!localhost)/, (r) => r.abort());
    return ctx;
  };
  const errors = [];
  const watch = (page) => {
    page.on('pageerror', (e) => errors.push(`${page.url()} pageerror: ${e.message}`));
    page.on('console', (m) => m.type() === 'error' && !/ERR_FAILED|net::/.test(m.text()) && errors.push(`${page.url()} console: ${m.text()}`));
  };
  const F = '#inquiry-form';
  const stored = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('outplay.inquiries.v1') || '[]'));

  try {
    // ------------------------------------------------------------------ 1. Pergola, BG, full flow
    console.log('\n1. Contact page (BG) – pergola inquiry');
    let ctx = await newCtx();
    let page = await ctx.newPage();
    watch(page);
    await page.goto(`${origin}${BASE}contact/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    check((await page.locator('h1').count()) === 1, 'one h1 on the contact page');
    check(await page.locator('section#inquiry').isVisible(), 'section#inquiry exists');
    check((await page.locator(`${F} [data-iq-steptext]`).textContent()).includes('1 от 3'), 'step text shows "1 от 3"');

    await page.click(`${F} [data-iq-next]`);
    const prodErr = await page.locator('#inquiry-form-product-err').textContent();
    check(prodErr.includes('Изберете продукт'), `product required error shown ("${prodErr}")`);
    check((await page.evaluate(() => document.activeElement?.id)) === 'inquiry-form-product', 'focus moved to the product select');
    check((await page.getAttribute('#inquiry-form-product', 'aria-invalid')) === 'true', 'select has aria-invalid');
    check(
      ((await page.getAttribute('#inquiry-form-product', 'aria-describedby')) || '').includes('inquiry-form-product-err'),
      'select aria-describedby references the error',
    );

    await page.selectOption('#inquiry-form-product', 'balance');
    check(!(await page.getAttribute('#inquiry-form-product', 'aria-invalid')), 'product error clears after choosing');
    const w = '#inquiry-form-pergola-width';
    const d = '#inquiry-form-pergola-depth';
    check(await page.locator(w).isVisible(), 'pergola width field visible');
    check(await page.locator(d).isVisible(), 'pergola depth field visible');
    check(!(await page.locator('#inquiry-form-zip-units').isVisible()), 'ZIP fields hidden for a pergola');

    await page.fill(w, 'abc');
    await page.locator(w).blur();
    check((await page.locator(`${w}-err`).textContent()).includes('Въведете число'), 'non-number → number error');
    await page.fill(w, '50');
    await page.locator(w).blur();
    const rangeErr = await page.locator(`${w}-err`).textContent();
    check(rangeErr.includes('между 1 и 30 м'), `out of range → "${rangeErr}"`);
    // an invalid size never leaves a stale drawing looking current
    check(await page.locator(`${F} [data-iq-preview]`).evaluate((el) => el.classList.contains('is-stale')), 'invalid width dims the sketch');
    check((await page.locator(`${F} [data-iq-area]`).textContent()) === '—', 'invalid width shows "—" for the area');
    await page.waitForTimeout(350);
    check(
      (await page.locator(`${F} [data-iq-svg]`).evaluate((el) => getComputedStyle(el).opacity)) === '0.35',
      'dimmed sketch opacity .35',
    );
    await page.click(`${F} [data-iq-next]`);
    check((await page.evaluate(() => document.activeElement?.id)) === 'inquiry-form-pergola-width', 'Next focuses the invalid width');
    check(await page.locator(`${F} section[data-step="1"]`).isVisible(), 'still on step 1 while invalid');

    await page.fill(w, '5');
    await page.fill(d, '4,0');
    await page.locator(d).blur();
    check((await page.locator(`${w}-err`).textContent()) === '', 'width error clears');
    check(!(await page.locator(`${F} [data-iq-preview]`).evaluate((el) => el.classList.contains('is-stale'))), 'valid size un-dims the sketch');
    let area = await page.locator(`${F} [data-iq-area]`).textContent();
    check(area === '20,0', `area 5 × 4 = 20,0 m² (got ${area})`);
    // slider drives the number field
    await page.locator(`${F} [data-dims-block="pergola"] [data-dim="depth"] [data-dim-range]`).fill('3.5');
    check((await page.inputValue(d)) === '3,5', 'depth slider updates the number field (3,5)');
    area = await page.locator(`${F} [data-iq-area]`).textContent();
    check(area === '17,5', `area 5 × 3,5 = 17,5 (got ${area})`);
    const svgLabel = await page.getAttribute(`${F} [data-iq-svg]`, 'aria-label');
    check(/Ширина 5 м/.test(svgLabel) && /Дълбочина 3,5 м/.test(svgLabel), `sketch is labelled (${svgLabel})`);
    check((await page.locator(`${F} [data-iq-svg] text`).count()) >= 4, 'sketch has dimension labels');
    // labels inside the drawing never overlap
    const overlaps = await page.evaluate(() => {
      const boxes = [...document.querySelectorAll('#inquiry-form [data-iq-svg] text')].map((t) => t.getBoundingClientRect());
      let n = 0;
      for (let i = 0; i < boxes.length; i++)
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i], b = boxes[j];
          if (a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1) n++;
        }
      return n;
    });
    check(overlaps === 0, `no overlapping labels in the sketch (${overlaps})`);
    await shot(page, 'flow-1-step1');

    // Enter in a field moves on (no early submit)
    await page.focus(w);
    await page.keyboard.press('Enter');
    check(await page.locator(`${F} section[data-step="2"]`).isVisible(), 'Enter in a dimension field goes to step 2');
    check((await page.evaluate(() => document.activeElement?.id)) === 'inquiry-form-s2-title', 'focus moved to the step 2 heading');
    check((await stored(page)).length === 0, 'nothing stored before submit');

    check(await page.isChecked(`${F} input[name="opt.pergola.roofType"][value="lamellas"]`), 'Balance preselects aluminium louvres');
    const s2 = `${F} section[data-step="2"]`;
    check((await page.locator(`${s2} h3, ${s2} h4`).count()) === 1, 'step 2 has a single heading');
    // property type, place and timeline are folded into "More details (optional)"
    const more = `${F} details[data-iq-project]`;
    check(!(await page.locator(more).evaluate((el) => el.open)), '"more details" collapsed by default');
    check(!(await page.locator(`${F} input[name="proj.placeType"][value="garden"]`).isVisible()), 'project chips hidden while collapsed');
    const moreSum = (await page.locator(`${more} summary`).textContent()).replace(/\s+/g, ' ');
    check(moreSum.includes('Още детайли') && moreSum.includes('Дом · Тераса · 1–3 месеца'), `summary row lists current choices ("${moreSum.trim()}")`);
    await page.click(`${more} summary`);
    await page.check(`${F} input[name="proj.placeType"][value="garden"]`);
    await page.click(`${more} summary`);
    check(
      (await page.locator(`${F} [data-iq-more-v]`).textContent()).includes('Двор или градина'),
      'summary row follows a changed choice',
    );
    check(await page.locator(`${F} .iq-drop-fine`).isVisible(), 'desktop upload box offers drag and drop');
    check(!(await page.locator(`${F} .iq-drop-coarse`).isVisible()), 'phone wording hidden on desktop');
    await page.check(`${F} input[name="opt.pergola.extras"][value="led"]`);
    await page.check(`${F} input[name="opt.pergola.mounting"][value="freestanding"]`);
    await page.fill('#inquiry-form-pergola-colour', 'антрацит');
    await page.setInputFiles(`${F} [data-iq-file]`, [
      { name: 'terrace-1.png', mimeType: 'image/png', buffer: PNG },
      { name: 'terrace-2.png', mimeType: 'image/png', buffer: PNG },
      { name: 'notes.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF') },
    ]);
    check((await page.locator(`${F} .iq-thumb`).count()) === 2, 'two image thumbnails shown');
    check((await page.locator('#inquiry-form-photos-err').textContent()).includes('JPG, PNG или WEBP'), 'non-image file rejected with a message');
    await page.click(`${F} .iq-thumb-rm >> nth=1`);
    check((await page.locator(`${F} .iq-thumb`).count()) === 1, 'remove button removes a thumbnail');
    await page.fill('#inquiry-form-message', 'Тераса на втори етаж.');
    await shot(page, 'flow-2-step2', true);

    await page.click(`${F} [data-iq-next]`);
    check(await page.locator(`${F} section[data-step="3"]`).isVisible(), 'step 3 visible');
    const sum = await page.locator(`${F} [data-iq-summary]`).textContent();
    check(sum.includes('Balance') && sum.includes('Ширина 5 м') && sum.includes('антрацит') && sum.includes('LED'), 'summary lists product, size and options');
    check(sum.includes('terrace-1.png'), 'summary lists the photo name');
    check(sum.includes('Двор или градина'), 'summary lists the folded project choice');
    const consentText = await page.locator(`${F} label[for="inquiry-form-consent"]`).textContent();
    check(consentText.includes('Съгласявам се') && !consentText.includes('/на'), `gender-neutral consent ("${consentText.trim().slice(0, 30)}…")`);

    await page.click(`${F} [data-iq-submit]`);
    check((await page.locator('#inquiry-form-name-err').textContent()).length > 0, 'name required');
    check((await page.locator('#inquiry-form-phone-err').textContent()).length > 0, 'phone required for the phone channel');
    check((await page.locator('#inquiry-form-consent-err').textContent()).includes('съгласието'), 'consent required');
    check((await page.evaluate(() => document.activeElement?.id)) === 'inquiry-form-name', 'focus on the first invalid field (name)');

    await page.fill('#inquiry-form-name', 'Мария Петрова');
    await page.fill('#inquiry-form-phone', '12345');
    await page.locator('#inquiry-form-phone').blur();
    check((await page.locator('#inquiry-form-phone-err').textContent()).includes('валиден телефонен'), 'invalid phone rejected');
    for (const ok of ['0888 123 456', '+359 88 812 3456', '02 987 6543', '0879811259']) {
      await page.fill('#inquiry-form-phone', ok);
      await page.locator('#inquiry-form-phone').blur();
      check((await page.locator('#inquiry-form-phone-err').textContent()) === '', `phone accepted: ${ok}`);
    }
    await page.fill('#inquiry-form-email', 'maria@');
    await page.locator('#inquiry-form-email').blur();
    check((await page.locator('#inquiry-form-email-err').textContent()).includes('имейл'), 'invalid email rejected');
    await page.fill('#inquiry-form-email', 'maria@example.bg');
    await page.locator('#inquiry-form-email').blur();
    check((await page.locator('#inquiry-form-email-err').textContent()) === '', 'valid email accepted');
    await page.fill('#inquiry-form-city', 'София');
    await page.check(`${F} input[name="contact.channel"][value="viber"]`);
    // draft saved while typing
    await page.waitForTimeout(500);
    const draft = await page.evaluate(() => JSON.parse(localStorage.getItem('outplay.inquiry.draft.v1') || 'null'));
    check(draft && draft.productId === 'balance' && draft.values['contact.name'] === 'Мария Петрова', 'draft saved to localStorage');
    await page.check('#inquiry-form-consent');
    await shot(page, 'flow-3-step3', true);
    await page.click(`${F} [data-iq-submit]`);

    check(await page.locator(`${F} [data-iq-success]`).isVisible(), 'success state visible');
    check(!(await page.locator(`${F} [data-iq-form]`).isVisible()), 'form hidden after submit');
    check((await page.evaluate(() => document.activeElement?.hasAttribute('data-iq-success-title'))) === true, 'focus on the success heading');
    const note = await page.locator(`${F} .iq-demo-note`).textContent();
    check(note.includes('не е изпратено') && note.includes('OUTPLAY'), 'demo notice says nothing was sent');
    check(!(await page.locator(`${F} [data-iq-storage-note]`).isVisible()), 'no storage warning when saving worked');
    const okSum = await page.locator(`${F} [data-iq-success-summary]`).textContent();
    check(okSum.includes('Мария Петрова') && okSum.includes('Viber') && okSum.includes('17,5'), 'success summary lists contact, channel and area');
    check((await page.locator(`${F} [data-iq-success] a[href^="tel:"]`).count()) >= 2, 'success offers phone links');
    check((await page.locator(`${F} [data-iq-success] [data-copy]`).count()) >= 2, 'success offers copy buttons');
    let list = await stored(page);
    const inq = list[0];
    check(list.length === 1, 'one inquiry stored');
    check(inq && inq.productId === 'balance' && inq.family === 'pergola', 'stored product + family');
    check(inq && inq.dims.width === 5 && inq.dims.depth === 3.5 && inq.dims.height === 2.6, `stored dims ${JSON.stringify(inq && inq.dims)}`);
    check(inq && inq.options.roofType === 'lamellas' && inq.options.mounting === 'freestanding', 'stored single options');
    check(inq && Array.isArray(inq.options.extras) && inq.options.extras.includes('led'), 'stored multi options');
    check(inq && inq.options.colour === 'антрацит' && inq.options.placeType === 'garden' && inq.options.timeline === '1-3m', 'stored text + project fields');
    check(inq && inq.contact.channel === 'viber' && inq.contact.city === 'София' && inq.status === 'new', 'stored contact');
    check(inq && JSON.stringify(inq.files) === '["terrace-1.png"]' && inq.message === 'Тераса на втори етаж.', 'stored file names + message');
    check((await page.evaluate(() => localStorage.getItem('outplay.inquiry.draft.v1'))) === null, 'draft cleared on submit');
    await shot(page, 'flow-4-success', true);

    await page.click(`${F} [data-iq-new]`);
    check(await page.locator(`${F} section[data-step="1"]`).isVisible(), 'new request starts at step 1');
    check((await page.inputValue('#inquiry-form-name')) === 'Мария Петрова', 'contact details kept for the next request');
    check((await page.inputValue('#inquiry-form-product')) === 'balance', 'last product kept');
    await ctx.close();

    // ------------------------------------------------------------------ 2. ZIP, EN, ?product=
    console.log('\n2. Contact page (EN) – ZIP inquiry via ?product=vertical-zip');
    ctx = await newCtx();
    page = await ctx.newPage();
    watch(page);
    await page.goto(`${origin}${BASE}en/contact/?product=vertical-zip#inquiry`, { waitUntil: 'networkidle' });
    check((await page.inputValue('#inquiry-form-product')) === 'vertical-zip', 'EN: ?product=vertical-zip preselects the product');
    check(await page.locator('#inquiry-form-zip-units').isVisible(), 'ZIP units field visible');
    check(!(await page.locator('#inquiry-form-pergola-depth').isVisible()), 'pergola depth hidden for ZIP');
    await page.fill('#inquiry-form-zip-width', '2.5');
    await page.fill('#inquiry-form-zip-height', '2');
    await page.locator('#inquiry-form-zip-height').blur();
    await page.click(`${F} [data-dim="units"] [data-stepper="1"]`);
    await page.click(`${F} [data-dim="units"] [data-stepper="1"]`);
    check((await page.inputValue('#inquiry-form-zip-units')) === '3', 'stepper increments units to 3');
    area = await page.locator(`${F} [data-iq-area]`).textContent();
    const detail = await page.locator(`${F} [data-iq-area-detail]`).textContent();
    check(area === '15.0' && detail.includes('5.0') && detail.includes('× 3'), `ZIP area 2.5 × 2 × 3 = 15.0 (got ${area}; ${detail})`);
    await page.fill('#inquiry-form-zip-units', '0');
    await page.locator('#inquiry-form-zip-units').blur();
    check((await page.locator('#inquiry-form-zip-units-err').textContent()).includes('between 1 and 40'), 'units range error in English');
    await page.fill('#inquiry-form-zip-units', '3');
    await page.locator('#inquiry-form-zip-units').blur();
    await shot(page, 'zip-1-step1');
    await page.click(`${F} [data-iq-next]`);
    check(await page.isChecked(`${F} input[name="opt.zip.zipType"][value="vertical"]`), 'vertical ZIP preselected');
    await page.check(`${F} input[name="opt.zip.fabric"][value="blackout"]`);
    await page.fill('#inquiry-form-zip-fabricColour', 'grey');
    await page.click(`${F} [data-iq-next]`);
    await page.check(`${F} input[name="contact.channel"][value="email"]`);
    check(!(await page.locator(`${F} [data-opt-mark="phone"]`).isHidden()), 'phone marked optional for the email channel');
    await page.fill('#inquiry-form-name', 'John Smith');
    await page.check('#inquiry-form-consent');
    await page.click(`${F} [data-iq-submit]`);
    check((await page.locator('#inquiry-form-email-err').textContent()).includes('fill in'), 'email required for the email channel');
    check((await page.locator('#inquiry-form-phone-err').textContent()) === '', 'phone not required for the email channel');
    await page.fill('#inquiry-form-email', 'john@example.com');
    await page.click(`${F} [data-iq-submit]`);
    check(await page.locator(`${F} [data-iq-success]`).isVisible(), 'EN success visible');
    check((await page.locator(`${F} .iq-demo-note`).textContent()).includes('has not been sent'), 'EN demo notice');
    list = await stored(page);
    check(list[0] && list[0].family === 'zip' && list[0].dims.units === 3 && list[0].dims.width === 2.5, 'ZIP stored with units');
    check(list[0] && list[0].options.fabric === 'blackout' && list[0].options.fabricColour === 'grey' && list[0].lang === 'en', 'ZIP options stored');
    check(list[0] && list[0].contact.channel === 'email' && list[0].contact.phone === '', 'email channel stored');
    await shot(page, 'zip-2-success', true);
    await ctx.close();

    // ------------------------------------------------------------------ 2b. Roof ZIP: plan view, width × projection
    console.log('\n2b. Roof ZIP drawn in plan');
    ctx = await newCtx();
    page = await ctx.newPage();
    watch(page);
    await page.goto(`${origin}${BASE}contact/?product=roof-zip#inquiry`, { waitUntil: 'networkidle' });
    check((await page.inputValue('#inquiry-form-product')) === 'roof-zip', '?product=roof-zip preselects Roof ZIP');
    check(await page.locator('#inquiry-form-roof-zip-width').isVisible(), 'roof ZIP has its own dimension set');
    check(!(await page.locator('#inquiry-form-zip-width').isVisible()), 'vertical ZIP set hidden for roof ZIP');
    await page.fill('#inquiry-form-roof-zip-width', '4');
    await page.fill('#inquiry-form-roof-zip-height', '3,5');
    await page.locator('#inquiry-form-roof-zip-height').blur();
    let rzLabel = (await page.getAttribute(`${F} [data-iq-svg]`, 'aria-label')) || '';
    check(rzLabel.startsWith('Изглед отгоре') && /Излаз 3,5 м/.test(rzLabel), `roof ZIP sketch is a plan view (${rzLabel})`);
    check((await page.locator(`${F} [data-iq-area]`).textContent()) === '14,0', 'roof ZIP area 4 × 3,5 = 14,0');
    await page.click(`${F} [data-iq-next]`);
    check(await page.isChecked(`${F} input[name="opt.zip.zipType"][value="roof"]`), 'roof ZIP preselects the roof screen type');
    await page.click(`${F} [data-iq-next]`);
    check((await page.locator(`${F} [data-iq-summary]`).textContent()).includes('Излаз 3,5 м'), 'summary names the projection');
    await page.click(`${F} [data-goto="1"]`);
    await page.selectOption('#inquiry-form-product', 'vertical-zip');
    rzLabel = (await page.getAttribute(`${F} [data-iq-svg]`, 'aria-label')) || '';
    check(await page.locator('#inquiry-form-zip-width').isVisible() && rzLabel.startsWith('Изглед отпред'), 'vertical ZIP switches back to the front view');
    await shot(page, 'roofzip-1');
    await ctx.close();

    // ------------------------------------------------------------------ 3. Preselect + draft restore
    console.log('\n3. ?product=balance preselect and draft restore');
    ctx = await newCtx();
    page = await ctx.newPage();
    watch(page);
    await page.goto(`${origin}${BASE}contact/?product=balance#inquiry`, { waitUntil: 'networkidle' });
    check((await page.inputValue('#inquiry-form-product')) === 'balance', '?product=balance preselects Balance');
    check(await page.isChecked(`${F} input[name="opt.pergola.roofType"][value="lamellas"]`), 'Balance preset applied');
    await page.goto(`${origin}${BASE}contact/?product=flat#inquiry`, { waitUntil: 'networkidle' });
    check(await page.isChecked(`${F} input[name="opt.pergola.roofType"][value="pvc"]`), 'Flat preselects the PVC roof');
    await page.fill('#inquiry-form-pergola-width', '6,5');
    await page.locator('#inquiry-form-pergola-width').blur();
    await page.waitForTimeout(500);
    await page.reload({ waitUntil: 'networkidle' });
    check((await page.inputValue('#inquiry-form-pergola-width')) === '6,5', 'draft restored after reload');
    check(await page.locator(`${F} [data-iq-draft]`).isVisible(), 'draft notice shown');
    await page.click(`${F} [data-iq-reset]`);
    check((await page.inputValue('#inquiry-form-pergola-width')) === '4', 'start over resets the values');
    check((await page.evaluate(() => localStorage.getItem('outplay.inquiry.draft.v1'))) === null, 'start over clears the draft');
    await ctx.close();

    // ------------------------------------------------------------------ 4. Storage failure still shows the summary
    console.log('\n4. Storage blocked');
    ctx = await newCtx();
    await ctx.addInitScript(() => {
      Storage.prototype.setItem = function () {
        throw new Error('QuotaExceededError');
      };
    });
    page = await ctx.newPage();
    watch(page);
    await page.goto(`${origin}${BASE}contact/?product=guillotine`, { waitUntil: 'networkidle' });
    await page.click(`${F} [data-iq-next]`);
    await page.click(`${F} [data-iq-next]`);
    await page.fill('#inquiry-form-name', 'Test');
    await page.fill('#inquiry-form-phone', '0888123456');
    await page.check('#inquiry-form-consent');
    await page.click(`${F} [data-iq-submit]`);
    check(await page.locator(`${F} [data-iq-success]`).isVisible(), 'success summary shown even when storage fails');
    check(await page.locator(`${F} [data-iq-storage-note]`).isVisible(), 'storage warning shown');
    await ctx.close();

    // ------------------------------------------------------------------ 5. Search palette
    console.log('\n5. Search palette');
    ctx = await newCtx();
    page = await ctx.newPage();
    watch(page);
    await page.goto(`${origin}${BASE}`, { waitUntil: 'networkidle' });
    await page.keyboard.press('Control+k');
    check(await page.locator('[data-sp]').isVisible(), 'Ctrl+K opens the palette');
    check((await page.getAttribute('#sp-input', 'placeholder')).includes('гилотина'), 'full placeholder on desktop');
    check((await page.evaluate(() => document.activeElement?.id)) === 'sp-input', 'input focused');
    check(await page.locator('[data-sp-empty]').isVisible(), 'popular searches shown when empty');
    const queries = [
      ['pergola', /Balance/],
      ['gilotina', /Гилотина/],
      ['zip', /ZIP/],
      ['Balance', /Balance/],
      ['pergla', /Balance|Infinity/],
    ];
    for (const [q, re] of queries) {
      await page.fill('#sp-input', q);
      await page.waitForSelector('[data-sp-list]:not([hidden]) [role="option"]', { timeout: 4000 }).catch(() => {});
      const first = (await page.locator('[data-sp-list] [role="option"]').first().textContent().catch(() => '')) || '';
      const allText = (await page.locator('[data-sp-list]').textContent()) || '';
      check(re.test(allText), `"${q}" finds ${re} (first: ${first.trim().slice(0, 40)})`);
    }
    await page.fill('#sp-input', 'gilotina');
    await page.waitForTimeout(100);
    check(
      ((await page.locator('[data-sp-list] [role="option"]').first().textContent()) || '').includes('Гилотина'),
      '"gilotina" ranks Гилотина first',
    );
    check((await page.locator('[data-sp-list] mark').count()) > 0, 'matches highlighted');
    check((await page.getAttribute('#sp-input', 'aria-expanded')) === 'true', 'combobox expanded');
    await page.fill('#sp-input', 'Balance');
    await page.waitForTimeout(100);
    const firstId = await page.getAttribute('#sp-input', 'aria-activedescendant');
    await page.keyboard.press('ArrowDown');
    const secondId = await page.getAttribute('#sp-input', 'aria-activedescendant');
    check(firstId && secondId && firstId !== secondId, 'ArrowDown moves the active option');
    await page.keyboard.press('ArrowUp');
    check((await page.getAttribute('#sp-input', 'aria-activedescendant')) === firstId, 'ArrowUp moves back');
    await shot(page, 'search-1-palette');
    await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), page.keyboard.press('Enter')]);
    check(page.url().endsWith(`${BASE}products/bioclimatic-pergolas/balance/`), `Enter opens Balance (${page.url().replace(origin, '')})`);

    await page.goto(`${origin}${BASE}`, { waitUntil: 'networkidle' });
    await page.keyboard.press('/');
    check(await page.locator('[data-sp]').isVisible(), '"/" opens the palette');
    await page.keyboard.press('Escape');
    check(!(await page.locator('[data-sp]').isVisible()), 'Esc closes the palette');
    await page.click('.site-header [data-search-open]');
    await page.waitForSelector('[data-sp][open]', { timeout: 2000 }).catch(() => {});
    check(await page.locator('[data-sp]').isVisible(), 'header search button opens the palette');
    await page.keyboard.press('Escape');
    check(
      (await page.evaluate(() => document.activeElement?.matches('.site-header [data-search-open]'))) === true,
      'focus returns to the search button',
    );
    // "/" inside a field types normally
    await page.goto(`${origin}${BASE}contact/`, { waitUntil: 'networkidle' });
    await page.focus('#inquiry-form-message').catch(() => {});
    await page.selectOption('#inquiry-form-product', 'balance');
    await page.click(`${F} [data-iq-next]`);
    await page.focus('#inquiry-form-message');
    await page.keyboard.type('a/b');
    check(!(await page.locator('[data-sp]').isVisible()) && (await page.inputValue('#inquiry-form-message')) === 'a/b', '"/" in a text field does not open search');
    // see all results
    await page.keyboard.press('Control+k');
    await page.fill('#sp-input', 'zip');
    await page.waitForTimeout(100);
    const allHref = await page.getAttribute('[data-sp-all]', 'href');
    check(allHref === `${BASE}search/?q=zip`, `"see all" links to the search page (${allHref})`);
    await ctx.close();

    // EN palette with Cyrillic input
    ctx = await newCtx();
    page = await ctx.newPage();
    watch(page);
    await page.goto(`${origin}${BASE}en/`, { waitUntil: 'networkidle' });
    await page.keyboard.press('Control+k');
    await page.fill('#sp-input', 'пергола');
    await page.waitForSelector('[data-sp-list]:not([hidden]) [role="option"]', { timeout: 4000 }).catch(() => {});
    const enText = (await page.locator('[data-sp-list]').textContent()) || '';
    check(/pergola/i.test(enText), 'EN: "пергола" finds pergolas');
    await page.fill('#sp-input', 'гилотина');
    await page.waitForTimeout(100);
    check(((await page.locator('[data-sp-list] [role="option"]').first().textContent()) || '').includes('Guillotine'), 'EN: "гилотина" → Guillotine');
    await ctx.close();

    // Mobile: full-screen palette
    ctx = await newCtx({ viewport: { width: 390, height: 800 }, hasTouch: true, isMobile: true });
    page = await ctx.newPage();
    watch(page);
    await page.goto(`${origin}${BASE}`, { waitUntil: 'networkidle' });
    await page.click('.site-header [data-search-open]');
    await page.waitForSelector('[data-sp][open]', { timeout: 2000 }).catch(() => {});
    await page.waitForTimeout(300);
    const box = await page.locator('.sp-panel').boundingBox();
    check(box && box.width >= 389 && box.height >= 790, `palette is full-screen on mobile (${box && Math.round(box.width)}×${box && Math.round(box.height)})`);
    check((await page.getAttribute('#sp-input', 'placeholder')) === 'Търсете продукт', 'short placeholder on a phone');
    const closeBtn = page.locator('[data-sp-close]');
    check((await closeBtn.innerText()).trim() === 'Отказ', 'phone close button is the text "Отказ"');
    await page.fill('#sp-input', 'стъкло');
    await page.waitForTimeout(300);
    check(await page.locator('[data-sp-clear]').isVisible(), 'clear × shown next to "Отказ"');
    const inputBox = await page.locator('#sp-input').boundingBox();
    check(inputBox && inputBox.width >= 150, `input keeps room for the query (${inputBox && Math.round(inputBox.width)}px)`);
    await shot(page, 'search-2-mobile');
    await page.click('[data-sp-close]');
    check(!(await page.locator('[data-sp]').isVisible()), 'mobile close button closes');
    if (await page.locator('[data-drawer-open]').isVisible()) {
      await page.click('[data-drawer-open]');
      await page.click('[data-drawer] [data-search-open]');
      await page.waitForSelector('[data-sp][open]', { timeout: 2000 }).catch(() => {});
      check(await page.locator('[data-sp]').isVisible(), 'search in the mobile menu opens the palette');
      check((await page.evaluate(() => document.activeElement?.id)) === 'sp-input', 'palette input focused after the menu closes');
      await page.keyboard.press('Escape');
    }
    await ctx.close();

    // ------------------------------------------------------------------ 6. Search page
    console.log('\n6. Search page');
    ctx = await newCtx();
    page = await ctx.newPage();
    watch(page);
    await page.goto(`${origin}${BASE}search/?q=gilotina`, { waitUntil: 'networkidle' });
    check((await page.locator('h1').count()) === 1, 'one h1 on the search page');
    check((await page.inputValue('#s-q')) === 'gilotina', 'query copied into the field');
    await page.waitForSelector('[data-s-results] .s-item', { timeout: 4000 }).catch(() => {});
    check(((await page.locator('[data-s-results] .s-item').first().textContent()) || '').includes('Гилотина'), 'results list Гилотина first');
    check((await page.locator('[data-s-results] .s-group-h').count()) >= 1, 'results are grouped');
    check(await page.locator('[data-s-empty]').isHidden(), 'empty state hidden when there are results');
    await shot(page, 'search-3-page', true);
    await page.fill('#s-q', 'xqzvw');
    await page.waitForTimeout(300);
    check((await page.locator('[data-s-status]').textContent()).includes('Няма резултати'), 'no-results message');
    check(await page.locator('[data-s-empty]').isVisible(), 'suggestions + contact shown for no results');
    check(page.url().includes('q=xqzvw'), 'URL updated with the query');
    await page.goto(`${origin}${BASE}en/search/?q=zip`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-s-results] .s-item', { timeout: 4000 }).catch(() => {});
    check(((await page.locator('[data-s-results]').textContent()) || '').includes('ZIP'), 'EN search page finds ZIP');
    await page.goto(`${origin}${BASE}search/`, { waitUntil: 'networkidle' });
    check(await page.locator('[data-s-empty]').isVisible(), 'empty search page shows suggestions');
    await ctx.close();

    // ------------------------------------------------------------------ 7. Compact form on a product page
    console.log('\n7. Compact form on a product page');
    ctx = await newCtx();
    page = await ctx.newPage();
    watch(page);
    const res = await page.goto(`${origin}${BASE}products/sun-protection/roof-zip/`, { waitUntil: 'networkidle' });
    if (res && res.status() === 200 && (await page.locator('[data-inquiry]').count())) {
      const root = page.locator('[data-inquiry]').first();
      check(await root.evaluate((el) => el.classList.contains('iq-compact')), 'compact variant rendered');
      check(((await root.locator('[data-iq-fixed-name]').textContent()) || '').trim().length > 0, 'fixed product chip shows the product');
      check(!(await root.locator('[data-iq-select]').isVisible()), 'product select collapsed');
      check(await root.locator('[data-dims-block="roof-zip"]').isVisible(), 'roof ZIP dimensions shown for roof-zip');
      check(((await root.locator('[data-iq-svg]').getAttribute('aria-label')) || '').startsWith('Изглед отгоре'), 'roof ZIP drawn in plan on its product page');
      await root.locator('[data-iq-change]').click();
      check(await root.locator('[data-iq-select]').isVisible(), '"change product" reveals the select');
      await root.locator('[data-iq-select]').selectOption('shell-awning');
      check(await root.locator('[data-dims-block="awning"]').isVisible(), 'switching product switches the family');
      check(((await root.locator('[data-iq-fixed-name]').textContent()) || '').includes('Shell'), 'chip follows the new product');
      await root.scrollIntoViewIfNeeded();
      await shot(page, 'compact-1');
    } else console.log('  (product page not in this build — skipped)');
    await ctx.close();

    // ------------------------------------------------------------------ 8. Narrow screens
    console.log('\n8. Narrow screens: progress, contact layout, touch wording');
    for (const lang of ['bg', 'en']) {
      ctx = await newCtx({ viewport: { width: 390, height: 844 } });
      page = await ctx.newPage();
      watch(page);
      const pre = lang === 'en' ? 'en/' : '';
      await page.goto(`${origin}${BASE}${pre}contact/?product=balance`, { waitUntil: 'networkidle' });
      const bad = [];
      for (const width of [320, 360, 390, 430, 480, 520, 560, 600, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 844 });
        for (const n of [1, 2, 3]) {
          await page.locator(`${F} [data-goto="${n}"]`).click();
          const r = await page.evaluate(() => {
            const lis = [...document.querySelectorAll('#inquiry-form .iq-pi')];
            const out = [];
            lis.forEach((li, i) => {
              const box = li.getBoundingClientRect();
              li.querySelectorAll('.iq-pi-n, .iq-pi-l').forEach((el) => {
                if (getComputedStyle(el).display === 'none') return;
                const b = el.getBoundingClientRect();
                if (b.right > box.right + 0.5 || b.left < box.left - 0.5) out.push(`step ${i + 1} ${el.className} overflows by ${Math.round(b.right - box.right)}px`);
              });
            });
            const now = document.querySelector('#inquiry-form [data-iq-progress-now]');
            const labels = [...document.querySelectorAll('#inquiry-form .iq-pi-l')].filter((el) => getComputedStyle(el).display !== 'none').length;
            return { out, nowShown: !!now && getComputedStyle(now).display !== 'none', now: now ? now.textContent.replace(/\s+/g, ' ').trim() : '', labels };
          });
          r.out.forEach((o) => bad.push(`${width}px step ${n}: ${o}`));
          // either every label or none plus the one-line "Step n of 3 · label"
          if (!(r.labels === 3 || (r.labels === 0 && r.nowShown && r.now.includes(`${n} `)))) bad.push(`${width}px step ${n}: labels=${r.labels} now="${r.now}"`);
        }
        await page.locator(`${F} [data-goto="1"]`).click();
      }
      check(bad.length === 0, `${lang.toUpperCase()}: progress labels never overlap at 320–1440px${bad.length ? ' — ' + bad.slice(0, 4).join('; ') : ''}`);
      await page.setViewportSize({ width: 390, height: 844 });
      await page.locator(`${F} [data-goto="2"]`).click();
      const nowText = (await page.locator(`${F} [data-iq-progress-now]`).innerText()).replace(/\s+/g, ' ');
      check(nowText === (lang === 'bg' ? 'Стъпка 2 от 3 · Конфигурация' : 'Step 2 of 3 · Configuration'), `${lang.toUpperCase()}: one-line step label "${nowText}"`);
      if (lang === 'bg') await shot(page, 'narrow-step2');

      // contact page first screen offers the form; on phones the form comes before the map
      await page.goto(`${origin}${BASE}${pre}contact/`, { waitUntil: 'networkidle' });
      const cta = page.locator('.c-hero-cta');
      const ctaBox = await cta.boundingBox();
      check(ctaBox && ctaBox.y + ctaBox.height <= 844 && (await cta.getAttribute('href')) === '#inquiry', `${lang.toUpperCase()}: hero CTA to the form on the first screen (bottom ${ctaBox && Math.round(ctaBox.y + ctaBox.height)}px)`);
      const yForm = (await page.locator('#inquiry').boundingBox()).y;
      const yMap = (await page.locator('.c-map').boundingBox()).y;
      check(yForm < yMap, `${lang.toUpperCase()}: phones show the form before the map`);
      await cta.click();
      await page.waitForTimeout(800);
      const formTop = (await page.locator('#inquiry').boundingBox()).y;
      check(formTop > -10 && formTop < 200, `${lang.toUpperCase()}: CTA scrolls to the form (top ${Math.round(formTop)}px)`);
      await ctx.close();
    }

    // Desktop contact layout: details | map, one "open in Google Maps", plain map surface
    ctx = await newCtx();
    page = await ctx.newPage();
    watch(page);
    await page.goto(`${origin}${BASE}contact/`, { waitUntil: 'networkidle' });
    const dBox = await page.locator('.c-details').boundingBox();
    const mBox = await page.locator('.c-map').boundingBox();
    check(Math.abs(dBox.y - mBox.y) < 2 && mBox.x > dBox.x, 'desktop: details and map side by side');
    check((await page.locator('#inquiry').boundingBox()).y > mBox.y, 'desktop: form below details and map');
    check((await page.locator('a', { hasText: /Отвори в Google Maps/ }).count()) === 1, '"Отвори в Google Maps" appears once');
    check((await page.locator('.c-map-fallback').evaluate((el) => getComputedStyle(el).backgroundImage)) === 'none', 'map placeholder has a plain surface');
    check(await page.locator('.c-hero.page-hero').count() === 1, 'contact hero uses .page-hero');
    await page.goto(`${origin}${BASE}search/`, { waitUntil: 'networkidle' });
    check(await page.locator('.s-hero.page-hero').count() === 1, 'search hero uses .page-hero');
    await ctx.close();

    // Touch devices: no drag-and-drop wording
    ctx = await newCtx({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    page = await ctx.newPage();
    watch(page);
    await page.goto(`${origin}${BASE}contact/?product=balance`, { waitUntil: 'networkidle' });
    await page.locator(`${F} [data-iq-next]`).click();
    check(await page.locator(`${F} .iq-drop-coarse`).isVisible(), 'touch: "Добавете снимки от телефона" shown');
    check(!(await page.locator(`${F} .iq-drop-fine`).isVisible()), 'touch: drag-and-drop wording hidden');
    const s2h = await page.locator(`${F} section[data-step="2"]`).evaluate((el) => Math.round(el.getBoundingClientRect().height));
    check(s2h < 2000, `touch: step 2 is shorter with details folded (${s2h}px)`);
    await page.goto(`${origin}${BASE}search/`, { waitUntil: 'networkidle' });
    check((await page.getAttribute('#s-q', 'placeholder')) === 'Търсете продукт', 'search page: short placeholder on a phone');
    await ctx.close();
  } catch (e) {
    failures.push(`exception: ${e.stack || e}`);
    console.error(e);
  }

  check(errors.length === 0, `no page errors${errors.length ? ': ' + [...new Set(errors)].slice(0, 5).join(' | ') : ''}`);
  await browser.close();
  server.close();
  console.log(`\n${passed} passed, ${failures.length} failed`);
  failures.forEach((f) => console.log(' - ' + f));
  process.exit(failures.length ? 1 : 0);
});
