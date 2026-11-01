# Assets report (images, brand, metadata)

All images come from the 2026 catalogue PDF (`katalog2026-web`). I extracted the embedded image objects directly, at their native resolution of about 150 ppi and up to 3293 px wide. I did not use page renders. The OUTPLAY corner logo, all printed text, callouts and the handwritten notes are separate vector objects in the PDF, so every photo is clean. The PDF's ICC profile is sRGB IEC61966-2.1, so the colours carry over unchanged.

Export settings: JPEG, sRGB, long edge capped at 2400 px, quality 86, progressive, no metadata. The images were left at the resolution stored in the PDF; nothing was upscaled. **115 files, 17 MB in total.**

Many photos are mirrored on the catalogue pages for layout reasons. Licence-plate text shows that the stored images are the true orientation, so I exported every photo the right way round.

## What's where (`src/assets/img/`)

| Folder | Contents |
|---|---|
| `products/<id>/` | `hero.jpg` + `gallery-NN.jpg` for all 17 ids, plus `diagram.jpg` for 8 ids |
| `categories/` | `bioclimatic-pergolas` (PDF 5), `glass-systems` (PDF 30), `sun-protection` (PDF 49), `windbreaks` (PDF 57). All 2400×994 |
| `home/` | `hero`, `hero-alt-1`, `hero-alt-2`, `cover-pergola.png`, `what-we-do`, `about`, `tech-led`, `tech-gutter`, `tech-120`, `mood-01..03` |
| `before-after/` | `carport-before/after` (1355×524), `glassroom-before/after` (1361×1120) |
| `references/` | 6 photos from PDF 59 (about 505×344, small in the source) |
| `brand/` | `logo.svg`, `logo-light.svg`, `logo-tagline.svg`, `logo-tagline-light.svg`, `favicon.svg`, `favicon-32.png`, `favicon.ico`, `apple-touch-icon.png` |

### Images per product (hero + gallery [+ diagram])

| id | files | notes |
|---|---|---|
| balance | hero + 4 + diagram | hero PDF 12 (anthracite, infinity pool) |
| infinity | hero + 4 + diagram | hero PDF 13 (white, LED, dusk). No catalogue photo shows the louvres retracted. The gallery uses the PDF 6 burgundy pergola and the PDF 5 two-bay pergola |
| flat | hero + 5 + diagram | hero PDF 17 (aerial rooftop bar) |
| curved | hero + 3 + diagram | hero PDF 19. Same diagram as Flat (PDF 15) |
| automatic-glass-roof | hero + 2 + diagram | weakest set: only 3 usable photos (the 587 px PDF 8 thumbnail was skipped) |
| fixed-glass-roof | hero + 3 + diagram | hero PDF 25 |
| thermo-panel-roof | hero + 5 + diagram | hero PDF 27 (carport with Mini). `gallery-05` is portrait |
| guillotine | hero + 5 | `gallery-04` and `gallery-05` are portrait. No callout diagram exists |
| dormakaba-es-200 | hero + 3 | hero is PDF 36 (Cafe Danton terrace; the door is in the left bay, focal set). `gallery-02`/`03` are small (about 600 px) and `gallery-03` is an illustration with a drawn radar cone |
| sliding-glass | hero + 4 | hero PDF 41 |
| compact | hero + 2 | `gallery-02` is portrait (PDF 42 folding intro: panels stacked flat, which looks like Compact parking) |
| accord | hero + 3 | `gallery-02` is portrait, `gallery-03` is small (591 px, PDF 31 teaser of zig-zag folding doors) |
| harmonia | hero + 2 | the gallery is the two unlabelled pivot-door photos on PDF 48, which may be a separate product. Please confirm with OUTPLAY |
| vertical-zip | hero + 3 + diagram | `gallery-03` is small (582 px) |
| roof-zip | hero + 3 | `gallery-02` is small (582 px). `gallery-03` is a crop of the PDF 49 conservatory, which has a roof shade on its glass roof |
| shell-awning | hero + 3 | `gallery-03` is small (584 px) |
| telescopic-windbreak | hero + 2 | the hero is the same photo as the category image. `gallery-02` is a product render on white |

