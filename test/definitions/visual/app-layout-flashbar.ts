// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Flashbar',
  componentName: 'app-layout',
  tests: [true, false].flatMap(disableContentPaddings =>
    [true, false].flatMap(stickyNotifications =>
      [true, false].flatMap(stickyTableHeader =>
        [true, false].map(stackNotifications => ({
          description: `disableContentPaddings: ${disableContentPaddings}, stickyNotifications: ${stickyNotifications}, stickyTableHeader: ${stickyTableHeader}, stackNotifications: ${stackNotifications}`,
          path: 'app-layout/with-stacked-notifications-and-table',
          screenshotType: 'screenshotArea' as const,
          configuration: { width: 1280, height: 900 },
          setup: async ({ page }) => {
            if (!disableContentPaddings) {
              await page.click('[data-id="toggle-content-paddings"]');
            }
            if (stickyNotifications) {
              await page.click('[data-id="toggle-sticky-notifications"]');
            }
            if (!stickyTableHeader) {
              await page.click('[data-id="toggle-sticky-table-header"]');
            }
            if (!stackNotifications) {
              await page.click('[data-id="toggle-stack-items"]');
            }
            await page.click('[data-id="add-notification"]');
            await page.click('[data-id="add-notification"]');
          },
        }))
      )
    )
  ),
};

export default suite;
