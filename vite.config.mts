import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import nodecg from './vite-nodecg.mjs';
import checker from 'vite-plugin-checker';
import rollupEsbuild from 'rollup-plugin-esbuild';
import rollupExternals from 'rollup-plugin-node-externals';

// https://vitejs.dev/config/
export default defineConfig({
  clearScreen: false,
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
      extension: {
        input: './src/extension/index.ts',
        plugins: [rollupEsbuild(), rollupExternals()],
      },
    }),
  ],
});
