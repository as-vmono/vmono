import vueParser from 'vue-eslint-parser';
import { genTsNormalRules } from './tsLintConfig.js';
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';

export const genVueNormalRules = ({ customRules }) => {
  return {
    'vue/no-v-html': 'off',
    'vue/attributes-order': 'off',
    'vue/require-emit-validator': 'warn',
    'vue/multi-word-component-names': 'off',
    'vue/no-setup-props-destructure': 'off',
    'vue/v-on-event-hyphenation': 'off',
    'vue/no-mutating-props': 'off',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'never',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
    ...(customRules ?? {}),
  };
};

export const genVueLintConfigArr = ({ customRules } = {}) => {
  return [
    ...pluginVue.configs['flat/recommended'],
    {
      files: ['**/*.vue'],
      plugins: {
        '@typescript-eslint': tseslint.plugin,
      },
      languageOptions: {
        parser: vueParser, // 使用vue解析器，这个可以识别vue文件
        parserOptions: {
          parser: tseslint.parser, // 在vue文件上使用ts解析器
          sourceType: 'module',
        },
      },
      rules: {
        ...genTsNormalRules({}),
        ...genVueNormalRules({ customRules }),
      },
    },
  ];
};
