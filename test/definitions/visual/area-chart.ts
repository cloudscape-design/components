// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const TEST_CHART_FILTER_TRIGGER = '#linear-latency-chart button';
const TEST_CHART_TOOLTIP_HEADER = '#linear-latency-chart h2';

const suite: TestSuite = {
  description: 'Area chart',
  componentName: 'area-chart',
  tests: [
    {
      description: 'permutations',
      path: 'area-chart/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'fit-height',
      path: 'area-chart/fit-height',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'fit-height no filter, no legend',
      path: 'area-chart/fit-height',
      screenshotType: 'screenshotArea',
      queryParams: { hideFilter: 'true', hideLegend: 'true' },
    },
    {
      description: 'fit-height, no legend',
      path: 'area-chart/fit-height',
      screenshotType: 'screenshotArea',
      queryParams: { hideLegend: 'true' },
    },
    {
      description: 'chart plot has a focus outline',
      path: 'area-chart/test',
      screenshotType: 'viewport',
      configuration: { width: 800, height: 800 },
      setup: async page => {
        await page.click(TEST_CHART_FILTER_TRIGGER);
        await page.keys(['Escape']);
        await page.focusNextElement();
      },
    },
    {
      description: 'can navigate along X axis highlighting all series with keyboard',
      path: 'area-chart/test',
      screenshotType: 'viewport',
      configuration: { width: 800, height: 800 },
      setup: async page => {
        await page.click(TEST_CHART_FILTER_TRIGGER);
        await page.keys(['Escape']);
        await page.focusNextElement();
        await page.keys(['ArrowRight', 'ArrowRight']);
        await page.waitForVisible(TEST_CHART_TOOLTIP_HEADER);
      },
    },
    {
      description: 'can navigate a specific series with keyboard',
      path: 'area-chart/test',
      screenshotType: 'viewport',
      configuration: { width: 800, height: 800 },
      setup: async page => {
        await page.click(TEST_CHART_FILTER_TRIGGER);
        await page.keys(['Escape']);
        await page.focusNextElement();
        await page.keys(['ArrowRight']);
        await page.keys(['ArrowDown']);
        await page.keys(['ArrowRight']);
        await page.waitForVisible(TEST_CHART_TOOLTIP_HEADER);
      },
    },
    {
      description: 'selects correct series when navigated back from legend',
      path: 'area-chart/test',
      screenshotType: 'viewport',
      configuration: { width: 800, height: 800 },
      setup: async page => {
        await page.click(TEST_CHART_FILTER_TRIGGER);
        await page.keys(['Escape']);
        await page.keys(['Tab']);
        await page.keys(['Tab']);
        await page.keys(['ArrowRight']);
        await page.keys(['Shift', 'Tab']);
        await page.keys(['ArrowRight']);
        await page.waitForVisible(TEST_CHART_TOOLTIP_HEADER);
      },
    },
    {
      description: 'can pin popover for all data points at a given X coordinate with keyboard',
      path: 'area-chart/test',
      screenshotType: 'viewport',
      configuration: { width: 800, height: 800 },
      setup: async page => {
        await page.click(TEST_CHART_FILTER_TRIGGER);
        await page.keys(['Escape']);
        await page.focusNextElement();
        await page.keys(['ArrowRight']);
        await page.keys(['ArrowRight']);
        await page.waitForVisible(TEST_CHART_TOOLTIP_HEADER);
        await page.keys(['Enter']);
        await page.waitForVisible('[aria-label="Dismiss"]');
      },
    },
    {
      description: 'can pin popover for a point in a specific series with keyboard',
      path: 'area-chart/test',
      screenshotType: 'viewport',
      configuration: { width: 800, height: 800 },
      setup: async page => {
        await page.click(TEST_CHART_FILTER_TRIGGER);
        await page.keys(['Escape']);
        await page.focusNextElement();
        await page.keys(['ArrowRight']);
        await page.keys(['ArrowDown']);
        await page.keys(['ArrowRight']);
        await page.waitForVisible(TEST_CHART_TOOLTIP_HEADER);
        await page.keys(['Enter']);
        await page.waitForVisible('[aria-label="Dismiss"]');
      },
    },
    {
      description: 'shows popover on hover',
      path: 'area-chart/test',
      screenshotType: 'viewport',
      configuration: { width: 800, height: 800 },
      setup: async page => {
        await page.hoverElement('[aria-label="Linear latency chart"]', 200, 50);
        await page.waitForVisible(TEST_CHART_TOOLTIP_HEADER);
      },
    },
  ],
};

export default suite;
