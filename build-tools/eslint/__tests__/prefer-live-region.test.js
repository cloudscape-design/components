// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { RuleTester } = require('eslint');
const useLiveRegionOverAriaLive = require('../prefer-live-region');

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2018, sourceType: 'module', ecmaFeatures: { jsx: true } },
});

ruleTester.run('no-aria-live', useLiveRegionOverAriaLive, {
  valid: ['<div></div>'],

  invalid: [
    {
      code: '<div aria-live></div>',
      errors: [{ messageId: 'prefer-live-region' }],
    },
    {
      code: '<div aria-live="polite"></div>',
      errors: [{ messageId: 'prefer-live-region' }],
    },
    {
      code: '<div aria-live="assertive"></div>',
      errors: [{ messageId: 'prefer-live-region' }],
    },
  ],
});
