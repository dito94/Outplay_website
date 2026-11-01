// @ts-check
import { defineConfig } from 'astro/config';

// Parallel builds (one per agent) use their own output + cache folders: OUTPLAY_AGENT=name npx astro build
const agent = process.env.OUTPLAY_AGENT;
const scratch = '/tmp/claude-0/-home-user/bd9643c5-b0c8-52a9-94df-688b6b6403b0/scratchpad';

export default defineConfig({
  site: 'https://dito94.github.io',
  base: '/Outplay_website',
  trailingSlash: 'always',
  // Keep HTML-aware whitespace handling (Astro 7 defaults to JSX rules, which can drop spaces in running text)
  compressHTML: true,
  build: { format: 'directory', inlineStylesheets: 'always' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
  ...(agent ? { outDir: `${scratch}/build-${agent}`, cacheDir: `./node_modules/.astro-${agent}` } : {}),
});
