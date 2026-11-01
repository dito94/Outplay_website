// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://dito94.github.io',
  base: '/Outplay_website',
  trailingSlash: 'always',
  // Keep HTML-aware whitespace handling (Astro 7 defaults to JSX rules, which can drop spaces in running text)
  compressHTML: true,
  build: { format: 'directory', inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
});
