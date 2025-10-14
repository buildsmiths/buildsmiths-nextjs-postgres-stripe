/** Minimal ESLint config (T009) */
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: { ecmaVersion: 2022, sourceType: 'module', project: undefined },
    plugins: ['@typescript-eslint', 'import'],
    extends: [
        'next/core-web-vitals',
        'plugin:@typescript-eslint/recommended',
        'prettier'
    ],
    rules: {
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'import/order': [
            'warn',
            {
                groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                'newlines-between': 'always'
            }
        ]
    }
};
