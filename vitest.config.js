import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/tests/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@gsps-layouts/types': './src/types/index.d.ts',
      'speedcontrol/types': './bundles/nodecg-speedcontrol/src/types/index.d.ts',
      'speedcontrol/types/*': './bundles/nodecg-speedcontrol/src/types/*',
      'speedcontrol/*': './bundles/nodecg-speedcontrol/src/types/*',
    },
  },
});