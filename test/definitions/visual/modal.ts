// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Modal',
  componentName: 'modal',
  tests: [
    {
      description: 'simple',
      path: 'modal/simple',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('aria/Show modal');
      },
    },
    {
      description: 'no-paddings',
      path: 'modal/no-paddings',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('aria/Show modal');
      },
    },
    {
      description: 'vertical-scroll',
      path: 'modal/vertical-scroll',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('aria/Show modal');
      },
    },
    {
      description: 'long-header',
      path: 'modal/long-header',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('aria/Show modal');
      },
    },
    {
      description: 'unbreakable-header',
      path: 'modal/unbreakable-header',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('aria/Show modal');
      },
    },
    ...['small', 'medium', 'large', 'x-large', 'xx-large', 'max'].map<TestDefinition>(size => ({
      description: `size-${size}`,
      path: 'modal/sizes',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click(`aria/${size}`);
      },
    })),
    {
      description: 'position-top',
      path: 'modal/position-top',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('aria/Show modal');
      },
    },
    ...['true', 'false'].map<TestSuite>(footer => ({
      description: `custom-dimensions ${footer === 'true' ? 'with' : 'without'} footer`,
      tests: [
        {
          description: 'custom-dimensions',
          path: 'modal/custom-dimensions',
          screenshotType: 'viewport',
          queryParams: { width: '600', height: '400', footer },
          setup: async ({ page }) => {
            await page.click('[data-testid="modal-trigger"]');
          },
        },
        {
          description: 'custom-dimensions very small width',
          path: 'modal/custom-dimensions',
          screenshotType: 'viewport',
          queryParams: { width: '10' } as Record<string, string>,
          setup: async ({ page }) => {
            await page.click('[data-testid="modal-trigger"]');
          },
        },
        {
          description: 'custom-dimensions very small height',
          path: 'modal/custom-dimensions',
          screenshotType: 'viewport',
          queryParams: { height: '10', footer },
          setup: async ({ page }) => {
            await page.click('[data-testid="modal-trigger"]');
          },
        },
        {
          description: 'custom-dimensions very small height & width',
          path: 'modal/custom-dimensions',
          screenshotType: 'viewport',
          queryParams: { width: '10', height: '15', footer },
          setup: async ({ page }) => {
            await page.click('[data-testid="modal-trigger"]');
          },
        },
        {
          description: 'custom-dimensions large height & width',
          path: 'modal/custom-dimensions',
          screenshotType: 'viewport',
          queryParams: { width: '10000', height: '10000', footer },
          setup: async ({ page }) => {
            await page.click('[data-testid="modal-trigger"]');
          },
        },
      ],
    })),
  ],
};

export default suite;
