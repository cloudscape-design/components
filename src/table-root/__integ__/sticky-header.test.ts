// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import scrollbarStyles from '../../../lib/components/internal/components/sticky-scrollbar/styles.selectors.js';
import styles from '../../../lib/components/table-root/styles.selectors.js';

const slot = `.${styles['sticky-slot']}`;
const stickyScrollbar = `.${scrollbarStyles['sticky-scrollbar-visible']}`;
const scroller = `.${styles['body-scroller']}`;
const copyCells = `${slot} th`;
const realCells = `${scroller} thead th`;

class StickyHeaderPage extends BasePageObject {
  getCellBoxes(selector: string) {
    return this.browser.execute(
      (selector: string) =>
        Array.from(document.querySelectorAll(selector)).map(cell => {
          const { left, width } = cell.getBoundingClientRect();
          return { left: Math.round(left), width: Math.round(width) };
        }),
      selector
    );
  }

  getFocusedElement() {
    return this.browser.execute((scroller: string) => {
      const active = document.activeElement;
      return { inRealHeader: !!active?.closest(`${scroller} thead`), tag: active?.tagName };
    }, scroller);
  }

  async expectCopyAlignedWithRealHeader() {
    await this.waitForAssertion(async () => {
      const copy = await this.getCellBoxes(copyCells);
      expect(copy).toHaveLength(5);
      expect(copy).toEqual(await this.getCellBoxes(realCells));
    });
  }
}

const setupTest = (layout: 'grid' | 'auto', testFn: (page: StickyHeaderPage) => Promise<void>) =>
  useBrowser({ width: 900, height: 800 }, async browser => {
    await browser.url(`#/light/table-root/sticky-header?layout=${layout}`);
    const page = new StickyHeaderPage(browser);
    await page.waitForVisible(copyCells);
    await testFn(page);
  });

describe.each(['grid', 'auto'] as const)('TableRoot sticky header, %s layout', layout => {
  test(
    'stays pinned to the top of the viewport as the page scrolls',
    setupTest(layout, async page => {
      const { top: startTop } = await page.getBoundingBox(slot);
      expect(startTop).toBeGreaterThan(0);

      await page.windowScrollTo({ top: 1000 });
      await page.waitForAssertion(async () => {
        await expect(page.getBoundingBox(slot)).resolves.toEqual(expect.objectContaining({ top: 0 }));
      });
    })
  );

  test(
    'lines up with the columns',
    setupTest(layout, async page => {
      await page.expectCopyAlignedWithRealHeader();
    })
  );

  test(
    'stays lined up with the columns after the viewport resizes',
    setupTest(layout, async page => {
      await page.setWindowSize({ width: 1400, height: 800 });
      await page.expectCopyAlignedWithRealHeader();
    })
  );
});

test(
  'moves focus to the real header when a pinned header control is clicked, and still activates it',
  setupTest('grid', async page => {
    await page.windowScrollTo({ top: 1000 });
    await expect(page.getElementAttribute(`${realCells}:first-child`, 'aria-sort')).resolves.toBe('ascending');

    await page.click(`${slot} button`);

    await page.waitForAssertion(async () => {
      await expect(page.getElementAttribute(`${realCells}:first-child`, 'aria-sort')).resolves.toBe('descending');
    });
    await expect(page.getFocusedElement()).resolves.toEqual({ inRealHeader: true, tag: 'BUTTON' });
    // The click doesn't scroll the page back up to the real header.
    await expect(page.getWindowScroll()).resolves.toEqual(expect.objectContaining({ top: 1000 }));
  })
);

test(
  'follows the table when it is scrolled with the sticky scrollbar',
  setupTest('grid', async page => {
    await page.windowScrollTo({ top: 1000 });
    await page.waitForVisible(stickyScrollbar);
    await page.elementScrollTo(stickyScrollbar, { left: 200 });
    await page.waitForAssertion(async () => {
      await expect(page.getElementScroll(`${slot} > *`)).resolves.toEqual(expect.objectContaining({ left: 200 }));
    });
    await page.expectCopyAlignedWithRealHeader();
  })
);

test(
  'stays lined up with the columns as the table scrolls horizontally',
  setupTest('grid', async page => {
    await page.windowScrollTo({ top: 1000 });
    await page.elementScrollTo(scroller, { left: 200 });
    await page.waitForAssertion(async () => {
      await expect(page.getElementScroll(`${slot} > *`)).resolves.toEqual(expect.objectContaining({ left: 200 }));
    });
    await page.expectCopyAlignedWithRealHeader();
  })
);
