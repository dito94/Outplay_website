import type { L, Lang } from '../data/types';

export const LANGS: Lang[] = ['bg', 'en'];
export const DEFAULT_LANG: Lang = 'bg';

/** getStaticPaths helper for src/pages/[...lang]/… routes */
export function langParams() {
  return LANGS.map((lang) => ({ params: { lang: lang === DEFAULT_LANG ? undefined : lang } }));
}

export function getLang(param: string | undefined): Lang {
  return param === 'en' ? 'en' : 'bg';
}

/** Translate a bilingual value */
export function t(value: L | undefined, lang: Lang): string {
  if (!value) return '';
  return value[lang] ?? value.bg;
}

const BASE = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');

/**
 * Build an internal URL with base path + language prefix + trailing slash.
 * url('bg', '/products/') → /Outplay_website/products/
 * url('en', 'faq') → /Outplay_website/en/faq/
 */
export function url(lang: Lang, path = '/'): string {
  const [pathname, hash = ''] = path.split('#');
  const [clean, query = ''] = pathname.split('?');
  let p = clean.replace(/^\/+/, '');
  if (p && !p.endsWith('/') && !/\.[a-z0-9]+$/i.test(p)) p += '/';
  const prefix = lang === DEFAULT_LANG ? '' : `${lang}/`;
  return `${BASE}${prefix}${p}${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`;
}

/** Path of an asset in /public (no language prefix) */
export function asset(path: string): string {
  return `${BASE}${path.replace(/^\/+/, '')}`;
}

/** Strip base + language prefix from a pathname → language-neutral route ("/products/x/") */
export function routeOf(pathname: string): string {
  let p = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname.replace(/^\/+/, '');
  p = p.replace(/^en(\/|$)/, '');
  return '/' + p;
}

/** Same page in the other language */
export function switchLangUrl(pathname: string, to: Lang): string {
  return url(to, routeOf(pathname));
}

export const productUrl = (lang: Lang, category: string, id: string) => url(lang, `/products/${category}/${id}/`);
export const categoryUrl = (lang: Lang, category: string) => url(lang, `/products/${category}/`);

/** Simple {placeholder} interpolation */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

/** "7 продукта" / "1 продукт" / "7 products" */
export function productCount(lang: Lang, n: number): string {
  if (lang === 'bg') return `${n} ${n === 1 ? 'продукт' : 'продукта'}`;
  return `${n} ${n === 1 ? 'product' : 'products'}`;
}

/** Product name for use inside a sentence (lower-case generic names, keeps series/brand names) */
export function inlineName(p: { name: L; nameInline?: L }, lang: Lang): string {
  return t(p.nameInline ?? p.name, lang);
}

/** Bulgarian "с" becomes "със" before words starting with с/з */
export function withPrep(lang: Lang, word: string): string {
  if (lang !== 'bg') return `with ${word}`;
  return `${/^[сзСЗ]/.test(word) ? 'със' : 'с'} ${word}`;
}
