// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'CollectionPreferences',
  componentName: 'collection-preferences',
  tests: [
    {
      description: 'complete at 600x1100',
      path: 'collection-preferences/simple',
      screenshotType: 'viewport',
      configuration: { width: 600, height: 1100 },
      setup: async ({ page }) => {
        await page.click('.cp-1 button');
      },
    },
    {
      description: 'visible content only at 600x1100',
      path: 'collection-preferences/simple',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('.cp-4 button');
      },
    },
    {
      description: 'complete at 1280x700',
      path: 'collection-preferences/simple',
      screenshotType: 'viewport',
      configuration: { width: 1280, height: 700 },
      setup: async ({ page }) => {
        await page.click('.cp-1 button');
      },
    },
    {
      description: 'visible content only at 1280x700',
      path: 'collection-preferences/simple',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('.cp-4 button');
      },
    },
    {
      description: 'custom',
      path: 'collection-preferences/simple',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('.cp-2 button');
      },
    },
    {
      description: 'Content reordering',
      componentName: 'collection-preferences',
      tests: [
        {
          description: 'drag handle focused',
          path: 'collection-preferences/reorder-content',
          screenshotType: 'viewport',
          configuration: { width: 900, height: 650 },
          setup: async ({ page }) => {
            await page.click('.cp-1 button');
            await page.keys(Array(5).fill('Tab'));
          },
        },
        {
          description: 'reordering active',
          path: 'collection-preferences/reorder-content',
          screenshotType: 'viewport',
          configuration: { width: 900, height: 650 },
          setup: async ({ page }) => {
            await page.click('.cp-1 button');
            await page.keys(Array(5).fill('Tab'));
            await page.keys('Space');
          },
        },
      ],
    },
  ],
};

export default suite;
