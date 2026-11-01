// Browser-local catalogue adjustments on public pages (admin demo, this browser only). Run once per page by
// src/components/CustomProducts.astro, in this order:
//   1. admin edits of catalogue products: name / tagline / summary texts, and hidden products (their grid
//      cell and menu links disappear);
//   2. products added in the admin: a card in the grid of their category wherever that category is listed in
//      full, and a link in the header mega-menu and the mobile drawer;
//   3. ProductGrid's lead-card layout recalculated for the new number of cards (no orphan rows);
//   4. product counts marked with data-pcount updated.
// It clones existing markup, so cards and links keep the look of the components that render them.
import { loadCustomProducts, loadOverrides, type CustomProduct, type ProductOverride } from './store';

export interface CustomProductsConfig {
  /** catalogue product id → category id */
  cats: Record<string, string>;
  /** catalogue product ids per category */
  byCat: Record<string, string[]>;
  /** public page of a custom product per language: <item>?id=c-… */
  item: { bg: string; en: string };
}

type Lang = 'bg' | 'en';
const pageLang = (): Lang => (document.documentElement.lang === 'en' ? 'en' : 'bg');
const pick = (p: { bg?: string; en?: string } | undefined, lang: Lang) => (p?.[lang] || p?.bg || p?.en || '').trim();

/** "1 продукт / 5 продукта", "1 product / 5 products" (same wording as productCount in src/lib/i18n.ts) */
export function productCountText(lang: Lang, n: number): string {
  if (lang === 'bg') return `${n} ${n === 1 ? 'продукт' : 'продукта'}`;
  return `${n} ${n === 1 ? 'product' : 'products'}`;
}

/** The grid cell of a product card (ProductGrid wraps each card in .pg-item) */
const cellOf = (card: HTMLElement) => card.closest<HTMLElement>('.pg-item') ?? card;

/** Links in the header mega-menu and the mobile drawer, keyed by the category their list belongs to */
function menuLists(cfg: CustomProductsConfig): { cat: string; ul: HTMLElement }[] {
  const catOfHref = (h: string | null | undefined) => {
    if (!h) return '';
    const m = new URL(h, location.href).pathname.match(/\/products\/([^/]+)\/$/);
    return m && cfg.byCat[m[1]] ? m[1] : '';
  };
  const out: { cat: string; ul: HTMLElement }[] = [];
  document.querySelectorAll<HTMLElement>('.mega-col').forEach((col) => {
    const cat = catOfHref(col.querySelector<HTMLAnchorElement>('.mega-cat')?.getAttribute('href'));
    const ul = col.querySelector<HTMLElement>('ul');
    if (cat && ul) out.push({ cat, ul });
  });
  document.querySelectorAll<HTMLElement>('.drawer-cats details').forEach((d) => {
    const first = d.querySelector<HTMLAnchorElement>('a[href]');
    const cat = catOfHref(first?.getAttribute('href'));
    const ul = first?.closest<HTMLElement>('ul');
    if (cat && ul) out.push({ cat, ul });
  });
  return out;
}

// ---------------------------------------------------------------------------
// 1. Edits of catalogue products
// ---------------------------------------------------------------------------

function applyOverrides(
  cfg: CustomProductsConfig,
  ov: Record<string, ProductOverride>,
  lang: Lang,
  touched: Set<HTMLElement>,
): void {
  document.querySelectorAll<HTMLElement>('[data-pid][data-pfield]').forEach((el) => {
    const o = ov[el.dataset.pid ?? ''];
    const field = el.dataset.pfield as 'name' | 'tagline' | 'summary';
    const v = o?.[field]?.[lang];
    if (v) el.textContent = v;
  });
  const hidden = Object.keys(ov).filter((id) => ov[id]?.hidden && cfg.cats[id]);
  if (!hidden.length) return;
  document.querySelectorAll<HTMLElement>('[data-pcard][data-pid]').forEach((card) => {
    if (!hidden.includes(card.dataset.pid ?? '')) return;
    const cell = cellOf(card);
    card.hidden = true;
    cell.hidden = true;
    if (cell.parentElement) touched.add(cell.parentElement);
  });
  // menus: drop the links to hidden products (their pages stay reachable by direct link)
  const ends = hidden.map((id) => `/products/${cfg.cats[id]}/${id}/`);
  menuLists(cfg).forEach(({ ul }) => {
    ul.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((a) => {
      const path = new URL(a.getAttribute('href')!, location.href).pathname;
      if (ends.some((e) => path.endsWith(e))) (a.closest('li') ?? a).setAttribute('hidden', '');
    });
  });
}

