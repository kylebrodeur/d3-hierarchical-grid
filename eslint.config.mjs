import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginPrettier from 'eslint-plugin-prettier';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/examples/**',
      '**/.github/**',
      '**/.agent/**',
    ],
  },
  { files: ['**/*.{js,mjs,cjs,ts,tsx}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.es2022 } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { prettier: pluginPrettier },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
];
