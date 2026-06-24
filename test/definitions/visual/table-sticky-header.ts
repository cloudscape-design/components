// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Table sticky header',
  componentName: 'table-sticky-header',
  tests: [
    {
      description: 'initial state',
      path: 'table/sticky-header',
      screenshotType: 'viewport',
    },
    {
      description: 'mid-scroll sticky state - container variant',
      path: 'table/sticky-header',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('#container');
        await page.windowScrollTo({ top: 400 });
      },
    },
    {
      description: 'mid-scroll sticky state - embedded variant',
      path: 'table/sticky-header',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('#embedded');
        await page.windowScrollTo({ top: 400 });
      },
    },
    {
      description: 'bottom sticky state',
      path: 'table/sticky-header',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.windowScrollTo({ top: 925 });
      },
    },
  ],
};

export default suite;
