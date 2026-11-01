// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://dito94.github.io',
  base: '/Outplay_website',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  image: { responsiveStyles: false },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
});
