import tseslint from 'typescript-eslint';

export const genTsNormalRules = ({ customRules }) => {
  return {
    'no-sparse-arrays': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/no-unsafe-function-type': 'off',
    '@typescript-eslint/consistent-type-imports': 'off',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    ...(customRules ?? {}),
  };
};

export const genTsLintConfig = ({ customRules } = {}) => {
  return [
    ...tseslint.configs.recommended,
    {
      files: ['**/*.ts'],
      plugins: {
        '@typescript-eslint': tseslint.plugin,
      },
      languageOptions: {
        parser: tseslint.parser,
      },
      rules: genTsNormalRules({ customRules }),
    },
  ];
};
