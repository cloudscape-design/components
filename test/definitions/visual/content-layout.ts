// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const suite: TestSuite = {
  description: 'ContentLayout',
  componentName: 'content-layout',
  tests: [
    {
      description: 'fill content area',
      path: 'content-layout/fill-content-area',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'standalone',
      path: 'content-layout/standalone',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'with absolute components',
      path: 'content-layout/with-absolute-components',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'form with form header',
      path: 'content-layout/with-header-toggles',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'form with content layout header',
      path: 'content-layout/with-header-toggles',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.click('[data-testid="toggle-form-header"] input');
        await page.click('[data-testid="toggle-content-layout"] input');
      },
    },
    // without header (from content-layout.test.ts)
    ...[1400, 600].flatMap(width =>
      [false, true].flatMap(hasBreadcrumbs =>
        [false, true].flatMap(hasNotifications =>
          [true, false].map<TestDefinition>(hasOverlap => ({
            description: `without header at ${width} ${hasBreadcrumbs ? 'with' : 'without'} breadcrumbs, ${hasNotifications ? 'with' : 'without'} notifications, ${hasOverlap ? 'with' : 'without'} overlap`,
            path: 'content-layout/without-header',
            screenshotType: 'screenshotArea' as const,
            configuration: { width },
            queryParams: {
              hasBreadcrumbs: `${hasBreadcrumbs}`,
              hasNotifications: `${hasNotifications}`,
              disableOverlap: `${!hasOverlap}`,
            },
          }))
        )
      )
    ),
  ],
};

export default suite;
