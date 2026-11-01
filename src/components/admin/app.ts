// Client controller for the admin demo (src/components/admin/AdminApp.astro).
// State lives in localStorage through src/lib/store.ts; the generated example inquiries live in memory only.
import {
  CUSTOM_MAX_IMAGES,
  KEYS,
  STORAGE_BUDGET,
  clearOverride,
  customProductId,
  deleteCustomProduct,
  getCustomProduct,
  loadCustomProducts,
  saveCustomProduct,
  storageUsed,
  updateCustomProduct,
  deleteInquiry,
  loadInquiries,
  loadOverrides,
  readJSON,
  remove,
  saveOverride,
  updateInquiry,
  writeJSON,
  type CustomProduct,
  type InquiryStatus,
  type SaveResult,
  type ProductOverride,
  type StoredInquiry,
} from '../../lib/store';
import {
  STATUSES,
  channelOf,
  dimRows,
  dimsSummary,
  esc,
  exampleInquiries,
  fmt,
  fmtDate,
  fmtDateLong,
  icon,
  inquiryText,
  optionRows,
  relTime,
  toE164,
  truncate,
  type AdminData,
  type AdminFaqItem,
  type AdminImage,
  type AdminProduct,
  type FaqEdits,
  type Lang,
  type Pair,
  type Row,
} from '../../lib/admin';
import { formatBytes, resizeImage } from './image-resize';

type View = 'dashboard' | 'inquiries' | 'products' | 'editor' | 'custom' | 'faq' | 'settings';
type CategoryId = CustomProduct['category'];
type FamilyId = CustomProduct['family'];
/** Working copy of a custom product while it is edited (texts as the admin types them) */
interface Draft {
  id: string | null;
  category: CategoryId;
  /** subgroup id ('' when the category has none) */
  subgroup: string;
  family: FamilyId;
  familyTouched: boolean;
  name: Pair;
  tagline: Pair;
  summary: Pair;
  description: Pair;
  features: Pair;
  specs: { label: Pair; value: Pair }[];
  images: string[];
}
const FAMILIES: FamilyId[] = ['pergola', 'glass', 'door', 'zip', 'awning', 'windbreak'];
const DEFAULT_FAMILY: Record<CategoryId, FamilyId> = {
  'bioclimatic-pergolas': 'pergola',
  'glass-systems': 'glass',
  'sun-protection': 'zip',
  windbreaks: 'windbreak',
};
const OVERVIEW: Pair = { bg: 'Описание', en: 'Overview' };
type TextField = 'name' | 'tagline' | 'summary';
type Filter = 'all' | InquiryStatus;

const TEXT_FIELDS: TextField[] = ['name', 'tagline', 'summary'];
const LANGS: Lang[] = ['bg', 'en'];
const ROUTES = ['dashboard', 'inquiries', 'products', 'faq', 'settings'];
const VIEW_PRODUCT: Pair = { bg: 'Виж продукта', en: 'View product' };

