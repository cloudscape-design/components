// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Table',
  componentName: 'table-resizable-columns',
  tests: [
    {
      description: 'resizable columns permutations',
      path: 'table/resizable-columns-permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'focused column resizer',
      path: 'table/resizable-columns',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.buttonDownOnElement('#reset-state');
        await page.keys(['Tab']);
      },
    },
    {
      description: 'active column resizer on sticky header',
      path: 'table/resizable-columns',
      screenshotType: 'viewport',
      setup: async ({ page, wrapper }) => {
        const table = wrapper.findTable();
        await page.click('#sticky-header-toggle input');
        await page.windowScrollTo({ top: 600 });
        await page.buttonDownOnElement(table.findColumnResizer(3).toSelector());
      },
    },
    {
      description: 'active column resizer',
      path: 'table/resizable-columns',
      screenshotType: 'screenshotArea',
      setup: async ({ page, wrapper }) => {
        const table = wrapper.findTable();
        await page.buttonDownOnElement(table.findColumnResizer(3).toSelector());
      },
    },
    {
      description: 'pressed column resizer',
      path: 'table/resizable-columns',
      screenshotType: 'screenshotArea',
      queryParams: { enableKeyboardNavigation: 'true' },
      setup: async ({ page, wrapper }) => {
        const table = wrapper.findTable();
        await page.click(table.findHeaderSlot().toSelector());
        await page.keys(['Tab', 'ArrowRight', 'ArrowRight', 'ArrowRight', 'Enter']);
      },
    },
    {
      description: 'pressed last column resizer',
      path: 'table/resizable-columns',
      screenshotType: 'screenshotArea',
      queryParams: { enableKeyboardNavigation: 'true' },
      setup: async ({ page, wrapper }) => {
        const table = wrapper.findTable();
        await page.click(table.findHeaderSlot().toSelector());
        await page.keys(['Tab', 'ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowRight', 'Enter']);
      },
    },
  ],
};

export default suite;
