// Link & anchor audit for the built site, served under the real base path.
// Usage: DIST=<build dir> [PORT=4432] node tests/links.cjs [--verbose]
//
// Checks, for every built HTML page (rendered in Chromium so JS-adjusted links count too):
//  1. every internal href/src-like link resolves to a file in DIST (query strings stripped);
//  2. every #fragment exists as an id/name on the target page (same-page and cross-page);
//  3. ?product=<id> links name a real product, and loading them preselects that product in the inquiry form;
//  4. every product page's quote CTAs ("Request a quote" / "Get a quote" / "Inquiry") preselect that product;
//  5. the header/drawer/footer language switch goes to the same route in the other language;
//  6. <link rel=canonical> and hreflang bg/en/x-default are absolute, correct and mutually consistent;
//  7. nothing points outside /Outplay_website/ except the allowed external hosts/schemes;
//  8. every URL in search-index.json resolves.
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE = '/Outplay_website/';
const SITE = 'https://dito94.github.io';
const DIST = process.env.DIST ? path.resolve(process.env.DIST) : path.resolve(__dirname, '..', 'dist');
const PORT = Number(process.env.PORT || 4432);
const VERBOSE = process.argv.includes('--verbose');

// External destinations that are intended (anything else is reported).
const ALLOWED_EXTERNAL = [
  /^tel:\+?\d+$/,
  /^mailto:[^@\s]+@[^@\s]+$/,
  /^viber:\/\//,
  /^https:\/\/(www\.)?outplay\.bg(\/|$)/,
  /^https:\/\/(www\.)?google\.[a-z.]+\/maps/,
  /^https:\/\/maps\.google\.[a-z.]+\//,
  /^https:\/\/(www\.)?google\.com\/maps/,
  /^https:\/\/maps\.app\.goo\.gl\//,
  /^https:\/\/goo\.gl\/maps\//,
  /^https:\/\/(www\.)?youtube(-nocookie)?\.com\//,
  /^https:\/\/youtu\.be\//,
];
const QUOTE_TEXT = /^(Направете запитване|Запитване|Изпратете запитване|Request a quote|Get a quote|Inquiry|Send an inquiry)$/i;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.json': 'application/json', '.ico': 'image/x-icon', '.txt': 'text/plain',
};

/** Map a site pathname to a file in DIST (or null). */
function fileFor(pathname) {
  if (!pathname.startsWith(BASE)) return null;
  let rel = decodeURIComponent(pathname.slice(BASE.length));
  let f = path.join(DIST, rel);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  return fs.existsSync(f) && fs.statSync(f).isFile() ? f : null;
}

