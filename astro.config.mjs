import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://katafract.com',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'file',
  },
  compressHTML: true,
});
