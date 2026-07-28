// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Z-index',
  componentName: 'app-layout',
  tests: [
    ...[600, 1280].flatMap(width => [
      {
        description: `button dropdown (${width}px)`,
        path: 'app-layout/with-absolute-components',
        screenshotType: 'viewport' as const,
        configuration: { width },
        setup: async ({ page }) => {
          await page.click('button=Button dropdown');
          await page.click('[data-testid="2"]');
          await page.windowScrollTo({ top: 300 });
        },
      } as TestDefinition,
      {
        description: `select (${width}px)`,
        path: 'app-layout/with-absolute-components',
        screenshotType: 'viewport' as const,
        configuration: { width, height: 800 },
        setup: async ({ page }) => {
          await page.click('[data-testid="select-demo"] button');
          await page.windowScrollTo({ top: 300 });
        },
      } as TestDefinition,
      {
        description: `split-panel and full-page table (${width}px)`,
        path: 'app-layout/with-full-page-table-and-split-panel',
        screenshotType: 'viewport' as const,
        configuration: { width },
      },
    ]),
    // ── With sticky notifications ─────────────────────────────────────────
    {
      description: 'with sticky notifications - button dropdown',
      path: 'app-layout/with-absolute-components',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('button=Toggle sticky notifications');
        await page.click('button=Button dropdown');
        await page.click('[data-testid="2"]');
        await page.windowScrollTo({ top: 250 });
      },
    },
    {
      description: 'with sticky notifications - select',
      path: 'app-layout/with-absolute-components',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('button=Toggle sticky notifications');
        await page.click('[data-testid="select-demo"] button');
        await page.windowScrollTo({ top: 250 });
      },
    },
    {
      description: 'split-panel and full-page with open navigation (600px)',
      path: 'app-layout/with-full-page-table-and-split-panel',
      screenshotType: 'viewport' as const,
      configuration: { width: 600 },
      setup: async ({ page }) => {
        await page.click('button[aria-label="Open navigation"]');
      },
    },
    {
      description: 'split-panel and full-page with open tools (600px)',
      path: 'app-layout/with-full-page-table-and-split-panel',
      screenshotType: 'viewport' as const,
      configuration: { width: 600 },
      setup: async ({ page }) => {
        await page.click('button[aria-label="Open tools"]');
      },
    },
  ],
};

export default suite;
