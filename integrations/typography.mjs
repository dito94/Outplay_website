// Post-build typography for the static HTML:
//  • Bulgarian headings: a non-breaking space after short words (в, с, и, за, на, не, от, до…) so they never end a line
//  • English pages: phone numbers in international format (+359 …) for visitors outside Bulgaria
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SHORT = '(?:в|във|с|със|и|за|на|не|от|до|по|при|без|към|а|о|у|е|я|й|из|що|ще)';
const shortWord = new RegExp(`(^|[\\s(„])(${SHORT})\\s+(?=[^\\s<])`, 'giu');
const PHONES = [
  ['087 981 12 59', '+359 87 981 1259'],
  ['088 998 69 69', '+359 88 998 6969'],
];

function nbspHeadings(html) {
  return html.replace(/(<h[1-4]\b[^>]*>)([\s\S]*?)(<\/h[1-4]>)/g, (_, open, inner, close) => {
    // only touch text between tags, never attributes
    const fixed = inner
      .split(/(<[^>]+>)/)
      .map((part) => (part.startsWith('<') ? part : part.replace(shortWord, (m, pre, w) => `${pre}${w} `)))
      .join('');
    return open + fixed + close;
  });
}

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== '_astro') yield* htmlFiles(p);
    } else if (entry.name.endsWith('.html')) yield p;
  }
}

export default function typography() {
  return {
    name: 'outplay-typography',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const root = fileURLToPath(dir);
        for await (const file of htmlFiles(root)) {
          let html = await readFile(file, 'utf8');
          const before = html;
          const isEn = /<html[^>]*\blang="en"/.test(html);
          if (isEn) {
            for (const [local, intl] of PHONES) html = html.split(local).join(intl);
          } else {
            html = nbspHeadings(html);
          }
          if (html !== before) await writeFile(file, html);
        }
      },
    },
  };
}
