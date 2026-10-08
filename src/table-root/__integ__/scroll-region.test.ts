// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import styles from '../../../lib/components/table-root/styles.selectors.js';

const pageUrl = '#/light/table-root/scroll-region';
const scroller = (testid: string) => `[data-testid="${testid}"] .${styles['body-scroller']}`;
const scrollTable = scroller('scroll-table');
const growTable = scroller('grow-table');

test(
  'exposes the overflowing scroller as a focusable region that scrolls with the arrow keys',
  useBrowser({ width: 900, height: 800 }, async browser => {
    await browser.url(pageUrl);
    const page = new BasePageObject(browser);
    await page.waitForVisible(scrollTable);

    // The 1600px grid overflows a 900px viewport, so the scroller is a focusable region.
    await expect(page.getElementAttribute(scrollTable, 'role')).resolves.toEqual('region');
    await page.click('h1');
    await page.keys('Tab');
    await expect(page.isFocused(scrollTable)).resolves.toBe(true);

    let leftBefore = 0;
    await page.keys('ArrowRight');
    await page.waitForAssertion(async () => {
      leftBefore = (await page.getElementScroll(scrollTable)).left;
      expect(leftBefore).toBeGreaterThan(0);
    });

    await page.keys('ArrowLeft');
    await page.waitForAssertion(async () => {
      expect((await page.getElementScroll(scrollTable)).left).toBeLessThan(leftBefore);
    });
  })
);

test(
  'adds and removes the region as a viewport resize starts and stops the overflow',
  useBrowser({ width: 600, height: 800 }, async browser => {
    await browser.url(pageUrl);
    const page = new BasePageObject(browser);
    await page.waitForVisible(scrollTable);

    // Narrow viewport: the grid overflows, so the region and tab stop are present.
    await page.waitForAssertion(async () => {
      await expect(page.getElementAttribute(scrollTable, 'role')).resolves.toEqual('region');
      await expect(page.getElementAttribute(scrollTable, 'tabindex')).resolves.toEqual('0');
    });

    // Widen past the 1600px grid so it fits: the ResizeObserver on the scroller re-measures and the region clears.
    await page.setWindowSize({ width: 2000, height: 800 });
    await page.waitForAssertion(async () => {
      await expect(page.getElementAttribute(scrollTable, 'role')).resolves.toBeNull();
      await expect(page.getElementAttribute(scrollTable, 'tabindex')).resolves.toBeNull();
    });
  })
);

test(
  'adds the region when auto-layout content growth starts the overflow',
  useBrowser({ width: 1200, height: 800 }, async browser => {
    await browser.url(pageUrl);
    const page = new BasePageObject(browser);
    await page.waitForVisible(growTable);

    // Short content fits the viewport: no region.
    await page.waitForAssertion(async () => {
      await expect(page.getElementAttribute(growTable, 'role')).resolves.toBeNull();
    });

    // Growing a cell widens the table's own box; the ResizeObserver on that box re-measures and the region appears.
    await page.click('[data-testid="grow"]');
    await page.waitForAssertion(async () => {
      await expect(page.getElementAttribute(growTable, 'role')).resolves.toEqual('region');
      await expect(page.getElementAttribute(growTable, 'tabindex')).resolves.toEqual('0');
    });
  })
);
