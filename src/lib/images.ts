import type { ImageMetadata } from 'astro';
import type { Lang } from '../data/types';

// Every match is emitted as-is unless a page transforms it, so leave out rasters no page shows: the brand icons
// (served from public/) and unused home artwork.
const files = import.meta.glob<{ default: ImageMetadata }>(
  [
    '/src/assets/img/**/*.{jpg,jpeg,png,webp}',
    '!/src/assets/img/brand/**',
    '!/src/assets/img/home/tech-*',
    '!/src/assets/img/home/cover-pergola.*',
  ],
  { eager: true },
);

const PREFIX = '/src/assets/img/';

/** All image paths (relative to src/assets/img) */
export const imagePaths = Object.keys(files)
  .map((k) => k.slice(PREFIX.length))
  .sort();

/** Look up an image by its path relative to src/assets/img */
export function img(path: string | undefined): ImageMetadata | undefined {
  if (!path) return undefined;
  return files[PREFIX + path.replace(/^\/+/, '')]?.default;
}

export function hasImg(path: string | undefined): boolean {
  return !!img(path);
}

/** Images in a folder matching a prefix, e.g. listImages('products/balance/', 'gallery-') */
export function listImages(folder: string, startsWith = ''): string[] {
  const f = folder.replace(/\/?$/, '/');
  return imagePaths.filter((p) => p.startsWith(f + startsWith) && !p.slice(f.length).includes('/'));
}

export interface ProductImages {
  hero?: string;
  gallery: string[];
  diagram?: string;
}

export function productImages(id: string): ProductImages {
  const base = `products/${id}/`;
  const hero = hasImg(base + 'hero.jpg') ? base + 'hero.jpg' : listImages(base)[0];
  const diagram = ['diagram.jpg', 'diagram.png'].map((f) => base + f).find(hasImg);
  const gallery = listImages(base, 'gallery-');
  return { hero, gallery, diagram };
}

// Lazily resolved image metadata (alt text/focal); file is written by the assets pipeline.
const metaModules = import.meta.glob<{ imageMeta: Record<string, { alt: { bg: string; en: string }; focal?: string }> }>(
  '/src/data/image-meta.ts',
  { eager: true },
);
const imageMeta = Object.values(metaModules)[0]?.imageMeta ?? {};

export function altOf(path: string | undefined, lang: Lang, fallback = ''): string {
  if (!path) return fallback;
  return imageMeta[path]?.alt?.[lang] ?? fallback;
}

export function focalOf(path: string | undefined): string | undefined {
  if (!path) return undefined;
  return imageMeta[path]?.focal;
}

/**
 * URL of a large WebP rendition for lightbox links (call from component frontmatter). It is the no-JS target and
 * the fallback; the lightbox itself loads the size it needs from the thumbnail's srcset. Same format, quality and
 * widths as Img.astro (1920, or the photo's own width when smaller), so the file is shared with the page images
 * instead of being generated and downloaded a second time.
 */
export async function lightboxSrc(path: string | undefined, width = 1920): Promise<string | undefined> {
  const meta = img(path);
  if (!meta) return undefined;
  const { getImage } = await import('astro:assets');
  const out = await getImage({ src: meta, width: meta.width > width ? width : meta.width, format: 'webp', quality: 80 });
  return out.src;
}
