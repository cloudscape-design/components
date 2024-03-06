// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';

const tableWrapper = createWrapper().findTable();
const inputSelector = tableWrapper.findTextFilter().findInput().toSelector();

class TablePage extends BasePageObject {
  // page.keys(['Shift', 'Space', 'Shift']) triggers onKeyUp for Shift before Space is pressed
  // therefore using performActions to run desired behavior
  async selectWithShiftSpace() {
    await this.browser.performActions([
      {
        type: 'key',
        id: 'keyboard',
        actions: [
          { type: 'keyDown', value: '\uE050' }, //shift
          { type: 'keyDown', value: '\uE00D' }, //space
          { type: 'keyUp', value: '\uE00D' }, //space
          { type: 'keyUp', value: '\uE050' }, //shift
        ],
      },
    ]);
  }

  async selectWithShiftClick(index: number) {
    const { top, left, width: size } = await this.getBoundingBox(tableWrapper.findRowSelectionArea(index).toSelector());
    // rounding is necessary, because webdriver only accepts `int` values
    const x = Math.round(left + size / 2);
    const y = Math.round(top + size / 2);
    await this.browser.performActions([
      {
        type: 'key',
        id: 'keyboard1',
        actions: [
          { type: 'keyDown', value: '\uE050' }, //shift
        ],
      },
      {
        type: 'pointer',
        id: 'mouse',
        parameters: { pointerType: 'mouse' },
        actions: [
          { type: 'pointerMove', duration: 0, x, y },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerUp', button: 0 },
        ],
      },
      {
        type: 'key',
        id: 'keyboard2',
        actions: [
          { type: 'keyUp', value: '\uE050' }, //shift
        ],
      },
    ]);
  }
  async toggleRow(index: number) {
    await this.click(tableWrapper.findRowSelectionArea(index).toSelector());
  }
  countSelected() {
    return this.getElementsCount(tableWrapper.findSelectedRows().toSelector());
  }
}

interface TestOptions {
  enableKeyboardNavigation?: boolean;
}

describe('Shift selection', () => {
  const setupTest = ({ enableKeyboardNavigation }: TestOptions, testFn: (page: TablePage) => Promise<void>) => {
    return useBrowser(async browser => {
      const page = new TablePage(browser);
      const query = new URLSearchParams({ enableKeyboardNavigation: String(enableKeyboardNavigation) });
      await browser.url(`#/light/table/shift-selection?${query.toString()}`);
      await page.waitForVisible(tableWrapper.findBodyCell(2, 1).toSelector());
      await testFn(page);
    });
  };
  describe('selection', () => {
    test.each([false, true])('selects a batch of items [enableKeyboardNavigation=%s]', enableKeyboardNavigation => {
      setupTest({ enableKeyboardNavigation }, async page => {
        await page.toggleRow(1);
        await page.keys(['ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowDown']);
        await page.selectWithShiftSpace();
        await expect(page.countSelected()).resolves.toBe(6);
      });
    });
    test.each([false, true])('deselects a batch of items [enableKeyboardNavigation=%s]', enableKeyboardNavigation => {
      setupTest({ enableKeyboardNavigation }, async page => {
        await page.toggleRow(1);
        await page.keys(['ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowDown']);
        await page.selectWithShiftSpace();
        await page.keys(['ArrowUp', 'ArrowUp', 'ArrowUp']);
        await page.selectWithShiftSpace();
        await expect(page.countSelected()).resolves.toBe(2);
      });
    });
    test(
      'selects a batch of items with a mouse click',
      setupTest({}, async page => {
        await page.toggleRow(1);
        await page.selectWithShiftClick(8);
        await expect(page.countSelected()).resolves.toBe(8);
      })
    );
    test.each([false, true])(
      'focuses "all" checkbox with keyboard [enableKeyboardNavigation=%s]',
      enableKeyboardNavigation => {
        setupTest({ enableKeyboardNavigation }, async page => {
          await page.toggleRow(1);
          await page.keys(['ArrowUp', 'ArrowDown']);
          await page.keys(['Space']);
          await expect(page.countSelected()).resolves.toBe(0);
        });
      }
    );
    test(
      'forgets last selected item when moving to the next page',
      setupTest({}, async page => {
        await page.toggleRow(5);
        await expect(page.countSelected()).resolves.toBe(1);
        await page.click(tableWrapper.findPagination().findNextPageButton().toSelector());
        await expect(page.countSelected()).resolves.toBe(0);
        await page.selectWithShiftClick(8);
        await expect(page.countSelected()).resolves.toBe(1);
      })
    );
    test(
      'ignores last selected item when filtering and previously clicked item is no longer visible',
      setupTest({}, async page => {
        await page.toggleRow(1);
        await expect(page.countSelected()).resolves.toBe(1);
        await page.click(inputSelector);
        await page.keys(['2', '-', '2', '2', '-']);
        await expect(page.countSelected()).resolves.toBe(0);
        await page.selectWithShiftClick(5);
        await expect(page.countSelected()).resolves.toBe(1);
      })
    );
    test(
      'ignores last selected item when sorting and previously clicked item is no longer visible',
      setupTest({}, async page => {
        await page.toggleRow(1);
        await expect(page.countSelected()).resolves.toBe(1);
        await page.click(tableWrapper.findColumnHeaders().get(2).toSelector());
        await expect(page.countSelected()).resolves.toBe(0);
        await page.selectWithShiftClick(8);
        await expect(page.countSelected()).resolves.toBe(1);
      })
    );
  });
});
