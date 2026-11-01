// Admin demo helpers (pure, no DOM access): the data contract between the admin page and its client
// script, inquiry formatting, the generated example inquiries and the admin icon set.
import type { InquiryStatus, StoredInquiry } from './store';

export type Lang = 'bg' | 'en';
export interface Pair {
  bg: string;
  en: string;
}

export interface AdminImage {
  src: string | null;
  alt: string;
  kind: 'hero' | 'gallery' | 'diagram';
  n: number;
}
export interface AdminProduct {
  id: string;
  category: string;
  family: string;
  name: Pair;
  tagline: Pair;
  summary: Pair;
  fullName: string;
  url: string;
  thumb: string | null;
  card: string | null;
  images: AdminImage[];
  video: string | null;
}
export interface AdminCategory {
  id: string;
  name: string;
}
export interface AdminFaqItem {
  id: string;
  q: Pair;
  a: Pair;
}
export interface AdminFaqGroup {
  id: string;
  title: string;
  items: AdminFaqItem[];
}
export interface AdminOptGroup {
  id: string;
  label: string;
  type: 'single' | 'multi';
  choices: Record<string, string>;
}
export interface AdminFamily {
  preview: 'plan' | 'elevation';
  dims: { id: string; label: string; unit: 'm' | 'pcs' }[];
  groups: AdminOptGroup[];
  text: { id: string; label: string }[];
}
export interface AdminSite {
  name: string;
  address: string;
  phones: { display: string; e164: string }[];
  viber: string;
  email: string;
  website: string;
}
export interface AdminData {
  lang: Lang;
  home: string;
  homes: Pair;
  faqUrl: string;
  s: Record<string, string>;
  statuses: Record<InquiryStatus, string>;
  products: AdminProduct[];
  categories: AdminCategory[];
  faq: AdminFaqGroup[];
  families: Record<string, AdminFamily>;
  project: AdminOptGroup[];
  channels: Record<string, string>;
  site: AdminSite;
}

/** FAQ edits stored under KEYS.faq, keyed by "<groupId>-<index>" */
export type FaqEdits = Record<string, { q?: Partial<Pair>; a?: Partial<Pair>; updatedAt?: string }>;

export const STATUSES: InquiryStatus[] = ['new', 'in-progress', 'quoted', 'closed'];

// ---------------------------------------------------------------------------
// Text helpers
// ---------------------------------------------------------------------------

const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
/** Escape any value for safe use in HTML text and attribute values */
export const esc = (v: unknown): string => String(v ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

export function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s;
}

const NF: Record<Lang, Intl.NumberFormat> = {
  bg: new Intl.NumberFormat('bg-BG', { maximumFractionDigits: 2 }),
  en: new Intl.NumberFormat('en-GB', { maximumFractionDigits: 2 }),
};
/** Locale number: 4,5 in Bulgarian, 4.5 in English */
export const fmtNum = (n: number, lang: Lang): string => NF[lang].format(Math.round(n * 100) / 100);

const MONTHS_BG = ['яну', 'фев', 'мар', 'апр', 'май', 'юни', 'юли', 'авг', 'сеп', 'окт', 'ное', 'дек'];
const pad = (n: number) => String(n).padStart(2, '0');

/** Compact date for tables: "1 ное, 14:32" / "1 Nov, 14:32" (year added when not the current one) */
export function fmtDate(iso: string, lang: Lang, withTime = true): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const year = d.getFullYear() !== new Date().getFullYear() ? ` ${d.getFullYear()}` : '';
  const time = withTime ? `, ${pad(d.getHours())}:${pad(d.getMinutes())}` : '';
  if (lang === 'bg') return `${d.getDate()} ${MONTHS_BG[d.getMonth()]}${year}${time}`;
  const m = new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(d);
  return `${d.getDate()} ${m}${year}${time}`;
}

