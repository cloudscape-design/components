// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';
import styles from '../../../lib/components/table/styles.selectors.js';
import scrollbarStyles from '../../../lib/components/table/sticky-scrollbar/styles.selectors.js';

declare global {
  interface Window {
    __columnWidths: readonly number[];
  }
}

const scrollbarSelector = `.${scrollbarStyles['sticky-scrollbar-visible']}`;
const wrapper = createWrapper();
const tableWrapper = wrapper.findTable();
// All the columns fit in the viewport, which make it easier to test the columns' widths
const defaultScreen = { width: 1680, height: 800 };
const prepareCoordinate = (num: number) => Math.round(num);

class TablePage extends BasePageObject {
  async resizeColumn(columnIndex: number, xOffset: number) {
    const resizerSelector = tableWrapper.findColumnResizer(columnIndex).toSelector();
    await this.dragAndDrop(resizerSelector, xOffset);
  }

  async toggleColumn(columnId: string) {
    await this.click(wrapper.findCheckbox(`#toggle-${columnId}`).findNativeInput().toSelector());
  }

  async toggleStickyHeader() {
    await this.click(wrapper.findCheckbox('#sticky-header-toggle').findLabel().toSelector());
  }

  async toggleResizableColumns() {
    await this.click(wrapper.findCheckbox('#resizable-columns-toggle').findLabel().toSelector());
  }

  async getHeaderTopOffset() {
    const { top } = await this.getBoundingBox(tableWrapper.findHeaderSlot().toSelector());
    return top;
  }

  async getColumnWidth(columnIndex: number) {
    const columnSelector = tableWrapper.findColumnHeaders().get(columnIndex).toSelector();
    const element = await this.browser.$(columnSelector);
    const size = await element.getSize();
    return size.width;
  }

  // Returns column width communicated with onColumnWidthsChange
  readTableWidth(columnIndex: number) {
    return this.browser.execute(columnIndex => window.__columnWidths[columnIndex - 1], columnIndex);
  }

  async getColumnStyle(columnIndex: number) {
    const columnSelector = tableWrapper.findColumnHeaders().get(columnIndex).toSelector();
    const element = await this.browser.$(columnSelector);
    return element.getAttribute('style');
  }

  getFirstTableHeaderWidths() {
    return this.browser.execute(() => {
      const tables = document.querySelectorAll('table');
      return Array.from(tables[0].querySelectorAll('th')).map(el => el.offsetWidth);
    });
  }

  getLastTableHeaderWidths() {
    return this.browser.execute(() => {
      const tables = document.querySelectorAll('table');
      return Array.from(tables[tables.length - 1].querySelectorAll('th')).map(el => el.offsetWidth);
    });
  }

  async getColumnMinWidth(columnIndex: number) {
    const columnSelector = tableWrapper
      // use internal CSS-selector to always receive the real table header and not a sticky copy
      .find(`.${styles.wrapper} table`)
      .findAll('thead > tr > *')
      .get(columnIndex)
      .toSelector();
    const element = await this.browser.$(columnSelector);
    const { value = '' } = await element.getCSSProperty('min-width');
    return parseInt(value, 10);
  }

