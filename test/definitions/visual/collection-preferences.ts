// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const suite: TestSuite = {
  description: 'CollectionPreferences',
  componentName: 'collection-preferences',
  tests: [
    ...(
      [
        [600, 1100],
        [1280, 700],
      ] as [number, number][]
    ).flatMap<TestDefinition>(([width, height]) => [
      {
        description: `complete at ${width}x${height}`,
        path: 'collection-preferences/simple',
        screenshotType: 'viewport' as const,
        configuration: { width, height },
        setup: async ({ page }) => {
          await page.click('.cp-1 button');
        },
      },
      {
        description: `visible content only at ${width}x${height}`,
        path: 'collection-preferences/simple',
        screenshotType: 'viewport' as const,
        setup: async ({ page }) => {
          await page.click('.cp-4 button');
        },
      },
    ]),
    {
      description: 'custom',
      path: 'collection-preferences/simple',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('.cp-2 button');
      },
    },
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
        await page.keys(['Space']);
      },
    },
  ],
};

export default suite;
