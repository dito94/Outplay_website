// Browser-local catalogue adjustments on public pages (admin demo, this browser only). Run once per page by
// src/components/CustomProducts.astro, in this order:
//   1. admin edits of catalogue products: name / tagline / summary everywhere the product is named (elements
//      marked data-pid + data-pfield, the page title, link labels), and hidden products (their grid cells,
//      menu links, list entries and links to their page disappear);
//   2. products added in the admin: a card in the grid of their category (and subgroup) wherever that category
//      is listed in full, a link in the header mega-menu and the mobile drawer, an entry in the category's
//      product lists (category hero, home tile);
//   3. tidy-up: ProductGrid's lead-card layout recalculated, empty grids / menu columns hidden;
//   4. product counts marked with data-pcount updated ("Скоро" / "Coming soon" instead of zero).
// It clones existing markup, so cards and links keep the look of the components that render them.
import { loadCustomProducts, loadOverrides, type CustomProduct, type ProductOverride } from './store';

type Pair = { bg: string; en: string };
export interface CustomProductsConfig {
  /** catalogue product id → category id */
  cats: Record<string, string>;
  /** catalogue product ids per category */
  byCat: Record<string, string[]>;
  /** public page of a custom product per language: <item>?id=c-… */
  item: { bg: string; en: string };
  /** catalogue product names */
  names?: Record<string, Pair>;
  /** subgroups per category with their catalogue product ids */
  subgroups?: Record<string, { id: string; productIds: string[] }[]>;
}

type Lang = 'bg' | 'en';
const pageLang = (): Lang => (document.documentElement.lang === 'en' ? 'en' : 'bg');
const pick = (p: { bg?: string; en?: string } | undefined, lang: Lang) => (p?.[lang] || p?.bg || p?.en || '').trim();
const SOON: Record<Lang, string> = { bg: 'Скоро', en: 'Coming soon' };

/** "1 продукт / 5 продукта", "1 product / 5 products" (same wording as productCount in src/lib/i18n.ts) */
export function productCountText(lang: Lang, n: number): string {
  if (n === 0) return SOON[lang];
  if (lang === 'bg') return `${n} ${n === 1 ? 'продукт' : 'продукта'}`;
  return `${n} ${n === 1 ? 'product' : 'products'}`;
}

/** The grid cell of a product card (ProductGrid wraps each card in .pg-item) */
const cellOf = (card: HTMLElement) => card.closest<HTMLElement>('.pg-item') ?? card;
const isShown = (el: Element) => !(el as HTMLElement).hidden;

interface Ctx {
  cfg: CustomProductsConfig;
  lang: Lang;
  ov: Record<string, ProductOverride>;
  hidden: Set<string>;
  added: CustomProduct[];
  /** product grids whose cards changed */
  grids: Set<HTMLElement>;
  /** lists of product names that changed (home tiles) */
  lists: Set<HTMLElement>;
  href: (p: CustomProduct) => string;
}

/** Category of a /products/<category>/ link, '' for anything else */
function catOfHref(cfg: CustomProductsConfig, h: string | null | undefined): string {
  if (!h) return '';
  const m = new URL(h, location.href).pathname.match(/\/products\/([^/]+)\/$/);
  return m && cfg.byCat[m[1]] ? m[1] : '';
}
/** Catalogue product of a /products/<category>/<id>/ link, '' for anything else */
function pidOfHref(cfg: CustomProductsConfig, h: string | null | undefined): string {
  if (!h || h.startsWith('#')) return '';
  const m = new URL(h, location.href).pathname.match(/\/products\/([^/]+)\/([^/]+)\/$/);
  return m && cfg.cats[m[2]] === m[1] ? m[2] : '';
}

/** Header mega-menu columns and mobile drawer groups, with the category of each */
function menuLists(cfg: CustomProductsConfig): { cat: string; ul: HTMLElement; box: HTMLElement }[] {
  const out: { cat: string; ul: HTMLElement; box: HTMLElement }[] = [];
  document.querySelectorAll<HTMLElement>('.mega-col').forEach((col) => {
    const cat = catOfHref(cfg, col.querySelector<HTMLAnchorElement>('.mega-cat')?.getAttribute('href'));
    const ul = col.querySelector<HTMLElement>('ul');
    if (cat && ul) out.push({ cat, ul, box: col });
  });
  document.querySelectorAll<HTMLElement>('.drawer-cats details').forEach((d) => {
    const first = d.querySelector<HTMLAnchorElement>('a[href]');
    const cat = catOfHref(cfg, first?.getAttribute('href'));
    const ul = first?.closest<HTMLElement>('ul');
    if (cat && ul) out.push({ cat, ul, box: d.closest<HTMLElement>('li') ?? d });
  });
  return out;
}

