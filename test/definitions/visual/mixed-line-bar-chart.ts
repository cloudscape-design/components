// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const TEST_CHART_TOOLTIP_HEADER = '#chart h2';

const suite: TestSuite = {
  description: 'Mixed line bar chart',
  componentName: 'mixed-line-bar-chart',
  tests: [
    {
      description: 'permutations',
      path: 'mixed-line-bar-chart/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'fit-height',
      path: 'mixed-line-bar-chart/fit-height',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'fit-height no filter, no legend',
      path: 'mixed-line-bar-chart/fit-height',
      screenshotType: 'screenshotArea',
      queryParams: { hideFilter: 'true', hideLegend: 'true' },
    },
    {
      description: 'fit-height, no legend',
      path: 'mixed-line-bar-chart/fit-height',
      screenshotType: 'screenshotArea',
      queryParams: { hideLegend: 'true' },
    },
    {
      description: 'chart plot has a focus outline',
      path: 'mixed-line-bar-chart/test',
      screenshotType: 'viewport',
      configuration: { width: 800, height: 800 },
      setup: async ({ page }) => {
        await page.click('#focus-target');
        await page.focusNextElement();
        await page.focusNextElement();
      },
    },
    {
      description: 'can navigate series with keyboard',
      path: 'mixed-line-bar-chart/test',
      screenshotType: 'viewport',
      configuration: { width: 800, height: 800 },
      setup: async ({ page }) => {
        await page.click('#focus-target');
        await page.focusNextElement();
        await page.focusNextElement();
        await page.keys(['ArrowRight']);
        await page.keys(['ArrowRight']);
        await page.keys(['ArrowRight']);
        await page.waitForVisible(TEST_CHART_TOOLTIP_HEADER);
      },
    },
    {
      description: 'can pin popover with keyboard',
      path: 'mixed-line-bar-chart/test',
      screenshotType: 'viewport',
      configuration: { width: 800, height: 800 },
      setup: async ({ page }) => {
        await page.click('#focus-target');
        await page.focusNextElement();
        await page.focusNextElement();
        await page.keys(['ArrowRight']);
        await page.keys(['ArrowRight']);
        await page.keys(['ArrowRight']);
        await page.waitForVisible(TEST_CHART_TOOLTIP_HEADER);
        await page.keys(['Enter']);
        await page.waitForVisible('[aria-label="Dismiss"]');
      },
    },
    {
      description: 'shows popover on hover',
      path: 'mixed-line-bar-chart/test',
      screenshotType: 'viewport',
      // skip tests with line hover effects on Safari because they do not support it
      configuration: { width: 800, height: 800, skipBrowsers: ['Safari'] },
      setup: async ({ page }) => {
        await page.hoverElement('#chart svg[aria-label="Mixed chart 1"]', 200, 100);
        await page.waitForVisible(TEST_CHART_TOOLTIP_HEADER);
      },
    },
    {
      description: 'handles long left-labels',
      tests: [320, 400, 600].map<TestDefinition>(width => ({
        description: `width ${width}px`,
        path: 'mixed-line-bar-chart/with-long-left-labels',
        screenshotType: 'screenshotArea',
        configuration: { width },
      })),
    },
  ],
};

export default suite;