function serve() {
  return http
    .createServer((req, res) => {
      const u = new URL(req.url, 'http://x');
      const f = fileFor(u.pathname);
      if (!f) {
        res.writeHead(404, { 'content-type': 'text/plain' });
        return res.end('not found');
      }
      res.writeHead(200, { 'content-type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(res);
    })
    .listen(PORT);
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}
const routeOfFile = (f) => {
  const rel = path.relative(DIST, f).split(path.sep).join('/');
  return BASE + (rel === 'index.html' ? '' : rel.endsWith('/index.html') ? rel.slice(0, -'index.html'.length) : rel);
};
/** language-neutral route: /Outplay_website/en/faq/ → /faq/ */
const neutral = (p) => '/' + p.slice(BASE.length).replace(/^en(\/|$)/, '');
const langOf = (p) => (p.startsWith(BASE + 'en/') || p === BASE + 'en/' ? 'en' : 'bg');
const inLang = (route, lang) => BASE + (lang === 'en' ? 'en/' : '') + route.replace(/^\//, '');

(async () => {
  const server = serve();
  const origin = `http://localhost:${PORT}`;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  // Block third-party requests: maps/YouTube are unreachable here and only slow the load down.
  await ctx.route(/^(?!http:\/\/localhost)/, (r) => r.abort());
  const page = await ctx.newPage();

  const failures = [];
  const fail = (type, where, detail) => failures.push({ type, where, detail });
  const warnings = [];
  const warn = (type, where, detail) => warnings.push({ type, where, detail });
  const files = walk(DIST).sort();
  const routes = files.map(routeOfFile);
  const ids = new Map(); // route → Set(ids)
  const linksByPage = new Map(); // route → [{href, text, ctx}]
  const externals = new Map(); // href → Set(pages)
  const productIds = new Set();

  const products = JSON.parse(fs.readFileSync(path.join(DIST, 'search-index.json'), 'utf8'));

  // ---------------------------------------------------------------- 1) render every page and collect
  for (const route of routes) {
    const res = await page.goto(origin + route, { waitUntil: 'load' }).catch((e) => ({ err: e }));
    if (!res || res.err || res.status() >= 400) {
      fail('page-status', route, res && res.status ? res.status() : String(res && res.err));
      continue;
    }
    await page.waitForTimeout(80);
    const data = await page.evaluate(() => {
      const zone = (el) =>
        el.closest('.site-header [data-drawer], .drawer, #drawer') ? 'drawer'
        : el.closest('.site-header') ? 'header' : el.closest('footer') ? 'footer' : 'main';
      return {
        ids: [...document.querySelectorAll('[id]')].map((e) => e.id).concat([...document.querySelectorAll('a[name]')].map((a) => a.name)),
        links: [...document.querySelectorAll('a[href], area[href]')].map((a) => ({
          href: a.getAttribute('href'),
          abs: a.href,
          text: (a.textContent || '').replace(/\s+/g, ' ').trim(),
          hreflang: a.getAttribute('hreflang'),
          zone: zone(a),
          inSwitch: !!a.closest('[class*="lang"], [data-lang-switch], [aria-label="Език"], [aria-label="Language"]'),
          inForm: !!a.closest('form'),
        })),
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null,
        alternates: Object.fromEntries([...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((l) => [l.getAttribute('hreflang'), l.getAttribute('href')])),
        ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute('content') ?? null,
        htmlLang: document.documentElement.lang,
        formProduct: document.querySelector('[data-product]')?.getAttribute('data-product') ?? null,
        selectProduct: document.querySelector('#inquiry select[name="product"], select[name="product"]')?.value ?? null,
      };
    });
    ids.set(route, new Set(data.ids));
    linksByPage.set(route, data);

    // duplicate ids break fragment targets
    const dup = data.ids.filter((x, i, a) => x && a.indexOf(x) !== i);
    if (dup.length) fail('duplicate-id', route, [...new Set(dup)].join(', '));

    // html lang
    const expectLang = route.endsWith('404.html') ? null : langOf(route);
    if (expectLang && data.htmlLang !== expectLang) fail('html-lang', route, `lang="${data.htmlLang}" expected ${expectLang}`);

    // ---- canonical / hreflang
    if (!route.endsWith('404.html')) {
      const want = SITE + route;
      if (data.canonical !== want) fail('canonical', route, `${data.canonical} ≠ ${want}`);
      if (data.ogUrl !== want) fail('og:url', route, `${data.ogUrl} ≠ ${want}`);
      const n = neutral(route);
      const wantBg = SITE + inLang(n, 'bg');
      const wantEn = SITE + inLang(n, 'en');
      if (data.alternates.bg !== wantBg) fail('hreflang', route, `bg=${data.alternates.bg} ≠ ${wantBg}`);
      if (data.alternates.en !== wantEn) fail('hreflang', route, `en=${data.alternates.en} ≠ ${wantEn}`);
      if (data.alternates['x-default'] !== wantBg) fail('hreflang', route, `x-default=${data.alternates['x-default']} ≠ ${wantBg}`);
      for (const [hl, href] of Object.entries(data.alternates)) {
        if (href && href.startsWith(SITE + BASE) && !fileFor(href.slice(SITE.length))) fail('hreflang-target', route, `${hl} → ${href} (no such page)`);
      }
    } else {
      // A 404 page should not claim a canonical URL of its own (it is served for many URLs)
      if (data.canonical) fail('canonical-404', route, `404 page declares canonical ${data.canonical} and hreflang ${JSON.stringify(data.alternates)}`);
    }

    // ---- language switches (header tools, drawer, footer): every link with hreflang/aria-current inside a switch
    if (!route.endsWith('404.html')) {
      const other = langOf(route) === 'bg' ? 'en' : 'bg';
      const wantOther = inLang(neutral(route), other);
      const wantSame = route;
      const sw = data.links.filter((l) => /^(BG|EN|Български|English)$/.test(l.text));
      if (!sw.length) fail('lang-switch', route, 'no language switch links found');
      for (const l of sw) {
        const target = /^(EN|English)$/.test(l.text) ? 'en' : 'bg';
        const want = target === langOf(route) ? wantSame : wantOther;
        if (l.href !== want) fail('lang-switch', route, `[${l.zone}] "${l.text}" → ${l.href} expected ${want}`);
      }
    }
  }

  // ---------------------------------------------------------------- 2) validate every link
  const queryChecks = new Map(); // full internal URL with ?product= → page
  for (const [route, data] of linksByPage) {
    for (const l of data.links) {
      const href = l.href;
      if (!href) {
        fail('empty-href', route, `"${l.text}"`);
        continue;
      }
      if (href.startsWith('javascript:')) {
        fail('js-href', route, href);
        continue;
      }
      let u;
      try {
        u = new URL(href, origin + route);
      } catch {
        fail('bad-url', route, href);
        continue;
      }
      const internal = u.origin === origin || (u.origin === SITE && u.pathname.startsWith(BASE));
      if (!internal) {
        if (u.origin === SITE && !u.pathname.startsWith(BASE)) {
          fail('outside-base', route, href);
          continue;
        }
        const ok = ALLOWED_EXTERNAL.some((re) => re.test(href));
        if (!externals.has(href)) externals.set(href, new Set());
        externals.get(href).add(route);
        if (!ok) fail('external-not-allowed', route, `${href} ("${l.text}")`);
        continue;
      }
      // internal
      if (!u.pathname.startsWith(BASE)) {
        fail('outside-base', route, href);
        continue;
      }
      if (/^\/Outplay_website\/[^?#]*[^/?#]$/.test(u.pathname) && !/\.[a-z0-9]+$/i.test(u.pathname)) {
        fail('no-trailing-slash', route, href);
      }
      const targetFile = fileFor(u.pathname);
      if (!targetFile) {
        fail('broken-link', route, `${href} ("${l.text}")`);
        continue;
      }
      const targetRoute = routeOfFile(targetFile);
      // language consistency: internal page links should stay in the page's language (except the switch)
      if (targetFile.endsWith('.html') && !route.endsWith('404.html')) {
        const isSwitch = /^(BG|EN|Български|English)$/.test(l.text);
        if (!isSwitch && langOf(targetRoute) !== langOf(route)) fail('cross-language-link', route, `${href} ("${l.text}") [${l.zone}]`);
      }
      // fragment (the admin demo uses #routes handled in JS, not element ids)
      if (u.hash && u.hash.length > 1 && !/\/admin\/$/.test(targetRoute)) {
        const frag = decodeURIComponent(u.hash.slice(1));
        const set = ids.get(targetRoute);
        if (set && !set.has(frag)) fail('missing-anchor', route, `${href} → #${frag} not on ${targetRoute} ("${l.text}")`);
      }
      // query params
      for (const [k, v] of u.searchParams) {
        if (k === 'product') {
          queryChecks.set(u.pathname + u.search + u.hash, route);
        } else if (k === 'c' || k === 'category') {
          const cats = ['bioclimatic-pergolas', 'glass-systems', 'sun-protection', 'windbreaks', 'all'];
          if (!cats.includes(v)) fail('bad-query', route, `${href}: ${k}=${v}`);
        } else if (k !== 'q') {
          fail('unknown-query', route, href);
        }
      }
    }
  }

  // ---------------------------------------------------------------- 3) product pages: quote CTAs preselect the product
  const productRoutes = routes.filter((r) => /\/products\/[^/]+\/[^/]+\/$/.test(r));
  for (const route of productRoutes) {
    const pid = route.split('/').filter(Boolean).pop();
    productIds.add(pid);
    const data = linksByPage.get(route);
    if (!data) continue;
    if (data.formProduct !== pid) fail('quote-preselect', route, `embedded form data-product="${data.formProduct}" expected ${pid}`);
    if (data.selectProduct !== pid) fail('quote-preselect', route, `embedded form select value="${data.selectProduct}" expected ${pid}`);
    const all = data.links.filter((l) => QUOTE_TEXT.test(l.text) || /#inquiry$/.test(l.href) || /[?&]product=/.test(l.href));
    // header/drawer/footer quote buttons are site-wide; reported separately as a warning
    const global = all.filter((l) => l.zone !== 'main');
    const ctas = all.filter((l) => l.zone === 'main');
    for (const l of global) {
      const u = new URL(l.href, origin + route);
      if (u.pathname !== route && u.searchParams.get('product') !== pid) warn('global-quote-cta', route, `[${l.zone}] "${l.text}" → ${l.href} (product not preselected)`);
    }
    if (!ctas.length) fail('quote-cta', route, 'no quote CTA found');
    for (const l of ctas) {
      const u = new URL(l.href, origin + route);
      const sameDoc = u.pathname === route;
      if (sameDoc) {
        if (u.hash !== '#inquiry') fail('quote-cta', route, `"${l.text}" → ${l.href} (same page, not #inquiry)`);
      } else if (u.pathname.endsWith('/contact/')) {
        if (u.searchParams.get('product') !== pid) fail('quote-cta', route, `"${l.text}" → ${l.href} does not preselect ${pid}`);
      } else if (QUOTE_TEXT.test(l.text)) {
        fail('quote-cta', route, `"${l.text}" → ${l.href} goes neither to #inquiry nor to contact with ?product=${pid}`);
      }
    }
    if (VERBOSE) console.log(`  ${route}: ${ctas.length} quote CTAs → ${[...new Set(ctas.map((c) => c.href))].join(' | ')}`);
  }

  // ---------------------------------------------------------------- 4) ?product= links really preselect (plus one per product for both langs)
  for (const pid of productIds) for (const l of ['bg', 'en']) queryChecks.set(inLang(`/contact/?product=${pid}#inquiry`, l), 'synthetic');
  // fresh storage on every load so a saved draft cannot influence the preselection
  const qctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await qctx.route(/^(?!http:\/\/localhost)/, (r) => r.abort());
  await qctx.addInitScript(() => {
    try { localStorage.clear(); sessionStorage.clear(); } catch {}
  });
  const qpage = await qctx.newPage();
  for (const [href, from] of queryChecks) {
    const u = new URL(href, origin);
    const pid = u.searchParams.get('product');
    if (!productIds.has(pid)) {
      fail('bad-product-query', from, `${href}: unknown product "${pid}"`);
      continue;
    }
    await qpage.goto('about:blank');
    await qpage.goto(origin + href, { waitUntil: 'load' });
    await qpage.waitForTimeout(1800); // the page smooth-scrolls to the hash
    const page = qpage;
    const v = await page.evaluate(() => document.querySelector('select[name="product"]')?.value ?? null);
    if (v !== pid) fail('query-preselect', from, `${href}: select value "${v}" expected "${pid}"`);
    // and the visitor should land on the form
    const inView = await page.evaluate(() => {
      const el = document.getElementById('inquiry');
      if (!el) return 'no #inquiry';
      const r = el.getBoundingClientRect();
      return r.top < innerHeight && r.bottom > 0 ? 'ok' : `top=${Math.round(r.top)}`;
    });
    if (inView !== 'ok') fail('query-scroll', from, `${href}: #inquiry not in view after load (${inView})`);
  }

  // ---------------------------------------------------------------- 5) search index URLs
  const flat = [];
  (function collect(o) {
    if (Array.isArray(o)) o.forEach(collect);
    else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) (k === 'url' || k === 'href') && typeof v === 'string' ? flat.push(v) : collect(v);
  })(products);
  for (const h of flat) {
    const u = new URL(h, origin);
    const f = fileFor(u.pathname);
    if (!f) fail('search-index', 'search-index.json', `${h} does not resolve`);
    else if (u.hash.length > 1 && !ids.get(routeOfFile(f))?.has(decodeURIComponent(u.hash.slice(1)))) fail('search-index', 'search-index.json', `${h} anchor missing`);
  }

  await browser.close();
  server.close();

  // ---------------------------------------------------------------- report
  console.log(`Pages checked: ${routes.length} · internal links: ${[...linksByPage.values()].reduce((n, d) => n + d.links.length, 0)} · ?product= URLs: ${queryChecks.size} · search-index URLs: ${flat.length}`);
  console.log('External destinations:');
  for (const [h, pages] of [...externals].sort()) console.log(`  ${ALLOWED_EXTERNAL.some((re) => re.test(h)) ? 'ok ' : 'BAD'} ${h}  (${pages.size} pages)`);
  if (warnings.length) {
    const byT = {};
    for (const w of warnings) (byT[w.type] ||= []).push(w);
    for (const [type, list] of Object.entries(byT)) {
      const uniq = [...new Set(list.map((w) => w.detail.replace(/\/(en\/)?contact\/.*$/, '/…contact/#inquiry')))];
      console.log(`\nWARN [${type}] ×${list.length} on ${new Set(list.map((w) => w.where)).size} pages, e.g. ${uniq.slice(0, 4).join(' · ')}`);
    }
  }
  if (!failures.length) {
    console.log('\nPASS — no link/anchor problems found');
    process.exit(0);
  }
  const byType = {};
  for (const f of failures) (byType[f.type] ||= []).push(f);
  console.log(`\nFAIL — ${failures.length} problems`);
  for (const [type, list] of Object.entries(byType)) {
    console.log(`\n[${type}] ×${list.length}`);
    const seen = new Set();
    for (const f of list) {
      const key = `${f.where} ${f.detail}`;
      if (seen.has(key)) continue;
      seen.add(key);
      console.log(`  ${f.where}  ${f.detail}`);
    }
  }
  process.exit(1);
})().catch((e) => {
  console.error(e);
  process.exit(2);
});
