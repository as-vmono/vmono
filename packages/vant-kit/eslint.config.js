import eslintConfig from '@vmono/eslint-config';
import autoImportConfig from './.eslintrc-auto-import.json';
export default [
  ...eslintConfig,
  {
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      globals: {
        ...autoImportConfig.globals,
      },
    },
  },
];
