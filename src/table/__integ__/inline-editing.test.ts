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

const setupTest = (testFn: (page: BasePageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await page.setWindowSize({ width: 1200, height: 800 });
    await browser.url('#/light/table/editable');
    await testFn(page);
  });
};

test(
  'input field is displayed when editable cell is clicked',
  setupTest(async page => {
    const value = await page.getText(cellRoot$);
    await page.click(cellRoot$);
    await expect(page.getValue(cellInputField$)).resolves.toBe(value);
  })
);

test(
  'errorText is displayed when input field is invalid',
  setupTest(async page => {
    await page.click(cellRoot$);
    await page.setValue(cellInputField$, 'xyz .com'); // space is not allowed
    await expect(page.getText(bodyCellError)).resolves.toBe(DOMAIN_ERROR);
  })
);

test(
  'cell is focused after edit is submitted',
  setupTest(async page => {
    await page.click(cellRoot$);
    await page.click(cellSaveButton.toSelector());
    await expect(page.isFocused(cellEditButton$)).resolves.toBe(true);
  })
);

test(
  'success icon is displayed and aria live region is rendered after a successful edit',
  setupTest(async page => {
    // Before the edit, no live region and success icon is shown.
    await expect(page.isExisting(successIcon$)).resolves.toBe(false);
    await expect(page.isExisting(ariaLiveAnnouncement$)).resolves.toBe(false);
    await page.click(cellRoot$);
    await page.click(cellSaveButton.toSelector());
    // Success icon and live region is rendered after the successful edit.
    await expect(page.isFocused(cellEditButton$)).resolves.toBe(true);
    await expect(page.isDisplayed(successIcon$)).resolves.toBe(true);
    await expect(page.getElementProperty(ariaLiveAnnouncement$, 'textContent')).resolves.toBe('Edit successful');
  })
);

test(
  'success icon is not displayed, no aria live region is rendered after successfully edited cell lost focus and gets re-focused',
  setupTest(async page => {
    // Edit cell and perform a successful save
    await page.click(cellRoot$);
    await page.click(cellSaveButton.toSelector());
    // Success icon is displayed, aria live is rendered, the cell is focused.
    await expect(page.isFocused(cellEditButton$)).resolves.toBe(true);
    await expect(page.isDisplayed(successIcon$)).resolves.toBe(true);
    await expect(page.getElementProperty(ariaLiveAnnouncement$, 'textContent')).resolves.toBe('Edit successful');
    // Tab to another cell
    await page.keys('ArrowRight');
    // Edited cell lost focus, success icon is not visible, aria live region is not rendered
    await expect(page.isFocused(cellEditButton$)).resolves.toBe(false);
    await expect(page.isDisplayed(successIcon$)).resolves.toBe(false);
    await expect(page.getElementsCount(ariaLiveAnnouncement$)).resolves.toBe(0);
    // Tab back to the origin cell
    await page.keys('ArrowLeft');
    // Edited cell got focus again, the success icon is not visible, aria live region is not rendered
    await expect(page.isFocused(cellEditButton$)).resolves.toBe(true);
    await expect(page.isDisplayed(successIcon$)).resolves.toBe(false);
    await expect(page.getElementsCount(ariaLiveAnnouncement$)).resolves.toBe(0);
  })
);

test(
  'can start editing with mouse',
  setupTest(async page => {
    await page.click(cellEditButton$);
    await expect(page.isDisplayed(cellSaveButton.toSelector())).resolves.toBe(true);
  })
);

test(
  'can start editing with Enter key',
  setupTest(async page => {
    // Focus element before the table
    await page.click('[data-testid="focus"]');

    // Tab to the first editable column
    await page.keys(range(11).map(() => 'Tab'));
    await expect(page.isFocused(tableWrapper.findEditCellButton(1, 2).toSelector())).resolves.toBe(true);

    // Activate with Enter
    await page.keys(['Enter']);
    await expect(page.isDisplayed(cellSaveButton.toSelector())).resolves.toBe(true);
  })
);

test(
  'can start editing with Space key',
  setupTest(async page => {
    // Focus element before the table
    await page.click('[data-testid="focus"]');

    // Tab to the first editable column
    await page.keys(range(11).map(() => 'Tab'));
    await expect(page.isFocused(tableWrapper.findEditCellButton(1, 2).toSelector())).resolves.toBe(true);

    // Activate with Space
    await page.keys(['Space']);
    await expect(page.isDisplayed(cellSaveButton.toSelector())).resolves.toBe(true);
  })
);

test(
  'cell focus is moved when arrow keys are pressed',
  setupTest(async page => {
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
  })
);

test(
  'input is focused when the edit operation failed',
  setupTest(async page => {
    await page.click(cellRoot$);

    // "inline" is a special keyword that causes a server-side error
    await page.setValue(cellInputField$, 'inline');
    await page.keys('Enter');

    // after loading, the focus should be back on the input
    await page.waitForAssertion(() => expect(page.isFocused(cellInputField$)).resolves.toBe(true));
  })
);
