import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import nodecg from './vite-nodecg.mjs';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
  clearScreen: false,
  resolve: {
    alias: { src: fileURLToPath(new URL('./src', import.meta.url)) },
  },
  plugins: [
    react(),
    checker({ typescript: { tsconfigPath: './tsconfig.browser.json' } }),
    nodecg({
      bundleName: 'gsps-layouts',
      graphics: './src/browser/graphics/*.tsx',
      dashboard: './src/browser/dashboard/*.tsx',
      template: {
        graphics: './src/browser/graphics/template.html',
        dashboard: './src/browser/dashboard/template.html',
      },
    }),
  ],
});
