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
      setup: async ({ page, configuration }) => {
        const keys = configuration?.direction === 'rtl' ? ['ArrowLeft', 'ArrowLeft'] : ['ArrowRight', 'ArrowRight'];
        // Focus and close the filtering select
        await page.click(TEST_CHART_FILTER_TRIGGER);
        await page.keys(['Escape']);
        await page.focusNextElement();
        await page.keys(keys);
        await page.waitForVisible(TEST_CHART_TOOLTIP_HEADER);
      },
    },
    {
      description: 'can navigate series with keyboard',
      path: 'line-chart/test',
      screenshotType: 'viewport',
      configuration: { width: 800, height: 800 },
      setup: async ({ page }) => {
        // Focus and close the filtering select
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
      setup: async ({ page, configuration }) => {
        const keys = configuration?.direction === 'rtl' ? ['ArrowLeft', 'ArrowLeft'] : ['ArrowRight', 'ArrowRight'];
        // Focus and close the filtering select
        await page.click(TEST_CHART_FILTER_TRIGGER);
        await page.keys(['Escape']);
        await page.focusNextElement();
        await page.keys(keys);
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
        // Focus and close the filtering select
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
      // skip tests with line hover effects on Safari because they do not support it
      configuration: { width: 800, height: 800, skipBrowsers: ['Safari'] },
      setup: async ({ page }) => {
        await page.hoverElement('[aria-label="Line chart"]', 200, 50);
        await page.waitForVisible(TEST_CHART_TOOLTIP_HEADER);
      },
    },
    {
      description: 'shows popover with expandable sub-items',
      // Give enough height to reach the popover trigger
      tests: [
        {
          description: 'no series highlighted, sub-items collapsed',
          path: 'line-chart/drilldown',
          screenshotType: 'screenshotArea',
          configuration: { width: 800, height: 1000 },
          queryParams: { expandableSubItems: 'true' },
          setup: async ({ page, wrapper }) => {
            const popoverSelector = wrapper.findLineChart().findDetailPopover().toSelector();
            await page.click('#focus-target');
            await page.focusNextElement(); // Focus chart
            await page.keys(['ArrowRight']); // Focus first x coordinate
            await page.waitForVisible(popoverSelector);
          },
        },
        {
          description: 'no series highlighted, sub-items expanded',
          path: 'line-chart/drilldown',
          screenshotType: 'screenshotArea',
          configuration: { width: 800, height: 1000 },
          queryParams: { expandableSubItems: 'true' },
          setup: async ({ page, wrapper }) => {
            const popoverSelector = wrapper.findLineChart().findDetailPopover().toSelector();
            await page.click('#focus-target');
            await page.focusNextElement(); // Focus chart
            await page.keys(['ArrowRight']); // Focus first x coordinate
            await page.waitForVisible(popoverSelector);
            await page.keys(['Tab']); // Focus expandable section in popover
            await page.keys(['Enter']); // Expand
          },
        },
        {
          description: 'one series highlighted, sub-items collapsed',
          path: 'line-chart/drilldown',
          screenshotType: 'screenshotArea',
          configuration: { width: 800, height: 1000 },
          queryParams: { expandableSubItems: 'true' },
          setup: async ({ page, wrapper }) => {
            const popoverSelector = wrapper.findLineChart().findDetailPopover().toSelector();
            await page.click('#focus-target');
            await page.focusNextElement(); // Focus chart
            await page.keys(['ArrowRight']); // Focus first x coordinate
            await page.keys(['ArrowUp']); // Focus first series
            await page.waitForVisible(popoverSelector);
          },
        },
        {
          description: 'one series highlighted, sub-items expanded',
          path: 'line-chart/drilldown',
          screenshotType: 'screenshotArea',
          configuration: { width: 800, height: 1000 },
          queryParams: { expandableSubItems: 'true' },
          setup: async ({ page, wrapper }) => {
            const popoverSelector = wrapper.findLineChart().findDetailPopover().toSelector();
            await page.click('#focus-target');
            await page.focusNextElement(); // Focus chart
            await page.keys(['ArrowRight']); // Focus first x coordinate
            await page.keys(['ArrowUp']); // Focus first series
            await page.waitForVisible(popoverSelector);
            await page.keys(['Tab']); // Focus expandable section in popover
            await page.keys(['Enter']); // Expand
          },
        },
      ],
    },
    {
      description: 'correctly renders the chart inside an expandable section',
      tests: [
        {
          description: 'X ticks do not overlap nor overflow',
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
    },
  ],
};

export default suite;
