// Browser-side demo storage shared by the inquiry form, the admin demo and the public pages.
// Everything lives in localStorage of the current browser only (no backend on GitHub Pages).

export type InquiryStatus = 'new' | 'in-progress' | 'quoted' | 'closed';

export interface StoredInquiry {
  id: string;
  createdAt: string; // ISO
  lang: 'bg' | 'en';
  productId: string | null;
  family: string;
  dims: Record<string, number>;
  options: Record<string, string | string[]>;
  contact: {
    name: string;
    phone: string;
    email: string;
    city?: string;
    channel?: string;
  };
  message?: string;
  files?: string[]; // file names only
  status: InquiryStatus;
  /** true for the seeded example rows shown in the admin demo */
  example?: boolean;
}

export interface ProductOverride {
  name?: { bg?: string; en?: string };
  tagline?: { bg?: string; en?: string };
  summary?: { bg?: string; en?: string };
  hidden?: boolean;
  featured?: boolean;
  updatedAt?: string;
}

export const KEYS = {
  inquiries: 'outplay.inquiries.v1',
  overrides: 'outplay.overrides.v1',
  faq: 'outplay.faq.v1',
  settings: 'outplay.settings.v1',
  session: 'outplay.admin.session.v1',
  draft: 'outplay.inquiry.draft.v1',
  customProducts: 'outplay.customProducts.v1',
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('outplay:store', { detail: { key } }));
    return true;
  } catch {
    return false;
  }
}

export function remove(key: string): void {
  try {
    window.localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent('outplay:store', { detail: { key } }));
  } catch {
    /* storage unavailable */
  }
}

export const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

// Inquiries
export const loadInquiries = (): StoredInquiry[] => read<StoredInquiry[]>(KEYS.inquiries, []);
export function saveInquiry(inq: Omit<StoredInquiry, 'id' | 'createdAt' | 'status'>): StoredInquiry | null {
  const full: StoredInquiry = { ...inq, id: uid(), createdAt: new Date().toISOString(), status: 'new' };
  const list = loadInquiries();
  list.unshift(full);
  return write(KEYS.inquiries, list) ? full : null;
}
/** Returns false when the browser refused the write (storage full or unavailable) */
export function updateInquiry(id: string, patch: Partial<StoredInquiry>): boolean {
  return write(
    KEYS.inquiries,
    loadInquiries().map((i) => (i.id === id ? { ...i, ...patch } : i)),
  );
}
export function deleteInquiry(id: string): boolean {
  return write(
    KEYS.inquiries,
    loadInquiries().filter((i) => i.id !== id),
  );
}

// Product overrides (admin demo edits applied on public pages)
export const loadOverrides = (): Record<string, ProductOverride> => read(KEYS.overrides, {});
/** Returns false when the browser refused the write (storage full or unavailable) */
export function saveOverride(productId: string, patch: ProductOverride): boolean {
  const all = loadOverrides();
  all[productId] = { ...all[productId], ...patch, updatedAt: new Date().toISOString() };
  return write(KEYS.overrides, all);
}
export function clearOverride(productId: string): boolean {
  const all = loadOverrides();
  delete all[productId];
  return write(KEYS.overrides, all);
}

export const readJSON = read;
export const writeJSON = write;

export function storageAvailable(): boolean {
  try {
    const k = '__outplay_test__';
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Custom products (added in the admin demo; shown on public pages in this browser only)
// ---------------------------------------------------------------------------

type LPair = { bg: string; en: string };

export interface CustomProduct {
  /** 'c-' + slug of the name, unique among custom products */
  id: string;
  category: 'bioclimatic-pergolas' | 'glass-systems' | 'sun-protection' | 'windbreaks';
  /** subgroup of the category (e.g. 'automated' / 'fixed' pergolas); listings place the card there */
  subgroup?: string;
  family: 'pergola' | 'glass' | 'door' | 'zip' | 'awning' | 'windbreak';
  name: LPair;
  tagline: LPair;
  summary: LPair;
  sections: { heading: LPair; paragraphs: LPair[] }[];
  features: LPair[];
  specs: { label: LPair; value: LPair }[];
  /** JPEG data URLs, first = main photo */
  images: string[];
  hidden?: boolean;
  createdAt: string;
  updatedAt: string;
}

export const CUSTOM_MAX_IMAGES = 6;

export type SaveResult = { ok: true } | { ok: false; reason: 'quota' | 'unavailable' };

const isQuotaError = (e: unknown) =>
  e instanceof DOMException &&
  (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e.code === 22 || e.code === 1014);

export function loadCustomProducts(): CustomProduct[] {
  const list = read<CustomProduct[]>(KEYS.customProducts, []);
  return Array.isArray(list) ? list.filter((p) => p && typeof p === 'object' && typeof p.id === 'string') : [];
}

export const getCustomProduct = (id: string): CustomProduct | undefined => loadCustomProducts().find((p) => p.id === id);

function writeCustom(list: CustomProduct[]): SaveResult {
  try {
    window.localStorage.setItem(KEYS.customProducts, JSON.stringify(list));
  } catch (e) {
    return { ok: false, reason: isQuotaError(e) ? 'quota' : 'unavailable' };
  }
  window.dispatchEvent(new CustomEvent('outplay:store', { detail: { key: KEYS.customProducts } }));
  return { ok: true };
}

/** Insert or replace by id. Reports a full storage quota instead of throwing. */
export function saveCustomProduct(product: CustomProduct): SaveResult {
  const list = loadCustomProducts();
  const i = list.findIndex((p) => p.id === product.id);
  const next = { ...product, updatedAt: new Date().toISOString() };
  if (i >= 0) list[i] = next;
  else list.push(next);
  return writeCustom(list);
}

export function updateCustomProduct(id: string, patch: Partial<CustomProduct>): SaveResult {
  const list = loadCustomProducts();
  const i = list.findIndex((p) => p.id === id);
  if (i < 0) return { ok: true };
  list[i] = { ...list[i], ...patch, id, updatedAt: new Date().toISOString() };
  return writeCustom(list);
}

export function deleteCustomProduct(id: string): void {
  writeCustom(loadCustomProducts().filter((p) => p.id !== id));
}

const TRANSLIT: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n',
  о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sht', ъ: 'a',
  ь: 'y', ю: 'yu', я: 'ya',
};

/** URL-safe slug; Bulgarian Cyrillic is transliterated (Streamlined System) */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[а-я]/g, (c) => TRANSLIT[c] ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
    .replace(/-+$/g, '');
}

/** New unique id for a custom product: 'c-' + slug of the name, with -2, -3 … on collisions */
export function customProductId(name: string, taken: Iterable<string> = loadCustomProducts().map((p) => p.id)): string {
  const used = new Set(taken);
  const base = `c-${slugify(name) || 'produkt'}`;
  let id = base;
  for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
  return id;
}

/** Characters stored in localStorage by this origin (data URLs are ASCII, so ≈ bytes) */
export function storageUsed(): number {
  try {
    let n = 0;
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i) ?? '';
      n += k.length + (window.localStorage.getItem(k)?.length ?? 0);
    }
    return n;
  } catch {
    return 0;
  }
}
/** Typical per-origin localStorage limit in current browsers (about 5 million characters) */
export const STORAGE_BUDGET = 5_000_000;
