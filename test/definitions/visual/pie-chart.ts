// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Pie chart',
  componentName: 'pie-chart',
  tests: [
    {
      description: 'permutations',
      path: 'pie-chart/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'permutations in narrow container',
      path: 'pie-chart/permutations',
      screenshotType: 'permutations',
      configuration: { width: 350 },
    },
    {
      description: 'fit-height',
      path: 'pie-chart/fit-height',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'fit-height no filter, no legend',
      path: 'pie-chart/fit-height',
      screenshotType: 'screenshotArea',
      queryParams: { hideFilter: 'true', hideLegend: 'true' },
    },
    {
      description: 'can focus chart plot',
      path: 'pie-chart/test',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.click('#focus-target');
        await page.focusNextElement();
        await page.focusNextElement();
      },
    },
    {
      description: 'can navigate segments with keyboard',
      path: 'pie-chart/test',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.click('#focus-target');
        await page.focusNextElement();
        await page.focusNextElement();
        await page.keys(['Enter']);
        await page.keys(['ArrowRight']);
      },
    },
    {
      description: 'can pin segments with mouse',
      path: 'pie-chart/test',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.click('svg [aria-label~="Apples"] > path');
        await page.waitForVisible('[aria-label="Dismiss"]');
      },
    },
  ],
};

export default suite;
