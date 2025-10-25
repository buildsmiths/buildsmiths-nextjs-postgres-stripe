import { defineConfig, mergeConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'node:url';

// Shared Vite config so aliases/plugins apply to each Vitest project
const shared = defineConfig({
  resolve: {
    alias: [
      // Robust alias for @/ -> repo root (handles subpaths like @/app/layout)
      { find: /^@\/(.*)$/, replacement: `${fileURLToPath(new URL('.', import.meta.url))}/$1` },
    ],
  },
});

export default defineConfig({
  test: {
    projects: [
      mergeConfig(shared, {
        extends: true,
        test: {
          name: 'core-node',
          environment: 'node',
          include: [
            'tests/**/*.test.ts',
            'tests/**/*.test.tsx',
            'tests/**/*.spec.ts',
            'tests/**/*.spec.tsx',
          ],
          exclude: ['DELETED/**', 'tests/ui/**'],
          globals: true,
          setupFiles: [
            'tests/setup/patch-pg.js',
            'tests/setup/env.ts',
            'tests/setup/testing-library.ts',
          ],
        },
      }),
      mergeConfig(shared, {
        extends: true,
        test: {
          name: 'core-ui',
          environment: 'jsdom',
          include: [
            'tests/ui/**/*.test.tsx',
            'tests/ui/**/*.spec.tsx',
          ],
          exclude: ['DELETED/**'],
          globals: true,
          setupFiles: [
            'tests/setup/patch-pg.js',
            'tests/setup/env.ts',
            'tests/setup/testing-library.ts',
            'tests/setup/jsdom-matchMedia.ts',
          ],
        },
      }),
    ],
  },
});
