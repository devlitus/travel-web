// @ts-check
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://travel-web.vercel.app',
  adapter: vercel(),

  integrations: [
    sitemap({
      filter: (page) => !page.includes('/api/'),
    }),
  ],

  // Configuración de cache y optimización
  compressHTML: true,

  build: {
    assets: 'assets',
    inlineStylesheets: 'auto'
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          // Cache busting para assets estáticos
          assetFileNames: 'assets/[name].[hash][extname]',
          chunkFileNames: 'chunks/[name].[hash].js',
          entryFileNames: 'entry/[name].[hash].js',
        }
      },
      // Optimizaciones adicionales
      minify: 'esbuild',
      cssMinify: true,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1000
    }
  }
});