// ---------------------------------------------------------------------------
// 2. Products added in the admin
// ---------------------------------------------------------------------------

function fillCard(item: HTMLElement, p: CustomProduct, lang: Lang, href: string): void {
  const card = item.matches('[data-pcard]') ? item : item.querySelector<HTMLElement>('[data-pcard]');
  if (!card) return;
  const name = pick(p.name, lang) || p.id;
  item.hidden = false;
  card.hidden = false;
  card.dataset.custom = '';
  card.classList.remove('pcard-large');
  card.classList.add('pcard-normal');
  card.querySelectorAll<HTMLElement>('[data-pid]').forEach((n) => (n.dataset.pid = p.id));
  card.dataset.pid = p.id;
  const link =
    card.querySelector<HTMLAnchorElement>('a[data-pfield="name"]') ?? card.querySelector<HTMLAnchorElement>('a[href]');
  if (link) {
    link.href = href;
    link.textContent = name;
  }
  const set = (field: string, text: string) => {
    const n = card.querySelector<HTMLElement>(`[data-pfield="${field}"]`);
    if (!n) return;
    n.textContent = text;
    n.hidden = !text;
  };
  set('tagline', pick(p.tagline, lang));
  set('summary', pick(p.summary, lang));
  const img = card.querySelector<HTMLImageElement>('img');
  const main = (p.images ?? [])[0];
  if (img && main) {
    img.closest('picture')?.querySelectorAll('source').forEach((s) => s.remove());
    img.removeAttribute('srcset');
    img.removeAttribute('sizes');
    img.removeAttribute('fetchpriority');
    // the photo is a local data URL: nothing to save by lazy-loading it
    img.loading = 'eager';
    img.src = main;
    img.alt = name;
    img.style.objectPosition = '';
  } else {
    // no photo: the media box keeps its dark plate
    (img?.closest('picture') ?? img)?.remove();
  }
}

function addCustomProducts(
  cfg: CustomProductsConfig,
  list: CustomProduct[],
  lang: Lang,
  touched: Set<HTMLElement>,
): void {
  if (!list.length) return;
  const href = (p: CustomProduct) => `${cfg.item[lang]}?id=${encodeURIComponent(p.id)}`;

  // A grid "lists a category" when its cards all belong to it and, together with the category's other grids on
  // the page, it shows the whole category (so related-product strips are left alone).
  const grids = new Map<HTMLElement, { cats: Set<string>; pids: string[]; items: HTMLElement[] }>();
  document.querySelectorAll<HTMLElement>('[data-pcard][data-pid]').forEach((card) => {
    const pid = card.dataset.pid ?? '';
    if (!cfg.cats[pid]) return;
    const item = cellOf(card);
    const grid = item.parentElement;
    if (!grid) return;
    const g = grids.get(grid) ?? { cats: new Set<string>(), pids: [], items: [] };
    g.cats.add(cfg.cats[pid]);
    g.pids.push(pid);
    g.items.push(item);
    grids.set(grid, g);
  });
  for (const [cat, all] of Object.entries(cfg.byCat)) {
    const mine = list.filter((p) => p.category === cat);
    if (!mine.length) continue;
    const own = Array.from(grids.entries()).filter(([, g]) => g.cats.size === 1 && g.cats.has(cat));
    const shown = new Set(own.flatMap(([, g]) => g.pids));
    if (!own.length || !all.every((id) => shown.has(id))) continue;
    const [grid, g] = own[own.length - 1];
    const sample = g.items[g.items.length - 1];
    for (const p of mine) {
      if (grid.querySelector(`[data-pcard][data-pid="${CSS.escape(p.id)}"]`)) continue;
      const clone = sample.cloneNode(true) as HTMLElement;
      fillCard(clone, p, lang, href(p));
      grid.appendChild(clone);
    }
    touched.add(grid);
  }

  // header mega-menu and mobile drawer: one more link in the category's list
  menuLists(cfg).forEach(({ cat, ul }) => {
    const sample = Array.from(ul.children)
      .filter((li) => li.querySelector('a') && !li.querySelector('a.drawer-all'))
      .pop() as HTMLElement | undefined;
    if (!sample) return;
    for (const p of list.filter((x) => x.category === cat)) {
      if (ul.querySelector(`[data-custom-link="${CSS.escape(p.id)}"]`)) continue;
      const li = sample.cloneNode(true) as HTMLElement;
      li.hidden = false;
      const a = li.querySelector<HTMLAnchorElement>('a')!;
      a.href = href(p);
      a.textContent = pick(p.name, lang) || p.id;
      a.removeAttribute('aria-current');
      a.dataset.customLink = p.id;
      ul.appendChild(li);
    }
  });
}

