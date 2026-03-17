// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../../../lib/components/test-utils/selectors';

const autosuggest = createWrapper().findAutosuggest();
const select = createWrapper().findSelect();
const multiselect = createWrapper().findMultiselect();

function setupTest(testFn: (page: BasePageObject) => Promise<void>) {
  return useBrowser(async browser => {
    await browser.url('#/light/dropdown-list-placement.test');
    const page = new BasePageObject(browser);
    await page.waitForVisible(autosuggest.toSelector());
    await testFn(page);
  });
}

async function isBelow(page: BasePageObject, inputSelector: string, dropdownSelector: string) {
  const inputBox = await page.getBoundingBox(inputSelector);
  const dropdownBox = await page.getBoundingBox(dropdownSelector);
  return dropdownBox.top >= inputBox.bottom;
}

async function isAbove(page: BasePageObject, inputSelector: string, dropdownSelector: string) {
  return !(await isBelow(page, inputSelector, dropdownSelector));
}

test(
  'changes autosuggest dropdown position',
  setupTest(async page => {
    const inputSelector = autosuggest.findNativeInput().toSelector();
    const dropdownSelector = autosuggest.findDropdown().findOpenDropdown().toSelector();
    const optionsSelector = autosuggest.findDropdown().findOptions().toSelector();
    const recoveryButtonSelector = autosuggest.findErrorRecoveryButton().toSelector();

    // Open dropdown
    await page.click(inputSelector);
    await expect(page.getElementsCount(optionsSelector)).resolves.toBe(0);
    await expect(isBelow(page, inputSelector, dropdownSelector)).resolves.toBe(true);
    // Click retry to load more options (should update dropdown position)
    await page.click(recoveryButtonSelector);
    await expect(page.getElementsCount(optionsSelector)).resolves.toBe(100);
    await expect(isAbove(page, inputSelector, dropdownSelector)).resolves.toBe(true);
    // Enter search text to reduce options (should not update dropdown position)
    await page.keys('x');
    await expect(page.getElementsCount(optionsSelector)).resolves.toBe(0);
    await expect(isAbove(page, inputSelector, dropdownSelector)).resolves.toBe(true);
  })
);

test(
  'changes select dropdown position',
  setupTest(async page => {
    const inputSelector = select.findTrigger().toSelector();
    const dropdownSelector = select.findDropdown().findOpenDropdown().toSelector();
    const optionsSelector = select.findDropdown().findOptions().toSelector();
    const recoveryButtonSelector = select.findErrorRecoveryButton().toSelector();

    // Open dropdown
    await page.click(inputSelector);
    await expect(page.getElementsCount(optionsSelector)).resolves.toBe(0);
    await expect(isBelow(page, inputSelector, dropdownSelector)).resolves.toBe(true);
    // Click retry to load more options (should update dropdown position)
    await page.click(recoveryButtonSelector);
    await expect(page.getElementsCount(optionsSelector)).resolves.toBe(100);
    await expect(isAbove(page, inputSelector, dropdownSelector)).resolves.toBe(true);
    // Enter search text to reduce options (should not update dropdown position)
    await page.keys('x');
    await expect(page.getElementsCount(optionsSelector)).resolves.toBe(0);
    await expect(isAbove(page, inputSelector, dropdownSelector)).resolves.toBe(true);
  })
);

test(
  'changes multiselect dropdown position',
  setupTest(async page => {
    const inputSelector = multiselect.findTrigger().toSelector();
    const dropdownSelector = multiselect.findDropdown().findOpenDropdown().toSelector();
    const optionsSelector = multiselect.findDropdown().findOptions().toSelector();
    const recoveryButtonSelector = multiselect.findErrorRecoveryButton().toSelector();

    // Open dropdown
    await page.click(inputSelector);
    await expect(page.getElementsCount(optionsSelector)).resolves.toBe(0);
    await expect(isBelow(page, inputSelector, dropdownSelector)).resolves.toBe(true);
    // Click retry to load more options (should update dropdown position)
    await page.click(recoveryButtonSelector);
    await expect(page.getElementsCount(optionsSelector)).resolves.toBe(100);
    await expect(isAbove(page, inputSelector, dropdownSelector)).resolves.toBe(true);
    // Enter search text to reduce options (should not update dropdown position)
    await page.keys('x');
    await expect(page.getElementsCount(optionsSelector)).resolves.toBe(0);
    await expect(isAbove(page, inputSelector, dropdownSelector)).resolves.toBe(true);
  })
);
