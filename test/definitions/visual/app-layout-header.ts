// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestDefinition, TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Headers',
  componentName: 'app-layout',
  tests: [
    // ── Headers ───────────────────────────────────────────────────────────
    {
      description: 'Headers',
      tests: [600, 1280].flatMap(width => [
        {
          description: `alignment with full-page table (${width}px)`,
          path: 'app-layout/with-table',
          screenshotType: 'viewport' as const,
          configuration: { width },
        },
        {
          description: `alignment with full-page table in sticky state (${width}px)`,
          path: 'app-layout/with-table',
          screenshotType: 'viewport' as const,
          configuration: { width },
          setup: async ({ page }) => {
            await page.windowScrollTo({ top: 200 });
          },
        },
        {
          description: `alignment with full-page table in sticky state with sticky notifications (${width}px)`,
          path: 'app-layout/with-table',
          screenshotType: 'viewport' as const,
          configuration: { width },
          queryParams: { stickyNotifications: 'true' },
          setup: async ({ page }) => {
            await page.windowScrollTo({ top: 200 });
          },
        },
        {
          description: `high contrast header variant in landing page (${width}px)`,
          path: 'app-layout/landing-page',
          screenshotType: 'viewport' as const,
          configuration: { width },
        },
      ]),
    },

    // ── High contrast header variant ──────────────────────────────────────
    {
      description: 'High contrast header variant',
      tests: [
        ...[1400, 600].flatMap(width => [
          {
            description: `with breadcrumbs and notifications at ${width}px`,
            path: 'app-layout/high-contrast-header-variant',
            screenshotType: 'screenshotArea' as const,
            configuration: { width },
            queryParams: { hasBreadcrumbs: 'true', hasNotifications: 'true', hasContainer: 'true' },
          } as TestDefinition,
          {
            description: `without overlap at ${width}px`,
            path: 'app-layout/high-contrast-header-variant',
            screenshotType: 'screenshotArea' as const,
            configuration: { width },
            queryParams: { disableOverlap: 'true' },
          } as TestDefinition,
          {
            description: `with content layout at ${width}px`,
            path: 'app-layout/high-contrast-header-variant',
            screenshotType: 'screenshotArea' as const,
            configuration: { width },
            queryParams: {
              hasBreadcrumbs: 'true',
              hasNotifications: 'true',
              hasContainer: 'true',
              hasContentLayout: 'true',
            },
          } as TestDefinition,
        ]),
      ],
    },
  ],
};

export default suite;
