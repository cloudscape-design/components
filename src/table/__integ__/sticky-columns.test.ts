// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper, { TableWrapper } from '../../../lib/components/test-utils/selectors';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import styles from '../../../lib/components/table/styles.selectors.js';

class StickyColumnsPage extends BasePageObject {
  async resizeColumn(wrapper: TableWrapper, columnIndex: number, xOffset: number) {
    const resizerSelector = wrapper.findColumnResizer(columnIndex).toSelector();
    await this.dragAndDrop(resizerSelector, xOffset);
  }
}

const getElementComputedStyle = (selector: string, styleProperty: keyof CSSStyleDeclaration) => {
  const el = document.querySelector<HTMLElement>(selector)!;
  const style = getComputedStyle(el);
  return style[styleProperty];
};

const getElementBoundingClientRect = (selector: string) => {
  const el = document.querySelector<HTMLElement>(selector)!;
  const rect = el.getBoundingClientRect();
  return rect;
};

async function forEachColumnCell(
  wrapper: TableWrapper,
  column: number,
  callback: (cellSelector: string) => Promise<void>
) {
  const headerCellSelector = wrapper.findColumnHeaders().get(column).toSelector();
  await callback(headerCellSelector);
  for (let i = 1; i <= rowCount; i++) {
    const cellSelector = wrapper.findBodyCell(i, column).toSelector();
    await callback(cellSelector);
  }
}

async function hasHorizontalOverflow(browser: any, selector: string) {
  const isOverflowing = await browser.execute((containerSelector: string) => {
    const container = document.querySelector(containerSelector) as HTMLElement;
    return container.scrollWidth > container.clientWidth;
  }, selector);

  return isOverflowing;
}

let rowCount: number;
let columnCount: number;

const checkStickyCells = async (
  browser: any,
  wrapper: TableWrapper,
  columnIndex: number,
  rowCount: number,
  shouldBeSticky: boolean
) => {
  // Expect header cell to be sticky
  const headerCellSelector = wrapper.findColumnHeaders().get(columnIndex).toSelector();
  const position = await browser.execute(getElementComputedStyle, headerCellSelector, 'position');
  await (shouldBeSticky ? expect(position) : expect(position).not).toEqual('sticky');

  // Expect all body cells in the column to be sticky
  for (let i = 1; i <= rowCount; i++) {
    const cellSelector = wrapper.findBodyCell(i, columnIndex).toSelector();
    const position = await browser.execute(getElementComputedStyle, cellSelector, 'position');
    await (shouldBeSticky ? expect(position) : expect(position).not).toEqual('sticky');
  }
};

async function setupTest(browser: any, dataTestId = 'simple', queryParams = '') {
  await browser.url(`#/light/table/sticky-columns${queryParams}`);
  // Simple table has stickyColumns: {first: 1, last: 1}
  const wrapper = createWrapper().findTable(`[data-test-id='${dataTestId}']`);
  const page = new StickyColumnsPage(browser);
  await page.waitForVisible(wrapper.findRows().toSelector());

  rowCount = await page.getElementsCount(wrapper.findRows().toSelector());
  columnCount = await page.getElementsCount(wrapper.findColumnHeaders().toSelector());

  return { page, wrapper };
}

test(
  'first and last columns are sticky',
  useBrowser(async browser => {
    const { wrapper } = await setupTest(browser);

    await checkStickyCells(browser, wrapper, 1, rowCount, true);
    await forEachColumnCell(wrapper, 1, async cellSelector => {
      const left = await browser.execute(getElementComputedStyle, cellSelector, 'left');
      await expect(left).toBe('0px');
    });
    await checkStickyCells(browser, wrapper, 2, rowCount, false);

    await checkStickyCells(browser, wrapper, columnCount - 1, rowCount, false);
    await forEachColumnCell(wrapper, columnCount, async cellSelector => {
      const right = await browser.execute(getElementComputedStyle, cellSelector, 'right');
      await expect(right).toBe('0px');
    });
    await checkStickyCells(browser, wrapper, columnCount, rowCount, true);
  })
);

