// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Checkbox',
  componentName: 'checkbox',
  tests: [
    {
      description: 'Permutations',
      path: 'checkbox/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'Checkbox is focused',
      path: 'checkbox/focus-test',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.click('#focus-target');
        await page.focusNextElement();
      },
    },
    {
      description: 'Checkbox has label with a correct width',
      path: 'checkbox/labels-highlight',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'Style custom page',
      path: 'checkbox/style-custom',
      screenshotType: 'screenshotArea',
    },
  ],
};

export default suite;
