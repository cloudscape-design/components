// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import scrollbarStyles from '../../../lib/components/internal/components/sticky-scrollbar/styles.selectors.js';
import styles from '../../../lib/components/table-root/styles.selectors.js';

const pageUrl = '#/light/table-root/sticky-scrollbar';
const scrollbar = (testId: string) => `[data-testid="${testId}"] .${scrollbarStyles['sticky-scrollbar-visible']}`;
const scroller = (testId: string) => `[data-testid="${testId}"] .${styles['body-scroller']}`;

const setupTest = (testFn: (page: BasePageObject) => Promise<void>) =>
  useBrowser({ width: 800, height: 600 }, async browser => {
    await browser.url(pageUrl);
    const page = new BasePageObject(browser);
    await page.waitForVisible(scroller('container-table'));
    await testFn(page);
  });

describe('TableRoot sticky scrollbar', () => {
  test(
    'stays at the bottom of the viewport while the page-scrolled table continues below it',
    setupTest(async page => {
      await page.waitForVisible(scrollbar('page-table'));
      await page.windowScrollTo({ top: 600 });
      await page.waitForAssertion(async () => {
        const { bottom } = await page.getBoundingBox(scrollbar('page-table'));
        const { height } = await page.getViewportSize();
        expect(bottom).toBe(height);
      });
    })
  );

  test(
    'stays at the bottom of a fixed-height container',
    setupTest(async page => {
      await page.waitForVisible(scrollbar('container-table'));
      await page.elementScrollTo('[data-testid="scroll-container"]', { top: 300 });
      await page.waitForAssertion(async () => {
        const { bottom: containerBottom } = await page.getBoundingBox('[data-testid="scroll-container"]');
        const { bottom: scrollbarBottom } = await page.getBoundingBox(scrollbar('container-table'));
        expect(scrollbarBottom).toBe(containerBottom);
      });
    })
  );

  test(
    'scrolls the table horizontally',
    setupTest(async page => {
      await page.waitForVisible(scrollbar('container-table'));
      await page.elementScrollTo(scrollbar('container-table'), { left: 200 });
      await page.waitForAssertion(async () => {
        await expect(page.getElementScroll(scroller('container-table'))).resolves.toEqual({ left: 200, top: 0 });
      });
    })
  );

  test(
    'is hidden when the table fits',
    setupTest(async page => {
      await page.waitForVisible(scrollbar('page-table'));
      await page.setWindowSize({ width: 2400, height: 600 });
      await page.waitForAssertion(async () => {
        await expect(page.isExisting(scrollbar('page-table'))).resolves.toBe(false);
      });
    })
  );
});
