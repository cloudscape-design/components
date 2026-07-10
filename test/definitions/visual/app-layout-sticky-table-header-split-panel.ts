// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Sticky header with split panel',
  componentName: 'app-layout',
  tests: [
    {
      description: 'scrolling to bottom with closed split panel (1 table row)',
      path: 'app-layout/with-sticky-table-and-split-panel',
      screenshotType: 'viewport',
      configuration: { width: 1280, height: 900 },
      setup: async ({ page }) => {
        await page.click('[data-testid="set-item-count-to-1"]');
        await page.scrollToBottom('html');
      },
    },
    {
      description: 'scrolling to bottom with closed split panel (30 table rows)',
      path: 'app-layout/with-sticky-table-and-split-panel',
      screenshotType: 'viewport',
      configuration: { width: 1280, height: 900 },
      setup: async ({ page }) => {
        await page.click('[data-testid="set-item-count-to-30"]');
        await page.scrollToBottom('html');
      },
    },
    {
      description: 'header stays sticky with open split panel (1 table row)',
      path: 'app-layout/with-sticky-table-and-split-panel',
      screenshotType: 'viewport',
      configuration: { width: 1280, height: 900 },
      setup: async ({ page }) => {
        await page.click('[data-testid="set-item-count-to-1"]');
        await page.click('aria/Open panel');
        await page.scrollToBottom('html');
      },
    },
    {
      description: 'header stays sticky with open split panel (30 table rows)',
      path: 'app-layout/with-sticky-table-and-split-panel',
      screenshotType: 'viewport',
      configuration: { width: 1280, height: 900 },
      setup: async ({ page }) => {
        await page.click('[data-testid="set-item-count-to-30"]');
        await page.click('aria/Open panel');
        await page.scrollToBottom('html');
      },
    },
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
    // ── Max content width ─────────────────────────────────────────────────
    {
      description: 'maxContentWidth set to Number.MAX_VALUE',
      path: 'app-layout/refresh-content-width',
      screenshotType: 'viewport',
      configuration: { width: 1280, height: 700 },
      setup: async ({ page }) => {
        await page.click('[data-test-id="button_width-number-max_value"]');
      },
    },
  ],
};

export default suite;
