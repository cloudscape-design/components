// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'ButtonGroup',
  componentName: 'button-group',
  tests: [
    {
      description: 'item permutations',
      path: 'button-group/item-permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'permutations',
      path: 'button-group/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'shows tooltip when hovering item',
      path: 'button-group/test',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.hoverElement('[data-testid="like"]');
      },
    },
    {
      description: 'shows tooltip when hovering menu',
      path: 'button-group/test',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.hoverElement('[data-testid="more-actions"]');
      },
    },
    {
      description: 'shows feedback when clicking copy',
      path: 'button-group/test',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.hoverElement('[data-testid="copy"]');
      },
    },
    {
      description: 'style custom page',
      path: 'button-group/style-custom-types',
      screenshotType: 'screenshotArea',
    },
  ],
};

export default suite;
