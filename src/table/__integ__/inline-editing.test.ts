// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';

const DNS_CHAR_ERROR = 'The value should only include DNS-safe characters';

const tableWrapper = createWrapper().findTable();

const bodyCell = tableWrapper.findBodyCell(2, 2);
const cellRoot = bodyCell.toSelector();
const cellInputField = bodyCell.find('input').toSelector();
const cellEditButton = bodyCell.find('button:first-child:last-child').toSelector();
const cellSaveButton = bodyCell.find('button[aria-label*="Submit edit"]').toSelector();

// for navigation
const mainCell = tableWrapper.findBodyCell(3, 2).toSelector();
const mainCellSaveButton = tableWrapper.findBodyCell(3, 2).find('button[aria-label*="Submit edit"]').toSelector();
const leftCell = tableWrapper.findBodyCell(3, 1).find('button:first-child:last-child').toSelector();
const rightCell = tableWrapper.findBodyCell(3, 3).find('button:first-child:last-child').toSelector();
const cellAbove = tableWrapper.findBodyCell(2, 2).find('button:first-child:last-child').toSelector();
const cellBelow = tableWrapper.findBodyCell(4, 2).find('button:first-child:last-child').toSelector();

const bodyCellError = bodyCell.findFormField().findError().toSelector();

const setupTest = (testFn: (page: BasePageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await page.setWindowSize({ width: 900, height: 800 });
    await browser.url('#/light/table/editable-with-app-layout');
    await testFn(page);
  });
};

test(
  'input field is displayed when editable cell is clicked',
  setupTest(async page => {
    const value = await page.getText(cellRoot);
    await page.click(cellRoot);
    await expect(page.getValue(cellInputField)).resolves.toBe(value);
  })
);

test(
  'errorText is displayed when input field is invalid',
  setupTest(async page => {
    await page.click(cellRoot);
    await page.setValue(cellInputField, 'xyz .com'); // space is not allowed
    await expect(page.getText(bodyCellError)).resolves.toBe(DNS_CHAR_ERROR);
  })
);

test(
  'cell is focused after edit is submitted',
  setupTest(async page => {
    await page.click(cellRoot);
    await page.click(cellSaveButton);
    await expect(page.isFocused(cellEditButton)).resolves.toBe(true);
  })
);

test(
  'cell focus is moved when arrow keys are pressed',
  setupTest(async page => {
    await page.click(mainCell);
    await page.click(mainCellSaveButton);
    await page.keys(['ArrowRight']);
    await expect(page.isFocused(rightCell)).resolves.toBe(true);
    await page.keys(['ArrowLeft', 'ArrowLeft']);
    await expect(page.isFocused(leftCell)).resolves.toBe(true);
    await page.keys(['ArrowRight', 'ArrowUp']);
    await expect(page.isFocused(cellAbove)).resolves.toBe(true);
    await page.keys(['ArrowDown', 'ArrowDown']);
    await expect(page.isFocused(cellBelow)).resolves.toBe(true);
  })
);
