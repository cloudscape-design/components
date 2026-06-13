// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const TEST_CHART_FILTER_TRIGGER = '#chart button';
const TEST_CHART_TOOLTIP_HEADER = '#chart h2';

const suite: TestSuite = {
  description: 'Line chart',
  componentName: 'line-chart',
  tests: [
    {
      description: 'permutations',
      path: 'line-chart/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'can highlight all data points at a given X coordinate with keyboard',
      path: 'line-chart/test',
      screenshotType: 'viewport',
      configuration: { width: 800, height: 800 },
      setup: async ({ page }) => {
        await page.click(TEST_CHART_FILTER_TRIGGER);
        await page.keys(['Escape']);
        await page.focusNextElement();
        await page.keys(['ArrowRight', 'ArrowRight']);
        await page.waitForVisible(TEST_CHART_TOOLTIP_HEADER);
      },
    },
    {
      description: 'can navigate series with keyboard',
      path: 'line-chart/test',
      screenshotType: 'viewport',
      configuration: { width: 800, height: 800 },
      setup: async ({ page }) => {
        await page.click(TEST_CHART_FILTER_TRIGGER);
        await page.keys(['Escape']);
        await page.focusNextElement();
        await page.keys(['ArrowRight', 'ArrowDown', 'ArrowRight']);
        await page.waitForVisible(TEST_CHART_TOOLTIP_HEADER);
      },
    },
    {
      description: 'can pin popover for all data points at a given X coordinate with keyboard',
      path: 'line-chart/test',
      screenshotType: 'viewport',
      configuration: { width: 800, height: 800 },
      pixelDiffTolerance: 6,
      setup: async ({ page }) => {
        await page.click(TEST_CHART_FILTER_TRIGGER);
        await page.keys(['Escape']);
        await page.focusNextElement();
        await page.keys(['ArrowRight', 'ArrowRight']);
        await page.waitForVisible(TEST_CHART_TOOLTIP_HEADER);
        await page.keys(['Enter']);
        await page.waitForVisible('[aria-label="Dismiss"]');
      },
    },
    {
      description: 'can pin popover for a point in a specific series with keyboard',
      path: 'line-chart/test',
      screenshotType: 'viewport',
      configuration: { width: 800, height: 800 },
      setup: async ({ page }) => {
        await page.click(TEST_CHART_FILTER_TRIGGER);
        await page.keys(['Escape']);
        await page.focusNextElement();
        await page.keys(['ArrowRight', 'ArrowDown', 'ArrowRight']);
        await page.waitForVisible(TEST_CHART_TOOLTIP_HEADER);
        await page.keys(['Enter']);
        await page.waitForVisible('[aria-label="Dismiss"]');
      },
    },
    {
      description: 'shows popover on hover',
      path: 'line-chart/test',
      screenshotType: 'viewport',
      configuration: { width: 800, height: 800 },
      setup: async ({ page }) => {
        await page.hoverElement('[aria-label="Line chart"]', 200, 50);
        await page.waitForVisible(TEST_CHART_TOOLTIP_HEADER);
      },
    },
    {
      description: 'shows popover with expandable sub-items - no series highlighted, sub-items collapsed',
      path: 'line-chart/drilldown',
      screenshotType: 'screenshotArea',
      configuration: { width: 800, height: 1000 },
      queryParams: { expandableSubItems: 'true' },
      setup: async ({ page, wrapper }) => {
        await page.click('#focus-target');
        await page.focusNextElement();
        await page.keys(['ArrowRight']);
        await page.waitForVisible(wrapper.findLineChart().findDetailPopover().toSelector());
      },
    },
    {
      description: 'shows popover with expandable sub-items - no series highlighted, sub-items expanded',
      path: 'line-chart/drilldown',
      screenshotType: 'screenshotArea',
      configuration: { width: 800, height: 1000 },
      queryParams: { expandableSubItems: 'true' },
      setup: async ({ page, wrapper }) => {
        await page.click('#focus-target');
        await page.focusNextElement();
        await page.keys(['ArrowRight']);
        await page.waitForVisible(wrapper.findLineChart().findDetailPopover().toSelector());
        await page.keys(['Tab']);
        await page.keys(['Enter']);
      },
    },
    {
      description: 'shows popover with expandable sub-items - one series highlighted, sub-items collapsed',
      path: 'line-chart/drilldown',
      screenshotType: 'screenshotArea',
      configuration: { width: 800, height: 1000 },
      queryParams: { expandableSubItems: 'true' },
      setup: async ({ page, wrapper }) => {
        await page.click('#focus-target');
        await page.focusNextElement();
        await page.keys(['ArrowRight']);
        await page.keys(['ArrowUp']);
        await page.waitForVisible(wrapper.findLineChart().findDetailPopover().toSelector());
      },
    },
    {
      description: 'shows popover with expandable sub-items - one series highlighted, sub-items expanded',
      path: 'line-chart/drilldown',
      screenshotType: 'screenshotArea',
      configuration: { width: 800, height: 1000 },
      queryParams: { expandableSubItems: 'true' },
      setup: async ({ page, wrapper }) => {
        await page.click('#focus-target');
        await page.focusNextElement();
        await page.keys(['ArrowRight']);
        await page.keys(['ArrowUp']);
        await page.waitForVisible(wrapper.findLineChart().findDetailPopover().toSelector());
        await page.keys(['Tab']);
        await page.keys(['Enter']);
      },
    },
    {
      description: 'correctly renders the chart inside an expandable section - X ticks do not overlap nor overflow',
      path: 'line-chart/in-expandable-section-test',
      screenshotType: 'screenshotArea',
      configuration: { width: 800, height: 800 },
      setup: async ({ page, wrapper }) => {
        const expandableSectionWrapper = wrapper.findExpandableSection();
        await page.waitForVisible(expandableSectionWrapper.toSelector());
        await page.click(expandableSectionWrapper.findExpandButton().toSelector());
      },
    },
  ],
};

export default suite;
