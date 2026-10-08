// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import VisualTestPageObject from '../page-object';
import { SetupConfiguration, TestDefinition, TestSuite, Wrapper } from '../types';

function scrollTableWrapper(
  page: VisualTestPageObject,
  wrapper: Wrapper,
  configuration: SetupConfiguration | undefined,
  scroll: number
) {
  const table = wrapper.findTable('[data-test-id="small-table"]');
  const scrollLeft = configuration?.direction === 'rtl' ? -scroll : scroll;
  return page.elementScrollTo(table.find('[class*="awsui_wrapper_"]').toSelector(), { top: 0, left: scrollLeft });
}

const suite: TestSuite = {
  description: 'Table',
  componentName: 'table',
  tests: [
    ...[400, 600, 1200].map<TestDefinition>(width => ({
      description: `simple permutations at ${width}`,
      path: 'table/simple-permutations',
      screenshotType: 'permutations',
      configuration: { width },
    })),
    ...[400, 600, 1200].map<TestDefinition>(width => ({
      description: `permutations at ${width}`,
      path: 'table/permutations',
      screenshotType: 'permutations',
      configuration: { width },
    })),
    {
      description: 'expandable rows permutations',
      path: 'table/expandable-rows.permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'empty state – default',
      path: 'table/empty-state',
      screenshotType: 'screenshotArea',
      configuration: { width: 600 },
    },
    {
      description: 'empty state – scrolled horizontally',
      path: 'table/empty-state',
      screenshotType: 'screenshotArea',
      configuration: { width: 600 },
      setup: async ({ page }) => {
        await page.click('#scroll-content');
      },
    },
    {
      description: 'with features',
      path: 'table/hooks',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'with striped rows',
      path: 'table/striped-rows',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'inside stacked container',
      path: 'table/sticky-header-in-stacked-container',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.windowScrollTo({ top: 10 });
        await page.click('button=Actions');
      },
    },
    {
      description: 'sticky header with open action button dropdown',
      path: 'table/sticky-header-with-actions',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.click('[data-test-id="actions-button"]');
      },
    },
    {
      description: 'variants',
      path: 'table/variants',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'focus on last cell inline action',
      path: 'table/inline-actions',
      screenshotType: 'screenshotArea',
      setup: async ({ page, wrapper }) => {
        const tableWrapper = wrapper.findTable('[data-testid="table-with-dropdown-actions"]');
        // Open dropdown
        await page.click(tableWrapper.findRows().get(1).findButtonDropdown().findNativeButton().toSelector());
        // Close dropdown and move keyboard focus to the trigger
        await page.keys(['Escape']);
      },
    },
    {
      description: 'focus on first cell link',
      path: 'table/inline-actions',
      screenshotType: 'screenshotArea',
      setup: async ({ page, wrapper }) => {
        const tableWrapper = wrapper.findTable('[data-testid="table-with-dropdown-actions"]');
        // Focus on row selection checkbox
        await page.click(tableWrapper.findRowSelectionArea(1).toSelector());
        // Move keyboard focus to the ID link
        await page.keys(['Tab']);
      },
    },
    {
      description: 'first column sticky state',
      path: 'table/sticky-columns',
      screenshotType: 'screenshotArea',
      configuration: { width: 800 },
      queryParams: { stickyColumnsFirst: '1' },
      setup: async ({ page, wrapper, configuration }) => {
        await scrollTableWrapper(page, wrapper, configuration, 100);
      },
    },
    {
      description: 'first column sticky state and selection',
      path: 'table/sticky-columns',
      screenshotType: 'screenshotArea',
      configuration: { width: 800 },
      queryParams: { stickyColumnsFirst: '1', selectionType: 'single' },
      setup: async ({ page, wrapper, configuration }) => {
        await scrollTableWrapper(page, wrapper, configuration, 100);
      },
    },
    {
      description: 'first column sticky state and striped rows',
      path: 'table/sticky-columns',
      screenshotType: 'screenshotArea',
      configuration: { width: 800 },
      queryParams: { stickyColumnsFirst: '1', stripedRows: 'true' },
      setup: async ({ page, wrapper, configuration }) => {
        await scrollTableWrapper(page, wrapper, configuration, 100);
      },
    },
    {
      description: 'first two columns sticky state',
      path: 'table/sticky-columns',
      screenshotType: 'screenshotArea',
      configuration: { width: 800 },
      queryParams: { stickyColumnsFirst: '2' },
      setup: async ({ page, wrapper, configuration }) => {
        await scrollTableWrapper(page, wrapper, configuration, 100);
      },
    },
    {
      description: 'last column sticky state',
      path: 'table/sticky-columns',
      screenshotType: 'screenshotArea',
      configuration: { width: 800 },
      queryParams: { stickyColumnsLast: '1' },
    },
    {
      description: 'Table',
      componentName: 'token',
      tests: [
        {
          description: 'expandable rows with group selection and row counters',
          path: 'table/grouped-table-hooks',
          screenshotType: 'screenshotArea',
          setup: async ({ page, wrapper }) => {
            const table = wrapper.findTable();
            await page.click(table.findExpandToggle(1).toSelector());
            await page.click(table.findRowSelectionArea(1).toSelector());
            await page.click(table.findRowSelectionArea(2).toSelector());
          },
        },
      ],
    },
  ],
};

export default suite;
