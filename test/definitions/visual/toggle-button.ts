// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Toggle button',
  componentName: 'toggle-button',
  tests: [
    {
      description: 'permutations',
      path: 'toggle-button/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'hovering over normal variant',
      path: 'toggle-button/permutations',
      screenshotType: 'permutations',
      setup: async page => {
        await page.hoverElement('[aria-label="Favorite"][aria-pressed="false"]');
      },
    },
  ],
};

export default suite;
