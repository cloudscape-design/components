// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import range from 'lodash/range';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import styles from '../../../lib/components/table/body-cell/styles.selectors.js';

const DOMAIN_ERROR = 'Must be a valid domain name';
const tableWrapper = createWrapper().findTable()!;

// $ = selector

const bodyCell = tableWrapper.findBodyCell(2, 2)!;
const cellRoot$ = bodyCell.toSelector();
const cellInputField$ = bodyCell.findFormField().find('input').toSelector();
const cellEditButton$ = tableWrapper.findEditCellButton(2, 2).toSelector();
const cellSaveButton = tableWrapper.findEditingCellSaveButton();
const successIcon$ = bodyCell.findByClassName(styles['body-cell-success']).toSelector();
const ariaLiveAnnouncement$ = bodyCell.find(`[aria-live="polite"]`).toSelector();

// for arrow key navigation
const mainCell = tableWrapper.findBodyCell(4, 5);
const mainCell$ = mainCell.toSelector();
const leftCell$ = tableWrapper.findEditCellButton(4, 4).toSelector();
const rightCell$ = tableWrapper.findEditCellButton(4, 6).toSelector();
const cellAbove$ = tableWrapper.findEditCellButton(3, 5).toSelector();
const cellBelow$ = tableWrapper.findEditCellButton(5, 5).toSelector();

const bodyCellError = bodyCell.findFormField().findError().toSelector();

interface TestOptions {
  enableKeyboardNavigation?: boolean;
}

const setupTest = (
  { enableKeyboardNavigation = false }: TestOptions,
  testFn: (page: BasePageObject) => Promise<void>
) => {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await page.setWindowSize({ width: 1200, height: 800 });
    const query = new URLSearchParams({ enableKeyboardNavigation: String(enableKeyboardNavigation) });
    await browser.url(`#/light/table/editable?${query.toString()}`);
    await testFn(page);
  });
};

test(
  'input field is displayed when editable cell is clicked',
  setupTest({}, async page => {
    const value = await page.getText(cellRoot$);
    await page.click(cellRoot$);
    await expect(page.getValue(cellInputField$)).resolves.toBe(value);
  })
);

test(
  'errorText is displayed when input field is invalid',
  setupTest({}, async page => {
    await page.click(cellRoot$);
    await page.setValue(cellInputField$, 'xyz .com'); // space is not allowed
    await expect(page.getText(bodyCellError)).resolves.toBe(DOMAIN_ERROR);
  })
);

test.each([false, true])(
  'after edit is submitted, cell is focused, success icon is displayed and aria live region is rendered [enableKeyboardNavigation=%s]',
  enableKeyboardNavigation => {
    setupTest({ enableKeyboardNavigation }, async page => {
      await page.click(cellRoot$);
      await page.click(cellSaveButton.toSelector());

      await expect(page.isFocused(cellEditButton$)).resolves.toBe(true);
      await expect(page.isDisplayed(successIcon$)).resolves.toBe(true);
      await expect(page.getElementProperty(ariaLiveAnnouncement$, 'textContent')).resolves.toBe('Edit successful');
    });
  }
);

test(
  'can start editing with mouse',
  setupTest({}, async page => {
    await page.click(cellEditButton$);
    await expect(page.isDisplayed(cellSaveButton.toSelector())).resolves.toBe(true);
  })
);

test.each(['Enter', 'Space'])('can start editing with %s key', key => {
  setupTest({}, async page => {
    // Focus element before the table
    await page.click('[data-testid="focus"]');

    // Tab to the first editable column
    await page.keys(range(11).map(() => 'Tab'));
    await expect(page.isFocused(tableWrapper.findEditCellButton(1, 2).toSelector())).resolves.toBe(true);

    // Activate with given key
    await page.keys([key]);
    await expect(page.isDisplayed(cellSaveButton.toSelector())).resolves.toBe(true);
  });
});

test.each(['Enter', 'Space'])('can start editing with %s key with keyboard navigation', key => {
  setupTest({}, async page => {
    // Focus element before the table
    await page.click('[data-testid="focus"]');

    // Tab to the first cell
    await page.keys(['Tab', 'Tab']);

    // Navigate to the first editable column
    await page.keys(['ArrowDown', 'ArrowRight']);
    await expect(page.isFocused(tableWrapper.findEditCellButton(1, 2).toSelector())).resolves.toBe(true);

    // Activate with given key
    await page.keys([key]);
    await expect(page.isDisplayed(cellSaveButton.toSelector())).resolves.toBe(true);
  });
});

test.each([false, true])(
  'cell focus is moved when arrow keys are pressed [enableKeyboardNavigation=%s]',
  enableKeyboardNavigation => {
    setupTest({ enableKeyboardNavigation }, async page => {
      await page.click(mainCell$);
      await page.click(cellSaveButton.toSelector());
      await page.keys(['ArrowRight']);
      await expect(page.isFocused(rightCell$)).resolves.toBe(true);
      await page.keys(['ArrowLeft', 'ArrowLeft']);
      await expect(page.isFocused(leftCell$)).resolves.toBe(true);
      await page.keys(['ArrowRight', 'ArrowUp']);
      await expect(page.isFocused(cellAbove$)).resolves.toBe(true);
      await page.keys(['ArrowDown', 'ArrowDown']);
      await expect(page.isFocused(cellBelow$)).resolves.toBe(true);
    });
  }
);

test.each([false, true])(
  'input is focused when the edit operation failed [enableKeyboardNavigation=%s]',
  enableKeyboardNavigation => {
    setupTest({ enableKeyboardNavigation }, async page => {
      await page.click(cellRoot$);

      // "inline" is a special keyword that causes a server-side error
      await page.setValue(cellInputField$, 'inline');
      await page.keys('Enter');

      // after loading, the focus should be back on the input
      await page.waitForAssertion(() => expect(page.isFocused(cellInputField$)).resolves.toBe(true));
    });
  }
);

test.each([false, true])(
  'click focusable element outside when editing cancels editing and focuses clicked element [enableKeyboardNavigation=%s]',
  enableKeyboardNavigation => {
    setupTest({ enableKeyboardNavigation }, async page => {
      // Edit a cell
      await page.click(cellEditButton$);
      await expect(page.isFocused(cellInputField$)).resolves.toBe(true);

      // Click on the input element outside, it should get focused.
      await page.click('[data-testid="focus"]');
      await expect(page.isFocused('[data-testid="focus"]')).resolves.toBe(true);
    });
  }
);
