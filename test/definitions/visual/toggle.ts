// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Toggle',
  componentName: 'toggle',
  tests: [
    {
      description: 'Permutations',
      path: 'toggle/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'Toggle is focused',
      path: 'toggle/focus-test',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.click('#focus-target');
        await page.focusNextElement();
      },
    },
    {
      description: 'Toggle has label with a correct width',
      path: 'toggle/labels-highlight',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'Style custom page',
      path: 'toggle/style-custom',
      screenshotType: 'screenshotArea',
    },
  ],
};

export default suite;
