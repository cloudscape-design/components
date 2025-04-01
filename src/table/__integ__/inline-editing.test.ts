// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import range from 'lodash/range';

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

import styles from '../../../lib/components/table/body-cell/styles.selectors.js';

// $ = selector

const distributionIdRow1 = [1, 1] as const;
const distributionIdRow2 = [2, 1] as const; // Disabled
const domainNameRow1 = [1, 2] as const;
const domainNameRow2 = [2, 2] as const;
const tslVersionRow4 = [4, 5] as const;

const tableWrapper = createWrapper().findTable();
const cellSaveButton$ = tableWrapper.findEditingCellSaveButton().toSelector();
const liveRegion$ = createWrapper().findLiveRegion().toSelector();

function cell$(rowIndex: number, columnIndex: number) {
  return tableWrapper.findBodyCell(rowIndex, columnIndex).toSelector();
}
function cellEditButton$(rowIndex: number, columnIndex: number) {
  return tableWrapper.findEditCellButton(rowIndex, columnIndex).toSelector();
}
function cellExpandToggle$(rowIndex: number) {
  return tableWrapper.findExpandToggle(rowIndex).toSelector();
}
function cellError$(rowIndex: number, columnIndex: number) {
  return tableWrapper.findBodyCell(rowIndex, columnIndex).findFormField().findError().toSelector();
}
function cellInput$(rowIndex: number, columnIndex: number) {
  return tableWrapper.findBodyCell(rowIndex, columnIndex).findFormField().find('input').toSelector();
}
function cellSuccessIcon$(rowIndex: number, columnIndex: number) {
  return tableWrapper.findBodyCell(rowIndex, columnIndex).findByClassName(styles['body-cell-success']).toSelector();
}

interface TestOptions {
  enableKeyboardNavigation?: boolean;
  expandableRows?: boolean;
}

const setupTest = (
  { enableKeyboardNavigation = false, expandableRows = false }: TestOptions,
  testFn: (page: BasePageObject) => Promise<void>
) => {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await page.setWindowSize({ width: 1200, height: 800 });
    const query = new URLSearchParams({
      enableKeyboardNavigation: String(enableKeyboardNavigation),
      expandableRows: String(expandableRows),
    });
    await browser.url(`#/light/table/editable?${query.toString()}`);
    await testFn(page);
  });
};

test(
  'input field is displayed when click on editable cell',
  setupTest({ expandableRows: false }, async page => {
    const value = await page.getText(cell$(...distributionIdRow1));
    await expect(page.isDisplayed(cellExpandToggle$(distributionIdRow1[0]))).resolves.toBe(false);
    await page.click(cell$(...distributionIdRow1));
    await expect(page.getValue(cellInput$(...distributionIdRow1))).resolves.toBe(value);
    await expect(page.isDisplayed(cellSaveButton$)).resolves.toBe(true);
  })
);

test(
  'input field is displayed when click on cell edit button inside expandable column',
  setupTest({ expandableRows: true }, async page => {
    const value = await page.getText(cell$(...distributionIdRow1));
    await expect(page.isDisplayed(cellExpandToggle$(distributionIdRow1[0]))).resolves.toBe(true);
    await page.click(cellEditButton$(...distributionIdRow1));
    await expect(page.getValue(cellInput$(...distributionIdRow1))).resolves.toBe(value);
    await expect(page.isDisplayed(cellSaveButton$)).resolves.toBe(true);
  })
);

test(
  'disabled reason is displayed when click on disabled editable cell',
  setupTest({ expandableRows: false }, async page => {
    await expect(page.isDisplayed(cellExpandToggle$(distributionIdRow1[0]))).resolves.toBe(false);

    // Click on cell with disabled inline edit
    await page.click(cell$(...distributionIdRow2));
    await expect(page.getText(liveRegion$)).resolves.toContain("You don't have the necessary permissions");

    // Dismiss with click outside
    await page.click('[data-testid="focus"]');
    await expect(page.getElementsCount(liveRegion$)).resolves.toBe(0);
  })
);

test(
  'disabled reason is displayed when click on disabled edit button inside expandable column',
  setupTest({ expandableRows: true }, async page => {
    await expect(page.isDisplayed(cellExpandToggle$(distributionIdRow1[0]))).resolves.toBe(true);

    // Click on cell with disabled inline edit
    await page.click(cellEditButton$(...distributionIdRow2));
    await expect(page.getText(liveRegion$)).resolves.toContain("You don't have the necessary permissions");

    // Dismiss with click outside
    await page.click('[data-testid="focus"]');
    await expect(page.getElementsCount(liveRegion$)).resolves.toBe(0);
  })
);

