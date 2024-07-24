// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

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
  plugins: [
    'unicorn',
    'react-hooks',
    '@cloudscape-design/eslint-plugin',
    'no-unsanitized',
    'header',
    'simple-import-sort',
  ],
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
    'simple-import-sort/imports': 'error',
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
      files: ['build-tools/integ/**', '**/__integ__/**', '**/__a11y__/**', '**/__motion__/**'],
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
      excludedFiles: ['src/**/__tests__/**', 'src/**/__integ__/**', 'src/**/__a11y__/**', 'src/**/__motion__/**'],
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
              {
                group: ['react-virtual', '!**/vendor/react-virtual'],
                message:
                  '`react-virtual` gets shipped as a bundled dependency. Use `src/internal/vendor/react-virtual` as import source.',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['src/**', 'pages/**'],
      rules: {
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              // External packages come first.
              ['^react', '^(?!@cloudscape)@?\\w'],
              // Cloudscape packages.
              ['^@cloudscape'],
              // Things that start with a letter (or digit or underscore), or `~` followed by a letter.
              ['^~\\w'],
              // Anything not matched in another group.
              ['^'],
              // Styles come last.
              ['^.+\\.?(css)$', '^.+\\.?(css.js)$', '^.+\\.?(scss)$', '^.+\\.?(selectors.js)$'],
            ],
          },
        ],
      },
    },
    {
      files: [
        'src/alert/**',
        'src/anchor-navigation/**',
        'src/annotation-context/**',
        // 'src/app-layout/**',
        // 'src/area-chart/**',
        'src/attribute-editor/**',
        'src/autosuggest/**',
        'src/badge/**',
        // 'src/bar-chart/**',
        'src/box/**',
        'src/breadcrumb-group/**',
        'src/button/**',
        'src/button-dropdown/**',
        'src/calendar/**',
        // 'src/cards/**',
        'src/checkbox/**',
        // 'src/code-editor/**',
        // 'src/collection-preferences/**',
        'src/column-layout/**',
        'src/container/**',
        // 'src/content-layout/**',
        // 'src/contexts/**',
        'src/date-input/**',
        'src/date-picker/**',
        'src/date-range-picker/**',
        // 'src/drawer/**',
        'src/expandable-section/**',
        'src/file-upload/**',
        'src/flashbar/**',
        'src/form/**',
        'src/form-field/**',
        'src/grid/**',
        'src/header/**',
        'src/help-panel/**',
        // 'src/hotspot/**',
        // 'src/i18n/**',
        'src/icon/**',
        'src/input/**',
        // 'src/internal/**',
        // 'src/line-chart/**',
        'src/link/**',
        // 'src/mixed-line-bar-chart/**',
        // 'src/modal/**',
        // 'src/multiselect/**',
        // 'src/pagination/**',
        // 'src/pie-chart/**',
        // 'src/popover/**',
        // 'src/progress-bar/**',
        // 'src/property-filter/**',
        // 'src/radio-group/**',
        // 'src/s3-resource-selector/**',
        // 'src/segmented-control/**',
        // 'src/select/**',
        // 'src/side-navigation/**',
        // 'src/space-between/**',
        // 'src/spinner/**',
        // 'src/split-panel/**',
        // 'src/status-indicator/**',
        // 'src/table/**',
        // 'src/tabs/**',
        // 'src/tag-editor/**',
        // 'src/text-content/**',
        // 'src/text-filter/**',
        // 'src/textarea/**',
        // 'src/theming/**',
        // 'src/tiles/**',
        // 'src/time-input/**',
        // 'src/toggle/**',
        // 'src/token-group/**',
        // 'src/top-navigation/**',
        // 'src/tutorial-panel/**',
        // 'src/wizard/**',
      ],
      excludedFiles: [
        'src/**/__tests__/**',
        'src/**/__integ__/**',
        'src/**/__a11y__/**',
        'src/**/__motion__/**',
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
