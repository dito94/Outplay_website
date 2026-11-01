// Client-side site search shared by the search palette and the /search/ page.
// Matching is diacritics-insensitive, folds Cyrillic to Latin (so "pergola" finds "пергола" and the other
// way round), squashes common spelling variants (c/k, w/v, doubled letters…) and tolerates small typos.

export type DocType = 'product' | 'category' | 'faq' | 'page';

/** One entry of /search-index.json (built by src/pages/[...lang]/search-index.json.ts) */
export interface SearchDoc {
  type: DocType;
  /** Display title */
  title: string;
  /** Display subtitle (category, group, tagline) */
  sub?: string;
  /** Display description / body text */
  text?: string;
  /** Extra searchable names, not displayed (full name, other-language name) */
  alias?: string;
  /** Extra search terms, not displayed */
  kw?: string;
  url: string;
  /** Small WebP thumbnail */
  img?: string;
}

export interface SearchIndex {
  lang: 'bg' | 'en';
  docs: SearchDoc[];
}

export interface SearchHit {
  doc: SearchDoc;
  score: number;
}

export const GROUP_ORDER: DocType[] = ['product', 'category', 'faq', 'page'];

// ---------------------------------------------------------------------------
// Normalisation
// ---------------------------------------------------------------------------

const CYR: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm',
  н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sht',
  ъ: 'a', ь: 'y', ю: 'yu', я: 'ya', ы: 'y', э: 'e', ё: 'yo', є: 'ye', і: 'i', ї: 'yi', ґ: 'g', ѝ: 'i',
};

/** Lower-case, Cyrillic → Latin, strip diacritics; keeps spaces/punctuation */
export function fold(input: string): string {
  let s = input.toLowerCase().normalize('NFC');
  let out = '';
  for (const ch of s) out += CYR[ch] ?? ch;
  s = out.normalize('NFD').replace(/\p{M}+/gu, '');
  return s.replace(/ß/g, 'ss').replace(/æ/g, 'ae').replace(/œ/g, 'oe').replace(/ø/g, 'o');
}

/** Phonetic squash of one folded token so Latin spellings and transliterations meet */
function squash(tok: string): string {
  return tok
    .replace(/x/g, 'ks')
    .replace(/w/g, 'v')
    .replace(/ph/g, 'f')
    .replace(/qu/g, 'kv')
    .replace(/q/g, 'k')
    .replace(/ck/g, 'k')
    .replace(/c(?=[eiy])/g, 's')
    .replace(/c(?!h)/g, 'k')
    .replace(/y/g, 'i')
    .replace(/([a-z])\1+/g, '$1');
}

/** Normalised tokens of a string */
export function tokens(input: string | undefined): string[] {
  if (!input) return [];
  return fold(input)
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map(squash);
}

const STOP = new Set([
  // bg (after normalisation)
  'i', 'v', 'na', 'za', 's', 'ot', 'do', 'po', 'se', 'e', 'li', 'ili', 'kak', 'koi', 'kakvo', 'mi', 'da',
  // en
  'the', 'a', 'an', 'of', 'for', 'and', 'to', 'in', 'with', 'is', 'my', 'on', 'or',
]);

/** Query tokens without stop words (kept if the query is only stop words) */
export function queryTokens(q: string): string[] {
  const all = tokens(q);
  const useful = all.filter((t) => !STOP.has(t) && (t.length > 1 || /\d/.test(t)));
  return useful.length ? useful : all;
}

// ---------------------------------------------------------------------------
// Fuzzy matching
// ---------------------------------------------------------------------------

/** Optimal-string-alignment distance with an upper bound (returns max+1 when exceeded) */
export function editDistance(a: string, b: string, max = 2): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const m = a.length;
  const n = b.length;
  let prev2: number[] = [];
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1);
      cur[j] = v;
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    prev2 = prev;
    prev = cur;
  }
  return prev[n];
}

const allowedEdits = (len: number) => (len >= 7 ? 2 : len >= 4 ? 1 : 0);

/**
 * How well a query token matches a document token, 0…1.
 * 1 exact · 0.85 prefix · 0.5 substring · 0.35–0.6 within a small edit distance
 */
export function tokenMatch(q: string, d: string): number {
  if (q === d) return 1;
  if (d.startsWith(q)) return q.length === 1 ? 0.55 : 0.85;
  if (q.length >= 3 && d.includes(q)) return 0.5;
  const max = allowedEdits(q.length);
  if (!max || d.length < 3) return 0;
  // whole token, or the beginning of a longer token (typing in progress with a typo)
  let best = editDistance(q, d, max);
  for (const len of [q.length - 1, q.length, q.length + 1]) {
    if (len >= 3 && len < d.length) best = Math.min(best, editDistance(q, d.slice(0, len), max));
  }
  if (best > max) return 0;
  return best === 1 ? 0.6 : 0.4;
}

// ---------------------------------------------------------------------------
// Prepared index + ranking
// ---------------------------------------------------------------------------

interface Prepared {
  doc: SearchDoc;
  fields: { toks: string[]; w: number }[];
  titleNorm: string;
}

const FIELD_WEIGHTS = { title: 10, alias: 6, kw: 6, sub: 3.5, text: 1.5 } as const;
const TYPE_BOOST: Record<DocType, number> = { product: 3, category: 2.5, page: 1.5, faq: 0 };

/** FAQ questions are long sentences: their words count for less than a product or page name */
const FAQ_WEIGHTS: Partial<Record<keyof typeof FIELD_WEIGHTS, number>> = { title: 5, text: 1 };