// ---------------------------------------------------------------------------
// 1. Edits of catalogue products
// ---------------------------------------------------------------------------

function applyEdits(x: Ctx): void {
  const { ov, lang, cfg } = x;
  // texts marked with data-pid + data-pfield (cards, product page, breadcrumbs, sub-nav, menus, lists, captions)
  document.querySelectorAll<HTMLElement>('[data-pid][data-pfield]').forEach((el) => {
    const o = ov[el.dataset.pid ?? ''];
    const field = el.dataset.pfield as 'name' | 'tagline' | 'summary';
    const v = o?.[field]?.[lang];
    if (v) el.textContent = v;
  });
  const renamed = Object.keys(ov).filter((id) => ov[id]?.name?.[lang] && cfg.names?.[id]?.[lang]);
  if (renamed.length) {
    const swap = (text: string, id: string) => text.split(cfg.names![id][lang]).join(ov[id].name![lang]!);
    // link labels that spell the name out (gallery captions)
    document.querySelectorAll<HTMLElement>('a[data-pid][aria-label]').forEach((a) => {
      const id = a.dataset.pid ?? '';
      if (renamed.includes(id)) a.setAttribute('aria-label', swap(a.getAttribute('aria-label') ?? '', id));
    });
    // the product page's own title
    const h1 = document.querySelector<HTMLElement>('h1[data-pid][data-pfield="name"]');
    const id = h1?.dataset.pid ?? '';
    if (renamed.includes(id)) {
      const before = document.title;
      document.title = before.includes(cfg.names![id][lang]) ? swap(before, id) : `${ov[id].name![lang]} · OUTPLAY`;
    }
  }
  // hotspot cards repeat the product summary
  document.querySelectorAll<HTMLElement>('.hs-card').forEach((card) => {
    const id = pidOfHref(cfg, card.querySelector('a[href]')?.getAttribute('href'));
    const v = id ? ov[id]?.summary?.[lang] : '';
    const text = card.querySelector<HTMLElement>('.hs-text');
    if (v && text) text.textContent = v;
  });
}

