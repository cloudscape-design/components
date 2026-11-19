// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Table sticky header',
  componentName: 'table',
  tests: [
    {
      description: 'initial state',
      path: 'table/sticky-header',
      screenshotType: 'viewport',
    },
    ...['container', 'embedded'].map<TestDefinition>(variant => ({
      description: `mid-scroll sticky state - ${variant} variant`,
      path: 'table/sticky-header',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click(`#${variant}`);
        await page.windowScrollTo({ top: 400 });
      },
    })),
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
