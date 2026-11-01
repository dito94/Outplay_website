# OUTPLAY site — build contract (read before touching code)

Stack: **Astro 5.18 static site**, vanilla TypeScript islands, no UI framework. Deployed to GitHub Pages at
`https://dito94.github.io/Outplay_website/` → Astro `base: '/Outplay_website'`, `trailingSlash: 'always'`.
Always build internal links with the helpers in `src/lib/i18n.ts` (`url(lang, path)`), never hardcode the base.

Languages: Bulgarian (default, no prefix) and English (`/en/` prefix). Every piece of copy is an `L` = `{ bg, en }`
(see `src/data/types.ts`). Bulgarian copy comes from the 2026 catalogue (`docs/catalogue-part-*.md`), cleaned
of typos; English is a natural, fluent translation (not word-for-word), British/neutral spelling.

## IDs (fixed — use exactly)
Categories: `bioclimatic-pergolas`, `glass-systems`, `sun-protection`, `windbreaks`.

Products (id → category → inquiry family):
| id | category | family | catalogue name |
|---|---|---|---|
| `balance` | bioclimatic-pergolas (subgroup `automated`) | pergola | Ламели — серия Balance |
| `infinity` | bioclimatic-pergolas (`automated`) | pergola | Ламели — серия Infinity |
| `flat` | bioclimatic-pergolas (`automated`) | pergola | Поливинилно покритие — серия Flat |
| `curved` | bioclimatic-pergolas (`automated`) | pergola | Поливинилно покритие — серия Curved |
| `automatic-glass-roof` | bioclimatic-pergolas (`automated`) | pergola | Автоматичен стъклен покрив |
| `fixed-glass-roof` | bioclimatic-pergolas (`fixed`) | pergola | Стационарен стъклен покрив |
| `thermo-panel-roof` | bioclimatic-pergolas (`fixed`) | pergola | Стационарен покрив от термопанели |
| `guillotine` | glass-systems (`automatic`) | glass | Гилотина |
| `dormakaba-es-200` | glass-systems (`automatic`) | door | Автоматични входни врати dormakaba ES 200 |
| `sliding-glass` | glass-systems (`manual`) | glass | Ръчни хоризонтално плъзгащи |
| `compact` | glass-systems (`manual`) | glass | Сгъваеми — серия Compact |
| `accord` | glass-systems (`manual`) | glass | Сгъваеми — серия Accord |
| `harmonia` | glass-systems (`manual`) | glass | Сгъваеми — серия Harmonia |
| `vertical-zip` | sun-protection | zip | Вертикални ZIP завеси |
| `roof-zip` | sun-protection | zip | ZIP завеси за стъклени покриви |
| `shell-awning` | sun-protection | awning | Касетъчни тенти Shell |
| `telescopic-windbreak` | windbreaks | windbreak | Телескопични хидравлични ветрозащитни системи |

## Images (convention — pages glob these folders, so no image lists in product data)
All under `src/assets/img/` (JPEG, sRGB, long edge ≤ 2400 px, quality ~86; PNG only when transparency is needed):
- `products/<id>/hero.jpg` — required, landscape, the single best photo
- `products/<id>/gallery-01.jpg … gallery-NN.jpg` — 2–6 more photos (landscape preferred)
- `products/<id>/diagram.jpg` — optional clean technical render (no printed text) for callout hotspots
- `categories/<categoryId>.jpg` — category hero
- `home/…` — `hero.jpg`, `what-we-do.jpg` (catalogue p.3 sketch→render villa, clean, no handwriting), others
- `before-after/<pair>-before.jpg`, `<pair>-after.jpg` — same size, aligned
- `references/<id>.jpg` — reference projects (PDF 59)
- `brand/` — `logo.svg` (on light), `logo-light.svg` (on dark), favicon assets

Metadata files written alongside:
- `src/data/image-meta.ts` → `export const imageMeta: Record<string, ImageMeta>` (key = path relative to `src/assets/img`)
- `src/data/hotspots.ts` → `export const diagramHotspots: Record<string, Hotspot[]>` (by product id, % of diagram.jpg)
  and `export const houseHotspots: Hotspot[]` (% of home/what-we-do.jpg)
- `src/data/before-after.ts` → `export const beforeAfter: BeforeAfterPair[]`
- `src/data/gallery.ts` → `export const gallery: GalleryItem[]`
- `src/data/references.ts` → `export const references: ReferenceProject[]`

## Content files (content agent)
- `src/data/site.ts` — company + contacts
- `src/data/categories.ts` → `export const categories: Category[]`
- `src/data/products.ts` → `export const products: Product[]`
- `src/data/faq.ts` → `export const faq: FaqGroup[]`
- `src/data/inquiry.ts` → `export const inquiryFamilies: Record<InquiryFamily, InquiryFamilyDef>` + shared fields
- `src/data/pages.ts` → home / about / contact / process copy
- `src/data/ui.ts` → UI strings dictionary

## Copy rules
No prices. Never invent specs, certifications, warranties or numbers that are not in the catalogue. No buzzwords
("cutting-edge", "world-class"…), no "Not X, but Y" formulas, no emoji. Plain, confident, specific.
