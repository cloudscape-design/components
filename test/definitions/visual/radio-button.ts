// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'RadioButton',
  componentName: 'radio-button',
  tests: [
    {
      description: 'Permutations',
      path: 'radio-button/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'Focused and not checked',
      path: 'radio-button/focus-test',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.click('#focus-target');
        await page.focusNextElement();
      },
    },
    {
      description: 'Focused and checked',
      path: 'radio-button/focus-test',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.click('#focus-target');
        await page.focusNextElement();
        await page.keys(['Space']);
      },
    },
    {
      description: 'Custom style permutations',
      path: 'radio-button/style-custom',
      screenshotType: 'permutations',
    },
  ],
};

export default suite;
