import eslintConfig from '@vmono/eslint-config';
import autoImportConfig from './.eslintrc-auto-import.js';

// console.log('🏃‍♂️ vant-kit eslint.config.js loaded!');

export default [
  ...eslintConfig,
  /**
   * 配置 AutoImport 自动生成的全局变量,防止 lint 报错
   */
  {
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      globals: {
        ...autoImportConfig.globals,
      },
    },
  },
];