/** Long date for the detail panel: "1 ноември 2026 г., 14:32" */
export function fmtDateLong(iso: string, lang: Lang): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat(lang === 'bg' ? 'bg-BG' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/** "преди 2 часа" / "2 hours ago"; falls back to the date after a week */
export function relTime(iso: string | undefined, lang: Lang, justNow: string): string {
  if (!iso) return '';
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return '';
  const s = Math.round((t - Date.now()) / 1000);
  const a = Math.abs(s);
  if (a < 45) return justNow;
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
  if (a < 3600) return rtf.format(Math.round(s / 60), 'minute');
  if (a < 86400) return rtf.format(Math.round(s / 3600), 'hour');
  if (a < 7 * 86400) return rtf.format(Math.round(s / 86400), 'day');
  return fmtDate(iso, lang, false);
}

/** Bulgarian phone as typed ("0888 123 456") → E.164 ("+359888123456") for tel:/viber: links */
export function toE164(phone: string | undefined): string | null {
  const d = (phone ?? '').replace(/[^\d+]/g, '');
  if (d.replace(/\D/g, '').length < 6) return null;
  if (d.startsWith('+')) return d;
  if (d.startsWith('00')) return '+' + d.slice(2);
  if (d.startsWith('359')) return '+' + d;
  if (d.startsWith('0')) return '+359' + d.slice(1);
  return '+359' + d;
}

// ---------------------------------------------------------------------------
// Inquiry formatting
// ---------------------------------------------------------------------------

export interface Units {
  m: string;
  m2: string;
  pcs: string;
}

const num = (v: unknown): number | undefined => {
  const n = typeof v === 'string' ? Number(v.replace(',', '.')) : (v as number);
  return typeof n === 'number' && Number.isFinite(n) && n > 0 ? n : undefined;
};

/**
 * One-line size summary for tables: "4,5 × 3,2 м · 14,4 м²".
 * Plan families give width × depth, elevation families width × height, windbreaks length × height;
 * screens add the number of units and the total area.
 */
export function dimsSummary(inq: Pick<StoredInquiry, 'dims'>, lang: Lang, u: Units): string {
  const d = inq.dims ?? {};
  const a = num(d.width) ?? num(d.length);
  const b = num(d.depth) ?? num(d.height);
  const units = num(d.units);
  if (!a && !b) return units ? `${fmtNum(units, lang)} ${u.pcs}` : '—';
  if (!a || !b) return `${fmtNum((a ?? b)!, lang)} ${u.m}`;
  const parts = [`${fmtNum(a, lang)} × ${fmtNum(b, lang)} ${u.m}`];
  if (units && units > 1) parts.push(`${fmtNum(units, lang)} ${u.pcs}`);
  parts.push(`${fmtNum(a * b * (units ?? 1), lang)} ${u.m2}`);
  return parts.join(' · ');
}

/** Area used in the detail panel (total for several screens) */
export function dimsArea(inq: Pick<StoredInquiry, 'dims'>): { area: number; total: boolean } | null {
  const d = inq.dims ?? {};
  const a = num(d.width) ?? num(d.length);
  const b = num(d.depth) ?? num(d.height);
  if (!a || !b) return null;
  const units = num(d.units);
  return { area: a * b * (units ?? 1), total: !!units && units > 1 };
}

export interface Row {
  label: string;
  value: string;
}

function choiceText(g: AdminOptGroup, v: unknown): string {
  if (Array.isArray(v)) return v.map((x) => g.choices[String(x)] ?? String(x)).join(', ');
  if (v === undefined || v === null || v === '') return '';
  return g.choices[String(v)] ?? String(v);
}

export function dimRows(inq: StoredInquiry, data: AdminData): Row[] {
  const fam = data.families[inq.family];
  const u: Units = { m: data.s.m, m2: data.s.m2, pcs: data.s.pcs };
  const rows: Row[] = [];
  const known = new Set<string>();
  for (const f of fam?.dims ?? []) {
    known.add(f.id);
    const v = num(inq.dims?.[f.id]);
    if (v !== undefined) rows.push({ label: f.label, value: `${fmtNum(v, data.lang)} ${f.unit === 'pcs' ? u.pcs : u.m}` });
  }
  for (const [k, v] of Object.entries(inq.dims ?? {})) {
    if (!known.has(k) && num(v) !== undefined) rows.push({ label: k, value: fmtNum(num(v)!, data.lang) });
  }
  const area = dimsArea(inq);
  if (area) rows.push({ label: area.total ? data.s.totalArea : data.s.area, value: `${fmtNum(area.area, data.lang)} ${u.m2}` });
  return rows;
}

/** Configuration rows (family option groups + free-text fields) and project rows, mapped to labels */
export function optionRows(inq: StoredInquiry, data: AdminData): { config: Row[]; project: Row[] } {
  const fam = data.families[inq.family];
  const opts = inq.options ?? {};
  const used = new Set<string>(['contactChannel']);
  const config: Row[] = [];
  const project: Row[] = [];
  for (const g of fam?.groups ?? []) {
    used.add(g.id);
    const v = choiceText(g, opts[g.id]);
    if (v) config.push({ label: g.label, value: v });
  }
  for (const f of fam?.text ?? []) {
    used.add(f.id);
    const v = opts[f.id];
    if (typeof v === 'string' && v.trim()) config.push({ label: f.label, value: v.trim() });
  }
  for (const g of data.project) {
    used.add(g.id);
    const v = choiceText(g, opts[g.id]);
    if (v) project.push({ label: g.label, value: v });
  }
  for (const [k, v] of Object.entries(opts)) {
    if (used.has(k)) continue;
    const text = Array.isArray(v) ? v.join(', ') : String(v ?? '');
    if (text) config.push({ label: k, value: text });
  }
  return { config, project };
}

export const channelOf = (inq: StoredInquiry): string => {
  const c = inq.contact?.channel ?? inq.options?.contactChannel;
  return typeof c === 'string' ? c : '';
};

/** Plain-text version of an inquiry for pasting into an email or a quote */
export function inquiryText(inq: StoredInquiry, data: AdminData, productName: string): string {
  const s = data.s;
  const lines: string[] = [];
  const add = (label: string, value: string | undefined) => {
    if (value) lines.push(`${label}: ${value}`);
  };
  lines.push(`${s.textTitle} · ${productName}`);
  add(s.received, fmtDateLong(inq.createdAt, data.lang));
  add(s.status, data.statuses[inq.status]);
  lines.push('');
  lines.push(s.contact.toUpperCase());
  add(s.customer, inq.contact?.name);
  add(s.phone, inq.contact?.phone);
  add(s.email, inq.contact?.email);
  add(s.city, inq.contact?.city);
  const ch = channelOf(inq);
  add(s.channel, ch ? (data.channels[ch] ?? ch) : '');
  const dims = dimRows(inq, data);
  if (dims.length) {
    lines.push('', s.dimsApprox.toUpperCase());
    dims.forEach((r) => add(r.label, r.value));
  }
  const { config, project } = optionRows(inq, data);
  if (config.length) {
    lines.push('', s.config.toUpperCase());
    config.forEach((r) => add(r.label, r.value));
  }
  if (project.length) {
    lines.push('', s.project.toUpperCase());
    project.forEach((r) => add(r.label, r.value));
  }
  if (inq.message?.trim()) lines.push('', s.message.toUpperCase(), inq.message.trim());
  if (inq.files?.length) lines.push('', `${s.files}: ${inq.files.join(', ')}`);
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Example inquiries: generated in code for the demo (never written to storage)
// ---------------------------------------------------------------------------

interface ExampleTpl {
  n: number;
  hoursAgo: number;
  productId: string;
  family: string;
  dims: Record<string, number>;
  options: Record<string, string | string[] | Pair>;
  name: Pair;
  city: Pair;
  phone: string;
  email: string;
  channel: string;
  message: Pair;
  files: string[];
  status: InquiryStatus;
}

const EXAMPLES: ExampleTpl[] = [
  {
    n: 1,
    hoursAgo: 2.4,
    productId: 'balance',
    family: 'pergola',
    dims: { width: 4.5, depth: 3.2, height: 2.6 },
    options: {
      roofType: 'lamellas',
      mounting: 'wall',
      extras: ['led', 'zip'],
      colour: { bg: 'антрацит, RAL 7016', en: 'anthracite, RAL 7016' },
      propertyType: 'home',
      placeType: 'terrace',
      timeline: '1-3m',
    },
    name: { bg: 'Мария Георгиева', en: 'Maria Georgieva' },
    city: { bg: 'София', en: 'Sofia' },
    phone: '0888 123 456',
    email: 'maria.georgieva@example.com',
    channel: 'viber',
    message: {
      bg: 'Терасата е на втория етаж, с достъп по външно стълбище. По-късно бихме искали да я затворим със стъкло за зимата.',
      en: 'The terrace is on the first floor, reached by an outside staircase. Later we would like to glaze it in for the winter.',
    },
    files: ['terasa-iztok.jpg', 'terasa-otgore.jpg'],
    status: 'new',
  },
  {
    n: 2,
    hoursAgo: 27,
    productId: 'guillotine',
    family: 'glass',
    dims: { width: 8.4, height: 2.4 },
    options: {
      systemType: 'guillotine',
      panels: 'more',
      glass: 'tempered',
      tint: 'clear',
      context: 'existing-structure',
      propertyType: 'horeca',
      placeType: 'terrace',
      timeline: 'within-1m',
    },
    name: { bg: 'Иван Петров', en: 'Ivan Petrov' },
    city: { bg: 'Пловдив', en: 'Plovdiv' },
    phone: '0877 456 789',
    email: 'ivan.petrov@example.com',
    channel: 'phone',
    message: {
      bg: 'Ресторант с лятна градина под съществуваща пергола. Търсим затваряне за зимния сезон, без да губим гледката.',
      en: 'A restaurant with a summer garden under an existing pergola. We want to close it in for the winter without losing the view.',
    },
    files: ['gradina-restorant.jpg'],
    status: 'in-progress',
  },
  {
    n: 3,
    hoursAgo: 76,
    productId: 'vertical-zip',
    family: 'zip',
    dims: { width: 3, height: 2.5, units: 4 },
    options: {
      zipType: 'vertical',
      fabric: 'perforated',
      mounting: 'surface',
      automation: ['sensors'],
      fabricColour: { bg: 'сиво', en: 'grey' },
      propertyType: 'home',
      placeType: 'facade',
      timeline: '3-6m',
    },
    name: { bg: 'Николай Стоянов', en: 'Nikolay Stoyanov' },
    city: { bg: 'Варна', en: 'Varna' },
    phone: '0899 321 654',
    email: 'n.stoyanov@example.com',
    channel: 'email',
    message: {
      bg: 'Четири прозореца на западната фасада, които прегряват следобед.',
      en: 'Four windows on the west façade that overheat in the afternoon.',
    },
    files: [],
    status: 'quoted',
  },
  {
    n: 4,
    hoursAgo: 150,
    productId: 'telescopic-windbreak',
    family: 'windbreak',
    dims: { length: 12, height: 1.6 },
    options: { glass: 'clear', propertyType: 'horeca', placeType: 'terrace', timeline: '1-3m' },
    name: { bg: 'Елена Димитрова', en: 'Elena Dimitrova' },
    city: { bg: 'Бургас', en: 'Burgas' },
    phone: '0886 987 123',
    email: 'elena.dimitrova@example.com',
    channel: 'viber',
    message: {
      bg: 'Кафене на ъгъла, вятърът духа от две страни. Искаме гледката към морето да остане открита.',
      en: 'A corner café with wind from two sides. We want to keep the sea view open.',
    },
    files: [],
    status: 'closed',
  },
];

const isPair = (v: unknown): v is Pair => !!v && typeof v === 'object' && !Array.isArray(v) && 'bg' in v;

export function exampleInquiries(lang: Lang, now = Date.now()): StoredInquiry[] {
  return EXAMPLES.map((e) => ({
    id: `example-${e.n}`,
    createdAt: new Date(now - e.hoursAgo * 3600_000).toISOString(),
    lang,
    productId: e.productId,
    family: e.family,
    dims: e.dims,
    options: Object.fromEntries(Object.entries(e.options).map(([k, v]) => [k, isPair(v) ? v[lang] : v])),
    contact: { name: e.name[lang], phone: e.phone, email: e.email, city: e.city[lang], channel: e.channel },
    message: e.message[lang],
    files: e.files,
    status: e.status,
    example: true,
  }));
}

// ---------------------------------------------------------------------------
// Icons (same 24px grid and 1.6 stroke as src/components/Icon.astro)
// ---------------------------------------------------------------------------

const ICONS: Record<string, string> = {
  dashboard: '<rect x="3.5" y="4" width="17" height="16" rx="1"/><path d="M3.5 9.5h17M9.5 9.5V20"/>',
  inbox: '<path d="M3.5 13.5 6 5h12l2.5 8.5V19a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z"/><path d="M3.5 13.5H9l1 2h4l1-2h5.5"/>',
  box: '<path d="M12 3 20 7.5v9L12 21l-8-4.5v-9Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
  help: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.4a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.7"/><path d="M12 17h.01"/>',
  sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  logout: '<path d="M10 4H5v16h5"/><path d="m15 8 4 4-4 4M19 12H9"/>',
  reset: '<path d="M4 5v5h5"/><path d="M5.6 15a7 7 0 1 0 1.1-7.6L4 10"/>',
  arrowRight: '<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>',
  arrowLeft: '<path d="M20 12H5"/><path d="m11 6-6 6 6 6"/>',
  chevronRight: '<path d="m9 6 6 6-6 6"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  close: '<path d="M6 6l12 12"/><path d="M18 6 6 18"/>',
  phone:
    '<path d="M5 4h3.2l1.6 4-2 1.3a10.5 10.5 0 0 0 4.9 4.9l1.3-2 4 1.6V17a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="m3.5 6 8.5 7 8.5-7"/>',
  viber:
    '<path d="M12 2.8c5 0 8.4 2.4 8.4 7.9 0 5.2-3.2 7.8-8.2 7.8-.7 0-1.4 0-2-.1L7 21v-3.3c-2.4-1.2-3.4-3.6-3.4-7 0-5.5 3.4-7.9 8.4-7.9Z"/><path d="M9.3 7.3c.4-.3 1-.2 1.2.2l.7 1.3c.2.4.1.8-.2 1.1l-.4.3c.4 1 1.3 1.9 2.3 2.3l.3-.4c.3-.3.7-.4 1.1-.2l1.3.7c.4.2.5.8.2 1.2-.6.8-1.6 1.1-2.6.7a7.6 7.6 0 0 1-4.6-4.6c-.4-1 0-2 .7-2.6Z"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="1.5"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/>',
  check: '<path d="m4.5 12.5 4.5 4.5L19.5 6.5"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6"/><path d="M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  upload: '<path d="M12 15V4"/><path d="m7 9 5-5 5 5"/><path d="M4 15v4.5h16V15"/>',
  download: '<path d="M12 4v11"/><path d="m7 10 5 5 5-5"/><path d="M4 15v4.5h16V15"/>',
  play: '<rect x="3.5" y="5" width="17" height="14" rx="1"/><path d="m10 9 5 3-5 3z"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="1.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 20.5c1.4-3.6 4.3-5.5 8-5.5s6.6 1.9 8 5.5"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff:
    '<path d="M4 4l16 16"/><path d="M10.6 6.1A9.7 9.7 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-2.8 3.4M6.6 7.6A16.6 16.6 0 0 0 2.5 12S6 18 12 18c1.5 0 2.8-.3 4-.9"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
  clip: '<path d="M20 11.5 12.4 19a5 5 0 0 1-7.1-7.1l8-8a3.4 3.4 0 0 1 4.8 4.8l-8 8a1.7 1.7 0 0 1-2.4-2.4l7.3-7.3"/>',
  globe:
    '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.4 2.4 3.6 5.2 3.6 8.5s-1.2 6.1-3.6 8.5c-2.4-2.4-3.6-5.2-3.6-8.5S9.6 5.9 12 3.5Z"/>',
  image:
    '<rect x="3.5" y="4.5" width="17" height="15" rx="1"/><circle cx="9" cy="10" r="1.8"/><path d="m4 18 5.5-5.5 4 4 2.5-2.5 4.5 4.5"/>',
};

export type AdminIcon = keyof typeof ICONS;

/** Inline SVG icon markup (decorative: aria-hidden) */
export function icon(name: string, size = 18): string {
  return `<svg class="adm-ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name] ?? ''}</svg>`;
}
