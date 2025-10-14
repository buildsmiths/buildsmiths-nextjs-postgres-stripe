// ESLint v9+ flat config (TypeScript-aware, minimal, Next-agnostic)
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import nextPlugin from '@next/eslint-plugin-next';
import { FlatCompat } from '@eslint/eslintrc';
import reactHooks from 'eslint-plugin-react-hooks';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
    {
        ignores: [
            '.next/**',
            'node_modules/**',
            'coverage/**',
            'artifacts/**',
            'dist/**',
            'DELETED/**',
            // generated or tool-specific
            'next-env.d.ts'
        ]
    },
    js.configs.recommended,
    // Add Next.js rules via compat to satisfy Next build plugin detection under flat config
    ...compat.extends('plugin:@next/next/core-web-vitals'),
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                // Avoid requiring type-aware linting setup; use syntax-only rules for speed
                project: false
            },
            globals: {
                ...globals.node,
                ...globals.browser,
                // Common runtime globals in this project
                Request: 'readonly',
                Response: 'readonly',
                URL: 'readonly',
                performance: 'readonly',
                fetch: 'readonly',
                console: 'readonly',
                module: 'writable',
                process: 'readonly'
            }
        },
        plugins: { '@typescript-eslint': tsPlugin, '@next/next': nextPlugin, 'react-hooks': reactHooks },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            // Additional project-specific tweaks
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-var-requires': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/ban-ts-comment': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            // TypeScript handles undefined symbols; avoid false positives on type references (e.g., NodeJS)
            'no-undef': 'off',
            // Keep console for structured logging; warn only in client code if desired
            'no-console': 'off',
            // React hooks linting: align with Next core-web-vitals expectations
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn'
        }
    },
    // Formatting handled by editor; no Prettier integration
    // Tests: relax rules and add Vitest globals
    {
        files: ['tests/**/*.{ts,tsx}'],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
                ...globals.vitest
            }
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'no-undef': 'off',
            // UI tests often use RegExp literals with quotes; avoid noisy escapes rule
            'no-useless-escape': 'off'
        }
    },
    // JS test setup files use CommonJS require; allow Node globals
    {
        files: ['tests/**/*.{js,jsx}'],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.vitest,
                console: 'readonly',
                process: 'readonly',
                module: 'writable',
                require: 'readonly'
            }
        },
        rules: {
            'no-undef': 'off'
        }
    },
    // Config and script files: node context
    {
        files: ['*.config.{js,cjs,mjs}', 'scripts/**/*.{js,mjs,ts}'],
        languageOptions: {
            globals: {
                ...globals.node,
                console: 'readonly',
                process: 'readonly',
                module: 'writable'
            }
        },
        rules: {
            'no-console': 'off'
        }
    }
];
