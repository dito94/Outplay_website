// Shows products added in the admin demo on public pages (this browser only). Used by
// src/components/CustomProducts.astro; kept as a module so it can also be exercised by tests/admin.spec.cjs.
// (a) a card in the product grid of the product's category, wherever that category is listed in full;
// (b) a link in the header mega-menu column and the mobile drawer list of that category.
// It clones existing markup, so the cards and links keep the look of the components that render them.
import { loadCustomProducts, type CustomProduct } from './store';

export interface CustomProductsConfig {
  /** catalogue product id → category id */
  cats: Record<string, string>;
  /** catalogue product ids per category */
  byCat: Record<string, string[]>;
  /** public page of a custom product per language: <item>?id=c-… */
  item: { bg: string; en: string };
}

export function injectCustomProducts(cfg: CustomProductsConfig): void {
  const list = loadCustomProducts()
    .filter((p) => !p.hidden && p.category)
    .sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
  if (!list.length) return;
  const lang = document.documentElement.lang === 'en' ? 'en' : 'bg';
  const pick = (p?: { bg?: string; en?: string }) => (p?.[lang] || p?.bg || p?.en || '').trim();
  const href = (p: CustomProduct) => `${cfg.item[lang]}?id=${encodeURIComponent(p.id)}`;
  const catOfHref = (h: string | null) => {
    if (!h) return '';
    const m = new URL(h, location.href).pathname.match(/\/products\/([^/]+)\/$/);
    return m && cfg.byCat[m[1]] ? m[1] : '';
  };

  // (a) Product grids: a grid "lists a category" when its cards all belong to it and, together with the
  // other such grids on the page, it shows the whole category (so related-product strips are left alone).
  const grids = new Map<HTMLElement, { cats: Set<string>; pids: string[]; items: HTMLElement[] }>();
  document.querySelectorAll<HTMLElement>('[data-pcard][data-pid]').forEach((card) => {
    const pid = card.dataset.pid ?? '';
    if (!cfg.cats[pid]) return;
    const item = card.closest<HTMLElement>('.pg-item') ?? card;
    const grid = item.parentElement;
    if (!grid) return;
    const g = grids.get(grid) ?? { cats: new Set<string>(), pids: [], items: [] };
    g.cats.add(cfg.cats[pid]);
    g.pids.push(pid);
    g.items.push(item);
    grids.set(grid, g);
  });

  const fillCard = (item: HTMLElement, p: CustomProduct) => {
    const card = item.matches('[data-pcard]') ? item : item.querySelector<HTMLElement>('[data-pcard]');
    if (!card) return;
    const name = pick(p.name) || p.id;
    item.hidden = false;
    card.hidden = false;
    card.dataset.custom = '';
    card.classList.remove('pcard-large');
    card.classList.add('pcard-normal');
    card.querySelectorAll<HTMLElement>('[data-pid]').forEach((n) => (n.dataset.pid = p.id));
    card.dataset.pid = p.id;
    const link = card.querySelector<HTMLAnchorElement>('a[data-pfield="name"]') ?? card.querySelector<HTMLAnchorElement>('a[href]');
    if (link) {
      link.href = href(p);
      link.textContent = name;
    }
    const set = (field: string, text: string) => {
      const n = card.querySelector<HTMLElement>(`[data-pfield="${field}"]`);
      if (!n) return;
      n.textContent = text;
      n.hidden = !text;
    };
    set('tagline', pick(p.tagline));
    set('summary', pick(p.summary));
    const img = card.querySelector<HTMLImageElement>('img');
    const main = (p.images ?? [])[0];
    if (img && main) {
      img.closest('picture')?.querySelectorAll('source').forEach((s) => s.remove());
      img.removeAttribute('srcset');
      img.removeAttribute('sizes');
      img.removeAttribute('fetchpriority');
      img.src = main;
      img.alt = name;
      img.style.objectPosition = '';
    } else {
      // no photo: the media box keeps its dark plate
      (img?.closest('picture') ?? img)?.remove();
    }
  };

  /** ProductGrid promotes its first card depending on the count (no orphan rows); redo it for the new count */
  const relayout = (grid: HTMLElement) => {
    if (!grid.classList.contains('pgrid')) return;
    const items = Array.from(grid.children).filter(
      (c) => !(c as HTMLElement).hidden && !c.querySelector<HTMLElement>('[data-pcard]')?.hidden,
    ) as HTMLElement[];
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
  };

  const added: Record<string, number> = {};
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
      fillCard(clone, p);
      grid.appendChild(clone);
    }
    relayout(grid);
    added[cat] = mine.length;
  }

  // Products index filter: keep the per-category counts in step with the cards
  const total = Object.values(added).reduce((a, b) => a + b, 0);
  if (total) {
    const bump = (btn: HTMLElement | null, n: number) => {
      if (!btn || !n) return;
      const count = btn.querySelector<HTMLElement>('.seg-n');
      const next = (Number(btn.dataset.count ?? count?.textContent ?? 0) || 0) + n;
      btn.dataset.count = String(next);
      if (count) count.textContent = String(next);
    };
    bump(document.querySelector<HTMLElement>('[data-filter-btn="all"]'), total);
    for (const [cat, n] of Object.entries(added)) bump(document.querySelector<HTMLElement>(`[data-filter-btn="${CSS.escape(cat)}"]`), n);
  }

  // (b) Header mega-menu and mobile drawer: one more link in the category's list
  const addLinks = (ul: HTMLElement | null, cat: string) => {
    if (!ul) return;
    const sample = Array.from(ul.children).filter((li) => li.querySelector('a')).pop() as HTMLElement | undefined;
    if (!sample) return;
    for (const p of list.filter((x) => x.category === cat)) {
      if (ul.querySelector(`[data-custom-link="${CSS.escape(p.id)}"]`)) continue;
      const li = sample.cloneNode(true) as HTMLElement;
      const a = li.querySelector<HTMLAnchorElement>('a')!;
      a.href = href(p);
      a.textContent = pick(p.name) || p.id;
      a.classList.remove('drawer-all');
      a.removeAttribute('aria-current');
      a.dataset.customLink = p.id;
      ul.appendChild(li);
    }
  };
  document.querySelectorAll<HTMLElement>('.mega-col').forEach((col) => {
    const cat = catOfHref(col.querySelector<HTMLAnchorElement>('.mega-cat')?.getAttribute('href') ?? null);
    if (cat) addLinks(col.querySelector<HTMLElement>('ul'), cat);
  });
  document.querySelectorAll<HTMLElement>('.drawer-cats details').forEach((d) => {
    const first = d.querySelector<HTMLAnchorElement>('a[href]');
    const cat = catOfHref(first?.getAttribute('href') ?? null);
    if (cat) addLinks(first!.closest('ul'), cat);
  });
}
