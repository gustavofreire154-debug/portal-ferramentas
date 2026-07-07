// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // IMPORTANTE: troque essa URL se você conectar um domínio próprio
  // (ex: https://portaldeferramentas.com.br). É a partir dela que o
  // sitemap.xml e as tags de SEO montam as URLs completas.
  site: 'https://portal-ferramentas.vercel.app',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react(), mdx(), sitemap()]
});