// Downscale an uploaded photo in the browser (canvas) so it fits in localStorage:
// longest edge ≤ maxEdge, JPEG at the given quality, transparent areas flattened onto white.

async function decode(file: File): Promise<{ src: CanvasImageSource; w: number; h: number; done: () => void }> {
  if ('createImageBitmap' in window) {
    try {
      const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
      return { src: bmp, w: bmp.width, h: bmp.height, done: () => bmp.close() };
    } catch {
      /* fall back to <img> decoding below */
    }
  }
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.src = url;
  try {
    await img.decode();
  } catch (e) {
    URL.revokeObjectURL(url);
    throw e;
  }
  return { src: img, w: img.naturalWidth, h: img.naturalHeight, done: () => URL.revokeObjectURL(url) };
}

export async function resizeImage(file: File, maxEdge = 1600, quality = 0.8): Promise<string> {
  const { src, w, h, done } = await decode(file);
  try {
    if (!w || !h) throw new Error('empty image');
    const scale = Math.min(1, maxEdge / Math.max(w, h));
    const cw = Math.max(1, Math.round(w * scale));
    const ch = Math.max(1, Math.round(h * scale));
    const canvas = document.createElement('canvas');
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('no canvas');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cw, ch);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(src, 0, 0, cw, ch);
    const out = canvas.toDataURL('image/jpeg', quality);
    if (!out.startsWith('data:image/jpeg')) throw new Error('encode failed');
    return out;
  } finally {
    done();
  }
}

/** "1,2 МБ" / "340 KB" style size of a string stored in localStorage (≈ 1 byte per character) */
export function formatBytes(chars: number, lang: 'bg' | 'en'): string {
  const nf = new Intl.NumberFormat(lang === 'bg' ? 'bg-BG' : 'en-GB', { maximumFractionDigits: 1 });
  if (chars >= 1_000_000) return `${nf.format(chars / 1_000_000)} ${lang === 'bg' ? 'МБ' : 'MB'}`;
  return `${nf.format(Math.max(1, Math.round(chars / 1000)))} ${lang === 'bg' ? 'КБ' : 'KB'}`;
}
