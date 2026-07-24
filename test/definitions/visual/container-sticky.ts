// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Container sticky permutations',
  componentName: 'container',
  tests: [1400, 600].flatMap<TestDefinition>(width => [
    {
      description: `simple - at ${width}px`,
      path: 'container/sticky-permutations',
      screenshotType: 'viewport' as const,
      configuration: { width },
      setup: async ({ page }) => {
        await page.windowScrollTo({ top: 200 });
      },
    },
    {
      description: `with notifications - at ${width}px`,
      path: 'container/sticky-permutations',
      screenshotType: 'viewport' as const,
      configuration: { width },
      queryParams: { hasNotifications: 'true' },
      setup: async ({ page }) => {
        await page.windowScrollTo({ top: 200 });
      },
    },
    {
      description: `with breadcrumbs - at ${width}px`,
      path: 'container/sticky-permutations',
      screenshotType: 'viewport' as const,
      configuration: { width },
      queryParams: { hasBreadcrumbs: 'true' },
      setup: async ({ page }) => {
        await page.windowScrollTo({ top: 200 });
      },
    },
    {
      description: `with an alert - at ${width}px`,
      path: 'container/sticky-permutations',
      screenshotType: 'viewport' as const,
      configuration: { width },
      queryParams: { hasNotifications: 'true', hasAlert: 'true' },
      setup: async ({ page }) => {
        await page.windowScrollTo({ top: 200 });
      },
    },
    {
      description: `with an alert - at ${width}px without scroll`,
      path: 'container/sticky-permutations',
      screenshotType: 'viewport' as const,
      configuration: { width },
      queryParams: { hasNotifications: 'true', hasAlert: 'true' },
    },
    {
      description: `with high-contrast header - at ${width}px`,
      path: 'container/sticky-permutations',
      screenshotType: 'viewport' as const,
      configuration: { width },
      queryParams: { hasNotifications: 'true', highContrast: 'true' },
      setup: async ({ page }) => {
        await page.windowScrollTo({ top: 200 });
      },
    },
  ]),
};

export default suite;
