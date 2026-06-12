// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Table',
  componentName: 'table',
  tests: [
    {
      description: 'simple permutations at ${width}',
      path: 'table/simple-permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'permutations at ${width}',
      path: 'table/permutations',
      screenshotType: 'permutations',
    },
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
        await page.click(tableWrapper.findRows().get(1).findButtonDropdown().findNativeButton().toSelector());
        await page.keys(['Escape']);
      },
    },
    {
      description: 'focus on first cell link',
      path: 'table/inline-actions',
      screenshotType: 'screenshotArea',
      setup: async ({ page, wrapper }) => {
        const tableWrapper = wrapper.findTable('[data-testid="table-with-dropdown-actions"]');
        await page.click(tableWrapper.findRowSelectionArea(1).toSelector());
        await page.keys(['Tab']);
      },
    },
    {
      description: 'first column sticky state',
      path: 'table/sticky-columns',
      screenshotType: 'screenshotArea',
      configuration: { width: 800 },
      queryParams: { stickyColumnsFirst: '1' },
    },
    {
      description: 'first column sticky state and selection',
      path: 'table/sticky-columns',
      screenshotType: 'screenshotArea',
      configuration: { width: 800 },
      queryParams: { stickyColumnsFirst: '1', selectionType: 'single' },
    },
    {
      description: 'first column sticky state and striped rows',
      path: 'table/sticky-columns',
      screenshotType: 'screenshotArea',
      configuration: { width: 800 },
      queryParams: { stickyColumnsFirst: '1', stripedRows: 'true' },
    },
    {
      description: 'first two columns sticky state',
      path: 'table/sticky-columns',
      screenshotType: 'screenshotArea',
      configuration: { width: 800 },
      queryParams: { stickyColumnsFirst: '2' },
    },
    {
      description: 'last column sticky state',
      path: 'table/sticky-columns',
      screenshotType: 'screenshotArea',
      configuration: { width: 800 },
      queryParams: { stickyColumnsLast: '1' },
    },
  ],
};

export default suite;
