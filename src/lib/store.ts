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
export function updateInquiry(id: string, patch: Partial<StoredInquiry>): void {
  write(
    KEYS.inquiries,
    loadInquiries().map((i) => (i.id === id ? { ...i, ...patch } : i)),
  );
}
export function deleteInquiry(id: string): void {
  write(
    KEYS.inquiries,
    loadInquiries().filter((i) => i.id !== id),
  );
}

// Product overrides (admin demo edits applied on public pages)
export const loadOverrides = (): Record<string, ProductOverride> => read(KEYS.overrides, {});
export function saveOverride(productId: string, patch: ProductOverride): void {
  const all = loadOverrides();
  all[productId] = { ...all[productId], ...patch, updatedAt: new Date().toISOString() };
  write(KEYS.overrides, all);
}
export function clearOverride(productId: string): void {
  const all = loadOverrides();
  delete all[productId];
  write(KEYS.overrides, all);
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