export function boot(): void {
  const root = document.querySelector<HTMLElement>('[data-adm]');
  const dataEl = document.getElementById('adm-data');
  if (!root || !dataEl) return;
  const D = JSON.parse(dataEl.textContent || '{}') as AdminData;
  const S = D.s;
  const lang = D.lang;
  const docEl = document.documentElement;
  const units = { m: S.m, m2: S.m2, pcs: S.pcs };

  const q = <T extends HTMLElement = HTMLElement>(sel: string, el: ParentNode = root): T | null =>
    el.querySelector<T>(sel);
  const qa = <T extends HTMLElement = HTMLElement>(sel: string, el: ParentNode = root): T[] =>
    Array.from(el.querySelectorAll<T>(sel));
  const slot = (name: string) => q(`[data-slot="${name}"]`)!;

  const productById = new Map(D.products.map((p) => [p.id, p]));
  const catById = new Map(D.categories.map((c) => [c.id, c]));
  const faqById = new Map<string, AdminFaqItem>(D.faq.flatMap((g) => g.items.map((i) => [i.id, i] as const)));
  const examples = exampleInquiries(lang);
  const drawer = q<HTMLDialogElement>('[data-adm-drawer]')!;
  const confirmEl = q<HTMLDialogElement>('[data-adm-confirm]')!;

  const state = {
    view: 'dashboard' as View,
    arg: '',
    rendered: false,
    filter: 'all' as Filter,
    query: '',
    drawerId: null as string | null,
    faqEditing: null as string | null,
    faqTab: lang as Lang,
    editorTab: lang as Lang,
    customTab: 'bg' as Lang,
    draft: null as Draft | null,
    draftBase: '',
    busy: false,
    exampleStatus: {} as Record<string, InquiryStatus>,
  };

  // ---------------------------------------------------------------------------
  // Data access
  // ---------------------------------------------------------------------------

  const storedInquiries = (): StoredInquiry[] => {
    const list = loadInquiries();
    return Array.isArray(list) ? list.filter((i) => i && typeof i === 'object' && typeof i.id === 'string') : [];
  };
  const normalize = (i: StoredInquiry): StoredInquiry => ({
    ...i,
    status: STATUSES.includes(i.status) ? i.status : 'new',
    family:
      i.family ||
      (i.productId ? (productById.get(i.productId)?.family ?? getCustomProduct(i.productId)?.family) : '') ||
      '',
    dims: i.dims ?? {},
    options: i.options ?? {},
    contact: { ...{ name: '', phone: '', email: '' }, ...(i.contact ?? {}) },
  });
  const allInquiries = (): StoredInquiry[] => {
    const real = storedInquiries().map(normalize);
    const ex = examples.map((e) => ({ ...e, status: state.exampleStatus[e.id] ?? e.status }));
    return [...real, ...ex].sort((a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0));
  };
  /** Example rows generated in code (not in storage): status kept in memory, never deletable */
  const isGenerated = (id: string) => id.startsWith('example-') && !storedInquiries().some((i) => i.id === id);

  const overrides = () => {
    const o = loadOverrides();
    return o && typeof o === 'object' ? o : {};
  };
  const hasText = (o?: ProductOverride) => !!o && TEXT_FIELDS.some((f) => !!(o[f]?.bg || o[f]?.en));
  const effText = (p: AdminProduct, f: TextField, l: Lang = lang, ov = overrides()) => ov[p.id]?.[f]?.[l] || p[f][l];
  const customs = () => loadCustomProducts();
  /** A custom product's text in the admin language, falling back to the other language */
  const cText = (v: Pair | undefined, l: Lang = lang) => (v?.[l] || v?.bg || v?.en || '').trim();
  const productLabel = (inq: StoredInquiry, ov = overrides()) => {
    if (!inq.productId) return S.noProduct;
    const p = productById.get(inq.productId);
    if (p) return effText(p, 'name', lang, ov);
    const c = getCustomProduct(inq.productId);
    return c ? cText(c.name) : inq.productId;
  };
  const customUrl = (id: string) => `${D.itemUrl}?id=${encodeURIComponent(id)}`;
  const loadFaq = (): FaqEdits => {
    const v = readJSON<FaqEdits>(KEYS.faq, {});
    return v && typeof v === 'object' ? v : {};
  };
  const faqText = (it: AdminFaqItem, f: 'q' | 'a', l: Lang = lang, ed = loadFaq()) => ed[it.id]?.[f]?.[l] || it[f][l];
  const editedFaqCount = (ed = loadFaq()) => Object.keys(ed).filter((id) => faqById.has(id)).length;
  const editedProductCount = (ov = overrides()) =>
    Object.entries(ov).filter(([id, o]) => productById.has(id) && (hasText(o) || o.hidden)).length;

  // Our own writes are followed by an explicit render; only other tabs trigger a passive refresh.
  let muted = false;
  const mutate = (fn: () => void) => {
    muted = true;
    try {
      fn();
    } finally {
      muted = false;
    }
  };

  // ---------------------------------------------------------------------------
  // Small UI helpers
  // ---------------------------------------------------------------------------

  const pill = (s: InquiryStatus) => `<span class="adm-pill" data-s="${s}">${esc(D.statuses[s])}</span>`;
  const badge = (text: string, kind: string, ic?: string) =>
    `<span class="adm-badge adm-badge-${kind}">${ic ? icon(ic, 12) : ''}${esc(text)}</span>`;
  const chIcon = (c: string) => (c === 'viber' ? 'viber' : c === 'email' ? 'mail' : 'phone');
  const newTab = `<span class="sr-only"> ${esc(S.newWindow)}</span>`;
  const dl = (rows: Row[]) =>
    rows.length
      ? `<dl class="adm-dl">${rows.map((r) => `<div><dt>${esc(r.label)}</dt><dd>${esc(r.value)}</dd></div>`).join('')}</dl>`
      : `<p class="adm-muted">—</p>`;
  const headerH = () => parseFloat(getComputedStyle(docEl).getPropertyValue('--header-h')) || 72;

  /** Re-render while keeping keyboard focus on the "same" control (matched by data-fkey) */
  function keepFocus(container: HTMLElement, render: () => void) {
    const a = document.activeElement as HTMLElement | null;
    const key = a && container.contains(a) ? a.dataset.fkey : undefined;
    render();
    if (key) container.querySelector<HTMLElement>(`[data-fkey="${CSS.escape(key)}"]`)?.focus({ preventScroll: true });
  }

  function toast(message: string, link?: { href: string; label: string } | null, error = false) {
    const openDialog = qa<HTMLDialogElement>('dialog[open]').pop();
    const region = (openDialog && q('[data-adm-toasts]', openDialog)) || q(':scope > [data-adm-toasts]');
    if (!region) return;
    const el = document.createElement('div');
    el.className = error ? 'adm-toast is-error' : 'adm-toast';
    el.innerHTML = `${icon(error ? 'info' : 'check', 18)}<p>${esc(message)}${
      link ? ` <a href="${esc(link.href)}" target="_blank" rel="noopener">${esc(link.label)}${newTab}</a>` : ''
    }</p><button type="button" class="adm-toast-x">${icon('close', 16)}<span class="sr-only">${esc(S.dismiss)}</span></button>`;
    region.appendChild(el);
    while (region.children.length > 3) region.firstElementChild?.remove();
    let timer = 0;
    const kill = () => {
      window.clearTimeout(timer);
      el.classList.add('is-out');
      window.setTimeout(() => el.remove(), 220);
    };
    const arm = (ms: number) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(kill, ms);
    };
    el.querySelector('button')!.addEventListener('click', kill);
    el.addEventListener('mouseenter', () => window.clearTimeout(timer));
    el.addEventListener('focusin', () => window.clearTimeout(timer));
    el.addEventListener('mouseleave', () => arm(3000));
    arm(link || error ? 9000 : 5000);
  }

  function confirmDialog(o: { title: string; text: string; ok: string; danger?: boolean; check?: string; cancel?: string }) {
    q('#adm-cf-title', confirmEl)!.textContent = o.title;
    q('#adm-cf-text', confirmEl)!.textContent = o.text;
    const ok = q<HTMLButtonElement>('[data-cf-ok]', confirmEl)!;
    ok.textContent = o.ok;
    ok.classList.toggle('adm-danger', !!o.danger);
    const checkWrap = q('[data-cf-check]', confirmEl)!;
    const check = q<HTMLInputElement>('input', checkWrap)!;
    checkWrap.hidden = !o.check;
    check.checked = true;
    if (o.check) q('span', checkWrap)!.textContent = o.check;
    q('[data-cf-cancel]', confirmEl)!.textContent = o.cancel ?? S.cancel;
    confirmEl.returnValue = '';
    confirmEl.showModal();
    q<HTMLButtonElement>('[data-cf-cancel]', confirmEl)!.focus();
    return new Promise<{ ok: boolean; checked: boolean }>((resolve) => {
      confirmEl.addEventListener(
        'close',
        () => resolve({ ok: confirmEl.returnValue === 'ok', checked: !!o.check && check.checked }),
        { once: true },
      );
    });
  }
  confirmEl.addEventListener('click', (e) => {
    if (e.target === confirmEl) confirmEl.close('cancel');
  });

  /** Storage refused the write: say so (the UI is re-rendered from storage by the caller) */
  const failed = () => toast(S.saveFailed, null, true);

  async function copyText(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      (drawer.open ? drawer : document.body).appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch {
        /* nothing else to try */
      }
      ta.remove();
    }
  }

  // ---------------------------------------------------------------------------
  // Unsaved changes (product editor, new/added product editor, FAQ editor)
  // ---------------------------------------------------------------------------

  function faqDirty(): boolean {
    const id = state.faqEditing;
    const it = id ? faqById.get(id) : undefined;
    const form = id ? q(`[data-faq-form="${id}"]`) : null;
    if (!it || !form) return false;
    const ed = loadFaq();
    const val = (sel: string) => q<HTMLInputElement>(sel, form)?.value ?? '';
    return LANGS.some((l) => val(`[data-fq="${l}"]`) !== faqText(it, 'q', l, ed) || val(`[data-fa="${l}"]`) !== faqText(it, 'a', l, ed));
  }
  function isDirty(): boolean {
    if (!isAuthed() || !state.rendered) return false;
    if (state.view === 'editor') {
      const save = q<HTMLButtonElement>('[data-ed-save]');
      return !!save && !save.disabled;
    }
    if (state.view === 'custom') return !!state.draft && JSON.stringify(state.draft) !== state.draftBase;
    if (state.view === 'faq') return faqDirty();
    return false;
  }
  /** Ask in-page before unsaved changes are thrown away; true = go ahead */
  async function confirmLeave(): Promise<boolean> {
    if (!isDirty()) return true;
    const r = await confirmDialog({ title: S.leaveTitle, text: S.leaveText, ok: S.leaveOk, danger: true, cancel: S.leaveStay });
    return r.ok;
  }
  /** Hash of the view on screen (restored while the guard asks) */
  let currentHash = location.hash;
  let leaving = false;

  // ---------------------------------------------------------------------------
  // Routing
  // ---------------------------------------------------------------------------

  const isAuthed = () => docEl.classList.contains('adm-authed');
  const viewEl = (v: View = state.view) => q(`[data-view="${v}"]`)!;

  function parseHash(): { view: View; arg: string } | null {
    let raw = '';
    try {
      raw = decodeURIComponent(location.hash.replace(/^#/, ''));
    } catch {
      return null;
    }
    if (!raw) return { view: 'dashboard', arg: '' };
    const [v, arg = ''] = raw.split('/');
    if (!ROUTES.includes(v)) return null; // e.g. #main from the skip link: keep the current view
    if (v === 'products' && arg) {
      if (arg === 'new' || (arg.startsWith('c-') && getCustomProduct(arg))) return { view: 'custom', arg };
      return productById.has(arg) ? { view: 'editor', arg } : { view: 'products', arg: '' };
    }
    return { view: v as View, arg: '' };
  }

  function viewTitle(): string {
    if (state.view === 'editor') {
      const p = productById.get(state.arg);
      return p ? `${effText(p, 'name')} · ${S.navProducts}` : S.navProducts;
    }
    if (state.view === 'custom') {
      const c = state.arg === 'new' ? undefined : getCustomProduct(state.arg);
      return `${c ? cText(c.name) : S.cpNewTitle} · ${S.navProducts}`;
    }
    const map: Record<string, string> = {
      dashboard: S.navDashboard,
      inquiries: S.navInquiries,
      products: S.navProducts,
      faq: S.navFaq,
      settings: S.navSettings,
    };
    return map[state.view];
  }

  function route(moveFocus: boolean) {
    if (!isAuthed()) return;
    const r = parseHash() ?? (state.rendered ? null : { view: 'dashboard' as View, arg: '' });
    if (!r) return;
    if (drawer.open) {
      state.drawerId = null; // the row it came from is about to disappear
      drawer.close();
    }
    if (confirmEl.open) confirmEl.close('cancel');
    if (r.view !== 'faq') state.faqEditing = null;
    if (r.view === 'editor' && (state.view !== 'editor' || state.arg !== r.arg)) state.editorTab = lang;
    if (r.view === 'custom' && (state.view !== 'custom' || state.arg !== r.arg)) {
      state.draft = null;
      state.customTab = 'bg';
    }
    state.view = r.view;
    state.arg = r.arg;
    state.rendered = true;
    currentHash = location.hash;
    qa('[data-view]').forEach((el) => (el.hidden = el.dataset.view !== r.view));
    const navId = r.view === 'editor' || r.view === 'custom' ? 'products' : r.view;
    qa<HTMLAnchorElement>('[data-nav]').forEach((a) => {
      if (a.dataset.nav === navId) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    renderView(true);
    updateNavCount();
    document.title = `${viewTitle()} · ${S.title} · OUTPLAY`;
    // keep the active tab visible in the horizontal mobile nav
    const list = q('.adm-nav ul');
    const active = q(`[data-nav="${navId}"]`);
    if (list && active && list.scrollWidth > list.clientWidth) {
      const left = active.offsetLeft;
      const right = left + active.offsetWidth;
      if (left < list.scrollLeft || right > list.scrollLeft + list.clientWidth) {
        list.scrollLeft = Math.max(0, left - (list.clientWidth - active.offsetWidth) / 2);
      }
    }
    if (moveFocus) {
      const app = q('[data-app]')!;
      const top = app.getBoundingClientRect().top + window.scrollY - headerH();
      if (window.scrollY > top + 1) window.scrollTo({ top, behavior: 'instant' as ScrollBehavior });
      q<HTMLElement>(`[data-view="${r.view}"] h2`)?.focus({ preventScroll: true });
    }
  }

  function renderView(entering: boolean) {
    switch (state.view) {
      case 'dashboard':
        return renderDashboard();
      case 'inquiries':
        return renderInquiries();
      case 'products':
        return renderProducts();
      case 'editor':
        return entering ? renderEditor() : syncEditorChrome();
      case 'custom':
        return entering ? renderCustomEditor() : syncCustomChrome();
      case 'faq':
        return entering || !state.faqEditing ? renderFaq() : undefined;
      case 'settings':
        return renderSettings();
    }
  }

  /** Re-render the current view (and the open inquiry panel) from storage */
  function refresh() {
    if (!isAuthed() || !state.rendered) return;
    updateNavCount();
    keepFocus(viewEl(), () => renderView(false));
    if (drawer.open) renderDrawer();
  }

  function updateNavCount() {
    const n = allInquiries().filter((i) => i.status === 'new').length;
    qa('[data-new-count]').forEach((el) => {
      el.textContent = String(n);
      el.hidden = n === 0;
    });
  }

  // ---------------------------------------------------------------------------
  // Dashboard
  // ---------------------------------------------------------------------------

  function renderDashboard() {
    const inqs = allInquiries();
    const ov = overrides();
    const fe = loadFaq();
    const nNew = inqs.filter((i) => i.status === 'new').length;
    const nEx = inqs.filter((i) => i.example).length;
    const cps = customs();
    const nHidden = D.products.filter((p) => ov[p.id]?.hidden).length + cps.filter((c) => c.hidden).length;
    const nFaqEdited = editedFaqCount(fe);
    const stat = (href: string, label: string, value: number, sub: string, filter?: Filter) =>
      `<a class="adm-stat" href="${href}"${filter ? ` data-goto-filter="${filter}"` : ''}><span class="adm-stat-label">${esc(label)}</span><span class="adm-stat-value num">${value}</span><span class="adm-stat-sub">${esc(sub)}</span></a>`;

    const latest = inqs
      .slice(0, 5)
      .map(
        (i) => `<li><button type="button" class="adm-latest-row" data-open-inq="${esc(i.id)}" data-fkey="latest-${esc(i.id)}">
        <span class="adm-latest-main"><span class="adm-latest-name">${esc(i.contact.name || '—')}${i.example ? badge(S.example, 'example') : ''}</span>
        <span class="adm-latest-meta">${esc(productLabel(i, ov))} · <span class="num">${esc(dimsSummary(i, lang, units))}</span></span></span>
        <span class="adm-latest-side">${pill(i.status)}<span class="adm-latest-time">${esc(relTime(i.createdAt, lang, S.justNow))}</span></span>
      </button></li>`,
      )
      .join('');

    const describe = (o: ProductOverride) => {
      const parts: string[] = [];
      const label: Record<TextField, string> = { name: S.chName, tagline: S.chTagline, summary: S.chSummary };
      TEXT_FIELDS.forEach((f) => {
        const ls = LANGS.filter((l) => o[f]?.[l]);
        if (ls.length) parts.push(`${label[f]} (${ls.map((l) => l.toUpperCase()).join(', ')})`);
      });
      if (o.hidden) parts.push(S.chHidden);
      return parts.join(', ');
    };
    const changes = [
      ...Object.entries(ov)
        .filter(([id, o]) => productById.has(id) && (hasText(o) || o.hidden))
        .map(([id, o]) => ({
          at: o.updatedAt ?? '',
          title: effText(productById.get(id)!, 'name', lang, ov),
          what: describe(o),
          href: `#products/${id}`,
        })),
      ...cps.map((c) => ({
        at: c.updatedAt || c.createdAt || '',
        title: cText(c.name),
        what: c.hidden ? `${S.chCustom}, ${S.chHidden}` : S.chCustom,
        href: `#products/${c.id}`,
      })),
      ...Object.entries(fe)
        .filter(([id]) => faqById.has(id))
        .map(([id, e]) => ({
          at: e.updatedAt ?? '',
          title: truncate(faqText(faqById.get(id)!, 'q', lang, fe), 64),
          what: S.chFaq,
          href: '#faq',
        })),
    ]
      .sort((a, b) => (Date.parse(b.at) || 0) - (Date.parse(a.at) || 0))
      .slice(0, 5);

    const chev = icon('chevronRight', 16);
    slot('dashboard').innerHTML = `
      <div class="adm-stats">
        ${stat('#inquiries', S.statNew, nNew, S.statNewSub, 'new')}
        ${stat('#inquiries', S.statTotal, inqs.length, fmt(S.statTotalSub, { n: nEx }), 'all')}
        ${stat(
          '#products',
          S.statProducts,
          D.products.length + cps.length,
          fmt(cps.length ? S.statProductsAdded : S.statProductsSub, { n: D.categories.length, k: cps.length }),
        )}
        ${stat('#products', S.statHidden, nHidden, nHidden ? S.statHiddenSub : S.statHiddenSub0)}
        ${stat('#faq', S.statFaq, faqById.size, fmt(S.statFaqSub, { n: nFaqEdited }))}
      </div>
      <div class="adm-dash">
        <section class="adm-panel" aria-labelledby="adm-latest-h">
          <div class="adm-panel-h"><h3 id="adm-latest-h">${esc(S.latest)}</h3>
            <a class="adm-more" href="#inquiries" data-goto-filter="all">${esc(S.seeAll)} ${icon('arrowRight', 16)}</a></div>
          <ul class="adm-latest">${latest}</ul>
        </section>
        <div class="adm-dash-side">
          <section class="adm-panel" aria-labelledby="adm-quick-h">
            <div class="adm-panel-h"><h3 id="adm-quick-h">${esc(S.quick)}</h3></div>
            <ul class="adm-quick">
              <li><a href="#inquiries" data-goto-filter="new">${icon('inbox')}<span>${esc(S.qaNew)}</span>${nNew ? `<span class="adm-quick-n num">${nNew}</span>` : ''}${chev}</a></li>
              <li><a href="#products">${icon('box')}<span>${esc(S.qaProducts)}</span>${chev}</a></li>
              <li><a href="#products/new">${icon('plus')}<span>${esc(S.addProduct)}</span>${chev}</a></li>
              <li><a href="#faq">${icon('help')}<span>${esc(S.qaFaq)}</span>${chev}</a></li>
              <li><a href="${esc(D.home)}" target="_blank" rel="noopener">${icon('external')}<span>${esc(S.qaSite)}</span>${newTab}${chev}</a></li>
            </ul>
          </section>
          <section class="adm-panel" aria-labelledby="adm-changes-h">
            <div class="adm-panel-h"><h3 id="adm-changes-h">${esc(S.changes)}</h3></div>
            ${
              changes.length
                ? `<ul class="adm-changes">${changes
                    .map(
                      (c) =>
                        `<li><a href="${c.href}"><span class="adm-ch-title">${esc(c.title)}</span><span class="adm-ch-meta">${esc(c.what)}${c.at ? ` · ${esc(relTime(c.at, lang, S.justNow))}` : ''}</span></a></li>`,
                    )
                    .join('')}</ul>`
                : `<p class="adm-empty-sm">${esc(S.changesEmpty)}</p>`
            }
          </section>
          <aside class="adm-how" aria-labelledby="adm-how-h"><h3 id="adm-how-h">${esc(S.howTitle)}</h3><p>${esc(S.howText)}</p></aside>
        </div>
      </div>`;
  }

  // ---------------------------------------------------------------------------
  // Inquiries
  // ---------------------------------------------------------------------------

  const norm = (s: string) => s.toLocaleLowerCase(lang).normalize('NFKD').replace(/\p{M}/gu, '').trim();
  const haystack = (i: StoredInquiry, ov: Record<string, ProductOverride>) => {
    const p = i.productId ? productById.get(i.productId) : undefined;
    const c = !p && i.productId ? getCustomProduct(i.productId) : undefined;
    return norm(
      [i.contact.name, i.contact.city, i.contact.email, i.contact.phone, productLabel(i, ov), p?.name.bg, p?.name.en, p?.fullName, c?.name.bg, c?.name.en]
        .filter(Boolean)
        .join(' '),
    );
  };

  function renderInquiries() {
    const all = allInquiries();
    const ov = overrides();
    const counts: Record<string, number> = { all: all.length };
    STATUSES.forEach((s) => (counts[s] = all.filter((i) => i.status === s).length));
    const seg = q('[data-inq-filter]')!;
    keepFocus(seg, () => {
      seg.innerHTML = (['all', ...STATUSES] as Filter[])
        .map(
          (s) =>
            `<button type="button" class="adm-seg-btn" data-filter="${s}" data-fkey="filter-${s}" aria-pressed="${state.filter === s}">${esc(
              s === 'all' ? S.all : D.statuses[s],
            )}<span class="adm-seg-n num">${counts[s]}</span></button>`,
        )
        .join('');
    });
    const search = q<HTMLInputElement>('[data-inq-search]')!;
    if (search.value !== state.query) search.value = state.query;

    const needle = norm(state.query);
    const rows = all.filter(
      (i) => (state.filter === 'all' || i.status === state.filter) && (!needle || haystack(i, ov).includes(needle)),
    );
    q('[data-inq-count]')!.textContent = fmt(S.shown, { n: rows.length, total: all.length });

    const row = (i: StoredInquiry) => {
      const id = esc(i.id);
      const ch = channelOf(i);
      return `<tr data-open-inq="${id}"${i.status === 'new' ? ' class="is-new"' : ''}>
        <td class="c-date num">${esc(fmtDate(i.createdAt, lang))}</td>
        <td class="c-name"><button type="button" class="adm-rowlink" data-open-inq="${id}" data-fkey="row-${id}">${esc(
          i.contact.name || '—',
        )}</button>${i.example ? badge(S.example, 'example') : ''}${i.contact.city ? `<span class="adm-sub">${esc(i.contact.city)}</span>` : ''}</td>
        <td class="c-prod">${esc(productLabel(i, ov))}</td>
        <td class="c-dims num">${esc(dimsSummary(i, lang, units))}</td>
        <td class="c-chan">${ch ? `${icon(chIcon(ch), 16)}<span>${esc(D.channels[ch] ?? ch)}</span>` : '<span class="adm-muted">—</span>'}</td>
        <td class="c-status">${pill(i.status)}</td>
      </tr>`;
    };

    slot('inquiries').innerHTML = rows.length
      ? `<div class="adm-panel adm-table-wrap"><table class="adm-table">
          <caption class="sr-only">${esc(S.navInquiries)}</caption>
          <thead><tr>
            <th scope="col">${esc(S.colDate)}</th><th scope="col">${esc(S.colCustomer)}</th><th scope="col">${esc(S.colProduct)}</th>
            <th scope="col">${esc(S.colDims)}</th><th scope="col">${esc(S.colChannel)}</th><th scope="col">${esc(S.colStatus)}</th>
          </tr></thead>
          <tbody>${rows.map(row).join('')}</tbody>
        </table></div>
        <p class="adm-note adm-after">${icon('info', 16)}<span>${esc(S.exampleNote)}</span></p>`
      : `<div class="adm-empty">${icon('inbox', 28)}<p class="adm-empty-title">${esc(S.noResults)}</p>
          <button type="button" class="adm-btn" data-clear-filters data-fkey="clear-filters">${esc(S.clearFilters)}</button></div>`;
  }

  // ---------------------------------------------------------------------------
  // Inquiry detail panel
  // ---------------------------------------------------------------------------

  function openInquiry(id: string) {
    state.drawerId = id;
    renderDrawer();
    if (!drawer.open) drawer.showModal();
    q<HTMLElement>('#adm-dw-title', drawer)?.focus();
  }

  drawer.addEventListener('close', () => {
    const id = state.drawerId;
    state.drawerId = null;
    if (!id) return;
    const target = q<HTMLElement>(`[data-view="${state.view}"] button[data-open-inq="${CSS.escape(id)}"]`);
    target?.focus();
  });
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) drawer.close();
  });

  function renderDrawer() {
    const box = slot('drawer');
    const inq = allInquiries().find((i) => i.id === state.drawerId);
    if (!inq) {
      if (drawer.open) drawer.close();
      return;
    }
    const scroll = q('.adm-dw-body', box)?.scrollTop ?? 0;
    keepFocus(box, () => (box.innerHTML = drawerHtml(inq)));
    const body = q('.adm-dw-body', box);
    if (body) body.scrollTop = scroll;
  }

  function drawerHtml(inq: StoredInquiry): string {
    const gen = isGenerated(inq.id);
    const name = inq.contact.name || '—';
    const product = productLabel(inq);
    const phone = inq.contact.phone?.trim() ?? '';
    const email = inq.contact.email?.trim() ?? '';
    const e164 = toE164(phone);
    const ch = channelOf(inq);
    const { config, project } = optionRows(inq, D);
    const subject = encodeURIComponent(`${S.textTitle} · ${product}`);

    const contact: string[] = [];
    contact.push(`<div><dt>${esc(S.customer)}</dt><dd>${esc(name)}</dd></div>`);
    if (phone)
      contact.push(`<div><dt>${esc(S.phone)}</dt><dd><span class="adm-dd-main num">${esc(phone)}</span><span class="adm-dd-actions">${
        e164
          ? `<a class="adm-chip-btn" href="tel:${esc(e164)}">${icon('phone', 16)}${esc(S.call)}</a><a class="adm-chip-btn" href="viber://chat?number=${encodeURIComponent(e164)}">${icon('viber', 16)}${esc(S.viber)}</a>`
          : ''
      }<button type="button" class="adm-chip-btn" data-copy-value="${esc(phone)}" data-fkey="copy-phone">${icon('copy', 16)}<span class="sr-only">${esc(S.copy)}: ${esc(phone)}</span></button></span></dd></div>`);
    if (email)
      contact.push(`<div><dt>${esc(S.email)}</dt><dd><span class="adm-dd-main">${esc(email)}</span><span class="adm-dd-actions"><a class="adm-chip-btn" href="mailto:${esc(
        email,
      )}?subject=${subject}">${icon('mail', 16)}${esc(S.writeEmail)}</a><button type="button" class="adm-chip-btn" data-copy-value="${esc(email)}" data-fkey="copy-email">${icon('copy', 16)}<span class="sr-only">${esc(S.copy)}: ${esc(email)}</span></button></span></dd></div>`);
    if (inq.contact.city) contact.push(`<div><dt>${esc(S.city)}</dt><dd>${esc(inq.contact.city)}</dd></div>`);
    if (ch) contact.push(`<div><dt>${esc(S.channel)}</dt><dd>${esc(D.channels[ch] ?? ch)}</dd></div>`);

    const files = (inq.files ?? []).filter(Boolean);
    return `
      <header class="adm-dw-head">
        <div class="adm-dw-heading">
          <p class="adm-dw-meta">${inq.example ? badge(S.example, 'example') : ''}<span>${esc(S.received)} ${esc(fmtDateLong(inq.createdAt, lang))}</span></p>
          <h2 id="adm-dw-title" class="adm-dw-title" tabindex="-1">${esc(name)}</h2>
          <p class="adm-dw-sub">${esc(product)} · <span class="num">${esc(dimsSummary(inq, lang, units))}</span></p>
        </div>
        <button type="button" class="adm-icon-btn" data-close-drawer>${icon('close', 20)}<span class="sr-only">${esc(S.close)}</span></button>
      </header>
      <div class="adm-dw-body">
        <fieldset class="adm-dw-status">
          <legend>${esc(S.status)}</legend>
          <div class="chips">${STATUSES.map(
            (s) =>
              `<label class="chip"><input type="radio" name="adm-status" value="${s}" data-status-radio data-fkey="status-${s}"${
                inq.status === s ? ' checked' : ''
              } /><span>${esc(D.statuses[s])}</span></label>`,
          ).join('')}</div>
          ${gen ? `<p class="adm-note">${icon('info', 16)}<span>${esc(S.statusExample)}</span></p>` : ''}
        </fieldset>
        <section aria-labelledby="adm-dw-contact"><h3 id="adm-dw-contact">${esc(S.contact)}</h3><dl class="adm-dl">${contact.join('')}</dl></section>
        <section aria-labelledby="adm-dw-dims"><h3 id="adm-dw-dims">${esc(S.dimsApprox)}</h3>${dl(dimRows(inq, D))}</section>
        ${config.length ? `<section aria-labelledby="adm-dw-config"><h3 id="adm-dw-config">${esc(S.config)}</h3>${dl(config)}</section>` : ''}
        ${project.length ? `<section aria-labelledby="adm-dw-project"><h3 id="adm-dw-project">${esc(S.project)}</h3>${dl(project)}</section>` : ''}
        ${inq.message?.trim() ? `<section aria-labelledby="adm-dw-msg"><h3 id="adm-dw-msg">${esc(S.message)}</h3><p class="adm-msg">${esc(inq.message.trim())}</p></section>` : ''}
        ${
          files.length
            ? `<section aria-labelledby="adm-dw-files"><h3 id="adm-dw-files">${esc(S.files)}</h3><ul class="adm-files">${files
                .map((f) => `<li>${icon('clip', 16)}<span>${esc(f)}</span></li>`)
                .join('')}</ul><p class="adm-note">${icon('info', 16)}<span>${esc(S.filesNote)}</span></p></section>`
            : ''
        }
      </div>
      <div class="adm-dw-foot">
        <button type="button" class="btn btn-sm" data-copy-inq data-fkey="copy-inq">${icon('copy', 18)}<span>${esc(S.copyText)}</span></button>
        ${gen ? '' : `<button type="button" class="adm-btn adm-btn-danger" data-delete-inq data-fkey="delete-inq">${icon('trash', 16)}<span>${esc(S.delete)}</span></button>`}
      </div>`;
  }

  function setStatus(id: string, s: InquiryStatus) {
    let ok = true;
    if (isGenerated(id)) state.exampleStatus[id] = s;
    else mutate(() => (ok = updateInquiry(id, { status: s })));
    refresh(); // re-rendered from storage: on failure the previous status comes back
    if (!ok) return failed();
    toast(fmt(S.statusSaved, { s: D.statuses[s] }));
  }

  async function copyInquiry(btn: HTMLElement) {
    const inq = allInquiries().find((i) => i.id === state.drawerId);
    if (!inq) return;
    await copyText(inquiryText(inq, D, productLabel(inq)));
    const label = q('span', btn);
    if (label) {
      label.textContent = S.copied;
      btn.classList.add('is-done');
      window.setTimeout(() => {
        label.textContent = S.copyText;
        btn.classList.remove('is-done');
      }, 1800);
    }
    toast(S.copiedToast);
  }

  async function copyValue(btn: HTMLElement) {
    const v = btn.dataset.copyValue ?? '';
    await copyText(v);
    btn.classList.add('is-done');
    window.setTimeout(() => btn.classList.remove('is-done'), 1500);
    toast(`${S.copied}: ${v}`);
  }

  async function deleteCurrent() {
    const inq = allInquiries().find((i) => i.id === state.drawerId);
    if (!inq || isGenerated(inq.id)) return;
    const res = await confirmDialog({
      title: S.deleteTitle,
      text: fmt(S.deleteText, { name: inq.contact.name || '—' }),
      ok: S.delete,
      danger: true,
    });
    if (!res.ok) return;
    let ok = true;
    mutate(() => (ok = deleteInquiry(inq.id)));
    if (!ok) return failed();
    state.drawerId = null;
    drawer.close();
    refresh();
    q<HTMLElement>(`[data-view="${state.view}"] h2`)?.focus();
    toast(S.deleted);
  }

  // ---------------------------------------------------------------------------
  // Products
  // ---------------------------------------------------------------------------

  const visSwitch = (p: AdminProduct, hidden: boolean, name: string) =>
    `<button type="button" class="adm-switch" role="switch" aria-checked="${!hidden}" data-toggle-vis="${p.id}" data-fkey="vis-${p.id}" aria-label="${esc(
      `${S.visible}: ${name}`,
    )}"><span class="adm-switch-track" aria-hidden="true"></span><span class="adm-switch-label" aria-hidden="true">${esc(S.visible)}</span></button>`;

  function renderProducts() {
    const ov = overrides();
    const cps = customs();
    const lead = q('[data-prod-lead]');
    if (lead) lead.textContent = fmt(S.prodLead, { n: D.products.length + cps.length, c: D.categories.length });
    slot('products').innerHTML =
      (cps.length ? `<p class="adm-note adm-note-box">${icon('info', 18)}<span>${esc(S.cpLocalNote)}</span></p>` : '') +
      D.categories
        .map((c) => {
          const items = D.products.filter((p) => p.category === c.id);
          const added = cps.filter((p) => p.category === c.id);
          const n = items.length + added.length;
          if (!n) return '';
          const count = n === 1 ? S.productOne : fmt(S.productsCount, { n });
          return `<section class="adm-group" aria-labelledby="adm-pg-${c.id}">
          <div class="adm-group-h"><h3 id="adm-pg-${c.id}">${esc(c.name)}</h3><span class="adm-group-n">${esc(count)}</span></div>
          <ul class="adm-plist">${items.map((p) => productRow(p, ov)).join('')}${added.map(customRow).join('')}</ul>
        </section>`;
        })
        .join('');
  }

  const customSwitch = (c: CustomProduct) =>
    `<button type="button" class="adm-switch" role="switch" aria-checked="${!c.hidden}" data-toggle-vis="${esc(c.id)}" data-fkey="vis-${esc(
      c.id,
    )}" aria-label="${esc(`${S.visible}: ${cText(c.name)}`)}"><span class="adm-switch-track" aria-hidden="true"></span><span class="adm-switch-label" aria-hidden="true">${esc(
      S.visible,
    )}</span></button>`;

  function customRow(c: CustomProduct): string {
    const name = cText(c.name);
    const id = esc(c.id);
    return `<li class="adm-prow${c.hidden ? ' is-hidden' : ''}" data-product="${id}">
      <a class="adm-prow-thumb" href="#products/${id}" tabindex="-1" aria-hidden="true">${
        c.images[0] ? `<img src="${esc(c.images[0])}" alt="" width="96" height="64" loading="lazy" decoding="async" />` : ''
      }</a>
      <div class="adm-prow-info">
        <p class="adm-prow-name"><a href="#products/${id}" data-fkey="name-${id}">${esc(name)}</a>${badge(S.newBadge, 'new')}${
          c.hidden ? badge(S.hiddenBadge, 'hidden', 'eyeOff') : ''
        }</p>
        <p class="adm-prow-meta">${esc(cText(c.tagline) || S.cpAddedState)}</p>
      </div>
      <div class="adm-prow-actions">
        ${customSwitch(c)}
        <a class="adm-btn" href="#products/${id}" data-fkey="edit-${id}">${icon('edit', 16)}<span>${esc(S.edit)}</span><span class="sr-only">: ${esc(name)}</span></a>
        <a class="adm-icon-btn" href="${esc(customUrl(c.id))}" target="_blank" rel="noopener" title="${esc(S.view)}">${icon('external', 18)}<span class="sr-only">${esc(S.view)}: ${esc(name)} ${esc(S.newWindow)}</span></a>
      </div>
    </li>`;
  }

  function productRow(p: AdminProduct, ov: Record<string, ProductOverride>): string {
    const o = ov[p.id];
    const hidden = !!o?.hidden;
    const name = effText(p, 'name', lang, ov);
    return `<li class="adm-prow${hidden ? ' is-hidden' : ''}" data-product="${p.id}">
      <a class="adm-prow-thumb" href="#products/${p.id}" tabindex="-1" aria-hidden="true">${
        p.thumb ? `<img src="${esc(p.thumb)}" alt="" width="96" height="64" loading="lazy" decoding="async" />` : ''
      }</a>
      <div class="adm-prow-info">
        <p class="adm-prow-name"><a href="#products/${p.id}" data-fkey="name-${p.id}">${esc(name)}</a>${
          hidden ? badge(S.hiddenBadge, 'hidden', 'eyeOff') : ''
        }${hasText(o) ? badge(S.editedBadge, 'edited') : ''}</p>
        <p class="adm-prow-meta">${esc(effText(p, 'tagline', lang, ov))}</p>
      </div>
      <div class="adm-prow-actions">
        ${visSwitch(p, hidden, name)}
        <a class="adm-btn" href="#products/${p.id}" data-fkey="edit-${p.id}">${icon('edit', 16)}<span>${esc(S.edit)}</span><span class="sr-only">: ${esc(name)}</span></a>
        <a class="adm-icon-btn" href="${esc(p.url)}" target="_blank" rel="noopener" title="${esc(S.view)}">${icon('external', 18)}<span class="sr-only">${esc(S.view)}: ${esc(name)} ${esc(S.newWindow)}</span></a>
      </div>
    </li>`;
  }

  function toggleVisibility(id: string) {
    const c = id.startsWith('c-') ? getCustomProduct(id) : undefined;
    if (c) {
      const hide = !c.hidden;
      let res = { ok: true } as SaveResult;
      mutate(() => (res = updateCustomProduct(id, { hidden: hide || undefined })));
      if (!res.ok) {
        refresh();
        return failed();
      }
      refresh();
      return toast(fmt(hide ? S.hiddenToast : S.shownToast, { name: cText(c.name) }));
    }
    const p = productById.get(id);
    if (!p) return;
    const o = overrides()[id];
    const hide = !o?.hidden;
    let ok = true;
    mutate(() => {
      ok = !hide && !hasText(o) ? clearOverride(id) : saveOverride(id, { hidden: hide ? true : undefined });
    });
    refresh(); // re-rendered from storage: on failure the switch flips back
    if (!ok) return failed();
    toast(fmt(hide ? S.hiddenToast : S.shownToast, { name: effText(p, 'name') }));
  }

  // ---------------------------------------------------------------------------
  // Product editor
  // ---------------------------------------------------------------------------

  const fieldLabel: Record<TextField, string> = { name: S.fName, tagline: S.fTagline, summary: S.fSummary };
  const imgLabel = (im: AdminImage) =>
    im.kind === 'hero' ? S.imgHero : im.kind === 'diagram' ? S.imgDiagram : fmt(S.imgGallery, { n: String(im.n).padStart(2, '0') });

  const disabledBtn = (ic: string, label: string, tipId: string) =>
    `<span class="adm-tipwrap"><button type="button" class="adm-btn adm-btn-disabled" aria-disabled="true" aria-describedby="${tipId}" data-disabled-demo>${icon(
      ic,
      16,
    )}<span>${esc(label)}</span></button><span class="adm-tip" role="tooltip" id="${tipId}">${esc(S.realOnly)}</span></span>`;

  function editorStateText(o?: ProductOverride) {
    return hasText(o) && o?.updatedAt ? fmt(S.lastSaved, { t: relTime(o.updatedAt, lang, S.justNow) }) : S.pristine;
  }

  function renderEditor() {
    const p = productById.get(state.arg);
    if (!p) {
      location.hash = '#products';
      return;
    }
    const o = overrides()[p.id] ?? {};
    const val = (f: TextField, l: Lang) => o[f]?.[l] || p[f][l];
    const tab = state.editorTab;
    const field = (f: TextField, l: Lang) => {
      const id = `adm-f-${f}-${l}`;
      const v = val(f, l);
      const orig = p[f][l];
      const control =
        f === 'summary'
          ? `<textarea id="${id}" class="textarea" rows="4" data-field="${f}" data-l="${l}" aria-describedby="${id}-err">${esc(v)}</textarea>`
          : `<input id="${id}" class="input" type="text" value="${esc(v)}" data-field="${f}" data-l="${l}" aria-describedby="${id}-err"${
              f === 'name' ? ' required' : ''
            } />`;
      return `<div class="field">
        <div class="adm-field-top"><label for="${id}">${esc(fieldLabel[f])}</label>${
          f === 'summary' ? `<span class="adm-counter num" data-counter="${l}">${esc(fmt(S.chars, { n: v.length }))}</span>` : ''
        }</div>
        ${control}
        <p class="hint adm-orig" data-orig="${f}-${l}"${v === orig ? ' hidden' : ''}>${esc(S.original)}: ${esc(orig)}</p>
        <p class="error" id="${id}-err" data-err="${f}-${l}"></p>
      </div>`;
    };
    const video = p.video
      ? `<p><a href="${esc(p.video)}" target="_blank" rel="noopener">${esc(p.video)}</a></p>`
      : `<p>${esc(S.noVideo)}</p>`;

    slot('editor').innerHTML = `
      <a class="adm-back" href="#products">${icon('arrowLeft', 16)}<span>${esc(S.back)}</span></a>
      <header class="adm-vh">
        <div>
          <h2 id="adm-h-editor" tabindex="-1">${esc(val('name', lang))}</h2>
          <p class="adm-ed-state"><span>${esc(catById.get(p.category)?.name ?? '')}</span><span aria-hidden="true">·</span><span data-ed-state>${esc(
            editorStateText(o),
          )}</span></p>
        </div>
        <div class="adm-ed-tools">
          <span data-ed-vis>${visSwitch(p, !!o.hidden, val('name', lang))}</span>
          <a class="adm-btn" href="${esc(p.url)}" target="_blank" rel="noopener">${icon('external', 16)}<span>${esc(S.viewPage)}</span>${newTab}</a>
        </div>
      </header>
      <div class="adm-editor">
        <form class="adm-panel adm-ed-form" data-ed-form novalidate>
          <div class="adm-tabs" role="tablist" aria-label="${esc(S.langTabs)}" data-tabs="ed">
            ${LANGS.map(
              (l) =>
                `<button type="button" role="tab" id="adm-edtab-${l}" aria-controls="adm-edtp-${l}" aria-selected="${tab === l}" tabindex="${
                  tab === l ? 0 : -1
                }" data-tab="${l}">${esc(l === 'bg' ? S.tabBg : S.tabEn)}<span class="adm-tab-code" aria-hidden="true">${l.toUpperCase()}</span><span class="adm-tab-dot" data-dirty-dot="${l}" hidden></span></button>`,
            ).join('')}
          </div>
          ${LANGS.map(
            (l) =>
              `<div class="adm-tp" role="tabpanel" id="adm-edtp-${l}" aria-labelledby="adm-edtab-${l}" lang="${l}"${tab === l ? '' : ' hidden'}>${TEXT_FIELDS.map(
                (f) => field(f, l),
              ).join('')}</div>`,
          ).join('')}
          <div class="adm-ed-actions">
            <button type="submit" class="btn btn-sm" data-ed-save disabled>${icon('check', 18)}<span>${esc(S.save)}</span></button>
            <button type="button" class="btn btn-ghost btn-sm" data-ed-discard disabled>${esc(S.discard)}</button>
            <span class="adm-ed-dirty" data-ed-dirty hidden>${esc(S.unsaved)}</span>
            <button type="button" class="adm-btn-text" data-ed-revert${hasText(o) ? '' : ' disabled'}>${icon('reset', 16)}<span>${esc(S.revert)}</span></button>
          </div>
        </form>
        <aside class="adm-pv-wrap" aria-labelledby="adm-pv-h">
          <div class="adm-pv-head"><h3 id="adm-pv-h">${esc(S.preview)}</h3><span class="adm-pv-lang" data-pv-lang>${tab.toUpperCase()}</span></div>
          <article class="adm-pv" lang="${tab}" data-pv>
            <div class="adm-pv-media">${p.card ? `<img src="${esc(p.card)}" alt="" width="720" height="480" />` : ''}</div>
            <div class="adm-pv-body">
              <p class="adm-pv-title" data-pv-f="name">${esc(val('name', tab))}</p>
              <p class="adm-pv-tag" data-pv-f="tagline">${esc(val('tagline', tab))}</p>
              <p class="adm-pv-sum" data-pv-f="summary">${esc(val('summary', tab))}</p>
              <span class="adm-pv-more" aria-hidden="true"><span data-pv-more>${esc(VIEW_PRODUCT[tab])}</span>${icon('arrowRight', 16)}</span>
            </div>
          </article>
          <p class="adm-note">${esc(S.previewNote)}</p>
        </aside>
      </div>
      <section class="adm-panel adm-ed-media" aria-labelledby="adm-img-h">
        <div class="adm-panel-h">
          <div><h3 id="adm-img-h">${esc(S.images)}</h3><p class="adm-panel-sub">${esc(S.imagesNote)}</p></div>
          ${disabledBtn('upload', S.upload, 'adm-tip-upload')}
        </div>
        <div class="adm-imgs">${p.images
          .map(
            (im) =>
              `<figure class="adm-img"><div class="adm-img-media">${
                im.src ? `<img src="${esc(im.src)}" alt="${esc(im.alt)}" loading="lazy" decoding="async" />` : ''
              }</div><figcaption>${esc(imgLabel(im))}</figcaption></figure>`,
          )
          .join('')}</div>
        <div class="adm-ed-video">
          <div><h3>${esc(S.video)}</h3>${video}</div>
          ${disabledBtn('play', S.addVideo, 'adm-tip-video')}
        </div>
      </section>
      <p class="adm-note adm-ed-more">${icon('info', 16)}<span>${esc(S.moreFields)}</span></p>`;
  }

  function editorValues(): Record<TextField, Pair> {
    const form = q('[data-ed-form]');
    const out = {} as Record<TextField, Pair>;
    TEXT_FIELDS.forEach((f) => {
      out[f] = { bg: '', en: '' };
      LANGS.forEach((l) => {
        out[f][l] = form ? (q<HTMLInputElement>(`[data-field="${f}"][data-l="${l}"]`, form)?.value ?? '') : '';
      });
    });
    return out;
  }

  function onEditorInput() {
    const p = productById.get(state.arg);
    if (!p) return;
    const o = overrides()[p.id] ?? {};
    const v = editorValues();
    let dirty = false;
    const dirtyLang: Record<Lang, boolean> = { bg: false, en: false };
    TEXT_FIELDS.forEach((f) =>
      LANGS.forEach((l) => {
        const stored = o[f]?.[l] || p[f][l];
        if (v[f][l] !== stored) {
          dirty = true;
          dirtyLang[l] = true;
        }
        const orig = q(`[data-orig="${f}-${l}"]`);
        if (orig) orig.hidden = v[f][l].trim() === p[f][l] || !v[f][l].trim();
        if (v[f][l].trim()) {
          const err = q(`[data-err="${f}-${l}"]`);
          if (err?.textContent) {
            err.textContent = '';
            q(`[data-field="${f}"][data-l="${l}"]`)?.removeAttribute('aria-invalid');
          }
        }
      }),
    );
    LANGS.forEach((l) => {
      const c = q(`[data-counter="${l}"]`);
      if (c) c.textContent = fmt(S.chars, { n: v.summary[l].length });
      const dot = q(`[data-dirty-dot="${l}"]`);
      if (dot) dot.hidden = !dirtyLang[l];
    });
    q<HTMLButtonElement>('[data-ed-save]')!.disabled = !dirty;
    q<HTMLButtonElement>('[data-ed-discard]')!.disabled = !dirty;
    q('[data-ed-dirty]')!.hidden = !dirty;
    updatePreview();
  }

  function updatePreview() {
    const p = productById.get(state.arg);
    const pv = q('[data-pv]');
    if (!p || !pv) return;
    const v = editorValues();
    const l = state.editorTab;
    TEXT_FIELDS.forEach((f) => {
      const el = q(`[data-pv-f="${f}"]`, pv);
      if (el) el.textContent = v[f][l].trim() || p[f][l];
    });
    pv.lang = l;
    q('[data-pv-lang]')!.textContent = l.toUpperCase();
    q('[data-pv-more]', pv)!.textContent = VIEW_PRODUCT[l];
  }

  function saveEditor() {
    const p = productById.get(state.arg);
    if (!p) return;
    const v = editorValues();
    for (const l of LANGS) {
      if (!v.name[l].trim()) {
        const input = q<HTMLInputElement>(`[data-field="name"][data-l="${l}"]`)!;
        q(`[data-err="name-${l}"]`)!.textContent = S.nameRequired;
        input.setAttribute('aria-invalid', 'true');
        const tabEl = q(`[data-tabs="ed"] [data-tab="${l}"]`);
        if (tabEl) selectTab(tabEl);
        input.focus();
        return;
      }
    }
    const patch: ProductOverride = {};
    TEXT_FIELDS.forEach((f) => {
      const diff: { bg?: string; en?: string } = {};
      LANGS.forEach((l) => {
        const t = v[f][l].trim();
        if (t && t !== p[f][l]) diff[l] = t;
      });
      patch[f] = Object.keys(diff).length ? diff : undefined;
    });
    const o = overrides()[p.id];
    let ok = true;
    mutate(() => {
      ok = !hasText(patch) && !o?.hidden ? clearOverride(p.id) : saveOverride(p.id, patch);
    });
    if (!ok) return failed(); // the form keeps the edits
    renderEditor();
    updateNavCount();
    document.title = `${viewTitle()} · ${S.title} · OUTPLAY`;
    q<HTMLElement>('#adm-h-editor')?.focus();
    toast(S.savedToast, { href: p.url, label: S.viewPage });
  }

  async function revertEditor() {
    const p = productById.get(state.arg);
    if (!p) return;
    const res = await confirmDialog({
      title: S.revertTitle,
      text: fmt(S.revertText, { name: p.name[lang] }),
      ok: S.revertConfirm,
      danger: true,
    });
    if (!res.ok) return;
    const hidden = !!overrides()[p.id]?.hidden;
    let ok = true;
    mutate(() => {
      ok = clearOverride(p.id) && (!hidden || saveOverride(p.id, { hidden: true }));
    });
    if (!ok) return failed();
    renderEditor();
    document.title = `${viewTitle()} · ${S.title} · OUTPLAY`;
    q<HTMLElement>('#adm-h-editor')?.focus();
    toast(S.revertedToast);
  }

  /** Background refresh while the editor is open: never wipe unsaved text */
  function syncEditorChrome() {
    const p = productById.get(state.arg);
    if (!p) return;
    const o = overrides()[p.id];
    const vis = q('[data-ed-vis]');
    if (vis) keepFocus(vis, () => (vis.innerHTML = visSwitch(p, !!o?.hidden, effText(p, 'name'))));
    const st = q('[data-ed-state]');
    if (st) st.textContent = editorStateText(o);
    const rv = q<HTMLButtonElement>('[data-ed-revert]');
    if (rv) rv.disabled = !hasText(o);
  }

  // ---------------------------------------------------------------------------
  // Custom products: editor (#products/new, #products/c-…)
  // ---------------------------------------------------------------------------

  type DraftText = 'name' | 'tagline' | 'summary' | 'description' | 'features';
  const emptyPair = (): Pair => ({ bg: '', en: '' });
  const famLabel: Record<FamilyId, string> = {
    pergola: S.famPergola,
    glass: S.famGlass,
    door: S.famDoor,
    zip: S.famZip,
    awning: S.famAwning,
    windbreak: S.famWindbreak,
  };
  const draftLabel: Record<DraftText, string> = {
    name: S.fName,
    tagline: S.fTagline,
    summary: S.fSummary,
    description: S.cpDescription,
    features: S.cpFeatures,
  };

  const subgroupsOf = (cat: string) => D.categories.find((c) => c.id === cat)?.subgroups ?? [];
  const firstSubgroup = (cat: string) => subgroupsOf(cat)[0]?.id ?? '';

  function emptyDraft(): Draft {
    const category = (D.categories[0]?.id ?? 'bioclimatic-pergolas') as CategoryId;
    return {
      id: null,
      category,
      subgroup: firstSubgroup(category),
      family: DEFAULT_FAMILY[category],
      familyTouched: false,
      name: emptyPair(),
      tagline: emptyPair(),
      summary: emptyPair(),
      description: emptyPair(),
      features: emptyPair(),
      specs: [],
      images: [],
    };
  }

  function draftFromProduct(c: CustomProduct): Draft {
    const pair = (v?: Partial<Pair>): Pair => ({ bg: v?.bg ?? '', en: v?.en ?? '' });
    const joined = (items: Partial<Pair>[], sep: string): Pair => ({
      bg: items.map((i) => (i.bg ?? '').trim()).filter(Boolean).join(sep),
      en: items.map((i) => (i.en ?? '').trim()).filter(Boolean).join(sep),
    });
    return {
      id: c.id,
      category: c.category,
      subgroup: subgroupsOf(c.category).some((g) => g.id === c.subgroup) ? c.subgroup! : firstSubgroup(c.category),
      family: c.family,
      familyTouched: true,
      name: pair(c.name),
      tagline: pair(c.tagline),
      summary: pair(c.summary),
      description: joined((c.sections ?? []).flatMap((x) => x.paragraphs ?? []), '\n\n'),
      features: joined(c.features ?? [], '\n'),
      specs: (c.specs ?? []).map((r) => ({ label: pair(r.label), value: pair(r.value) })),
      images: [...(c.images ?? [])],
    };
  }

  function productFromDraft(d: Draft, existing?: CustomProduct): CustomProduct {
    const trim = (p: Pair): Pair => ({ bg: p.bg.trim(), en: p.en.trim() });
    // BG and EN are split separately and paired by position (either side may be empty)
    const pairList = (p: Pair, split: RegExp): Pair[] => {
      const bg = p.bg.split(split).map((x) => x.trim()).filter(Boolean);
      const en = p.en.split(split).map((x) => x.trim()).filter(Boolean);
      return Array.from({ length: Math.max(bg.length, en.length) }, (_, i) => ({ bg: bg[i] ?? '', en: en[i] ?? '' }));
    };
    const paragraphs = pairList(d.description, /\n\s*\n/);
    const now = new Date().toISOString();
    return {
      id:
        d.id ??
        customProductId(d.name.bg || d.name.en, [...customs().map((c) => c.id), ...D.products.map((p) => p.id)]),
      category: d.category,
      ...(d.subgroup ? { subgroup: d.subgroup } : {}),
      family: d.family,
      name: trim(d.name),
      tagline: trim(d.tagline),
      summary: trim(d.summary),
      sections: paragraphs.length ? [{ heading: OVERVIEW, paragraphs }] : [],
      features: pairList(d.features, /\n/),
      specs: d.specs
        .map((r) => ({ label: trim(r.label), value: trim(r.value) }))
        .filter((r) => r.label.bg || r.label.en || r.value.bg || r.value.en),
      images: [...d.images],
      ...(existing?.hidden ? { hidden: true } : {}),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
  }

  const customStateText = (c?: CustomProduct) =>
    c ? fmt(S.lastSaved, { t: relTime(c.updatedAt || c.createdAt, lang, S.justNow) }) : S.unsaved;
  const storageLine = () =>
    fmt(S.cpStorage, { used: formatBytes(storageUsed(), lang), total: formatBytes(STORAGE_BUDGET, lang) });

  function renderCustomEditor() {
    const existing = state.arg === 'new' ? undefined : getCustomProduct(state.arg);
    if (state.arg !== 'new' && !existing) {
      location.hash = '#products';
      return;
    }
    if (!state.draft) {
      state.draft = existing ? draftFromProduct(existing) : emptyDraft();
      state.draftBase = JSON.stringify(state.draft);
    }
    const d = state.draft;
    const tab = state.customTab;
    const title = existing ? cText(existing.name) : S.cpNewTitle;
    const MAX = CUSTOM_MAX_IMAGES;

    const textField = (f: DraftText, l: Lang) => {
      const id = `adm-cp-${f}-${l}`;
      const v = d[f][l];
      const multi = f === 'summary' || f === 'description' || f === 'features';
      const rows = f === 'summary' ? 3 : f === 'description' ? 7 : 5;
      const fallback = l === 'en' ? truncate(d[f].bg.split('\n')[0] ?? '', 90) : '';
      const ph = fallback ? ` placeholder="${esc(fallback)}"` : '';
      const hint = f === 'description' ? S.cpDescriptionHint : f === 'features' ? S.cpFeaturesHint : '';
      const required = f === 'name' && l === 'bg';
      const attrs = `id="${id}" data-cp-field="${f}" data-l="${l}" data-fkey="cp-${f}-${l}" aria-describedby="${id}-err${hint ? ` ${id}-hint` : ''}"${
        required ? ' aria-required="true"' : ''
      }${ph}`;
      return `<div class="field">
        <div class="adm-field-top"><label for="${id}">${esc(draftLabel[f])}</label>${
          required ? `<span class="adm-req">${esc(S.required)}</span>` : ''
        }</div>
        ${multi ? `<textarea class="textarea" rows="${rows}" ${attrs}>${esc(v)}</textarea>` : `<input class="input" type="text" value="${esc(v)}" ${attrs} />`}
        ${hint ? `<p class="hint" id="${id}-hint">${esc(hint)}</p>` : ''}
        <p class="error" id="${id}-err" data-cp-err="${f}-${l}"></p>
      </div>`;
    };

    const specRows = (l: Lang) =>
      d.specs.length
        ? `<ol class="adm-specs">${d.specs
            .map((r, i) => {
              const n = i + 1;
              const phLabel = l === 'en' && r.label.bg ? r.label.bg : S.cpSpecLabel;
              const phValue = l === 'en' && r.value.bg ? r.value.bg : S.cpSpecValue;
              return `<li class="adm-spec-row">
                <input class="input" type="text" value="${esc(r.label[l])}" placeholder="${esc(phLabel)}" aria-label="${esc(`${S.cpSpecLabel} ${n}`)}" data-cp-spec="${i}" data-part="label" data-l="${l}" data-fkey="cp-spec-${i}-label-${l}" />
                <input class="input" type="text" value="${esc(r.value[l])}" placeholder="${esc(phValue)}" aria-label="${esc(`${S.cpSpecValue} ${n}`)}" data-cp-spec="${i}" data-part="value" data-l="${l}" data-fkey="cp-spec-${i}-value-${l}" />
                <button type="button" class="adm-icon-btn" data-cp-spec-remove="${i}" data-fkey="cp-spec-x-${i}-${l}">${icon('trash', 16)}<span class="sr-only">${esc(
                  fmt(S.cpSpecRemove, { n }),
                )}</span></button>
              </li>`;
            })
            .join('')}</ol>`
        : `<p class="adm-muted adm-cp-empty">${esc(S.cpSpecsEmpty)}</p>`;

    const panel = (l: Lang) => `<div class="adm-tp" role="tabpanel" id="adm-cptp-${l}" aria-labelledby="adm-cptab-${l}" lang="${l}"${tab === l ? '' : ' hidden'}>
        ${l === 'en' ? `<p class="adm-note">${icon('info', 16)}<span>${esc(S.cpEnFallback)}</span></p>` : ''}
        ${(['name', 'tagline', 'summary', 'description', 'features'] as DraftText[]).map((f) => textField(f, l)).join('')}
        <div class="adm-cp-specs" role="group" aria-labelledby="adm-cp-specs-${l}">
          <p class="adm-cp-label" id="adm-cp-specs-${l}">${esc(S.cpSpecs)}</p>
          ${specRows(l)}
          <button type="button" class="adm-btn" data-cp-spec-add data-fkey="cp-spec-add-${l}">${icon('plus', 16)}<span>${esc(S.cpSpecAdd)}</span></button>
        </div>
      </div>`;

    const thumbs = d.images
      .map((src, i) => {
        const photo = fmt(S.cpPhotoN, { n: i + 1 });
        const last = i === d.images.length - 1;
        return `<li class="adm-thumb">
          <div class="adm-thumb-media"><img src="${esc(src)}" alt="${esc(photo)}" />${i === 0 ? `<span class="adm-thumb-main">${esc(S.cpMain)}</span>` : ''}</div>
          <div class="adm-thumb-tools">
            <button type="button" class="adm-icon-btn" data-cp-img-move="${i}" data-dir="-1" data-fkey="cp-img-l-${i}"${i === 0 ? ' disabled' : ''}>${icon(
              'chevronLeft',
              16,
            )}<span class="sr-only">${esc(`${S.cpMoveLeft}: ${photo}`)}</span></button>
            <button type="button" class="adm-icon-btn" data-cp-img-move="${i}" data-dir="1" data-fkey="cp-img-r-${i}"${last ? ' disabled' : ''}>${icon(
              'chevronRight',
              16,
            )}<span class="sr-only">${esc(`${S.cpMoveRight}: ${photo}`)}</span></button>
            ${i > 0 ? `<button type="button" class="adm-btn-text" data-cp-img-main="${i}" data-fkey="cp-img-m-${i}">${esc(S.cpMakeMain)}</button>` : ''}
            <button type="button" class="adm-icon-btn adm-thumb-x" data-cp-img-remove="${i}" data-fkey="cp-img-x-${i}">${icon(
              'trash',
              16,
            )}<span class="sr-only">${esc(`${S.cpRemoveImg}: ${photo}`)}</span></button>
          </div>
        </li>`;
      })
      .join('');

    const pvName = cText(d.name, tab);
    slot('custom').innerHTML = `
      <a class="adm-back" href="#products">${icon('arrowLeft', 16)}<span>${esc(S.back)}</span></a>
      <header class="adm-vh">
        <div>
          <h2 id="adm-h-custom" tabindex="-1">${esc(title)}</h2>
          <p class="adm-ed-state">${badge(S.newBadge, 'new')}<span data-cp-state>${esc(existing ? customStateText(existing) : S.cpNewState)}</span></p>
        </div>
        ${
          existing
            ? `<div class="adm-ed-tools"><span data-cp-vis>${customSwitch(existing)}</span><a class="adm-btn" href="${esc(
                customUrl(existing.id),
              )}" target="_blank" rel="noopener">${icon('external', 16)}<span>${esc(S.viewPage)}</span>${newTab}</a></div>`
            : ''
        }
      </header>
      <div class="adm-editor">
        <form class="adm-cp-form" data-cp-form novalidate>
          <section class="adm-panel" aria-labelledby="adm-cp-basics">
            <div class="adm-panel-h"><h3 id="adm-cp-basics">${esc(S.cpBasics)}</h3></div>
            <div class="adm-cp-grid">
              <div class="field"><label for="adm-cp-cat">${esc(S.cpCategory)}</label>
                <select id="adm-cp-cat" class="select" data-cp-select="category" data-fkey="cp-cat">${D.categories
                  .map((c) => `<option value="${c.id}"${c.id === d.category ? ' selected' : ''}>${esc(c.name)}</option>`)
                  .join('')}</select></div>
              ${
                subgroupsOf(d.category).length
                  ? `<div class="field"><label for="adm-cp-sub">${esc(S.cpSubgroup)}</label>
                <select id="adm-cp-sub" class="select" data-cp-select="subgroup" data-fkey="cp-sub" aria-describedby="adm-cp-sub-hint">${subgroupsOf(d.category)
                  .map((g) => `<option value="${esc(g.id)}"${g.id === d.subgroup ? ' selected' : ''}>${esc(g.name)}</option>`)
                  .join('')}</select>
                <p class="hint" id="adm-cp-sub-hint">${esc(S.cpSubgroupHint)}</p></div>`
                  : ''
              }
              <div class="field"><label for="adm-cp-fam">${esc(S.cpFamily)}</label>
                <select id="adm-cp-fam" class="select" data-cp-select="family" data-fkey="cp-fam" aria-describedby="adm-cp-fam-hint">${FAMILIES.map(
                  (f) => `<option value="${f}"${f === d.family ? ' selected' : ''}>${esc(famLabel[f])}</option>`,
                ).join('')}</select>
                <p class="hint" id="adm-cp-fam-hint">${esc(S.cpFamilyHint)}</p></div>
            </div>
          </section>
          <section class="adm-panel" aria-labelledby="adm-cp-texts">
            <div class="adm-panel-h"><h3 id="adm-cp-texts">${esc(S.cpTexts)}</h3></div>
            <div class="adm-cp-body">
              <div class="adm-tabs" role="tablist" aria-label="${esc(S.langTabs)}" data-tabs="cp">
                ${LANGS.map(
                  (l) =>
                    `<button type="button" role="tab" id="adm-cptab-${l}" aria-controls="adm-cptp-${l}" aria-selected="${tab === l}" tabindex="${
                      tab === l ? 0 : -1
                    }" data-tab="${l}">${esc(l === 'bg' ? S.tabBg : S.tabEn)}<span class="adm-tab-code" aria-hidden="true">${l.toUpperCase()}</span></button>`,
                ).join('')}
              </div>
              ${LANGS.map(panel).join('')}
            </div>
          </section>
          <section class="adm-panel" aria-labelledby="adm-cp-img">
            <div class="adm-panel-h"><div><h3 id="adm-cp-img">${esc(S.cpImages)} <span class="adm-group-n num">${d.images.length} / ${MAX}</span></h3>
              <p class="adm-panel-sub">${esc(fmt(S.cpImagesHint, { n: MAX }))}</p></div></div>
            ${d.images.length ? `<ul class="adm-thumbs">${thumbs}</ul>` : `<p class="adm-muted adm-cp-noimg">${esc(S.cpNoImages)}</p>`}
            ${
              d.images.length < MAX
                ? `<div class="adm-drop" data-cp-drop>
                    <input type="file" id="adm-cp-file" class="sr-only" accept="image/jpeg,image/png,image/webp" multiple data-cp-file data-fkey="cp-file" />
                    <label for="adm-cp-file" class="adm-btn" data-cp-upload>${icon('upload', 16)}<span>${esc(state.busy ? S.cpProcessing : S.cpUpload)}</span></label>
                    <span class="adm-muted">${esc(S.cpDrop)}</span>
                  </div>`
                : `<p class="adm-note adm-cp-full">${icon('info', 16)}<span>${esc(fmt(S.cpTooMany, { n: MAX }))}</span></p>`
            }
            <p class="adm-note adm-cp-storage" data-cp-storage>${icon('info', 16)}<span>${esc(storageLine())}</span></p>
          </section>
          <p class="adm-cp-error" role="alert" data-cp-error></p>
          <div class="adm-ed-actions adm-cp-actions">
            <button type="submit" class="btn btn-sm" data-cp-save>${icon('check', 18)}<span>${esc(S.save)}</span></button>
            ${
              existing
                ? `<button type="button" class="btn btn-ghost btn-sm" data-cp-discard disabled>${esc(S.discard)}</button>`
                : `<a class="btn btn-ghost btn-sm" href="#products">${esc(S.cancel)}</a>`
            }
            <span class="adm-ed-dirty" data-cp-dirty hidden>${esc(S.unsaved)}</span>
            ${existing ? `<button type="button" class="adm-btn adm-btn-danger adm-cp-del" data-cp-delete>${icon('trash', 16)}<span>${esc(S.cpDelete)}</span></button>` : ''}
          </div>
        </form>
        <aside class="adm-pv-wrap" aria-labelledby="adm-cpv-h">
          <div class="adm-pv-head"><h3 id="adm-cpv-h">${esc(S.preview)}</h3><span class="adm-pv-lang" data-cpv-lang>${tab.toUpperCase()}</span></div>
          <article class="adm-pv" lang="${tab}" data-cpv>
            <div class="adm-pv-media">${d.images[0] ? `<img src="${esc(d.images[0])}" alt="" />` : ''}</div>
            <div class="adm-pv-body">
              <p class="adm-pv-title${pvName ? '' : ' is-empty'}" data-cpv-f="name">${esc(pvName || S.cpNewTitle)}</p>
              <p class="adm-pv-tag" data-cpv-f="tagline">${esc(cText(d.tagline, tab))}</p>
              <p class="adm-pv-sum" data-cpv-f="summary">${esc(cText(d.summary, tab))}</p>
              <span class="adm-pv-more" aria-hidden="true"><span data-cpv-more>${esc(VIEW_PRODUCT[tab])}</span>${icon('arrowRight', 16)}</span>
            </div>
          </article>
          <p class="adm-note">${esc(S.previewNote)}</p>
        </aside>
      </div>`;
    updateCustomUi();
  }

  /** Re-render the custom editor from the draft, keeping focus and scroll */
  const paintCustom = () => keepFocus(viewEl('custom'), renderCustomEditor);

  function updateCustomUi() {
    const d = state.draft;
    if (!d) return;
    const dirty = JSON.stringify(d) !== state.draftBase;
    const isNew = !d.id;
    const save = q<HTMLButtonElement>('[data-cp-save]');
    if (save) save.disabled = !isNew && !dirty;
    const discard = q<HTMLButtonElement>('[data-cp-discard]');
    if (discard) discard.disabled = !dirty;
    const flag = q('[data-cp-dirty]');
    if (flag) flag.hidden = !dirty || isNew;
    // preview in the active language (empty English falls back to Bulgarian, as on the site)
    const pv = q('[data-cpv]');
    if (!pv) return;
    const l = state.customTab;
    const name = cText(d.name, l);
    const nameEl = q('[data-cpv-f="name"]', pv)!;
    nameEl.textContent = name || S.cpNewTitle;
    nameEl.classList.toggle('is-empty', !name);
    q('[data-cpv-f="tagline"]', pv)!.textContent = cText(d.tagline, l);
    q('[data-cpv-f="summary"]', pv)!.textContent = cText(d.summary, l);
    q('[data-cpv-more]', pv)!.textContent = VIEW_PRODUCT[l];
    q('[data-cpv-lang]')!.textContent = l.toUpperCase();
    pv.lang = l;
  }

  function onCustomInput(t: HTMLElement) {
    const d = state.draft;
    if (!d) return;
    const el = t as HTMLInputElement;
    const l = el.dataset.l as Lang | undefined;
    if (!l) return;
    if (el.dataset.cpField) {
      const f = el.dataset.cpField as DraftText;
      d[f][l] = el.value;
      if (el.value.trim()) {
        const err = q(`[data-cp-err="${f}-${l}"]`);
        if (err) err.textContent = '';
        el.removeAttribute('aria-invalid');
      }
    } else if (el.dataset.cpSpec !== undefined) {
      const row = d.specs[Number(el.dataset.cpSpec)];
      if (row) row[el.dataset.part === 'value' ? 'value' : 'label'][l] = el.value;
    }
    updateCustomUi();
  }

  function onCustomSelect(el: HTMLSelectElement) {
    const d = state.draft;
    if (!d) return;
    if (el.dataset.cpSelect === 'category') {
      d.category = el.value as CategoryId;
      d.subgroup = firstSubgroup(d.category);
      if (!d.familyTouched) d.family = DEFAULT_FAMILY[d.category];
      paintCustom(); // the subgroup choices depend on the category
      return;
    } else if (el.dataset.cpSelect === 'subgroup') {
      d.subgroup = el.value;
    } else {
      d.family = el.value as FamilyId;
      d.familyTouched = true;
    }
    updateCustomUi();
  }

  async function addImages(files: File[]) {
    const d = state.draft;
    if (!d || state.busy || !files.length) return;
    const room = CUSTOM_MAX_IMAGES - d.images.length;
    const problems: string[] = [];
    if (files.length > room) problems.push(fmt(S.cpTooMany, { n: CUSTOM_MAX_IMAGES }));
    state.busy = true;
    const label = q('[data-cp-upload] span');
    if (label) label.textContent = S.cpProcessing;
    for (const f of files.slice(0, Math.max(0, room))) {
      try {
        d.images.push(await resizeImage(f, 1600, 0.8));
      } catch {
        problems.push(fmt(S.cpBadFile, { name: f.name }));
      }
    }
    state.busy = false;
    if (state.view === 'custom' && state.draft === d) {
      paintCustom();
      q<HTMLElement>('[data-cp-upload]')?.closest('.adm-drop')?.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true });
    }
    problems.forEach((m) => toast(m));
  }

  function moveImage(from: number, to: number, focusKey: string) {
    const d = state.draft;
    if (!d || to < 0 || to >= d.images.length) return;
    const [img] = d.images.splice(from, 1);
    d.images.splice(to, 0, img);
    renderCustomEditor();
    q<HTMLElement>(`[data-fkey="${focusKey}"]:not(:disabled)`)?.focus({ preventScroll: true });
  }

  function removeImage(i: number) {
    const d = state.draft;
    if (!d) return;
    d.images.splice(i, 1);
    renderCustomEditor();
    const next =
      q<HTMLElement>(`[data-fkey="cp-img-x-${Math.min(i, d.images.length - 1)}"]`) ?? q<HTMLElement>('[data-cp-file]');
    next?.focus({ preventScroll: true });
  }

  function saveCustom() {
    const d = state.draft;
    if (!d) return;
    const errBox = q('[data-cp-error]');
    if (errBox) errBox.textContent = '';
    if (!d.name.bg.trim()) {
      const tabEl = q('[data-tabs="cp"] [data-tab="bg"]');
      if (tabEl) selectTab(tabEl);
      const input = q<HTMLInputElement>('#adm-cp-name-bg')!;
      q('[data-cp-err="name-bg"]')!.textContent = S.cpNameRequired;
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }
    const existing = d.id ? getCustomProduct(d.id) : undefined;
    const product = productFromDraft(d, existing);
    let res = { ok: true } as SaveResult;
    mutate(() => (res = saveCustomProduct(product)));
    if (!res.ok) {
      const msg = res.reason === 'quota' ? S.cpQuota : S.cpUnavailable;
      if (errBox) errBox.textContent = msg;
      const storage = q('[data-cp-storage] span');
      if (storage) storage.textContent = storageLine();
      toast(msg);
      return;
    }
    state.draft = null;
    updateNavCount();
    const link = { href: customUrl(product.id), label: S.viewPage };
    if (!existing) {
      location.hash = `#products/${product.id}`;
      toast(S.cpCreated, link);
      return;
    }
    renderCustomEditor();
    document.title = `${viewTitle()} · ${S.title} · OUTPLAY`;
    q<HTMLElement>('#adm-h-custom')?.focus();
    toast(S.savedToast, link);
  }

  async function deleteCustom() {
    const id = state.draft?.id;
    const c = id ? getCustomProduct(id) : undefined;
    if (!c) return;
    const res = await confirmDialog({
      title: S.cpDeleteTitle,
      text: fmt(S.cpDeleteText, { name: cText(c.name) }),
      ok: S.delete,
      danger: true,
    });
    if (!res.ok) return;
    let result: { ok: boolean } = { ok: true };
    mutate(() => {
      result = deleteCustomProduct(c.id);
    });
    if (!result.ok) {
      failed();
      return;
    }
    state.draft = null;
    location.hash = '#products';
    toast(S.cpDeleted);
  }

  /** Background refresh while the custom editor is open: never wipe the draft */
  function syncCustomChrome() {
    if (state.arg === 'new') return;
    const c = getCustomProduct(state.arg);
    if (!c) {
      state.draft = null;
      location.hash = '#products';
      return;
    }
    const vis = q('[data-cp-vis]');
    if (vis) keepFocus(vis, () => (vis.innerHTML = customSwitch(c)));
    const st = q('[data-cp-state]');
    if (st) st.textContent = customStateText(c);
  }

  // ---------------------------------------------------------------------------
  // Tabs (product editor and FAQ editor)
  // ---------------------------------------------------------------------------

  function selectTab(tab: HTMLElement, focus = false) {
    const list = tab.closest<HTMLElement>('[role="tablist"]');
    if (!list) return;
    qa('[role="tab"]', list).forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls') ?? '');
      if (panel) panel.hidden = !on;
    });
    if (focus) tab.focus();
    const l = tab.dataset.tab as Lang;
    if (list.dataset.tabs === 'ed') {
      state.editorTab = l;
      updatePreview();
    } else if (list.dataset.tabs === 'faq') {
      state.faqTab = l;
    } else if (list.dataset.tabs === 'cp') {
      state.customTab = l;
      updateCustomUi();
    }
  }

  // ---------------------------------------------------------------------------
  // FAQ
  // ---------------------------------------------------------------------------

  function renderFaq() {
    const ed = loadFaq();
    slot('faq').innerHTML = D.faq
      .map(
        (g) => `<section class="adm-group" aria-labelledby="adm-fg-${g.id}">
          <div class="adm-group-h"><h3 id="adm-fg-${g.id}">${esc(g.title)}</h3><span class="adm-group-n">${esc(
            fmt(S.itemsCount, { n: g.items.length }),
          )}</span></div>
          <ul class="adm-flist">${g.items.map((it) => faqRow(it, ed)).join('')}</ul>
        </section>`,
      )
      .join('');
  }

  function faqRow(it: AdminFaqItem, ed: FaqEdits): string {
    const open = state.faqEditing === it.id;
    const edited = !!ed[it.id];
    const qText = faqText(it, 'q', lang, ed);
    return `<li class="adm-frow${open ? ' is-open' : ''}" data-faq="${it.id}">
      <div class="adm-frow-h">
        <div class="adm-frow-text">
          <p class="adm-frow-q">${esc(qText)}${edited ? badge(S.editedBadge, 'edited') : ''}</p>
          ${open ? '' : `<p class="adm-frow-a">${esc(truncate(faqText(it, 'a', lang, ed), 170))}</p>`}
        </div>
        <button type="button" class="adm-btn" data-faq-edit="${it.id}" data-fkey="faq-${it.id}" aria-expanded="${open}"${
          open ? ` aria-controls="adm-fe-${it.id}"` : ''
        }>${icon(open ? 'close' : 'edit', 16)}<span>${esc(open ? S.close : S.edit)}</span><span class="sr-only">: ${esc(qText)}</span></button>
      </div>
      ${open ? faqEditor(it, ed) : ''}
    </li>`;
  }

  function faqEditor(it: AdminFaqItem, ed: FaqEdits): string {
    const tab = state.faqTab;
    const id = it.id;
    const panel = (l: Lang) => {
      const qv = faqText(it, 'q', l, ed);
      const av = faqText(it, 'a', l, ed);
      return `<div class="adm-tp" role="tabpanel" id="adm-fetp-${id}-${l}" aria-labelledby="adm-fetab-${id}-${l}" lang="${l}"${tab === l ? '' : ' hidden'}>
        <div class="field"><label for="adm-fq-${id}-${l}">${esc(S.question)}</label>
          <input id="adm-fq-${id}-${l}" class="input" type="text" value="${esc(qv)}" data-fq="${l}" aria-describedby="adm-fq-${id}-${l}-err" />
          <p class="hint adm-orig" data-forig="q-${l}"${qv === it.q[l] ? ' hidden' : ''}>${esc(S.original)}: ${esc(it.q[l])}</p>
          <p class="error" id="adm-fq-${id}-${l}-err" data-ferr="q-${l}"></p></div>
        <div class="field"><label for="adm-fa-${id}-${l}">${esc(S.answer)}</label>
          <textarea id="adm-fa-${id}-${l}" class="textarea" rows="6" data-fa="${l}" aria-describedby="adm-fa-${id}-${l}-err">${esc(av)}</textarea>
          <p class="error" id="adm-fa-${id}-${l}-err" data-ferr="a-${l}"></p></div>
      </div>`;
    };
    return `<form class="adm-fe" id="adm-fe-${id}" data-faq-form="${id}" novalidate>
      <div class="adm-tabs" role="tablist" aria-label="${esc(S.langTabs)}" data-tabs="faq">
        ${LANGS.map(
          (l) =>
            `<button type="button" role="tab" id="adm-fetab-${id}-${l}" aria-controls="adm-fetp-${id}-${l}" aria-selected="${tab === l}" tabindex="${
              tab === l ? 0 : -1
            }" data-tab="${l}">${esc(l === 'bg' ? S.tabBg : S.tabEn)}<span class="adm-tab-code" aria-hidden="true">${l.toUpperCase()}</span></button>`,
        ).join('')}
      </div>
      ${LANGS.map(panel).join('')}
      <div class="adm-ed-actions">
        <button type="submit" class="btn btn-sm">${icon('check', 18)}<span>${esc(S.save)}</span></button>
        <button type="button" class="btn btn-ghost btn-sm" data-faq-cancel>${esc(S.discard)}</button>
        ${edited(it, ed) ? `<button type="button" class="adm-btn-text" data-faq-revert>${icon('reset', 16)}<span>${esc(S.revert)}</span></button>` : ''}
      </div>
    </form>`;
  }
  const edited = (it: AdminFaqItem, ed: FaqEdits) => !!ed[it.id];

  async function openFaqEditor(id: string) {
    if (state.faqEditing && !(await confirmLeave())) return;
    const closing = state.faqEditing === id;
    state.faqEditing = closing ? null : id;
    state.faqTab = lang;
    renderFaq();
    if (closing) q<HTMLElement>(`[data-faq-edit="${id}"]`)?.focus();
    else q<HTMLElement>(`#adm-fe-${id} [data-fq="${lang}"]`)?.focus();
  }

  function closeFaqEditor(id: string) {
    state.faqEditing = null;
    renderFaq();
    q<HTMLElement>(`[data-faq-edit="${id}"]`)?.focus();
  }

  function saveFaq(id: string) {
    const it = faqById.get(id);
    const form = q(`[data-faq-form="${id}"]`);
    if (!it || !form) return;
    const val = (sel: string) => (q<HTMLInputElement>(sel, form)?.value ?? '').trim();
    const v = { q: { bg: val('[data-fq="bg"]'), en: val('[data-fq="en"]') }, a: { bg: val('[data-fa="bg"]'), en: val('[data-fa="en"]') } };
    let firstBad: { l: Lang; el: HTMLElement } | null = null;
    (['q', 'a'] as const).forEach((f) =>
      LANGS.forEach((l) => {
        const err = q(`[data-ferr="${f}-${l}"]`, form)!;
        const input = q<HTMLElement>(f === 'q' ? `[data-fq="${l}"]` : `[data-fa="${l}"]`, form)!;
        if (!v[f][l]) {
          err.textContent = S.faqRequired;
          input.setAttribute('aria-invalid', 'true');
          firstBad ??= { l, el: input };
        } else {
          err.textContent = '';
          input.removeAttribute('aria-invalid');
        }
      }),
    );
    if (firstBad) {
      const bad = firstBad as { l: Lang; el: HTMLElement };
      const tabEl = q(`[data-tabs="faq"] [data-tab="${bad.l}"]`, form);
      if (tabEl) selectTab(tabEl);
      bad.el.focus();
      return;
    }
    const diff = (f: 'q' | 'a') => {
      const d: Partial<Pair> = {};
      LANGS.forEach((l) => {
        if (v[f][l] !== it[f][l]) d[l] = v[f][l];
      });
      return Object.keys(d).length ? d : undefined;
    };
    const ed = loadFaq();
    const dq = diff('q');
    const da = diff('a');
    if (!dq && !da) delete ed[id];
    else ed[id] = { q: dq, a: da, updatedAt: new Date().toISOString() };
    let ok = true;
    mutate(() => (ok = writeJSON(KEYS.faq, ed)));
    if (!ok) return failed(); // the editor stays open with the text
    closeFaqEditor(id);
    toast(S.faqSaved);
  }

  async function revertFaq(id: string) {
    const res = await confirmDialog({ title: S.revertTitle, text: S.faqRevertText, ok: S.revertConfirm, danger: true });
    if (!res.ok) return;
    const ed = loadFaq();
    delete ed[id];
    let ok = true;
    mutate(() => (ok = writeJSON(KEYS.faq, ed)));
    if (!ok) return failed();
    closeFaqEditor(id);
    toast(S.faqReverted);
  }

  function onFaqInput(t: HTMLElement) {
    const form = t.closest<HTMLElement>('[data-faq-form]');
    const it = form ? faqById.get(form.dataset.faqForm ?? '') : undefined;
    if (!form || !it) return;
    const l = (t.dataset.fq ?? t.dataset.fa) as Lang | undefined;
    if (!l) return;
    const value = (t as HTMLInputElement).value.trim();
    if (t.dataset.fq) {
      const orig = q(`[data-forig="q-${l}"]`, form);
      if (orig) orig.hidden = value === it.q[l] || !value;
    }
    if (value) {
      const err = q(`[data-ferr="${t.dataset.fq ? 'q' : 'a'}-${l}"]`, form);
      if (err) err.textContent = '';
      t.removeAttribute('aria-invalid');
    }
  }

  // ---------------------------------------------------------------------------
  // Settings
  // ---------------------------------------------------------------------------

  function renderSettings() {
    const si = D.site;
    const ro = (id: string, label: string, value: string, type = 'text', span = false) =>
      `<div class="field${span ? ' adm-span2' : ''}"><label for="adm-s-${id}">${esc(label)}</label><input id="adm-s-${id}" class="input" type="${type}" value="${esc(
        value,
      )}" readonly /></div>`;
    const nInq = storedInquiries().length;
    const langRow = (l: Lang, primary: boolean) => `<li>
        ${icon('globe', 20)}
        <div class="adm-rows-main">
          <p class="adm-rows-title">${esc(l === 'bg' ? S.tabBg : S.tabEn)}${primary ? badge(S.primary, 'edited') : ''}</p>
          <p class="adm-rows-sub adm-code">${esc(D.homes[l])}</p>
        </div>
        <span class="adm-pill" data-s="quoted">${esc(S.enabled)}</span>
      </li>`;
    slot('settings').innerHTML = `<div class="adm-settings">
      <section class="adm-panel" aria-labelledby="adm-set-company">
        <div class="adm-panel-h"><h3 id="adm-set-company">${esc(S.company)}</h3>${badge(S.realOnly, 'example', 'lock')}</div>
        <div class="adm-form-grid">
          ${ro('name', S.companyName, si.name)}
          ${ro('website', S.website, si.website)}
          ${ro('address', S.address, si.address, 'text', true)}
          ${ro('phone1', S.phone1, si.phones[0]?.display ?? '', 'tel')}
          ${ro('phone2', S.phone2, si.phones[1]?.display ?? '', 'tel')}
          ${ro('email', S.email, si.email, 'email')}
          ${ro('viber', S.viber, si.viber, 'tel')}
        </div>
        <p class="adm-note adm-panel-note">${icon('info', 16)}<span>${esc(S.companyNote)}</span></p>
      </section>
      <section class="adm-panel" aria-labelledby="adm-set-langs">
        <div class="adm-panel-h"><h3 id="adm-set-langs">${esc(S.languages)}</h3></div>
        <ul class="adm-rows">${langRow('bg', true)}${langRow('en', false)}</ul>
        <p class="adm-note adm-panel-note">${icon('info', 16)}<span>${esc(S.langNote)}</span></p>
      </section>
      <section class="adm-panel" aria-labelledby="adm-set-access">
        <div class="adm-panel-h"><h3 id="adm-set-access">${esc(S.access)}</h3></div>
        <ul class="adm-rows"><li><span class="adm-avatar" aria-hidden="true">D</span><div class="adm-rows-main"><p class="adm-rows-title">demo</p><p class="adm-rows-sub">${esc(
          S.role,
        )}</p></div></li></ul>
        <p class="adm-note adm-panel-note">${icon('info', 16)}<span>${esc(S.accessNote)}</span></p>
      </section>
      <section class="adm-panel" aria-labelledby="adm-set-storage">
        <div class="adm-panel-h"><h3 id="adm-set-storage">${esc(S.storage)}</h3></div>
        <div class="adm-storage"><dl class="adm-dl">
          <div><dt>${esc(S.storageInq)}</dt><dd class="num">${nInq}</dd></div>
          <div><dt>${esc(S.storageProd)}</dt><dd class="num">${editedProductCount()}</dd></div>
          <div><dt>${esc(S.storageFaq)}</dt><dd class="num">${editedFaqCount()}</dd></div>
          <div><dt>${esc(S.storageCustom)}</dt><dd class="num">${customs().length}</dd></div>
          <div><dt>${esc(S.storageUsed)}</dt><dd class="num">${esc(formatBytes(storageUsed(), lang))} / ~${esc(formatBytes(STORAGE_BUDGET, lang))}</dd></div>
        </dl></div>
        <div class="adm-storage-actions">
          <button type="button" class="adm-btn" data-export data-fkey="export">${icon('download', 16)}<span>${esc(S.export)}</span></button>
          <button type="button" class="adm-btn adm-btn-danger" data-action="reset" data-fkey="reset">${icon('reset', 16)}<span>${esc(S.reset)}</span></button>
        </div>
      </section>
    </div>`;
  }

  function exportData() {
    const payload = {
      exportedAt: new Date().toISOString(),
      inquiries: storedInquiries(),
      productOverrides: overrides(),
      faqEdits: loadFaq(),
      customProducts: customs(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `outplay-demo-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    toast(S.exportDone);
  }

  // ---------------------------------------------------------------------------
  // Reset, session
  // ---------------------------------------------------------------------------

  async function resetDemo() {
    const n = storedInquiries().length;
    const res = await confirmDialog({
      title: S.resetTitle,
      text: S.resetText,
      ok: S.resetConfirm,
      danger: true,
      check: n ? fmt(S.resetInq, { n }) : undefined,
    });
    if (!res.ok) return;
    mutate(() => {
      remove(KEYS.overrides);
      remove(KEYS.faq);
      remove(KEYS.settings);
      remove(KEYS.customProducts);
      remove(KEYS.draft);
      if (res.checked) remove(KEYS.inquiries);
      else {
        const list = storedInquiries();
        const keep = list.filter((i) => !i.example);
        if (keep.length !== list.length) writeJSON(KEYS.inquiries, keep);
      }
    });
    state.exampleStatus = {};
    state.faqEditing = null;
    if (drawer.open) {
      state.drawerId = null;
      drawer.close();
    }
    if (state.view === 'editor') renderEditor();
    if (state.view === 'custom') {
      state.draft = null;
      if (state.arg === 'new') renderCustomEditor();
      else location.hash = '#products';
    }
    refresh();
    toast(S.resetDone);
  }

  const user = q<HTMLInputElement>('#adm-user')!;
  const pass = q<HTMLInputElement>('#adm-pass')!;
  const loginErr = q('#adm-login-error')!;

  q<HTMLFormElement>('[data-login-form]')!.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = user.value.trim();
    const pw = pass.value;
    const fail = (msg: string, focusEl: HTMLInputElement, both: boolean) => {
      loginErr.textContent = msg;
      [user, pass].forEach((el) => {
        if (both || el === focusEl) el.setAttribute('aria-invalid', 'true');
        else el.removeAttribute('aria-invalid');
      });
      focusEl.focus();
      if (focusEl === pass) pass.select();
    };
    if (!u || !pw) return fail(S.loginEmpty, !u ? user : pass, false);
    if (u !== 'demo' || pw !== 'demo') return fail(S.loginError, pass, true);
    loginErr.textContent = '';
    [user, pass].forEach((el) => el.removeAttribute('aria-invalid'));
    mutate(() => writeJSON(KEYS.session, { user: 'demo', at: new Date().toISOString() }));
    docEl.classList.add('adm-authed');
    pass.value = '';
    pass.type = 'password';
    state.rendered = false;
    route(true);
  });
  [user, pass].forEach((el) => el.addEventListener('input', () => el.removeAttribute('aria-invalid')));

  async function logout() {
    if (!(await confirmLeave())) return;
    if (drawer.open) {
      state.drawerId = null;
      drawer.close();
    }
    mutate(() => remove(KEYS.session));
    docEl.classList.remove('adm-authed');
    state.rendered = false;
    loginErr.textContent = '';
    document.title = `${S.title} · OUTPLAY`;
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    user.focus();
    toast(S.signedOut);
  }

  // ---------------------------------------------------------------------------
  // Events
  // ---------------------------------------------------------------------------

  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const hit = (sel: string) => t.closest<HTMLElement>(sel);
    let m: HTMLElement | null;
    if ((m = hit('[data-action="reset"]'))) return void resetDemo();
    if ((m = hit('[data-action="logout"]'))) return void logout();
    if ((m = hit('[data-fill-demo]'))) {
      user.value = 'demo';
      pass.value = 'demo';
      [user, pass].forEach((el) => el.removeAttribute('aria-invalid'));
      loginErr.textContent = '';
      q<HTMLButtonElement>('.adm-login-submit')?.focus();
      return;
    }
    if ((m = hit('[data-pass-toggle]'))) {
      const show = pass.type === 'password';
      pass.type = show ? 'text' : 'password';
      m.setAttribute('aria-pressed', String(show));
      m.setAttribute('aria-label', (show ? m.dataset.hide : m.dataset.show) ?? '');
      m.innerHTML = icon(show ? 'eyeOff' : 'eye', 20);
      return;
    }
    if ((m = hit('[data-goto-filter]'))) {
      state.filter = m.dataset.gotoFilter as Filter;
      state.query = '';
      if (state.view === 'inquiries') renderInquiries();
      return; // the link's own href switches the view
    }
    if ((m = hit('[data-filter]'))) {
      state.filter = m.dataset.filter as Filter;
      keepFocus(viewEl(), renderInquiries);
      return;
    }
    if ((m = hit('[data-clear-filters]'))) {
      state.filter = 'all';
      state.query = '';
      renderInquiries();
      q<HTMLInputElement>('[data-inq-search]')?.focus();
      return;
    }
    if ((m = hit('[data-close-drawer]'))) return void drawer.close();
    if ((m = hit('[data-copy-inq]'))) return void copyInquiry(m);
    if ((m = hit('[data-copy-value]'))) return void copyValue(m);
    if ((m = hit('[data-delete-inq]'))) return void deleteCurrent();
    if ((m = hit('[data-open-inq]'))) return void openInquiry(m.dataset.openInq!);
    if ((m = hit('[data-toggle-vis]'))) return void toggleVisibility(m.dataset.toggleVis!);
    if ((m = hit('[role="tab"][data-tab]'))) return void selectTab(m);
    if ((m = hit('[data-ed-discard]'))) {
      renderEditor();
      q<HTMLElement>('#adm-h-editor')?.focus();
      return;
    }
    if ((m = hit('[data-ed-revert]'))) return void revertEditor();
    if ((m = hit('[data-disabled-demo]'))) {
      e.preventDefault();
      const wrap = m.closest<HTMLElement>('.adm-tipwrap');
      wrap?.classList.add('is-tip');
      window.setTimeout(() => wrap?.classList.remove('is-tip'), 2000);
      return;
    }
    if ((m = hit('[data-faq-edit]'))) return void openFaqEditor(m.dataset.faqEdit!);
    if ((m = hit('[data-faq-cancel]'))) {
      const id = m.closest<HTMLElement>('[data-faq-form]')?.dataset.faqForm;
      if (id) closeFaqEditor(id);
      return;
    }
    if ((m = hit('[data-faq-revert]'))) {
      const id = m.closest<HTMLElement>('[data-faq-form]')?.dataset.faqForm;
      if (id) void revertFaq(id);
      return;
    }
    if ((m = hit('[data-export]'))) return void exportData();
    if ((m = hit('[data-cp-spec-add]')) && state.draft) {
      state.draft.specs.push({ label: emptyPair(), value: emptyPair() });
      renderCustomEditor();
      q<HTMLElement>(`[data-fkey="cp-spec-${state.draft.specs.length - 1}-label-${state.customTab}"]`)?.focus();
      return;
    }
    if ((m = hit('[data-cp-spec-remove]')) && state.draft) {
      const i = Number(m.dataset.cpSpecRemove);
      state.draft.specs.splice(i, 1);
      renderCustomEditor();
      const l = state.customTab;
      (q<HTMLElement>(`[data-fkey="cp-spec-x-${Math.min(i, state.draft.specs.length - 1)}-${l}"]`) ??
        q<HTMLElement>(`[data-fkey="cp-spec-add-${l}"]`))?.focus();
      return;
    }
    if ((m = hit('[data-cp-img-move]'))) {
      const i = Number(m.dataset.cpImgMove);
      const to = i + Number(m.dataset.dir);
      return void moveImage(i, to, `cp-img-${Number(m.dataset.dir) < 0 ? 'l' : 'r'}-${to}`);
    }
    if ((m = hit('[data-cp-img-main]'))) return void moveImage(Number(m.dataset.cpImgMain), 0, 'cp-img-r-0');
    if ((m = hit('[data-cp-img-remove]'))) return void removeImage(Number(m.dataset.cpImgRemove));
    if ((m = hit('[data-cp-discard]'))) {
      state.draft = null;
      renderCustomEditor();
      q<HTMLElement>('#adm-h-custom')?.focus();
      return;
    }
    if ((m = hit('[data-cp-delete]'))) return void deleteCustom();
  });

  // Photo drop zone of the custom product editor
  root.addEventListener('dragover', (e) => {
    const zone = (e.target as HTMLElement).closest<HTMLElement>('[data-cp-drop]');
    if (!zone) return;
    e.preventDefault();
    zone.classList.add('is-over');
  });
  root.addEventListener('dragleave', (e) => {
    (e.target as HTMLElement).closest<HTMLElement>('[data-cp-drop]')?.classList.remove('is-over');
  });
  root.addEventListener('drop', (e) => {
    const zone = (e.target as HTMLElement).closest<HTMLElement>('[data-cp-drop]');
    if (!zone) return;
    e.preventDefault();
    zone.classList.remove('is-over');
    void addImages(Array.from(e.dataTransfer?.files ?? []));
  });

  root.addEventListener('input', (e) => {
    const t = e.target as HTMLElement;
    if (t.matches('[data-inq-search]')) {
      state.query = (t as HTMLInputElement).value;
      renderInquiries();
    } else if (t.closest('[data-ed-form]')) onEditorInput();
    else if (t.closest('[data-faq-form]')) onFaqInput(t);
    else if (t.closest('[data-cp-form]') && !t.matches('select, [type="file"]')) onCustomInput(t);
  });

  root.addEventListener('change', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.matches('[data-status-radio]') && state.drawerId && t.checked) setStatus(state.drawerId, t.value as InquiryStatus);
    else if (t.matches('[data-cp-select]')) onCustomSelect(t as unknown as HTMLSelectElement);
    else if (t.matches('[data-cp-file]')) {
      const files = Array.from(t.files ?? []);
      t.value = '';
      void addImages(files);
    }
  });

  root.addEventListener('submit', (e) => {
    const f = e.target as HTMLFormElement;
    if (f.matches('[data-ed-form]')) {
      e.preventDefault();
      saveEditor();
    } else if (f.matches('[data-faq-form]')) {
      e.preventDefault();
      saveFaq(f.dataset.faqForm!);
    } else if (f.matches('[data-cp-form]')) {
      e.preventDefault();
      saveCustom();
    }
  });

  root.addEventListener('keydown', (e) => {
    const t = e.target as HTMLElement;
    if (t.matches('[role="tab"]')) {
      const tabs = qa('[role="tab"]', t.closest('[role="tablist"]')!);
      const i = tabs.indexOf(t);
      const next =
        e.key === 'ArrowRight'
          ? tabs[(i + 1) % tabs.length]
          : e.key === 'ArrowLeft'
            ? tabs[(i - 1 + tabs.length) % tabs.length]
            : e.key === 'Home'
              ? tabs[0]
              : e.key === 'End'
                ? tabs[tabs.length - 1]
                : null;
      if (next) {
        e.preventDefault();
        selectTab(next, true);
      }
      return;
    }
    if (e.key === 'Escape' && t.closest('[data-faq-form]')) {
      const id = t.closest<HTMLElement>('[data-faq-form]')?.dataset.faqForm;
      if (id) void confirmLeave().then((ok) => ok && closeFaqEditor(id));
    }
  });

  window.addEventListener('hashchange', async () => {
    const target = location.hash;
    if (!leaving && target !== currentHash && parseHash() && isDirty()) {
      // keep the editor's address while asking (replaceState fires no hashchange)
      history.replaceState(history.state, '', currentHash || `${location.pathname}${location.search}`);
      if (!(await confirmLeave())) return;
      leaving = true;
      location.hash = target;
      return;
    }
    leaving = false;
    route(true);
  });
  window.addEventListener('beforeunload', (e) => {
    if (!isDirty()) return;
    e.preventDefault();
    e.returnValue = '';
  });
  window.addEventListener('outplay:store', () => {
    if (!muted) refresh();
  });
  window.addEventListener('storage', (e) => {
    if (e.key && !e.key.startsWith('outplay.')) return;
    const authed = !!readJSON<unknown>(KEYS.session, null);
    if (authed !== isAuthed()) {
      docEl.classList.toggle('adm-authed', authed);
      state.rendered = false;
      if (authed) route(false);
      return;
    }
    refresh();
  });
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) refresh();
  });

  // ---------------------------------------------------------------------------
  // Start
  // ---------------------------------------------------------------------------
  if (readJSON<unknown>(KEYS.session, null)) docEl.classList.add('adm-authed');
  else docEl.classList.remove('adm-authed');
  if (isAuthed()) route(false);
  updateNavCount();
}
