// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import styles from '../../../lib/components/table/body-cell/styles.selectors.js';

const tableWrapper = createWrapper().findTable()!;

// $ = selector
const bodyCell = tableWrapper.findBodyCell(2, 2)!;
const cellRoot$ = bodyCell.toSelector();
const cellInputField$ = bodyCell.findFormField().find('input').toSelector();
const cellEditButton$ = tableWrapper.findEditCellButton(2, 2).toSelector();
const cellCancelButton$ = tableWrapper.findEditingCellCancelButton().toSelector();
const cellSaveButton = tableWrapper.findEditingCellSaveButton();
const successIcon$ = bodyCell.findByClassName(styles['body-cell-success']).toSelector();
const ariaLiveAnnouncement$ = bodyCell.find(`[aria-live="polite"]`).toSelector();

const setupTest = (testFn: (page: BasePageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await page.setWindowSize({ width: 1200, height: 800 });
    await browser.url('#/light/table/editable');
    await testFn(page);
  });
};

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
  'success icon is not displayed, when successfully edited, clicking edit again an cancel the edit',
  setupTest(async page => {
    // Edit cell and perform a successful save
    await page.click(cellRoot$);
    await page.click(cellSaveButton.toSelector());
    // Success icon is displayed, aria live is rendered.
    await expect(page.isExisting(successIcon$)).resolves.toBe(true);
    await expect(page.isExisting(ariaLiveAnnouncement$)).resolves.toBe(true);
    // Edit the cell again and click cancel.
    await page.click(cellRoot$);
    await page.click(cellCancelButton$);
    // Success icon and aria live region are not rendered.
    await expect(page.isExisting(successIcon$)).resolves.toBe(false);
    await expect(page.isExisting(ariaLiveAnnouncement$)).resolves.toBe(false);
  })
);

test(
  'input field is displayed when success icon is clicked after an edit',
  setupTest(async page => {
    const value = await page.getText(cellRoot$);
    // Edit cell and perform a successful save
    await page.click(cellRoot$);
    await page.click(cellSaveButton.toSelector());
    // Click the success icon - click the Icon component directly, clicking the wrapping span. would result in click element intercepted error.
    await page.click(`${successIcon$} > *:first-child`);
    // Cell is in edit mode again, input field is displayed
    await expect(page.getValue(cellInputField$)).resolves.toBe(value);
  })
);