test(
  'errorText is displayed when input field is invalid',
  setupTest({}, async page => {
    await page.click(cell$(...domainNameRow2));
    await page.setValue(cellInput$(...domainNameRow2), 'xyz .com'); // space is not allowed
    await expect(page.getText(cellError$(...domainNameRow2))).resolves.toBe('Must be a valid domain name');
    await expect(page.isDisplayed(cellSaveButton$)).resolves.toBe(true);
  })
);

test(
  'click focusable element outside when editing cancels editing and focuses clicked element',
  setupTest({}, async page => {
    // Edit a cell
    await page.click(cellEditButton$(...domainNameRow2));
    await expect(page.isFocused(cellInput$(...domainNameRow2))).resolves.toBe(true);

    // Click on the input element outside, it should get focused.
    await page.click('[data-testid="focus"]');
    await expect(page.isFocused('[data-testid="focus"]')).resolves.toBe(true);
  })
);

describe.each([false, true])('enableKeyboardNavigation=%s', enableKeyboardNavigation => {
  test(
    'after edit is submitted, cell is focused, success icon is displayed and aria live region is rendered [enableKeyboardNavigation=%s]',
    setupTest({ enableKeyboardNavigation }, async page => {
      await page.click(cell$(...domainNameRow2));
      await page.click(cellSaveButton$);

      await expect(page.isFocused(cellEditButton$(...domainNameRow2))).resolves.toBe(true);
      await expect(page.isDisplayed(cellSuccessIcon$(...domainNameRow2))).resolves.toBe(true);
      await expect(page.getElementProperty(liveRegion$, 'textContent')).resolves.toBe('Edit successful');
    })
  );

  test.each([
    { expandableRows: false, key: 'Enter' },
    { expandableRows: false, key: 'Space' },
    { expandableRows: true, key: 'Enter' },
    { expandableRows: true, key: 'Space' },
  ])('can start editing with $key key, expandableRows=$expandableRows', async ({ expandableRows, key }) => {
    await setupTest({ enableKeyboardNavigation, expandableRows }, async page => {
      // Focus element before the table
      await page.click('[data-testid="focus"]');

      // Navigate to the target cell
      if (enableKeyboardNavigation) {
        await page.keys(['Tab', 'Tab']);
        await page.keys(['ArrowDown', 'ArrowRight']);
      } else {
        await page.keys(range(12).map(() => 'Tab'));
      }
      const targetRow = (expandableRows ? distributionIdRow1 : domainNameRow1) as [number, number];
      await expect(page.isFocused(cellEditButton$(...targetRow))).resolves.toBe(true);

      // Activate with given key
      await page.keys([key]);
      await expect(page.isDisplayed(cellSaveButton$)).resolves.toBe(true);
    })();
  });

  test(
    'cell focus is moved when arrow keys are pressed',
    setupTest({ enableKeyboardNavigation }, async page => {
      await page.click(cell$(...tslVersionRow4));
      await page.click(cellSaveButton$);
      await page.keys(['ArrowRight']);
      await expect(page.isFocused(cellEditButton$(tslVersionRow4[0], tslVersionRow4[1] + 1))).resolves.toBe(true);
      await page.keys(['ArrowLeft', 'ArrowLeft']);
      await expect(page.isFocused(cellEditButton$(tslVersionRow4[0], tslVersionRow4[1] - 1))).resolves.toBe(true);
      await page.keys(['ArrowRight', 'ArrowUp']);
      await expect(page.isFocused(cellEditButton$(tslVersionRow4[0] - 1, tslVersionRow4[1]))).resolves.toBe(true);
      await page.keys(['ArrowDown', 'ArrowDown']);
      await expect(page.isFocused(cellEditButton$(tslVersionRow4[0] + 1, tslVersionRow4[1]))).resolves.toBe(true);
    })
  );

  test(
    'input is focused when the edit operation failed',
    setupTest({ enableKeyboardNavigation }, async page => {
      await page.click(cell$(...domainNameRow2));

      // "inline" is a special keyword that causes a server-side error
      await page.setValue(cellInput$(...domainNameRow2), 'inline');
      await page.keys('Enter');

      // after loading, the focus should be back on the input
      await page.waitForAssertion(() => expect(page.isFocused(cellInput$(...domainNameRow2))).resolves.toBe(true));
    })
  );

  test(
    'can activate disabled reason popover with keyboard',
    setupTest({ enableKeyboardNavigation }, async page => {
      // Navigate to a disabled cell
      await page.click(cell$(...tslVersionRow4));
      await page.click(cellSaveButton$);
      await page.keys(['ArrowLeft']);

      // Activate the popover with Enter
      await page.keys(['Enter']);
      await expect(page.getText(liveRegion$)).resolves.toContain("You don't have the necessary permissions");

      // Dismiss popover
      await page.keys(['Escape']);
      await expect(page.getElementsCount(liveRegion$)).resolves.toBe(0);
    })
  );
});
