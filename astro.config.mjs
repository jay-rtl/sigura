import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
const base = process.env.BASE_PATH || '/';
export default defineConfig({
  site: process.env.SITE_URL || 'https://jay-rtl.github.io',
  base,
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: { build: { chunkSizeWarningLimit: 650 } },
});
