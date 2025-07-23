import globals from 'globals';
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import { genTsLintConfig } from './tsLintConfig.js';
import { genVueLintConfigArr } from './vueLintConfig.js';

export * from './tsLintConfig.js';
export * from './vueLintConfig.js';

export default [
  {
    ignores: ['.history/**', '.husky/**', '.vscode/**', 'coverage/**', 'lib/**', 'public/**', 'node_modules/**'],
  },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  eslint.configs.recommended,
  ...genTsLintConfig(),
  ...genVueLintConfigArr(),
  eslintConfigPrettier,
];