// ---------------------------------------------------------------------------
// 3. ProductGrid layout
// ---------------------------------------------------------------------------

/** ProductGrid promotes its first card depending on the count (no orphan rows); redo it for the visible cards */
export function relayoutGrid(grid: HTMLElement): void {
  if (!grid.classList.contains('pgrid')) return;
  const items = (Array.from(grid.children) as HTMLElement[]).filter(
    (c) => !c.hidden && !c.querySelector<HTMLElement>('[data-pcard]')?.hidden,
  );
  const n = items.length;
  const lead3 = n % 3 === 2 ? 'span2' : n % 3 === 1 ? 'full' : 'none';
  const lead2 = n % 2 === 1 ? 'full' : 'none';
  grid.dataset.lead3 = lead3;
  grid.dataset.lead2 = lead2;
  const hasLead = lead3 !== 'none' || lead2 !== 'none';
  items.forEach((it, i) => {
    const card = it.querySelector<HTMLElement>('[data-pcard]') ?? it;
    card.classList.toggle('pcard-large', i === 0 && hasLead);
    card.classList.toggle('pcard-normal', !(i === 0 && hasLead));
  });
}

// ---------------------------------------------------------------------------
// 4. Counts
// ---------------------------------------------------------------------------

/**
 * Elements with data-pcount="<category id>|all" and data-pcount-n="<build-time count>" get the count for this
 * browser. data-pcount-mode: "phrase" (default, "5 продукта"), "num" ("5"), or "label" (data-one / data-many text).
 * Products-index filter buttons ([data-filter-btn] with data-count) are kept in step as well.
 */
function updateCounts(cfg: CustomProductsConfig, delta: Record<string, number>, lang: Lang): void {
  const total = Object.values(delta).reduce((a, b) => a + b, 0);
  const diff = (key: string) => (key === 'all' ? total : (delta[key] ?? 0));
  if (Object.values(delta).every((d) => !d)) return;
  document.querySelectorAll<HTMLElement>('[data-pcount]').forEach((el) => {
    const key = el.dataset.pcount ?? '';
    if (key !== 'all' && !cfg.byCat[key]) return;
    const n = Math.max(0, (Number(el.dataset.pcountN) || 0) + diff(key));
    const mode = el.dataset.pcountMode ?? 'phrase';
    el.textContent =
      mode === 'num' ? String(n) : mode === 'label' ? ((n === 1 ? el.dataset.one : el.dataset.many) ?? '') : productCountText(lang, n);
  });
  document.querySelectorAll<HTMLElement>('[data-filter-btn][data-count]').forEach((btn) => {
    const key = btn.dataset.filterBtn ?? '';
    if (key !== 'all' && !cfg.byCat[key]) return;
    const base = Number(btn.dataset.countBase ?? btn.dataset.count) || 0;
    btn.dataset.countBase = String(base);
    btn.dataset.count = String(Math.max(0, base + diff(key)));
  });
}

// ---------------------------------------------------------------------------

export function applyCatalogue(cfg: CustomProductsConfig): void {
  const lang = pageLang();
  const ov = loadOverrides() ?? {};
  const added = loadCustomProducts()
    .filter((p) => !p.hidden && p.category && cfg.byCat[p.category])
    .sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
  const touched = new Set<HTMLElement>();
  applyOverrides(cfg, ov, lang, touched);
  addCustomProducts(cfg, added, lang, touched);
  touched.forEach(relayoutGrid);
  const delta: Record<string, number> = {};
  for (const cat of Object.keys(cfg.byCat)) {
    const hiddenHere = cfg.byCat[cat].filter((id) => ov[id]?.hidden).length;
    delta[cat] = added.filter((p) => p.category === cat).length - hiddenHere;
  }
  updateCounts(cfg, delta, lang);
}

/** Kept for older callers and the test harness */
export const injectCustomProducts = applyCatalogue;
