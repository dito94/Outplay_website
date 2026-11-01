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
