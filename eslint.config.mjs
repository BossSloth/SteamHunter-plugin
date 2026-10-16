import pluginReact from '@eslint-react/eslint-plugin';
import pluginJs from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import perfectionist from 'eslint-plugin-perfectionist';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  { files: ['**/*.{js,mjs,cjs,ts,tsx}'] },
  globalIgnores(['.millennium/', '.venv/', './helpers']),
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*config.mjs'],
        },
      },
    },
  },
  pluginJs.configs.all,
  ...tseslint.configs.all,
  pluginReact.configs.all,
  {
    settings: {
      'react-x': {
        version: '16.14',
      },
    },
  },
  stylistic.configs.all,
  stylistic.configs['disable-legacy'],
  stylistic.configs.customize({
    indent: 2,
    semi: true,
    quotes: 'single',
    braceStyle: '1tbs',
    blockSpacing: true,
    commaDangle: 'always-multiline',
  }),
  {
    plugins: {
      perfectionist,
    },
    rules: {
      // #region Formatting preferences
      '@stylistic/function-call-argument-newline': ['error', 'consistent'],
      '@stylistic/newline-per-chained-call': ['error', { ignoreChainWithDepth: 3 }],
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: ['return', 'function', 'class', 'interface', 'type', 'enum'] },
      ],
      '@stylistic/quote-props': ['error', 'as-needed'],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      curly: ['error', 'multi-line'],
      'perfectionist/sort-interfaces': ['error', { type: 'natural', groups: ['method', 'property'] }],

      // Some of these are already handled by oxfmt
      '@stylistic/array-element-newline': 'off',
      '@stylistic/implicit-arrow-linebreak': 'off',
      '@stylistic/lines-around-comment': 'off',
      '@stylistic/multiline-comment-style': 'off',
      '@stylistic/object-property-newline': 'off',
      '@stylistic/function-paren-newline': 'off',
      '@stylistic/arrow-parens': 'off',
      '@stylistic/indent': 'off',
      '@stylistic/wrap-regex': 'off',
      '@stylistic/operator-linebreak': ['error', 'before', { overrides: { '=': 'after' } }],
      '@stylistic/multiline-ternary': 'off',
      // #endregion

      // #region Preferences
      '@typescript-eslint/method-signature-style': ['error', 'method'],
      '@typescript-eslint/prefer-literal-enum-member': ['error', { allowBitwiseExpressions: true }],
      'func-style': ['error', 'declaration'],
      'max-lines-per-function': ['error', { max: 100, skipBlankLines: true, skipComments: true }], // Higher than default for React components

      '@typescript-eslint/consistent-type-exports': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/init-declarations': 'off',
      '@typescript-eslint/max-params': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-invalid-void-type': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-unsafe-type-assertion': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/parameter-properties': 'off',
      '@typescript-eslint/prefer-destructuring': 'off',
      '@typescript-eslint/prefer-enum-initializers': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      '@typescript-eslint/prefer-regexp-exec': 'off',
      'capitalized-comments': 'off',
      'guard-for-in': 'off',
      'id-length': 'off',
      'max-lines': 'off',
      'max-statements': 'off',
      'new-cap': 'off',
      'no-bitwise': 'off',
      'no-continue': 'off',
      'no-inline-comments': 'off',
      'no-negated-condition': 'off',
      'no-param-reassign': 'off',
      'no-plusplus': 'off',
      'no-ternary': 'off',
      'no-undefined': 'off',
      'no-warning-comments': 'off',
      'one-var': 'off',
      'prefer-named-capture-group': 'off',
      radix: 'off',
      'require-unicode-regexp': 'off',
      'sort-imports': 'off',
      'sort-keys': 'off',
      '@typescript-eslint/strict-void-return': 'off',
      // #endregion

      // #region Project specific
      '@typescript-eslint/member-ordering': ['error', { default: ['method', 'field'] }],

      'arrow-body-style': ['off'],
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      'no-console': 'off',
      'no-alert': 'off',
      '@eslint-react/no-missing-component-display-name': 'off',
      camelcase: 'off',
      // #endregion

      // #region React
      '@stylistic/jsx-one-expression-per-line': 'off',
      '@eslint-react/no-leaked-conditional-rendering': 'off',
      // #endregion
    },
  },
);
