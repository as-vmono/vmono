import eslintConfig from '@vmono/eslint-config';
import autoImportConfig from './.eslintrc-auto-import.js';
export default [
  ...eslintConfig,
  {
    files: ['**/*ts', '**/*.vue'],
    languageOptions: {
      globals: {
        ...autoImportConfig.globals,
      },
    },
  },
];
