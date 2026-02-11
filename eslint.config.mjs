// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { includeIgnoreFile } from '@eslint/compat';
import eslint from '@eslint/js';
import headerPlugin from 'eslint-plugin-header';
import jestPlugin from 'eslint-plugin-jest';
import noUnsanitizedPlugin from 'eslint-plugin-no-unsanitized';
import eslintPrettier from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import unicornPlugin from 'eslint-plugin-unicorn';
import globals from 'globals';
import path from 'node:path';
import tsEslint from 'typescript-eslint';

import cloudscapeCommonRules from '@cloudscape-design/build-tools/eslint/index.js';

import cloudscapeComponentsRules from './build-tools/eslint/index.js';

// https://github.com/Stuk/eslint-plugin-header/issues/57
headerPlugin.rules.header.meta.schema = false;

export default tsEslint.config(
  includeIgnoreFile(path.resolve('.gitignore')),
  {
    // this code does not run, only used as a text content
    ignores: ['pages/code-editor/samples/**'],
  },
  {
    settings: {
      react: { version: 'detect' },
    },
  },
  eslint.configs.recommended,
  tsEslint.configs.recommended,
  noUnsanitizedPlugin.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactHooksPlugin.configs['recommended-latest'],
  eslintPrettier,
  {
    files: ['**/*.{js,mjs,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSortPlugin,
      '@cloudscape-design/components': cloudscapeComponentsRules,
      '@cloudscape-design/build-tools': cloudscapeCommonRules,
      unicorn: unicornPlugin,
      header: headerPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true }],
      '@typescript-eslint/ban-ts-comment': ['error', { 'ts-expect-error': 'allow-with-description' }],
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-explicit-any': 'off',
      'react/display-name': 'off',
      'react/no-danger': 'error',
      'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
      'react/prop-types': 'off',
      'react/jsx-boolean-value': ['error', 'always'],
      '@cloudscape-design/build-tools/react-server-components-directive': 'error',
      '@cloudscape-design/components/ban-files': [
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
      '@cloudscape-design/components/prefer-live-region': 'warn',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
      ],
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
      'prefer-object-spread': 'error',
      'require-await': 'error',
      'header/header': [
        'error',
        'line',
        [' Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.', ' SPDX-License-Identifier: Apache-2.0'],
      ],
      'no-warning-comments': 'warn',
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
      '@cloudscape-design/components/no-legacy-tokens': 'error',
    },
  },
  {
    files: ['.github/**', 'build-tools/**', 'scripts/**', 'jest.*.js', 'gulpfile.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.commonjs,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['src/**'],
    ignores: ['**/__tests__/**', '**/__integ__/**', '**/__motion__/**', '**/__a11y__/**', 'src/internal/vendor/**'],
    rules: {
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
            {
              group: ['date-fns/*'],
              message:
                "Disallowed import '{{ path }}'. These imports are not allowed because are not specified as package exports in date-fns package.json.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/__tests__/**', '**/__integ__/**', '**/__motion__/**', '**/__a11y__/**'],
    ...jestPlugin.configs['flat/recommended'],
    rules: {
      ...jestPlugin.configs['flat/recommended'].rules,
      'jest/no-conditional-expect': 'off',
      'jest/no-standalone-expect': 'off',
      'jest/expect-expect': 'off',
    },
  },
  {
    files: ['**/__integ__/**', '**/__motion__/**', '**/__a11y__/**'],
    rules: {
      // useBrowser is not a hook
      'react-hooks/rules-of-hooks': 'off',
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
    ignores: [
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
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
  }
);
