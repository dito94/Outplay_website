// Catalogue map for the admin demo's browser-local changes on public pages (src/lib/custom-products.ts).
// One language-independent file, /catalogue-config.json, fetched by src/components/CustomProducts.astro only in a
// browser that has admin-demo data stored, so other visitors never download it.
import type { APIRoute } from 'astro';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { url } from '../lib/i18n';
import type { CustomProductsConfig } from '../lib/custom-products';

export const GET: APIRoute = () => {
  const data: CustomProductsConfig = {
    /** catalogue product id → category id, to recognise which category a grid lists */
    cats: Object.fromEntries(products.map((p) => [p.id, p.category])),
    /** catalogue product ids per category */
    byCat: Object.fromEntries(categories.map((c) => [c.id, products.filter((p) => p.category === c.id).map((p) => p.id)])),
    /** public page of a custom product, per language: <item>?id=c-… */
    item: { bg: url('bg', '/products/item/'), en: url('en', '/products/item/') },
    /** catalogue names, to rename them inside longer texts (page title, aria-labels) */
    names: Object.fromEntries(products.map((p) => [p.id, p.name])),
    /** mid-sentence forms ("стационарен стъклен покрив"), also renamed on the product's page */
    inline: Object.fromEntries(products.flatMap((p) => (p.nameInline ? [[p.id, p.nameInline]] : []))),
    /** subgroups per category with their catalogue product ids (added products can join one) */
    subgroups: Object.fromEntries(
      categories.map((c) => [c.id, (c.subgroups ?? []).map((sg) => ({ id: sg.id, productIds: sg.productIds }))]),
    ),
    /** shown on the page of a hidden catalogue product (same wording as the page of a hidden added product) */
    hiddenNote: {
      bg: 'Продуктът е скрит от списъците на сайта. Виждате страницата, защото я отваряте с директна връзка.',
      en: 'This product is hidden from the site listings. You can see the page because you opened a direct link.',
    },
  };
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
