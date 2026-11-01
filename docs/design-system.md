# OUTPLAY design system — how to build pages that match

Read `docs/CONTRACT.md` first (stack, ids, data files). Then study the reference implementation:
`src/pages/[...lang]/index.astro` (home), `src/layouts/Base.astro`, `src/styles/global.css`, and the components in
`src/components/`. Match them exactly — same tokens, same spacing rhythm, same tone.

## Direction
Premium architectural brand from Sofia. Photography-led, calm, precise. White "day" bands (`.section`), light-grey
bands (`.section.mist`), catalogue-black "night" bands (`.section.night`). Yellow `#F9C823` is the single action /
accent colour: buttons, the short rule above headings, small marks. Never yellow text on white; never decorative
gradients, glows, glassmorphism, emoji, icon-in-rounded-square tiles, or grids of identical icon cards.

## Page skeleton
```astro
---
import Base from '../../layouts/Base.astro';
import { langParams, getLang, url, t } from '../../lib/i18n';
export function getStaticPaths() { return langParams(); }   // or flatMap with your own params, keeping `lang`
const lang = getLang(Astro.params.lang);
---
<Base lang={lang} title="…" description="…" ogImage="products/x/hero.jpg">
  <section class="section">  <div class="wrap"> … </div>  </section>
  <CtaBand lang={lang} />
</Base>
```
- Routes live in `src/pages/[...lang]/…`; BG has no prefix, EN is `/en/…`. Build every link with `url(lang, '/path/')`,
  `productUrl`, `categoryUrl` from `src/lib/i18n.ts`. Never hardcode `/Outplay_website`.
- Every page: exactly one `<h1>`, headings in order, `<Breadcrumbs>` under the page hero (except home).
- Pages that start with a dark full-bleed photo can pass `header="overlay"` to `Base` (transparent header); otherwise
  default solid header. If you use overlay, the first section must be dark enough for white text and must reserve
  `padding-top: calc(var(--header-h) + …)`.

## Tokens & utilities (src/styles/global.css)
- Layout: `.wrap` (max 1440 + responsive gutter), `.section` (vertical rhythm), `.section-tight`, `.measure`.
- Type: `.display`, `.h1`, `.h2`, `.h3`, `.h4`, `.lead`, `.muted`, `.small`, `.num` (tabular numerals), `.rule`
  (yellow 56px rule above a heading — use on section headings, not everywhere).
- Display face: Jost (light 300 for big headings). Body: Onest. Don't introduce other fonts.
- Buttons: `.btn` (yellow primary), `.btn-dark`, `.btn-ghost`, `.btn-viber`, `.btn-sm`, `.btn-row`; `.link-arrow`.
  Primary CTA everywhere = "Направете запитване" / "Request a quote" → `url(lang, '/contact/?product=<id>#inquiry')`.
- Media: `.media` + aspect classes `.ratio-wide|cine|photo|tall`; always render images with `<Img src="path" lang>`
  (`src/components/Img.astro`, responsive WebP, alt text from `src/data/image-meta.ts`). Give a correct `sizes`.
- Forms: `.field`, `.input`, `.select`, `.textarea`, `.hint`, `.error`, `.chips` + `.chip` (radio/checkbox pills).
- Lists: `.ticks` (yellow-dash bullets). Specs: `.spec-table` (hairline table, `<th>` label / `<td>` value).
- `data-reveal` on a block = subtle reveal on scroll (content stays visible without JS). Use on section-level blocks
  only, not on every element.
- Colours via CSS vars: `--ink --graphite --steel --alu --line --mist --paper --yellow --yellow-deep --viber`, and
  contextual `--fg --bg --muted --hair --focus --surface` (switch automatically inside `.night`).
- Motion: `var(--ease)` = cubic-bezier(.16,1,.3,1); 150–300 ms for state changes; transform/opacity only; no image
  zoom on hover, no bounce, no infinite pulsing; respect `prefers-reduced-motion`.

## Components to reuse (src/components)
`Img`, `Icon` (see names in file), `SectionHead` (asymmetric title + intro), `Breadcrumbs`, `ProductCard`, `CtaBand`,
`FaqAccordion`, `BeforeAfter`, `HotspotScene` (image + numbered hotspots + legend; also for product diagrams with
`diagramHotspots[id]`), `LamellaDemo` (bioclimatic lamella interactive: `series="balance"|"infinity"|"both"`),
`CopyButton`, `Logo`. If you need a new shared component, put it in `src/components/` with a clear name.

## Copy
Use data from `src/data/*` (bilingual `L` objects via `t(value, lang)`). For page-specific microcopy that isn't in the
data files, add bilingual strings in a local `const T = { key: { bg, en } }` at the top of the page. Bulgarian is
primary; English must be equally fluent. No buzzwords, no "Not X, but Y", no colon reveals, no exclamation marks,
no eyebrow labels (small uppercase text above headings). Plain, specific, confident.

## Accessibility & quality bar
WCAG AA contrast; visible focus (global `:focus-visible`); all interactive things are real `<a>`/`<button>`/inputs
with labels; 44px min touch targets; keyboard support for custom widgets (arrows/Escape where expected);
`aria-live` for dynamic messages; no horizontal scroll at 360px; images have meaningful alt (or `alt=""` when purely
decorative). Test BG and EN — Bulgarian strings are ~20% longer.
