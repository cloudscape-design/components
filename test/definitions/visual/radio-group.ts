// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'RadioGroup',
  componentName: 'radio-group',
  tests: [
    {
      description: 'Permutations',
      path: 'radio-group/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'Radio button is focused',
      path: 'radio-group/focus-test',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.click('#focus-target');
        await page.focusNextElement();
      },
    },
    {
      description: 'Radio button has label with a correct width',
      path: 'radio-group/labels-highlight',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'Horizontal radio group permutations at 600',
      path: 'radio-group/horizontal.permutations',
      screenshotType: 'permutations',
      configuration: { width: 600 },
    },
    {
      description: 'Horizontal radio group permutations at 1280',
      path: 'radio-group/horizontal.permutations',
      screenshotType: 'permutations',
      configuration: { width: 1280 },
    },
    {
      description: 'Style custom page',
      path: 'radio-group/style-custom',
      screenshotType: 'screenshotArea',
    },
  ],
};

export default suite;
