// Tile spans for the projects gallery mosaic. Used at build time and in the browser after filtering,
// so every visible set of n tiles fills complete rows (no orphans).
//
// 3-up layout on a 6-column grid:
//   S = 2 cols (a third)   H = 3 cols (a half)   F = 4 cols × 2 rows (feature)   P = 6 cols × 2 rows (single tile)
// Groups of three repeat as: feature-left [F S S] · row [S S S] · feature-right [S F S] · row [S S S].
// A remainder of 2 adds a row of halves [H H]; a remainder of 1 turns the last group into two rows of halves.
export type Span3 = 'S' | 'H' | 'F' | 'P';
// 2-up layout: W = full width × 2 rows, S = half width.
export type Span2 = 'W' | 'S';

export function layout3(n: number): Span3[] {
  if (n <= 0) return [];
  if (n === 1) return ['P'];
  const groups: Span3[][] = [];
  const full = Math.floor(n / 3);
  for (let g = 0; g < full; g++) {
    const k = g % 4;
    groups.push(k === 0 ? ['F', 'S', 'S'] : k === 2 ? ['S', 'F', 'S'] : ['S', 'S', 'S']);
  }
  const r = n % 3;
  if (r === 2) groups.push(['H', 'H']);
  if (r === 1) {
    groups.pop();
    groups.push(['H', 'H', 'H', 'H']);
  }
  return groups.flat();
}

export function layout2(n: number): Span2[] {
  const out: Span2[] = [];
  for (let i = 0; i < n; i++) out.push(i % 3 === 0 ? 'W' : 'S');
  // a lone half tile at the end becomes full width
  if (n % 3 === 2) out[n - 1] = 'W';
  return out;
}

// Responsive `sizes` for a tile. Tiles crop with object-fit: cover, so the file must be at least
// max(box width, box height × image aspect) wide. Box [width, height] per breakpoint, upper bounds taken from the
// grid CSS in GalleryMosaic.astro: px at ≥1440 (content 1328, 6 cols of 208, rows ≤ 320), vw below.
type Box = [number, number];
const BOX3_PX: Record<Span3, Box> = { S: [432, 320], H: [656, 320], F: [880, 656], P: [1328, 656] };
// 1001–1439: rows = max(220px, 21vw) ≤ 22vw
const BOX3_VW: Record<Span3, Box> = { S: [31, 22], H: [47, 22], F: [62, 46], P: [94, 46] };
// 601–1000: 2 columns, rows = clamp(170px, 27vw, 270px) ≤ 28.5vw
const BOX2_VW: Record<Span2, Box> = { S: [47, 28.5], W: [94, 59] };
// ≤600: one column at 3:2
const BOX1_VW: Box = [94, 63];

const need = ([w, h]: Box, aspect: number) => Math.ceil(Math.max(w, h * aspect));

export function tileSizes(s3: Span3, s2: Span2, aspect: number): string {
  const a = aspect > 0 ? aspect : 1.5;
  return [
    `(min-width: 1440px) ${need(BOX3_PX[s3], a)}px`,
    `(min-width: 1001px) ${need(BOX3_VW[s3], a)}vw`,
    `(min-width: 601px) ${need(BOX2_VW[s2], a)}vw`,
    `${need(BOX1_VW, a)}vw`,
  ].join(', ');
}