Deliberate duplicates (same photo in two folders): `home/hero` = `infinity/gallery-03`, `home/hero-alt-1` = `balance/hero`, `home/hero-alt-2` = `infinity/hero`, `infinity/gallery-04` = category bioclimatic, `vertical-zip/gallery-02` = category sun-protection, `telescopic-windbreak/hero` = category windbreaks, the `mood-*` images and the PDF 10 / PDF 15 diagrams (shared by two products each). `gallery.ts` lists each file only once.

## Home hero choice

**`home/hero.jpg` = PDF 6, the burgundy louvred pergola at dusk** (1753×957), with LED lines in the louvres and a couple on a sofa against a sunset.

- It is the most cinematic of the four candidates.
- Most of the frame is dark. The top band is calm deep-blue sky (good under a nav bar) and the lower-left is dark ground and grass, so white headline text reads with little or no scrim.
- The warm sunset suits the black and yellow brand.
- Focal point: `55% 60%`, which keeps the pergola and the couple in view on portrait screens.
- Caveat: the frame colour is an unusual RAL burgundy. In the catalogue it illustrates "custom colours".

Runner-ups:
- `hero-alt-1` is PDF 12 (anthracite pergola by the infinity pool). It is daylight, with calm sky top-left and pool at the bottom, but needs a dark scrim for white text.
- `hero-alt-2` is PDF 13 (white pergola with LED at dusk). The façade behind it is busier.

## Cover pergola

PDF 60 holds a larger copy (3293 px) of the PDF 1 cover pergola. Its soft mask is fully opaque, so there is no real cut-out in the file.

`home/cover-pergola.png` (1466×1010) is made by keying out the black: alpha comes from luminance and the colour is un-multiplied. The crop edges are feathered.