export function prepare(index: SearchIndex): Prepared[] {
  return index.docs.map((doc) => ({
    doc,
    titleNorm: tokens(doc.title).join(' '),
    fields: (Object.keys(FIELD_WEIGHTS) as (keyof typeof FIELD_WEIGHTS)[])
      .map((k) => ({
        toks: [...new Set(tokens(doc[k]))],
        w: (doc.type === 'faq' ? FAQ_WEIGHTS[k] : undefined) ?? FIELD_WEIGHTS[k],
      }))
      .filter((f) => f.toks.length),
  }));
}

export function search(prepared: Prepared[], q: string): SearchHit[] {
  const qt = queryTokens(q);
  if (!qt.length) return [];
  const qNorm = qt.join(' ');
  const hits: SearchHit[] = [];
  for (const p of prepared) {
    let total = 0;
    let all = true;
    for (const t of qt) {
      let best = 0;
      for (const f of p.fields) {
        let m = 0;
        for (const d of f.toks) {
          const s = tokenMatch(t, d);
          if (s > m) m = s;
          if (m === 1) break;
        }
        if (m * f.w > best) best = m * f.w;
      }
      if (!best) {
        all = false;
        break;
      }
      total += best;
    }
    if (!all) continue;
    if (p.titleNorm === qNorm) total += 25;
    else if (p.titleNorm.startsWith(qNorm)) total += 10;
    else if (p.doc.type !== 'faq' && ` ${p.titleNorm}`.includes(` ${qNorm}`)) total += 5;
    total += TYPE_BOOST[p.doc.type];
    hits.push({ doc: p.doc, score: total });
  }
  return hits.sort((a, b) => b.score - a.score);
}

/** Hits grouped by type (in GROUP_ORDER); weak fuzzy hits far below the group's best match are dropped */
export function groupHits(hits: SearchHit[], minRatio = 0.2): { type: DocType; hits: SearchHit[] }[] {
  return GROUP_ORDER.map((type) => {
    const list = hits.filter((h) => h.doc.type === type);
    const top = list[0]?.score ?? 0;
    return { type, hits: list.filter((h) => h.score >= top * minRatio) };
  }).filter((g) => g.hits.length);
}

// ---------------------------------------------------------------------------
// Highlighting
// ---------------------------------------------------------------------------

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

const WORD = /([\p{L}\p{N}]+)/u;

/** Length (in original characters) of the part of `word` that a query token matches, 0 if none */
function matchLength(word: string, qt: string[]): number {
  const norm = tokens(word);
  if (norm.length !== 1) return 0;
  const w = norm[0];
  let best = 0;
  for (const q of qt) {
    if (w === q) return word.length;
    if (w.startsWith(q)) {
      // shortest original prefix whose normalised form covers the query token
      for (let k = 1; k <= word.length; k++) {
        const pre = tokens(word.slice(0, k))[0] ?? '';
        if (pre.length >= q.length && pre.startsWith(q)) {
          best = Math.max(best, k);
          break;
        }
      }
    } else if (tokenMatch(q, w) >= 0.4) {
      best = word.length;
    }
  }
  return best;
}

/** HTML-escaped text with <mark> around the parts that match the query */
export function highlight(text: string | undefined, q: string): string {
  if (!text) return '';
  const qt = queryTokens(q);
  if (!qt.length) return escapeHtml(text);
  return text
    .split(WORD)
    .map((part, i) => {
      if (i % 2 === 0) return escapeHtml(part);
      const n = matchLength(part, qt);
      if (!n) return escapeHtml(part);
      return `<mark>${escapeHtml(part.slice(0, n))}</mark>${escapeHtml(part.slice(n))}`;
    })
    .join('');
}

/** Short excerpt of a long text around the first match (plain text, not escaped) */
export function snippet(text: string | undefined, q: string, max = 150): string {
  if (!text) return '';
  if (text.length <= max) return text;
  const qt = queryTokens(q);
  const parts = text.split(WORD);
  let pos = -1;
  let offset = 0;
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 1 && qt.length && matchLength(parts[i], qt)) {
      pos = offset;
      break;
    }
    offset += parts[i].length;
  }
  if (pos < 0 || pos < max * 0.6) {
    const cut = text.lastIndexOf(' ', max);
    return text.slice(0, cut > max * 0.6 ? cut : max).trimEnd() + '…';
  }
  let start = text.lastIndexOf(' ', Math.max(0, pos - Math.round(max * 0.35)));
  start = start < 0 ? 0 : start + 1;
  let end = text.indexOf(' ', start + max);
  if (end < 0) end = text.length;
  return (start > 0 ? '…' : '') + text.slice(start, end).trim() + (end < text.length ? '…' : '');
}

// ---------------------------------------------------------------------------
// Loading
// ---------------------------------------------------------------------------

const cache = new Map<string, Promise<Prepared[]>>();

/** Fetch + prepare the index once per URL */
export function loadIndex(url: string): Promise<Prepared[]> {
  let p = cache.get(url);
  if (!p) {
    p = fetch(url, { credentials: 'same-origin' })
      .then((r) => {
        if (!r.ok) throw new Error(`search index ${r.status}`);
        return r.json() as Promise<SearchIndex>;
      })
      .then(prepare);
    p.catch(() => cache.delete(url));
    cache.set(url, p);
  }
  return p;
}

export type { Prepared };