  async resizeBeyondTableWidth(columnIndex: number) {
    const resizerSelector = tableWrapper.findColumnResizer(columnIndex).toSelector();
    const resizerBox = await this.getBoundingBox(resizerSelector);
    const { width: windowWidth } = await this.browser.getWindowSize();
    await this.browser.performActions([
      {
        type: 'pointer',
        id: 'mouse',
        parameters: { pointerType: 'mouse' },
        actions: [
          // hover over resizer
          {
            type: 'pointerMove',
            duration: 0,
            x: prepareCoordinate(resizerBox.left),
            y: prepareCoordinate(resizerBox.top),
          },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 30 },
          // move cursor to screen edge to activate auto-growing behavior
          { type: 'pointerMove', duration: 0, x: windowWidth, y: 0 },
          // pause to let resizing interval fire a few times
          { type: 'pause', duration: 500 },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);
  }

  async assertColumnWidth(columnIndex: number, expected: number) {
    await this.browser.waitUntil(async () => (await this.getColumnWidth(columnIndex)) === expected, {
      timeout: 1000,
      timeoutMsg: `Column at index "${columnIndex}" should have width "${expected}"`,
    });
  }
}

interface PageConfig {
  stickyHeader?: boolean;
  withColumnIds?: boolean;
  withSelection?: boolean;
}

const setupTest = (testFn: (page: TablePage) => Promise<void>, config?: PageConfig) => {
  return useBrowser({ ...defaultScreen }, async browser => {
    const page = new TablePage(browser);
    const params = new URLSearchParams({
      visualRefresh: 'false',
      stickyHeader: config?.stickyHeader !== undefined ? String(config.stickyHeader) : 'false',
      withColumnIds: config?.withColumnIds !== undefined ? String(config.withColumnIds) : 'true',
      withSelection: config?.withSelection !== undefined ? String(config.withSelection) : 'false',
    }).toString();
    await browser.url(`#/light/table/resizable-columns?${params}`);
    await page.waitForVisible(tableWrapper.findBodyCell(2, 1).toSelector());
    await testFn(page);
  });
};

describe.each([true, false])('StickyHeader=%s', sticky => {
  function setupStickyTest(testFn: (page: TablePage) => Promise<void>, config?: PageConfig) {
    return setupTest(async page => {
      if (sticky) {
        await page.toggleStickyHeader();
        await page.windowScrollTo({ top: 400 });
        await expect(page.getHeaderTopOffset()).resolves.toEqual(0);
      }
      await testFn(page);
    }, config);
  }

  test(
    'should expand and shrink a column correctly',
    setupStickyTest(async page => {
      const delta = 50;
      let prevWidth = await page.getColumnWidth(2);
      await page.resizeColumn(2, delta);
      let width = await page.getColumnWidth(2);
      expect(width).toBe(prevWidth + delta);
      prevWidth = width;
      await page.resizeColumn(2, -delta);
      width = await page.getColumnWidth(2);
      expect(width).toBe(prevWidth - delta);
    })
  );

  test(
    'should not shrink a column less than its min-width',
    setupStickyTest(async page => {
      const minWidth = await page.getColumnMinWidth(2);
      await page.resizeColumn(2, -200);
      const width = await page.getColumnWidth(2);
      expect(minWidth).toBe(width);
    })
  );

  test(
    'should expand automatically when the cursor stops outside of the table container',
    setupStickyTest(async page => {
      const columnSelector = tableWrapper.findColumnHeaders().get(4).toSelector();
      const { left: originalLeft } = await page.getBoundingBox(columnSelector);
      await page.resizeBeyondTableWidth(4);
      const { left: newLeft } = await page.getBoundingBox(columnSelector);
      expect(newLeft).toBeLessThan(originalLeft);
    })
  );

  test(
    'should expand the last column after hiding a column',
    setupStickyTest(async page => {
      const columnToHideWidth = await page.getColumnWidth(1);
      const oldLastColumnWidth = await page.getColumnWidth(4);
      await page.toggleColumn('name');
      const newLastColumnWidth = await page.getColumnWidth(3);
      expect(newLastColumnWidth).toBe(oldLastColumnWidth + columnToHideWidth);
    })
  );

  // The page width of 620px is an empirical value defined for the respective test page in VR
  // so that the container width is slightly less than the table width (a sum of the column widths).
  // In that case we expect the container to be scrollable and no auto-width set for the last column.
  test(
    'should set explicit width for the last column when table width exceeds container width',
    useBrowser({ width: 620, height: 1000 }, async browser => {
      const page = new TablePage(browser);
      await browser.url('#/light/table/resizable-columns?visualRefresh=true');
      await page.waitForVisible(tableWrapper.findBodyCell(2, 1).toSelector());

      await expect(page.getColumnStyle(4)).resolves.toContain('width: 120px;');
    })
  );

  test(
    'should set explicit width for the last column when full-page table width exceeds container width',
    useBrowser({ width: 600, height: 1000 }, async browser => {
      const page = new TablePage(browser);
      await browser.url('#/light/table/resizable-columns?visualRefresh=true&fullPage=true');
      await page.waitForVisible(tableWrapper.findBodyCell(2, 1).toSelector());

      await expect(page.getColumnStyle(4)).resolves.toContain('width: 120px;');
    })
  );

  test(
    'should shrink the last column after revealing a column',
    setupStickyTest(async page => {
      const nameColumnWidth = await page.getColumnWidth(1);
      await page.toggleColumn('name');
      const prevLastColumnWidth = await page.getColumnWidth(3);
      await page.toggleColumn('name');
      const newLastColumnWidth = await page.getColumnWidth(4);
      expect(newLastColumnWidth).toBe(prevLastColumnWidth - nameColumnWidth);
    })
  );

  test(
    'should expand the last column when the container is resized outwards',
    setupStickyTest(async page => {
      const prevDateColumnWidth = await page.getColumnWidth(4);
      await page.setWindowSize({ ...defaultScreen, width: defaultScreen.width + 200 });
      const dateColumnWidth = await page.getColumnWidth(4);
      expect(dateColumnWidth).toBeGreaterThan(prevDateColumnWidth);
    })
  );

  test(
    'should compress the last column when the container is resized inwards',
    setupStickyTest(async page => {
      const prevDateColumnWidth = await page.getColumnWidth(4);
      await page.setWindowSize({ ...defaultScreen, width: defaultScreen.width - 200 });
      const dateColumnWidth = await page.getColumnWidth(4);
      expect(dateColumnWidth).toBeLessThan(prevDateColumnWidth);
    })
  );

  test(
    'should correctly reveal the last column that was hidden by default',
    setupStickyTest(async page => {
      await page.toggleColumn('extra');
      expect(await page.getColumnWidth(5)).toBeGreaterThan(100);
    })
  );
});

describe('sticky header sync', () => {
  test.each([1680, 620])('sticky and real column headers must have identical widths for screen width %s', width =>
    setupTest(
      async page => {
        await page.setWindowSize({ ...defaultScreen, width });
        const stickyHeaderWidths = await page.getFirstTableHeaderWidths();
        const realHeaderWidths = await page.getLastTableHeaderWidths();
        expect(stickyHeaderWidths).toEqual(realHeaderWidths);
      },
      { stickyHeader: true }
    )()
  );

  test.each([false, true])(
    'sticky and real column headers must have identical widths when column ids = %s',
    withColumnIds =>
      setupTest(
        async page => {
          const stickyHeaderWidths = await page.getFirstTableHeaderWidths();
          const realHeaderWidths = await page.getLastTableHeaderWidths();
          expect(stickyHeaderWidths).toEqual(realHeaderWidths);
        },
        { stickyHeader: true, withColumnIds }
      )()
  );

  test.each([false, true])(
    'sticky and real column headers must have identical widths when selection = %s',
    withSelection =>
      setupTest(
        async page => {
          const stickyHeaderWidths = await page.getFirstTableHeaderWidths();
          const realHeaderWidths = await page.getLastTableHeaderWidths();
          expect(stickyHeaderWidths).toEqual(realHeaderWidths);
        },
        { stickyHeader: true, withSelection }
      )()
  );
});

test(
  'should show and hide scrollbar',
  setupTest(async page => {
    await expect(page.isExisting(tableWrapper.find(scrollbarSelector).toSelector())).resolves.toEqual(false);
    await page.resizeColumn(3, 500);
    await page.resizeColumn(2, 1000);
    await page.waitForVisible(tableWrapper.find(scrollbarSelector).toSelector());
    await expect(page.isExisting(tableWrapper.find(scrollbarSelector).toSelector())).resolves.toEqual(true);
  })
);

test(
  'should sync sticky and non-sticky column widths',
  setupTest(async page => {
    await page.toggleResizableColumns();
    const prevWidth = await page.getColumnWidth(1);
    await page.toggleStickyHeader();
    const newWidth = await page.getColumnWidth(1);
    expect(newWidth).toEqual(prevWidth);
  })
);

test(
  'should recover column widths when the inner state is reset',
  setupTest(async page => {
    await page.resizeColumn(2, 100);
    const oldWidth = await page.getColumnWidth(2);
    await page.click('#reset-state');
    const newWidth = await page.getColumnWidth(2);
    expect(oldWidth).toEqual(newWidth);
  })
);

test(
  'should resize column to grow by keyboard',
  setupTest(async page => {
    await page.click('#reset-state');
    const originalWidth = await page.getColumnWidth(1);
    await page.keys(['Tab']);
    // wait for the resizer to attach handler

    await page.keys(['Enter', 'ArrowRight', 'ArrowRight', 'Enter']);
    await page.assertColumnWidth(1, originalWidth + 20);
    await expect(page.readTableWidth(1)).resolves.toEqual(originalWidth + 20);

    await page.keys(['Space', 'ArrowLeft', 'Space']);
    await page.assertColumnWidth(1, originalWidth + 10);
    await expect(page.readTableWidth(1)).resolves.toEqual(originalWidth + 10);

    await page.keys(['Enter', 'ArrowRight', 'Escape']);
    await page.assertColumnWidth(1, originalWidth + 20);
    await expect(page.readTableWidth(1)).resolves.toEqual(originalWidth + 20);
  })
);