function hideProducts(x: Ctx): void {
  const { hidden, cfg } = x;
  if (!hidden.size) return;
  // grid cards: the whole cell, so no empty cell is left
  document.querySelectorAll<HTMLElement>('[data-pcard][data-pid]').forEach((card) => {
    if (!hidden.has(card.dataset.pid ?? '')) return;
    const cell = cellOf(card);
    card.hidden = true;
    cell.hidden = true;
    if (cell.parentElement) x.grids.add(cell.parentElement);
  });
  // named entries: menu links, category hero list, home tile lists
  document.querySelectorAll<HTMLElement>('[data-pid][data-pfield="name"]').forEach((el) => {
    if (!hidden.has(el.dataset.pid ?? '')) return;
    const list = el.closest<HTMLElement>('[data-plist]');
    if (list) {
      el.hidden = true;
      x.lists.add(list);
      return;
    }
    const li = el.closest('li');
    if (li && el.closest('.mega-col, .drawer-cats, .c-jump')) li.hidden = true;
  });
  // any other link to a hidden product's page (feature links, gallery captions, hotspots); the admin keeps its own
  document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((a) => {
    if (a.hasAttribute('hreflang') || a.closest('[data-adm], [hidden]')) return;
    const id = pidOfHref(cfg, a.getAttribute('href'));
    if (!id || !hidden.has(id)) return;
    const legendRow = a.closest('.scene-legend li');
    if (legendRow) {
      // keep the numbered row (it matches a dot on the picture), without the link
      const span = document.createElement('span');
      a.querySelectorAll('svg').forEach((s) => s.remove());
      span.append(...Array.from(a.childNodes));
      a.replaceWith(span);
      return;
    }
    a.hidden = true;
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

/** Subgroup of an added product: its own when valid, else the category's first */
function subgroupOf(cfg: CustomProductsConfig, p: CustomProduct): { id: string; productIds: string[] } | undefined {
  const list = cfg.subgroups?.[p.category] ?? [];
  return list.find((s) => s.id === p.subgroup) ?? list[0];
}

function addToGrids(x: Ctx): void {
  const { cfg, added, lang } = x;
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
    const mine = added.filter((p) => p.category === cat);
    if (!mine.length) continue;
    const own = Array.from(grids.entries()).filter(([, g]) => g.cats.size === 1 && g.cats.has(cat));
    const shown = new Set(own.flatMap(([, g]) => g.pids));
    if (!own.length || !all.every((id) => shown.has(id))) continue;
    for (const p of mine) {
      if (document.querySelector(`[data-pcard][data-pid="${CSS.escape(p.id)}"]`)) continue;
      const sg = subgroupOf(cfg, p);
      // a grid of just this subgroup (category pages), else the category grid, after the subgroup's last card
      const target =
        (sg && own.find(([, g]) => g.pids.every((id) => sg.productIds.includes(id)))) ?? own[own.length - 1];
      const [grid, g] = target;
      const sample = g.items[g.items.length - 1];
      const clone = sample.cloneNode(true) as HTMLElement;
      fillCard(clone, p, lang, x.href(p));
      const after = sg ? [...g.items].reverse().find((it) => sg.productIds.includes(it.querySelector<HTMLElement>('[data-pcard]')?.dataset.pid ?? it.dataset.pid ?? '')) : undefined;
      const anchor = after && after !== g.items[g.items.length - 1] ? after : null;
      // keep earlier added products of the same subgroup in creation order
      let ref: Element | null = anchor ? anchor.nextElementSibling : null;
      while (ref && (ref as HTMLElement).querySelector?.('[data-custom]')) ref = ref.nextElementSibling;
      if (anchor) grid.insertBefore(clone, ref);
      else grid.appendChild(clone);
      x.grids.add(grid);
    }
  }
}

function addToLists(x: Ctx): void {
  const { cfg, added, lang } = x;
  if (!added.length) return;
  // header mega-menu and mobile drawer
  menuLists(cfg).forEach(({ cat, ul }) => {
    const sample = Array.from(ul.children)
      .filter((li) => li.querySelector('a') && !li.querySelector('a.drawer-all'))
      .pop() as HTMLElement | undefined;
    if (!sample) return;
    for (const p of added.filter((a) => a.category === cat)) {
      if (ul.querySelector(`[data-custom-link="${CSS.escape(p.id)}"]`)) continue;
      const li = sample.cloneNode(true) as HTMLElement;
      li.hidden = false;
      const a = li.querySelector<HTMLAnchorElement>('a')!;
      a.href = x.href(p);
      a.textContent = pick(p.name, lang) || p.id;
      a.hidden = false;
      a.removeAttribute('aria-current');
      a.dataset.pid = p.id;
      a.dataset.customLink = p.id;
      ul.appendChild(li);
    }
  });
  // category hero list (links): one per page, for the page's category
  document.querySelectorAll<HTMLElement>('.c-jump').forEach((ul) => {
    const sample = ul.querySelector<HTMLElement>('li:last-child');
    const pid = sample?.querySelector<HTMLElement>('[data-pid]')?.dataset.pid ?? '';
    const cat = cfg.cats[pid];
    if (!sample || !cat) return;
    for (const p of added.filter((a) => a.category === cat)) {
      if (ul.querySelector(`[data-custom-link="${CSS.escape(p.id)}"]`)) continue;
      const li = sample.cloneNode(true) as HTMLElement;
      li.hidden = false;
      const a = li.querySelector<HTMLAnchorElement>('a')!;
      a.href = x.href(p);
      a.textContent = pick(p.name, lang) || p.id;
      a.dataset.pid = p.id;
      a.dataset.customLink = p.id;
      ul.appendChild(li);
    }
  });
  // home tile lists (plain names, the tile links to the category)
  document.querySelectorAll<HTMLElement>('[data-plist]').forEach((list) => {
    const cat = list.dataset.plist ?? '';
    for (const p of added.filter((a) => a.category === cat)) {
      if (list.querySelector(`[data-pid="${CSS.escape(p.id)}"]`)) continue;
      const span = document.createElement('span');
      span.dataset.pid = p.id;
      span.textContent = pick(p.name, lang) || p.id;
      list.appendChild(span);
      x.lists.add(list);
    }
  });
}

// ---------------------------------------------------------------------------
// 3. Tidy-up
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
  // nothing left to show: drop the grid's section (products index: also its filter button)
  if (!n) {
    const section = grid.closest<HTMLElement>('section');
    const group = section?.dataset.group;
    if (group) {
      document.querySelector<HTMLElement>(`[data-filter-btn="${CSS.escape(group)}"]`)?.setAttribute('hidden', '');
      section!.remove(); // the filter script toggles [data-group] sections, so take it out of the page
    } else if (section) section.hidden = true;
  }
}

/** Rebuild the " · " separators of a home tile name list; "Скоро" when nothing is left */
function relist(list: HTMLElement, lang: Lang): void {
  const items = Array.from(list.querySelectorAll<HTMLElement>(':scope > [data-pid]'));
  Array.from(list.childNodes).forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE || (n as HTMLElement).dataset?.soon !== undefined) n.remove();
  });
  const shown = items.filter(isShown);
  shown.forEach((el, i) => {
    if (i > 0) list.insertBefore(document.createTextNode(' · '), el);
  });
  if (!shown.length) {
    const soon = document.createElement('span');
    soon.dataset.soon = '';
    soon.textContent = SOON[lang];
    list.appendChild(soon);
  }
}

