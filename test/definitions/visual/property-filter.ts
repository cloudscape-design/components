// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Property filter',
  componentName: 'property-filter',
  tests: [
    {
      description: 'token editor popover',
      path: 'property-filter/token-editor',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.click('.property-filter-default [aria-haspopup=dialog]');
      },
    },
    {
      description: 'filtering token select',
      path: 'property-filter/token-editor',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.click('.property-filter-default [aria-haspopup=listbox]');
      },
    },
    {
      description: 'token editor popover overflow',
      path: 'property-filter/token-editor',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.click('.property-filter-overflow [aria-haspopup=dialog]');
      },
    },
    {
      description: 'token editor custom property boolean',
      path: 'property-filter/token-editor',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.click('.property-filter-custom-prop-boolean [aria-haspopup=dialog]');
      },
    },
    {
      description: 'token editor custom property datetime',
      path: 'property-filter/token-editor',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.click('.property-filter-custom-prop-datetime [aria-haspopup=dialog]');
      },
    },
    {
      description: 'token editor group string property',
      path: 'property-filter/token-editor',
      screenshotType: 'screenshotArea',
      setup: async ({ page, wrapper }) => {
        const propertyFilter = wrapper.findPropertyFilter('.property-filter-group-editor');
        await page.click(propertyFilter.findTokens().get(1).findLabel().toSelector());
      },
    },
    {
      description: 'token editor group datetime property',
      path: 'property-filter/token-editor',
      screenshotType: 'screenshotArea',
      setup: async ({ page, wrapper }) => {
        const propertyFilter = wrapper.findPropertyFilter('.property-filter-group-editor');
        // Open 1st token editor dropdown
        await page.click(propertyFilter.findTokens().get(1).findLabel().toSelector());
        // Close 1st token editor dropdown.
        await page.keys(['Escape']);
        // Open 2nd token editor dropdown.
        await page.keys(['Tab', 'Tab', 'Tab', 'Enter']);
      },
    },
    {
      description: 'token editor enum property',
      path: 'property-filter/token-editor',
      screenshotType: 'screenshotArea',
      setup: async ({ page, wrapper }) => {
        const propertyFilter = wrapper.findPropertyFilter('.property-filter-group-editor');
        await page.click(propertyFilter.findNativeInput().toSelector());
        await page.keys('state = s');
      },
    },
    {
      description: 'token editor enum property no matches',
      path: 'property-filter/token-editor',
      screenshotType: 'screenshotArea',
      setup: async ({ page, wrapper }) => {
        const propertyFilter = wrapper.findPropertyFilter('.property-filter-group-editor');
        await page.click(propertyFilter.findNativeInput().toSelector());
        await page.keys('state = x');
      },
    },
    {
      description: 'permutations',
      path: 'property-filter/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'tokens permutations',
      path: 'property-filter/property-filter-tokens-permutations',
      screenshotType: 'permutations',
    },
    ...[400, 1200].map<TestDefinition>(width => ({
      description: `editor permutations at ${width}`,
      path: 'property-filter/property-filter-editor-permutations',
      screenshotType: 'permutations',
      configuration: { width },
    })),
    {
      description: 'split panel integration',
      tests: [
        {
          description: 'main content dropdown',
          path: 'property-filter/split-panel-app-layout-integration',
          screenshotType: 'viewport',
          setup: async ({ page }) => {
            await page.click('.main-content input[aria-label="your choice"]');
          },
        },
        {
          description: 'main content popover',
          path: 'property-filter/split-panel-app-layout-integration',
          screenshotType: 'viewport',
          setup: async ({ page }) => {
            await page.click('.main-content button[aria-haspopup=dialog]');
          },
        },
      ],
    },
    {
      description: 'virtual scroll navigate through 100 items',
      path: 'property-filter/virtual-scroll',
      screenshotType: 'screenshotArea',
      setup: async ({ page, wrapper }) => {
        const propertyFilter = wrapper.findPropertyFilter();
        await page.click(propertyFilter.findNativeInput().toSelector());
        await page.keys('Property = ');
        for (let i = 0; i < 100; i++) {
          await page.keys('ArrowDown');
        }
      },
    },
  ],
};

export default suite;
