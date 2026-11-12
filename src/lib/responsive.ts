// Responsive WebP renditions shared by <Img> and the LCP preload in Base, so a preload always names exactly the
// files the <img> (or its phone crop <source>) will pick: no second download.
import { getImage } from 'astro:assets';
import { img, focalOf } from './images';

export const DEFAULT_WIDTHS = [480, 768, 1080, 1440, 1920, 2400];
/** `sizes` of the home hero photo (src/components/HomeHero.astro), shared with its LCP preload on the home page */
export const HOME_HERO_SIZES = '(max-width: 600px) 300vw, (max-width: 1100px) 160vw, 100vw';
const FORMAT = 'webp';
const QUALITY = 80;

/** A second, cropped rendition for small screens (a `<source media>`), for wide photos shown in tall boxes */
export interface Crop {
  /** media query of the `<source>`, e.g. '(max-width: 600px)' */
  media: string;
  /** width / height of the crop (≥ the widest box it fills there, or the image is cropped again by object-fit) */
  ratio: number;
  sizes?: string;
  widths?: number[];
}

export interface ResponsiveOptions {
  sizes?: string;
  widths?: number[];
  crop?: Crop;
}

/** One `<link rel="preload" as="image">` */
export interface PreloadImage {
  srcset: string;
  sizes: string;
  media?: string;
}

/** Widths up to `max`; `max` itself is added only when it is more than 15% wider than the last step
 *  (a near-duplicate full-size file costs build time and deploy weight, and is often larger than the source). */
export function widthSteps(max: number, widths: number[]): number[] {
  const steps = [...new Set(widths)].sort((a, b) => a - b).filter((w) => w <= max);
  const last = steps[steps.length - 1];
  if (!last || max > last * 1.15) steps.push(max);
  return steps;
}

// sharp crops by gravity only, so the focal point picks the nearest side (most focal points sit near the middle)
function gravity(path: string, horizontal: boolean): string {
  const [x = 50, y = 50] = (focalOf(path) ?? '').split(/\s+/).map((v) => parseFloat(v));
  const v = horizontal ? x : y;
  if (!Number.isFinite(v) || (v > 25 && v < 75)) return 'centre';
  return horizontal ? (v <= 25 ? 'left' : 'right') : v <= 25 ? 'top' : 'bottom';
}

export async function responsive(path: string | undefined, { sizes = '100vw', widths = DEFAULT_WIDTHS, crop }: ResponsiveOptions = {}) {
  const meta = img(path);
  if (!path || !meta) return undefined;
  const steps = widthSteps(meta.width, widths);
  const main = await getImage({ src: meta, format: FORMAT, quality: QUALITY, width: steps[steps.length - 1], widths: steps, sizes });
  let cropped: { media: string; srcset: string; sizes: string } | undefined;
  if (crop) {
    // the largest crop the source holds without upscaling
    const cw = Math.min(meta.width, Math.round(meta.height * crop.ratio));
    const ch = Math.round(cw / crop.ratio);
    const cropSteps = widthSteps(cw, crop.widths ?? [480, 720, 1080]);
    const out = await getImage({
      src: meta,
      format: FORMAT,
      quality: QUALITY,
      width: cw,
      height: ch,
      fit: 'cover',
      position: gravity(path, crop.ratio < meta.width / meta.height),
      widths: cropSteps,
    });
    cropped = { media: crop.media, srcset: out.srcSet.attribute, sizes: crop.sizes ?? '100vw' };
  }
  return { meta, main, sizes, crop: cropped };
}

/** Preload links for an LCP image rendered by <Img> with the same options */
export async function preloadImage(path: string | undefined, options: ResponsiveOptions = {}): Promise<PreloadImage[]> {
  const r = await responsive(path, options);
  if (!r) return [];
  const main = { srcset: r.main.srcSet.attribute, sizes: r.sizes };
  if (!r.crop) return [main];
  return [
    { srcset: r.crop.srcset, sizes: r.crop.sizes, media: r.crop.media },
    { ...main, media: `not all and ${r.crop.media}` },
  ];
}
