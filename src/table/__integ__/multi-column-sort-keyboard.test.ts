// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const tableWrapper = createWrapper().findTable();

// Columns on the multi-column-sort dev page, in order: 1=Name, 2=Type, 3=State, 4=CPU %.
const sortControl = (colIndex: number) => tableWrapper.findColumnSortingArea(colIndex).toSelector();
// The per-column sort menu renders a single <button> trigger in the header cell (the sort control
// itself is a role="button" div, not a <button>), so this uniquely targets the sort menu trigger.
const sortMenuTrigger = (colIndex: number) =>
  tableWrapper.find(`th[data-column-index="${colIndex}"] button`).toSelector();
const bodyCell = (rowIndex: number, colIndex: number) => tableWrapper.findBodyCell(rowIndex, colIndex).toSelector();
const sortPriorityBadge = (colIndex: number) => tableWrapper.findColumnSortPriorityBadge(colIndex).toSelector();
// The sort menu opts into expandToViewport, so the open dropdown is portaled to the body and matched globally.
const openSortMenu = (colIndex: number) => tableWrapper.findColumnSortMenu(colIndex).findOpenDropdown().toSelector();

// The page renders seven settings checkboxes, then (because a multi-column sort is active) an
// auto-rendered "Clear sort" tools button, ahead of the table. The grid then exposes a single tab
// stop (grid navigation), so nine Tabs enter the grid on the first column's sort control.
const TABS_INTO_GRID = ['Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab'];

// Shift+click is issued through performActions (not page.click) so the Shift modifier is held for the
// whole pointer press; this mirrors the shift-selection.test.ts idiom.
class MultiColumnSortPage extends BasePageObject {
  async shiftClick(selector: string) {
    const { top, left, width, height } = await this.getBoundingBox(selector);
    // webdriver pointer coordinates must be integers.
    const x = Math.round(left + width / 2);
    const y = Math.round(top + height / 2);
    await this.browser.performActions([
      {
        type: 'key',
        id: 'keyboard1',
        actions: [{ type: 'keyDown', value: '\uE050' }], // shift
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
        actions: [{ type: 'keyUp', value: '\uE050' }], // shift
      },
    ]);
  }
}

const setupTest = (testFn: (page: MultiColumnSortPage) => Promise<void>) =>
  useBrowser({ width: 1200, height: 800 }, async browser => {
    const page = new MultiColumnSortPage(browser);
    await browser.url('#/light/table/multi-column-sort?keyboardNav=true');
    await page.waitForVisible(tableWrapper.toSelector());
    await testFn(page);
  });

test(
  'tabbing into the grid lands on the first column sort control as the single tab stop',
  setupTest(async page => {
    await page.click('h1');
    await page.keys(TABS_INTO_GRID);
    await expect(page.isFocused(sortControl(1))).resolves.toBe(true);

    // Grid navigation is a single tab stop, so the next Tab leaves the table entirely.
    await page.keys('Tab');
    await expect(page.isFocused(sortControl(1))).resolves.toBe(false);
  })
);

test(
  'left/right arrows traverse each column sort control and its sort menu across the header row',
  setupTest(async page => {
    await page.click('h1');
    await page.keys(TABS_INTO_GRID);
    await expect(page.isFocused(sortControl(1))).resolves.toBe(true);

    // Each sortable header cell exposes two focusables in order: the sort control, then its sort menu.
    await page.keys('ArrowRight');
    await expect(page.isFocused(sortMenuTrigger(1))).resolves.toBe(true);

    await page.keys('ArrowRight');
    await expect(page.isFocused(sortControl(2))).resolves.toBe(true);

    await page.keys('ArrowRight');
    await expect(page.isFocused(sortMenuTrigger(2))).resolves.toBe(true);

    // Moving left re-enters the previous cell from its last focusable (the sort menu), then its control.
    await page.keys('ArrowLeft');
    await expect(page.isFocused(sortControl(2))).resolves.toBe(true);

    await page.keys('ArrowLeft');
    await expect(page.isFocused(sortMenuTrigger(1))).resolves.toBe(true);

    await page.keys('ArrowLeft');
    await expect(page.isFocused(sortControl(1))).resolves.toBe(true);
  })
);

test(
  'down/up arrows move focus between the header sort control and the first body row cell',
  setupTest(async page => {
    await page.click('h1');
    await page.keys(TABS_INTO_GRID);
    await expect(page.isFocused(sortControl(1))).resolves.toBe(true);

    await page.keys('ArrowDown');
    await expect(page.isFocused(bodyCell(1, 1))).resolves.toBe(true);

    await page.keys('ArrowUp');
    await expect(page.isFocused(sortControl(1))).resolves.toBe(true);
  })
);

test(
  'down arrow on a column sort menu trigger opens its dropdown instead of moving into a body cell',
  setupTest(async page => {
    await page.click('h1');
    await page.keys(TABS_INTO_GRID);

    // Step past the sort control onto its sort menu trigger.
    await page.keys('ArrowRight');
    await expect(page.isFocused(sortMenuTrigger(1))).resolves.toBe(true);

    await page.keys('ArrowDown');

    // ArrowDown is consumed by the sort menu, which opens its dropdown...
    await expect(page.isExisting(openSortMenu(1))).resolves.toBe(true);
    // ...rather than grid navigation moving focus down into the first body cell.
    await expect(page.isFocused(bodyCell(1, 1))).resolves.toBe(false);
  })
);

test(
  'shift-click on an unsorted column appends it to the existing multi-column sort',
  setupTest(async page => {
    // The page starts with a two-column sort: State (column 3) then CPU % (column 4). Both carry a
    // priority badge; the unsorted Name column (column 1) does not.
    await expect(page.isExisting(sortPriorityBadge(3))).resolves.toBe(true);
    await expect(page.isExisting(sortPriorityBadge(4))).resolves.toBe(true);
    await expect(page.isExisting(sortPriorityBadge(1))).resolves.toBe(false);

    // Shift-click the Name column's sort control to add it as a further sort column.
    await page.shiftClick(sortControl(1));

    // The clicked column now participates and the pre-existing State/CPU % sort is retained, so all
    // three columns show a priority badge -- confirming shift-click appended rather than replaced.
    await expect(page.isExisting(sortPriorityBadge(1))).resolves.toBe(true);
    await expect(page.isExisting(sortPriorityBadge(3))).resolves.toBe(true);
    await expect(page.isExisting(sortPriorityBadge(4))).resolves.toBe(true);
  })
);
