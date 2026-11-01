// Screenshot one page of a build served under the real base path.
// Usage: DIST=<build dir> node tests/shot.cjs /Outplay_website/en/faq/ out.png [width=1440] [height=900] [full=1]
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const BASE = '/Outplay_website/';
const DIST = path.resolve(process.env.DIST || path.join(__dirname, '..', 'dist'));
const [, , route = BASE, out = 'shot.png', w = '1440', h = '900', full = '1'] = process.argv;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (!p.startsWith(BASE)) { res.writeHead(404); return res.end(); }
  let f = path.join(DIST, p.slice(BASE.length));
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end('404'); }
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(0, async () => {
  const port = server.address().port;
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: +w, height: +h } });
  const errs = [];
  pg.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  pg.on('pageerror', (e) => errs.push(e.message));
  await pg.goto(`http://localhost:${port}${route}`, { waitUntil: 'networkidle' });
  if (full === '1') await pg.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); } scrollTo(0, 0); });
  await pg.waitForTimeout(1500);
  await pg.screenshot({ path: out, fullPage: full === '1' });
  console.log('saved', out, '| console errors:', errs.length ? errs.join(' | ') : 'none');
  await b.close(); server.close();
});