/** Mega-menu columns and drawer groups without any product left are hidden */
function tidyMenus(cfg: CustomProductsConfig): void {
  menuLists(cfg).forEach(({ ul, box }) => {
    const left = Array.from(ul.children).filter(
      (li) => isShown(li) && li.querySelector('a') && !li.querySelector('a.drawer-all') && isShown(li.querySelector('a')!),
    );
    box.hidden = left.length === 0;
  });
}

// ---------------------------------------------------------------------------
// 4. Counts
// ---------------------------------------------------------------------------

/**
 * Elements with data-pcount="<category id>|all" and data-pcount-n="<build-time count>" get the count for this
 * browser. data-pcount-mode: "phrase" (default, "5 продукта"; "Скоро" for none), "num" ("5"; hidden for none),
 * or "label" (data-one / data-many text; "Скоро" for none). Products-index filter buttons keep data-count in step.
 */
function updateCounts(cfg: CustomProductsConfig, delta: Record<string, number>, lang: Lang): void {
  if (Object.values(delta).every((d) => !d)) return;
  const total = Object.values(delta).reduce((a, b) => a + b, 0);
  const diff = (key: string) => (key === 'all' ? total : (delta[key] ?? 0));
  document.querySelectorAll<HTMLElement>('[data-pcount]').forEach((el) => {
    const key = el.dataset.pcount ?? '';
    if (key !== 'all' && !cfg.byCat[key]) return;
    const n = Math.max(0, (Number(el.dataset.pcountN) || 0) + diff(key));
    const mode = el.dataset.pcountMode ?? 'phrase';
    if (mode === 'num') {
      el.textContent = String(n);
      el.hidden = n === 0;
    } else if (mode === 'label') {
      el.textContent = n === 0 ? SOON[lang] : ((n === 1 ? el.dataset.one : el.dataset.many) ?? '');
    } else {
      el.textContent = productCountText(lang, n);
    }
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
  const x: Ctx = {
    cfg,
    lang,
    ov,
    hidden: new Set(Object.keys(ov).filter((id) => ov[id]?.hidden && cfg.cats[id])),
    added,
    grids: new Set(),
    lists: new Set(),
    href: (p) => `${cfg.item[lang]}?id=${encodeURIComponent(p.id)}`,
  };
  applyEdits(x);
  hideProducts(x);
  addToGrids(x);
  addToLists(x);
  x.grids.forEach(relayoutGrid);
  x.lists.forEach((l) => relist(l, lang));
  if (x.hidden.size || added.length) tidyMenus(cfg);
  const delta: Record<string, number> = {};
  for (const cat of Object.keys(cfg.byCat)) {
    const hiddenHere = cfg.byCat[cat].filter((id) => x.hidden.has(id)).length;
    delta[cat] = added.filter((p) => p.category === cat).length - hiddenHere;
  }
  updateCounts(cfg, delta, lang);
}

/** Kept for older callers and the test harness */
export const injectCustomProducts = applyCatalogue;
