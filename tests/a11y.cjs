// Run axe-core (WCAG 2.1 A/AA) on every page of the build. Usage: DIST=<build> node tests/a11y.cjs [--width=1440]
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE = '/Outplay_website/';
const DIST = path.resolve(process.env.DIST || path.join(__dirname, '..', 'dist'));
const WIDTH = Number((process.argv.find((a) => a.startsWith('--width=')) || '--width=1440').slice(8));
const AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json' };

// every built page
function pages() {
  const out = [];
  (function walk(d) {
    for (const f of fs.readdirSync(d)) {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) { if (f !== '_astro') walk(p); }
      else if (f === 'index.html') out.push(BASE + path.relative(DIST, d).split(path.sep).join('/') + (d === DIST ? '' : '/'));
    }
  })(DIST);
  return out.map((p) => p.replace(/\/+$/, '/')).sort();
}

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
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: WIDTH, height: 900 } });
  const byRule = new Map();
  const list = pages();
  for (const p of list) {
    const pg = await ctx.newPage();
    await pg.route(/google\.com|gstatic|youtube/, (r) => r.abort());
    await pg.goto(`http://localhost:${port}${p}`, { waitUntil: 'networkidle' });
    await pg.addScriptTag({ content: AXE });
    const res = await pg.evaluate(async () => {
      // eslint-disable-next-line no-undef
      const r = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] }, resultTypes: ['violations'] });
      return r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.map((n) => n.target.join(' ') + ' :: ' + (n.failureSummary || '').split('\n').slice(1, 2).join(' ')).slice(0, 4), count: v.nodes.length }));
    });
    for (const v of res) {
      const e = byRule.get(v.id) || { ...v, pages: [], total: 0 };
      e.pages.push(p.replace(BASE, '/'));
      e.total += v.count;
      byRule.set(v.id, e);
    }
    await pg.close();
  }
  await browser.close();
  server.close();
  console.log(`axe @${WIDTH}px — ${list.length} pages, ${byRule.size} rules violated`);
  for (const v of [...byRule.values()].sort((a, b) => b.total - a.total)) {
    console.log(`\n[${v.impact}] ${v.id}: ${v.help} — ${v.total} nodes on ${v.pages.length} pages`);
    console.log('  pages: ' + v.pages.slice(0, 6).join(', ') + (v.pages.length > 6 ? ' …' : ''));
    v.nodes.forEach((n) => console.log('  - ' + n.slice(0, 220)));
  }
  process.exit(byRule.size ? 1 : 0);
});
