import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      pg: path.resolve(__dirname, 'tests/mocks/pg.ts'),
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    projects: [
      {
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
            'tests/setup/db-reset.ts',
            'tests/setup/testing-library.ts',
          ],
        },
      },
      {
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
      },
    ],
  },
});
