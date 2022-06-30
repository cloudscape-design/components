// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { RuleTester } = require('eslint');
const banFiles = require('../ban-files');

const ruleHardcodedPath = [
  {
    pattern: './src/index.ts',
    message: `Disallowed import '{{ path }}' in favor of having smaller bundle sizes.`,
  },
];
const ruleWildcardPath = [
  {
    pattern: './src/*/index.tsx',
    message: `Disallowed import '{{ path }}'.\nUse the internal component for composition instead.`,
  },
];
const defaultRules = [...ruleHardcodedPath, ...ruleWildcardPath];
const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2018, sourceType: 'module' } });

ruleTester.run('ban-files', banFiles, {
  valid: [
    {
      code: 'import "../icon/internal.tsx"',
      filename: './src/button/index.tsx',
      options: [defaultRules],
    },
    {
      code: 'import "../index"',
      filename: './src/internal/components/chart-filter/index.ts',
      options: [defaultRules],
    },
  ],

  invalid: [
    {
      code: 'import "../"',
      filename: './src/button/index.tsx',
      options: [ruleHardcodedPath],
      errors: [{ message: "Disallowed import 'src/index.ts' in favor of having smaller bundle sizes." }],
    },
    {
      code: 'import "../index"',
      filename: './src/button/index.tsx',
      options: [ruleHardcodedPath],
      errors: [{ message: "Disallowed import 'src/index.ts' in favor of having smaller bundle sizes." }],
    },
    {
      code: 'import "../../"',
      filename: './src/select/parts/filter.tsx',
      options: [ruleHardcodedPath],
      errors: [{ message: "Disallowed import 'src/index.ts' in favor of having smaller bundle sizes." }],
    },
    {
      code: 'import "../index"',
      filename: './src/button/index.tsx',
      options: [ruleHardcodedPath],
      errors: [{ message: "Disallowed import 'src/index.ts' in favor of having smaller bundle sizes." }],
    },
    {
      code: 'import "../button"',
      filename: './src/alert/index.tsx',
      options: [ruleWildcardPath],
      errors: [
        { message: "Disallowed import 'src/button/index.tsx'.\nUse the internal component for composition instead." },
      ],
    },
    {
      code: 'import "../../button"',
      filename: './src/internal/dropdown/index.tsx',
      options: [ruleWildcardPath],
      errors: [
        { message: "Disallowed import 'src/button/index.tsx'.\nUse the internal component for composition instead." },
      ],
    },
    {
      code: 'import "../../button/index.tsx"',
      filename: './src/internal/dropdown/index.tsx',
      options: [ruleWildcardPath],
      errors: [
        { message: "Disallowed import 'src/button/index.tsx'.\nUse the internal component for composition instead." },
      ],
    },
    {
      code: 'import "../icon"',
      filename: './src/button/index.tsx',
      options: [ruleWildcardPath],
      errors: [
        { message: "Disallowed import 'src/icon/index.tsx'.\nUse the internal component for composition instead." },
      ],
    },
    {
      code: 'import "../../index"',
      filename: './src/internal/components/dummy-component/index.tsx',
      options: [ruleWildcardPath],
      errors: [
        { message: "Disallowed import 'src/internal/index.tsx'.\nUse the internal component for composition instead." },
      ],
    },
  ],
});
