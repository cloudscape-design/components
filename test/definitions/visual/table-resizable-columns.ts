// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Table',
  componentName: 'table',
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
        await page.click('#sticky-header-toggle input');
        await page.windowScrollTo({ top: 600 });
        await page.buttonDownOnElement(wrapper.findTable().findColumnResizer(3).toSelector());
      },
    },
    {
      description: 'active column resizer',
      path: 'table/resizable-columns',
      screenshotType: 'screenshotArea',
      setup: async ({ page, wrapper }) => {
        await page.buttonDownOnElement(wrapper.findTable().findColumnResizer(3).toSelector());
      },
    },
    // In pressed state the UAP resize buttons are visible.
    {
      description: 'pressed column resizer',
      path: 'table/resizable-columns',
      screenshotType: 'screenshotArea',
      queryParams: { enableKeyboardNavigation: 'true' },
      setup: async ({ page, wrapper, configuration }) => {
        const horizontalKey = configuration?.direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
        await page.click(wrapper.findTable().findHeaderSlot().toSelector());
        await page.keys(['Tab', horizontalKey, horizontalKey, horizontalKey, 'Enter']);
      },
    },
    // On the last column the UAP buttons display vertically.
    {
      description: 'pressed last column resizer',
      path: 'table/resizable-columns',
      screenshotType: 'screenshotArea',
      queryParams: { enableKeyboardNavigation: 'true' },
      setup: async ({ page, wrapper, configuration }) => {
        const horizontalKey = configuration?.direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
        await page.click(wrapper.findTable().findHeaderSlot().toSelector());
        await page.keys(['Tab', horizontalKey, horizontalKey, horizontalKey, horizontalKey, 'Enter']);
      },
    },
  ],
};

export default suite;