test(
  'shadows are displayed correctly',
  useBrowser(async browser => {
    const { page, wrapper } = await setupTest(browser);

    // Before scroll there is no shadow on the first column
    await forEachColumnCell(wrapper, 1, async cellSelector => {
      const boxShadow = await browser.execute(getElementComputedStyle, cellSelector, 'boxShadow');
      await expect(boxShadow).toBe('none');
    });

    // Before scroll there is shadow on the last column
    await forEachColumnCell(wrapper, columnCount, async cellSelector => {
      const boxShadow = await browser.execute(getElementComputedStyle, cellSelector, 'boxShadow');
      await expect(boxShadow).not.toBe('none');
    });

    // Scroll to end of the wrapper container
    const scrollableWrapperContainer = wrapper.find(`.${styles.wrapper}`);
    await page.elementScrollTo(scrollableWrapperContainer.toSelector(), { left: 9999 });
    await page.waitForJsTimers();

    // Last column now has no shadow
    await forEachColumnCell(wrapper, columnCount, async cellSelector => {
      const boxShadow = await browser.execute(getElementComputedStyle, cellSelector, 'boxShadow');
      await expect(boxShadow).toBe('none');
    });

    // First column now has shadow
    await forEachColumnCell(wrapper, 1, async cellSelector => {
      const boxShadow = await browser.execute(getElementComputedStyle, cellSelector, 'boxShadow');
      await expect(boxShadow).not.toBe('none');
    });
  })
);

test(
  'padding gets applied to first column while stuck in VR',
  useBrowser(async browser => {
    // Simple table has stickyColumns: {first: 1, last: 1}
    const { page, wrapper } = await setupTest(browser, 'simple', '?visualRefresh=true');

    // First column cells have no padding-left
    await forEachColumnCell(wrapper, 1, async cellSelector => {
      const paddingLeft = await browser.execute(getElementComputedStyle, cellSelector, 'paddingLeft');
      await expect(paddingLeft).toBe('2px');
    });

    // Scroll the wrapper container
    const scrollableWrapperContainer = wrapper.find(`.${styles.wrapper}`);
    await page.elementScrollTo(scrollableWrapperContainer.toSelector(), { left: 200 });
    await page.waitForJsTimers();

    // First column cells now have padding-left added
    await forEachColumnCell(wrapper, 1, async cellSelector => {
      const paddingLeft = await browser.execute(getElementComputedStyle, cellSelector, 'paddingLeft');
      await expect(paddingLeft).toBe('20px');
    });
  })
);

test(
  'not enough space in viewport for feature to be enabled',
  useBrowser(async browser => {
    // Simple table has stickyColumns: {first: 1, last: 1}
    const { page, wrapper } = await setupTest(browser);

    await checkStickyCells(browser, wrapper, 1, rowCount, true);
    await checkStickyCells(browser, wrapper, columnCount, rowCount, true);

    await page.setWindowSize({ width: 500, height: 800 });

    await checkStickyCells(browser, wrapper, 1, rowCount, false);
    await checkStickyCells(browser, wrapper, columnCount, rowCount, false);
  })
);

test(
  'feature gets disabled after resizing columns to not allow enough scrollable space',
  useBrowser(async browser => {
    // Simple table has stickyColumns: {first: 1, last: 1}
    const { page, wrapper } = await setupTest(browser, 'resizable');
    await page.setWindowSize({ width: 1000, height: 800 });

    await checkStickyCells(browser, wrapper, 1, rowCount, true);
    await checkStickyCells(browser, wrapper, columnCount, rowCount, true);
    // Resizing column by 400px will make the remaining scrollable space in the table be lower
    // than our threshold (148px), therefore the feature gets disabled
    await page.resizeColumn(wrapper, 1, 400);
    await checkStickyCells(browser, wrapper, 1, rowCount, false);
    await checkStickyCells(browser, wrapper, columnCount, rowCount, false);
  })
);

test(
  'when table container is not scrollable, feature gets disabled',
  useBrowser(async browser => {
    // Simple table has stickyColumns: {first: 1, last: 1}
    const { page, wrapper } = await setupTest(browser, 'resizable');

    const scrollableWrapperContainer = wrapper.find(`.${styles.wrapper}`);
    let overflow = await hasHorizontalOverflow(browser, scrollableWrapperContainer.toSelector());
    expect(overflow).toBe(true);
    await checkStickyCells(browser, wrapper, 1, rowCount, true);
    await checkStickyCells(browser, wrapper, columnCount, rowCount, true);

    // Make page wide enough for the table not to be scrollablee
    await page.setWindowSize({ width: 2000, height: 800 });

    overflow = await hasHorizontalOverflow(browser, scrollableWrapperContainer.toSelector());
    expect(overflow).toBe(false);
    await checkStickyCells(browser, wrapper, 1, rowCount, false);
    await checkStickyCells(browser, wrapper, columnCount, rowCount, false);
  })
);

