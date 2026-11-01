// Crawl every internal page of the built site under the real base path and report problems.
// Usage: node tests/crawl.cjs [--shots] [--only=/path/] [--widths=375,768,1440]
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE = '/Outplay_website/';
const DIST = path.resolve(__dirname, '..', 'dist');
const PORT = 4399;
const args = process.argv.slice(2);
const SHOTS = args.includes('--shots');
const ONLY = (args.find((a) => a.startsWith('--only=')) || '').slice(7);
const WIDTHS = ((args.find((a) => a.startsWith('--widths=')) || '').slice(9) || '375,768,1440').split(',').map(Number);
const OUT = path.resolve(__dirname, 'screenshots');

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.json': 'application/json', '.ico': 'image/x-icon', '.txt': 'text/plain',
};

function serve() {
  return http
    .createServer((req, res) => {
      const u = new URL(req.url, 'http://x');
      let p = decodeURIComponent(u.pathname);
      if (!p.startsWith(BASE)) { res.writeHead(404); return res.end('outside base'); }
      p = p.slice(BASE.length);
      let file = path.join(DIST, p);
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      if (!fs.existsSync(file)) {
        res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
        return res.end(fs.existsSync(path.join(DIST, '404.html')) ? fs.readFileSync(path.join(DIST, '404.html')) : 'not found');
      }
      res.writeHead(200, { 'content-type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    })
    .listen(PORT);
}

(async () => {
  const server = serve();
  const origin = `http://localhost:${PORT}`;
  const browser = await chromium.launch();
  const issues = [];
  const seen = new Set();
  const queue = ONLY ? [ONLY] : [BASE, `${BASE}en/`];
  const pages = [];
  // 1) discover pages at desktop width
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  while (queue.length) {
    const p = queue.shift();
    if (seen.has(p)) continue;
    seen.add(p);
    const res = await page.goto(origin + p, { waitUntil: 'networkidle' }).catch((e) => ({ error: e }));
    if (!res || res.error || res.status() >= 400) {
      issues.push({ page: p, type: 'status', detail: res && res.status ? res.status() : String(res && res.error) });
      continue;
    }
    pages.push(p);
    if (ONLY) continue;
    const links = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')));
    for (const href of links) {
      if (!href || /^(mailto:|tel:|viber:|https?:|#)/.test(href)) continue;
      const u = new URL(href, origin + p);
      if (!u.pathname.startsWith(BASE)) { issues.push({ page: p, type: 'link-outside-base', detail: href }); continue; }
      if (/\.(jpg|png|webp|svg|json|xml|txt)$/i.test(u.pathname)) continue;
      if (!seen.has(u.pathname)) queue.push(u.pathname);
    }
  }
  await ctx.close();

  // 2) check each page at each width
  if (SHOTS) fs.mkdirSync(OUT, { recursive: true });
  for (const w of WIDTHS) {
    const c = await browser.newContext({ viewport: { width: w, height: w < 500 ? 800 : 900 }, deviceScaleFactor: 1 });
    for (const p of pages) {
      const pg = await c.newPage();
      const errs = [];
      pg.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
      pg.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
      pg.on('requestfailed', (r) => errs.push('requestfailed: ' + r.url()));
      pg.on('response', (r) => { if (r.status() >= 400) errs.push(`${r.status()} ${r.url()}`); });
      await pg.goto(origin + p, { waitUntil: 'networkidle' });
      // scroll through to trigger lazy images / reveals
      await pg.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
        window.scrollTo(0, 0);
      });
      await pg.waitForTimeout(400);
      const r = await pg.evaluate(() => {
        const doc = document.documentElement;
        const overflow = doc.scrollWidth - doc.clientWidth;
        const wide = [];
        if (overflow > 1) {
          document.querySelectorAll('body *').forEach((el) => {
            const b = el.getBoundingClientRect();
            if (b.right > doc.clientWidth + 1 && b.width > 0 && getComputedStyle(el).position !== 'fixed') wide.push(el.tagName.toLowerCase() + '.' + [...el.classList].join('.'));
          });
        }
        const broken = [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && !i.loading?.includes('lazy')).map((i) => i.currentSrc || i.src);
        const h1 = document.querySelectorAll('h1').length;
        const noAlt = [...document.images].filter((i) => !i.hasAttribute('alt')).length;
        const title = document.title;
        return { overflow, wide: wide.slice(0, 5), broken, h1, noAlt, title };
      });
      if (r.overflow > 1) issues.push({ page: p, w, type: 'h-overflow', detail: `${r.overflow}px ${r.wide.join(' ')}` });
      if (r.broken.length) issues.push({ page: p, w, type: 'broken-img', detail: r.broken.join(', ') });
      if (r.h1 !== 1 && w === WIDTHS[0]) issues.push({ page: p, type: 'h1-count', detail: r.h1 });
      if (r.noAlt && w === WIDTHS[0]) issues.push({ page: p, type: 'img-no-alt', detail: r.noAlt });
      if (errs.length) issues.push({ page: p, w, type: 'console', detail: [...new Set(errs)].slice(0, 6).join(' | ') });
      if (SHOTS) {
        const name = (p.replace(BASE, '') || 'home').replace(/\/$/, '').replace(/\//g, '__') || 'home';
        await pg.screenshot({ path: path.join(OUT, `${name}@${w}.png`), fullPage: true });
      }
      await pg.close();
    }
    await c.close();
  }
  await browser.close();
  server.close();
  console.log(`Pages: ${pages.length}`);
  console.log(pages.join('\n'));
  console.log(`\nIssues: ${issues.length}`);
  for (const i of issues) console.log(`- [${i.type}] ${i.page}${i.w ? ' @' + i.w : ''}: ${i.detail}`);
  process.exit(issues.length ? 1 : 0);
})();
