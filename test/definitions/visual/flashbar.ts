// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Flashbar',
  componentName: 'flashbar',
  tests: [
    {
      description: 'permutations at 600',
      path: 'flashbar/permutations',
      screenshotType: 'permutations',
      configuration: { width: 600 },
    },
    {
      description: 'permutations at 1280',
      path: 'flashbar/permutations',
      screenshotType: 'permutations',
      configuration: { width: 1280 },
    },
    {
      description: 'runtime-action at 600',
      path: 'flashbar/runtime-action',
      screenshotType: 'permutations',
      configuration: { width: 600 },
    },
    {
      description: 'runtime-action at 1280',
      path: 'flashbar/runtime-action',
      screenshotType: 'permutations',
      configuration: { width: 1280 },
    },
    {
      description: 'content permutations',
      path: 'flashbar/content-permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'style-custom',
      path: 'flashbar/style-custom',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'small screen button layout',
      path: 'flashbar/small-screen',
      screenshotType: 'screenshotArea',
      configuration: { width: 550 },
    },
    {
      description: 'stacking of multiple flashbar items',
      path: 'flashbar/stacking',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'focus border color',
      path: 'flashbar/dismissal',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.click('#focus-target');
        await page.focusNextElement();
      },
    },
  ],
};

export default suite;
