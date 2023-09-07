// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const isCI = process.env.CI;

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:no-unsanitized/DOM',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['unicorn', 'react-hooks', '@cloudscape-design/eslint-plugin', 'no-unsanitized', 'header'],
  rules: {
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'react/display-name': 'off',
    'react/no-danger': 'error',
    'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
    'react/prop-types': 'off',
    'react/forbid-component-props': isCI ? 'off' : ['warn', { forbid: ['className', 'id'] }],
    'react/jsx-boolean-value': ['error', 'always'],
    '@cloudscape-design/ban-files': [
      'error',
      [
        {
          pattern: './src/index.ts',
          message: "Disallowed import '{{ path }}' in favor of having smaller bundle sizes.",
        },
        {
          pattern: './src/*/index.tsx',
          message:
            "Disallowed import '{{ path }}'. Use the internal component for composition or the interface directly.",
        },
        {
          pattern: './src/*/index.js',
          message:
            "Disallowed import '{{ path }}'. Use the internal component for composition or the interface directly.",
        },
        {
          pattern: './src/i18n/{index,provider}.tsx',
          message:
            "Disallowed import '{{ path }}'. This raises the minimum TypeScript requirements of the current file.",
        },
      ],
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': [
      'error',
      {
        additionalHooks: '(useContainerQuery|useContainerBreakpoints|useEffectOnUpdate)',
      },
    ],
    'unicorn/filename-case': 'error',
    curly: 'error',
    'dot-notation': 'error',
    eqeqeq: 'error',
    'no-return-await': 'error',
    'require-await': 'error',
    'header/header': [
      'error',
      'line',
      [' Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.', ' SPDX-License-Identifier: Apache-2.0'],
    ],
    'no-warning-comments': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
  },
  overrides: [
    {
      files: ['*.js', 'build-tools/**'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
      env: {
        browser: false,
        es6: true,
        node: true,
      },
    },
    {
      files: ['build-tools/jest/**', '**/__tests__/**', '**/__mocks__/**'],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
      env: {
        es6: true,
        jasmine: true,
        jest: true,
      },
      globals: {
        Promise: true,
      },
    },
    {
      files: ['build-tools/integ/**', '**/__integ__/**', '**/__a11y__/**'],
      rules: {
        // useBrowser is not a React hook
        'react-hooks/rules-of-hooks': 'off',
        'react-hooks/exhaustive-deps': 'off',
      },
      env: {
        jest: true,
      },
    },
    {
      files: ['src/test-utils/**/*.ts'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
    {
      files: ['pages/**'],
      globals: {
        Promise: true,
      },
      rules: {
        '@cloudscape-design/ban-files': [
          'error',
          [
            {
              pattern: 'lib/components/**/*',
              message: "Disallowed import '{{ path }}'. Use '~components' instead.",
            },
            {
              pattern: 'lib/design-tokens/**/*',
              message: "Disallowed import '{{ path }}'. Use '~design-tokens' instead.",
            },
          ],
        ],
      },
    },
    {
      files: ['src/**'],
      excludedFiles: ['src/**/__tests__/**', 'src/**/__integ__/**', 'src/**/__a11y__/**'],
      rules: {
        '@cloudscape-design/no-implicit-svg-focusable': 'error',
        '@cloudscape-design/prefer-live-region': 'warn',
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['lodash', 'lodash/*'],
                message: 'lodash is a commonjs module, which breaks webpack esm optimizations.',
              },
              {
                group: ['d3-scale', '!**/vendor/d3-scale'],
                message:
                  '`d3-scale` gets shipped as a bundled dependency. Use `src/internal/vendor/d3-scale` as import source.',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['none'],
      excludedFiles: [
        'src/**/__tests__/**',
        'src/**/__integ__/**',
        'src/**/__a11y__/**',
        'src/test-utils/**',
        'src/internal/vendor/**',
      ],
      rules: {
        '@typescript-eslint/no-unsafe-argument': 'error',
        '@typescript-eslint/no-unsafe-assignment': 'error',
        '@typescript-eslint/no-unsafe-call': 'error',
        '@typescript-eslint/no-unsafe-declaration-merging': 'error',
        '@typescript-eslint/no-unsafe-member-access': 'error',
        '@typescript-eslint/no-unsafe-return': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
      },
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
  ],
};
