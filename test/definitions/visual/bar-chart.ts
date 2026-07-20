// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const TEST_CHART_TOOLTIP_HEADER = '#chart';

const suite: TestSuite = {
  description: 'Bar chart',
  componentName: 'bar-chart',
  tests: [
    {
      description: 'Horizontal bars permutations',
      path: 'bar-chart/horizontal-bars-permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'Horizontal stacked bars permutations',
      path: 'bar-chart/horizontal-stacked-bars-permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'Other permutations',
      path: 'bar-chart/other-permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'Threshold permutations',
      path: 'bar-chart/threshold-permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'Vertical bars permutations',
      path: 'bar-chart/vertical-bars-permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'Vertical stacked bars permutations',
      path: 'bar-chart/vertical-stacked-bars-permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'can navigate series with keyboard',
      path: 'bar-chart/test',
      screenshotType: 'viewport',
      configuration: { width: 800, height: 800 },
      pixelDiffTolerance: 12,
      setup: async ({ page }) => {
        await page.click('#focus-target');
        await (page as any).focusNextElement();
        await (page as any).focusNextElement();
        await page.keys(['ArrowRight', 'ArrowRight']);
        await page.waitForVisible(TEST_CHART_TOOLTIP_HEADER);
      },
    },
    {
      description: 'can pin popover with keyboard',
      path: 'bar-chart/test',
      screenshotType: 'viewport',
      configuration: { width: 800, height: 800 },
      pixelDiffTolerance: 10,
      setup: async ({ page }) => {
        await page.click('#focus-target');
        await (page as any).focusNextElement();
        await (page as any).focusNextElement();
        await page.keys(['ArrowRight', 'ArrowRight']);
        await page.waitForVisible(TEST_CHART_TOOLTIP_HEADER);
        await page.keys(['Enter']);
        await page.waitForVisible('[aria-label="Dismiss"]');
      },
    },
    {
      description: 'shows popover on hover',
      path: 'bar-chart/test',
      screenshotType: 'viewport',
      configuration: { width: 800, height: 800 },
      setup: async ({ page }) => {
        await page.hoverElement('#chart svg[aria-label="Bar chart"]');
        await page.waitForVisible(TEST_CHART_TOOLTIP_HEADER);
      },
    },
    {
      description: 'wrapping long series title 123',
      path: 'bar-chart/test',
      screenshotType: 'viewport',
      configuration: { width: 800, height: 800 },
      setup: async ({ page }) => {
        await (page as any).scrollToBottom('html');
        await page.click('#focus-target-3');
        await (page as any).focusNextElement();
        await (page as any).focusNextElement();
        await page.keys(['ArrowRight', 'Enter']);
        await page.waitForVisible('[aria-label="Dismiss"]');
      },
    },
  ],
};

export default suite;
