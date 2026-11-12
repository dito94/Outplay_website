// @ts-check
import { defineConfig } from 'astro/config';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import typography from './integrations/typography.mjs';

// Parallel builds use their own output + cache folders: OUTPLAY_AGENT=name npx astro build
// (output goes to $OUTPLAY_SCRATCH/build-<name>, or the system temp folder when OUTPLAY_SCRATCH is not set)
const agent = process.env.OUTPLAY_AGENT;
const scratch = process.env.OUTPLAY_SCRATCH || join(tmpdir(), 'outplay-builds');

export default defineConfig({
  site: 'https://dito94.github.io',
  base: '/Outplay_website',
  trailingSlash: 'always',
  // Keep HTML-aware whitespace handling (Astro 7 defaults to JSX rules, which can drop spaces in running text)
  compressHTML: true,
  build: { format: 'directory', inlineStylesheets: 'always' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
  integrations: [typography()],
  ...(agent ? { outDir: `${scratch}/build-${agent}`, cacheDir: `./node_modules/.astro-${agent}` } : {}),
});
