// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Flashbar',
  componentName: 'flashbar',
  tests: [
    ...[600, 1280].flatMap<TestDefinition>(width => [
      {
        description: `permutations at ${width}`,
        path: 'flashbar/permutations',
        screenshotType: 'permutations' as const,
        configuration: { width },
      },
      {
        description: `runtime-action at ${width}`,
        path: 'flashbar/runtime-action',
        screenshotType: 'permutations' as const,
        configuration: { width },
      },
    ]),
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
      setup: async ({ page }) => {
        await page.click('#focus-target');
        await page.focusNextElement();
      },
    },
  ],
};

export default suite;
