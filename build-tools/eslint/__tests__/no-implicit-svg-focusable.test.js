// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { RuleTester } = require('eslint');
const noImplicitSvgFocusable = require('../no-implicit-svg-focusable');

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2018, sourceType: 'module', ecmaFeatures: { jsx: true } },
});

ruleTester.run('no-focusable-svg', noImplicitSvgFocusable, {
  valid: ['<div></div>', '<svg focusable={true}></svg>', '<svg focusable={false}></svg>'],

  invalid: [
    {
      code: '<svg></svg>',
      errors: [{ messageId: 'no-implicit-svg-focusable' }],
    },
    {
      code: '<svg focusAble={true}></svg>',
      errors: [{ messageId: 'no-implicit-svg-focusable' }],
    },
    {
      code: '<svg viewBox="0 0 10 10"></svg>',
      errors: [{ messageId: 'no-implicit-svg-focusable' }],
    },
  ],
});