test(
  'when table container is not scrollable, feature gets disabled',
  useBrowser(async browser => {
    // Simple table has stickyColumns: {first: 1, last: 1}
    const { page, wrapper } = await setupTest(browser, 'resizable');

    const scrollableWrapperContainer = wrapper.find(`.${styles.wrapper}`);
    let overflow = await hasHorizontalOverflow(browser, scrollableWrapperContainer.toSelector());
    expect(overflow).toBe(true);
    await checkStickyCells(browser, wrapper, 1, rowCount, true);
    await checkStickyCells(browser, wrapper, columnCount, rowCount, true);

    // Make page wide enough for the table not to be scrollablee
    await page.setWindowSize({ width: 2000, height: 800 });

    overflow = await hasHorizontalOverflow(browser, scrollableWrapperContainer.toSelector());
    expect(overflow).toBe(false);
    await checkStickyCells(browser, wrapper, 1, rowCount, false);
    await checkStickyCells(browser, wrapper, columnCount, rowCount, false);
  })
);

test(
  'single selection cells are sticky',
  useBrowser(async browser => {
    const { wrapper } = await setupTest(browser, 'selection-single');

    await forEachColumnCell(wrapper, 1, async cellSelector => {
      const left = await browser.execute(getElementComputedStyle, cellSelector, 'left');
      const position = await browser.execute(getElementComputedStyle, cellSelector, 'position');
      await expect(position).toEqual('sticky');
      await expect(left).toBe('0px');
    });

    await forEachColumnCell(wrapper, 2, async cellSelector => {
      const left = await browser.execute(getElementComputedStyle, cellSelector, 'left');
      const position = await browser.execute(getElementComputedStyle, cellSelector, 'position');
      await expect(position).toEqual('sticky');
      await expect(left).toBe('40px');
    });
  })
);

test(
  'multi selection cells are sticky',
  useBrowser(async browser => {
    const { wrapper } = await setupTest(browser, 'selection-multi');

    await forEachColumnCell(wrapper, 1, async cellSelector => {
      const left = await browser.execute(getElementComputedStyle, cellSelector, 'left');
      const position = await browser.execute(getElementComputedStyle, cellSelector, 'position');
      await expect(position).toEqual('sticky');
      await expect(left).toBe('0px');
    });

    await forEachColumnCell(wrapper, 2, async cellSelector => {
      const left = await browser.execute(getElementComputedStyle, cellSelector, 'left');
      const position = await browser.execute(getElementComputedStyle, cellSelector, 'position');
      await expect(position).toEqual('sticky');
      await expect(left).toBe('40px');
    });
  })
);

test(
  'inline editing cells are sticky',
  useBrowser(async browser => {
    const { wrapper } = await setupTest(browser, 'inline-editing');
    await forEachColumnCell(wrapper, 1, async cellSelector => {
      const left = await browser.execute(getElementComputedStyle, cellSelector, 'left');
      const position = await browser.execute(getElementComputedStyle, cellSelector, 'position');
      await expect(position).toEqual('sticky');
      await expect(left).toBe('0px');
    });

    await forEachColumnCell(wrapper, columnCount, async cellSelector => {
      const right = await browser.execute(getElementComputedStyle, cellSelector, 'right');
      const position = await browser.execute(getElementComputedStyle, cellSelector, 'position');
      await expect(position).toEqual('sticky');
      await expect(right).toBe('0px');
    });
  })
);

test(
  'focusable element is not hidden by the sticky columns',
  useBrowser(async browser => {
    const isStickyCellOverlapping = async () => {
      const stickyCellRect = await browser.execute(
        getElementBoundingClientRect,
        wrapper.findBodyCell(1, 12).toSelector()
      );
      const focusedCellRect = await browser.execute(
        getElementBoundingClientRect,
        wrapper.findBodyCell(1, 11).toSelector()
      );
      return stickyCellRect.left < focusedCellRect.right;
    };

    const { page, wrapper } = await setupTest(browser, 'focusable-element');
    await page.setWindowSize({ width: 2560, height: 800 });

    await page.click(`[data-test-id='focusable-element'] h2`);

    // It should be overlapping
    expect(await isStickyCellOverlapping()).toBe(true);

    // Tab to focus first link
    await page.keys(['Tab', 'Tab']);
    await page.waitForJsTimers();

    // Ensure correct cell is focused
    const focusedText = await page.getFocusedElementText();
    await expect(focusedText).toBe('Link: This is the first item');
    const focusedCellSelector = wrapper.findBodyCell(1, 11).toSelector() + ' a';
    const isFocused = await page.isFocused(focusedCellSelector);
    await expect(isFocused).toBe(true);

    // Check that is not overlapping
    expect(await isStickyCellOverlapping()).toBe(false);
  })
);
