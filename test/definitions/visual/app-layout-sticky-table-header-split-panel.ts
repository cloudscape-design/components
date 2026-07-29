// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import VisualTestPageObject from '../page-object';
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'AppLayout',
  componentName: 'app-layout',
  tests: [
    {
      description: 'Sticky header with split panel',
      visualRefreshOnly: true,
      tests: [
        ...Object.entries({
          '1 table row': '[data-testid="set-item-count-to-1"]',
          '30 table rows': '[data-testid="set-item-count-to-30"]',
        }).flatMap(([tableRowCount, buttonSelector]) => [
          {
            description: `scrolling to bottom with closed split panel (${tableRowCount})`,
            path: 'app-layout/with-sticky-table-and-split-panel',
            screenshotType: 'viewport' as const,
            configuration: { width: 1280, height: 900 },
            setup: async ({ page }: { page: VisualTestPageObject }) => {
              await page.click(buttonSelector);
              await page.scrollToBottom('html');
            },
          },
          {
            description: `header stays sticky with open split panel (${tableRowCount})`,
            path: 'app-layout/with-sticky-table-and-split-panel',
            screenshotType: 'viewport' as const,
            configuration: { width: 1280, height: 900 },
            setup: async ({ page }: { page: VisualTestPageObject }) => {
              await page.click(buttonSelector);
              await page.click('aria/Open panel');
              await page.scrollToBottom('html');
            },
          },
        ]),
        {
          description: 'header stays sticky when mounting and unmounting a second table',
          path: 'app-layout/with-sticky-table-and-split-panel',
          screenshotType: 'viewport',
          configuration: { width: 1280, height: 900 },
          setup: async ({ page }) => {
            await page.click('[data-testid="set-item-count-to-30"]');
            await page.click('aria/Open panel');
            await page.windowScrollTo({ top: 0 });
            await page.click('aria/Close panel');
            await page.scrollToBottom('html');
          },
        },
      ],
    },
  ],
};

export default suite;
