import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import { globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  globalIgnores(['.millennium/', '.venv/', 'AugmentedSteam/']),
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*config.mjs', 'helpers/clean-maps.mjs'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    settings: {
      react: {
        version: '16.14',
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended
);