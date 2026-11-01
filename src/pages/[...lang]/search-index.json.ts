// Static search index per language: /search-index.json (BG) and /en/search-index.json (EN).
// Loaded lazily by the search palette and the /search/ page (see src/lib/search.ts).
import type { APIRoute } from 'astro';
import { getImage } from 'astro:assets';
import type { L, Lang } from '../../data/types';
import { categories } from '../../data/categories';
import { products } from '../../data/products';
import { faq } from '../../data/faq';
import { pages } from '../../data/pages';
import { ui } from '../../data/ui';
import { site } from '../../data/site';
import { langParams, getLang, url, productUrl, categoryUrl, t } from '../../lib/i18n';
import { img, productImages } from '../../lib/images';
import type { SearchDoc, SearchIndex } from '../../lib/search';

export function getStaticPaths() {
  return langParams();
}

const other = (lang: Lang): Lang => (lang === 'bg' ? 'en' : 'bg');
const join = (...parts: (string | undefined | false)[]) => parts.filter(Boolean).join(' · ');

async function thumb(path: string | undefined): Promise<string | undefined> {
  const src = img(path);
  if (!src) return undefined;
  const out = await getImage({ src, width: 160, height: 120, fit: 'cover', format: 'webp', quality: 70 });
  return out.src;
}

/** Extra keywords for the static pages (both languages, so either script finds them) */
const PAGE_KW: Record<string, string> = {
  about: 'компания фирма история опит екип партньори company team experience history partners outplay',
  projects: 'проекти обекти реализации снимки галерия преди след projects photos references before after',
  faq: 'въпроси отговори помощ гаранция монтаж поддръжка questions answers help installation care',
  contact: 'контакти адрес телефон имейл viber вайбър карта офис как да ни намерите contact address phone email map office',
  inquiry: 'запитване оферта цена цени ориентировъчна оферта размери оглед замер quote price prices estimate dimensions site visit',
  products: 'продукти системи каталог products systems catalogue',
};

export const GET: APIRoute = async ({ params }) => {
  const lang = getLang(params.lang);
  const o = other(lang);
  const catName = (id: string) => categories.find((c) => c.id === id)?.name;
  const docs: SearchDoc[] = [];

  // Products
  const sortedProducts = [...products].sort((a, b) => {
    const ca = categories.find((c) => c.id === a.category)?.order ?? 0;
    const cb = categories.find((c) => c.id === b.category)?.order ?? 0;
    return ca - cb || a.order - b.order;
  });
  for (const p of sortedProducts) {
    const cat = categories.find((c) => c.id === p.category);
    const sub = cat?.subgroups?.find((s) => s.id === p.subgroup);
    docs.push({
      type: 'product',
      id: p.id,
      title: t(p.name, lang),
      sub: join(t(cat?.name, lang), t(p.tagline, lang)),
      text: t(p.summary, lang),
      alias: [t(p.fullName, lang), t(p.name, o), t(p.fullName, o), t(sub?.name, lang)].join(' · '),
      kw: [
        ...(p.keywords ?? []),
        ...p.features.map((f: L) => t(f, lang)),
        ...(p.options ?? []).map((f: L) => t(f, lang)),
        t(cat?.name, o),
      ].join(' · '),
      url: productUrl(lang, p.category, p.id),
      img: await thumb(productImages(p.id).hero),
    });
  }

  // Categories
  for (const c of [...categories].sort((a, b) => a.order - b.order)) {
    const list = products.filter((p) => p.category === c.id).map((p) => t(p.name, lang));
    docs.push({
      type: 'category',
      id: c.id,
      title: t(c.name, lang),
      sub: t(c.tagline, lang),
      text: list.join(' · '),
      alias: [t(c.title, lang), t(c.name, o), t(c.title, o), ...(c.subgroups ?? []).map((s) => t(s.name, lang))].join(
        ' · ',
      ),
      kw: t(c.intro[0], lang),
      url: categoryUrl(lang, c.id),
      img: await thumb(`categories/${c.id}.jpg`),
    });
  }

  // FAQ (anchors follow the FAQ page: faq-<group id>-<n>)
  for (const g of faq) {
    g.items.forEach((item, i) => {
      docs.push({
        type: 'faq',
        title: t(item.q, lang),
        sub: t(g.title, lang),
        text: t(item.a, lang),
        url: url(lang, `/faq/#faq-${g.id}-${i + 1}`),
      });
    });
  }

  // Key pages
  const pageDocs: { id: string; title: L; text: L; path: string }[] = [
    { id: 'products', title: pages.products.title, text: pages.products.intro, path: '/products/' },
    { id: 'inquiry', title: pages.inquiry.title, text: pages.inquiry.intro, path: '/contact/#inquiry' },
    { id: 'contact', title: pages.contact.title, text: pages.contact.intro, path: '/contact/' },
    { id: 'about', title: pages.about.title, text: pages.about.intro, path: '/about/' },
    { id: 'projects', title: pages.gallery.title, text: pages.gallery.intro, path: '/projects/' },
    { id: 'faq', title: pages.faq.title, text: pages.faq.intro, path: '/faq/' },
  ];
  for (const pg of pageDocs) {
    docs.push({
      type: 'page',
      title: t(pg.title, lang),
      text: t(pg.text, lang),
      alias: t(pg.title, o),
      kw: [
        PAGE_KW[pg.id],
        pg.id === 'contact' ? [t(site.address, lang), ...site.phones.map((p) => p.display), site.email].join(' ') : '',
        pg.id === 'contact' || pg.id === 'inquiry' ? t(ui.nav.inquiry, lang) : '',
      ].join(' '),
      url: url(lang, pg.path),
    });
  }

  const body: SearchIndex = { lang, docs, itemUrl: url(lang, '/products/item/') };
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