- It composites exactly on near-black backgrounds (#0A0A08 or #000).
- On light backgrounds the dark posts turn semi-transparent, so use it on dark sections only.

## What-we-do villa (PDF 3)

**The image is clean.** The handwriting and arrows are vector shapes on top of the photo. I removed only the 360 px of plain white on the left. The left side still fades from sketch to white.

`houseHotspots` has 6 entries:
- The 4 annotated systems: automatic glass roof, guillotine, Balance pergola and sliding glass. Each dot sits on the element the handwritten arrow touches; I mapped the arrow geometry into image pixels.
- 2 extra elements with no `productId`: the glass balustrade on the balcony and the PVC/aluminium windows on the right. Both services are listed on catalogue p. 4–5.

## Diagrams and hotspots

The diagram renders are RGBA cut-outs. I composited each one onto the catalogue's box grey **#EAEAE8** and cropped it with 6% padding. None of them contains printed text.

How the hotspots were placed:
1. I took each callout's leader-line end point and dot from the PDF vector data.
2. I mapped it into the image through the image's placement matrix.
3. In the catalogue the dots stop just short of the structure, so I extended each vertical leader down until it meets the structure, then moved it a few pixels into the member.
4. Two leaders pass through a beam to the item behind it, so those dots go on the item itself: PDF 15 "fabric" sits on the fabric and PDF 26 "fixed glass panels" sits on the glass.

I checked every point visually on the final JPGs.

Label notes:
- **Balance:** its rotation label leaves out "can stack at one end", because stacking is Infinity-only (Balance has one motor and rotates only). Infinity keeps the full printed text.
- **Typo fixed:** "Водонепромукаемо" is now "Водонепромокаемо".
- **thermo-panel-roof:** the "perimeter" hotspot also links to `categoryId: 'glass-systems'`.
- **vertical-zip:** the label "Напълно скрит механизъм" is printed twice (once per mounting type), so each copy gets "(вграден монтаж)" or "(външен монтаж)" to tell them apart.

## Before / after

Both pairs are genuine (same scene, two states) and aligned:

1. **carport** (PDF 28): the enclosed render was registered onto the open one with SIFT and RANSAC (similarity transform: scale 1.089, rotation 1.05°). Both images were then cropped to the common area. A 50/50 blend shows the cars and roof sharp.
2. **glassroom** (PDF 29): two separate renders from the same camera, with no mirroring needed. A 6.6 px vertical offset was corrected by cropping.

I found no other same-scene pairs. PDF 13, 17, 19 and 41 show the same structures, but from different viewpoints.

## QR codes

Only one QR code exists in the whole PDF. I scanned all 60 pages at 200 dpi, in tiles, with OpenCV.

- **PDF 7 (catalogue p. 11), "вижте видео": `https://outplay.bg/video/`**

The small square on the windbreak post in the PDF 58 close-up is a hardware label, not a QR code.

## Brand

The logo is vector in the PDF, so **no potrace was needed**. I took the exact paths from the PDF and only changed the colours: yellow is set to #F9C823 (the PDF uses #FFCD04) and black to #0A0A08. The viewBoxes are tight, there is no background rect, and each file was rendered to PNG and checked against the logo JPG.

| File | Contents |
|---|---|
| `logo.svg` / `logo-light.svg` | Compact logo without tagline (bracket with stripes, wordmark, yellow bracket), from PDF 59. Black/yellow and white/yellow |
| `logo-tagline.svg` / `logo-tagline-light.svg` | Back-cover version from PDF 60, with "comfortable outdoor and indoor living spaces" |
| `favicon.svg` | The bracket mark only, with the gap tightened. It switches black to white under `prefers-color-scheme: dark`. At 16 px the stripes merge into a grey band and the mark reads as a bracket emblem |
| `apple-touch-icon.png` | 180×180, white and yellow mark on #0A0A08 |
| `favicon-32.png`, `favicon.ico` (16/32/48) | Dark-tile fallbacks |

These favicon files may need copying to `public/` if the layout links them by URL.

## Other caveats

- **Baked-in text or logos:**
  - The reference photos carry the client logos printed on them (NEW LAND DISTRICT, SamELYON, FOHAR, Constantinoff).
  - Some scenes have signage: "Skyline Hotel" in `home/about`, "Cafe Danton" in the dormakaba hero.
  - The beach pergola photo on PDF 14 shows a third-party "Green Beach" banner, so I skipped it.
  - I painted out the "120°" badge in `tech-120` (it sat on plain black).
- **Reference names:**
  - Two names come from signage, not printed captions: "Raffy Bar & Gelato" from the round "R" sign and "Щастливеца" from "RESTAURANT ЩАСТЛИВЕЦА".
  - "SamELYON" is written as it appears in the logo.
  - The vertical word next to the NEW LAND DISTRICT logo looks like "LOZEN", but I couldn't confirm it, so I left it out.
- **Resolution:** most photos are 1300–1850 px wide. Only the full-spread openers reach 2400 px. Diagrams are 820–1240 px wide.
- **Thin product sets:** automatic-glass-roof, compact, harmonia, telescopic-windbreak and dormakaba have few photos.

## Metadata files (`src/data/`)

| File | Contents |
|---|---|
| `image-meta.ts` | All 115 files: BG/EN alt text, plus `focal` where the subject is off-centre |
| `hotspots.ts` | `diagramHotspots` for 8 products and `houseHotspots` |
| `before-after.ts` | 2 pairs |
| `gallery.ts` | 40 items across all 4 categories |
| `references.ts` | 6 projects in printed grid order |

Every path in these files exists. `tsc --strict` passes, and `OUTPLAY_AGENT=assets npx astro build` completes and processes the images.
