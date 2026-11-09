// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper();
const singleList = wrapper.findOptionList('[data-testid="single"]');
const multiList = wrapper.findOptionList('[data-testid="multi"]');
const groupsList = wrapper.findOptionList('[data-testid="groups"]');
const listbox = (list: typeof singleList) => `${list.toSelector()} [role="listbox"]`;

const setupTest = (testFn: (page: BasePageObject) => Promise<void>) =>
  useBrowser(async browser => {
    await browser.url('#/light/option-list/simple');
    const page = new BasePageObject(browser);
    await page.waitForVisible(singleList.toSelector());
    await testFn(page);
  });

describe('OptionList', () => {
  test(
    'selects an option with a click anywhere on the row',
    setupTest(async page => {
      await page.click(singleList.findOptionByValue('performance').findDescription().toSelector());
      await expect(page.getText('[data-testid="single-value"]')).resolves.toBe('Selected: performance');
      await expect(page.getElementsCount(singleList.findSelectedOptions().toSelector())).resolves.toBe(1);
    })
  );

  test(
    'selects with the keyboard: Tab into the list, arrows move, Enter selects',
    setupTest(async page => {
      await page.click('#single-heading');
      await page.keys(['Tab']);
      await expect(page.isFocused(listbox(singleList))).resolves.toBe(true);
      await page.keys(['ArrowDown', 'ArrowDown', 'Enter']);
      await expect(page.getText('[data-testid="single-value"]')).resolves.toBe('Selected: reliability');
    })
  );

  test(
    'Tab leaves the list after one stop',
    setupTest(async page => {
      await page.click('#single-heading');
      await page.keys(['Tab', 'Tab']);
      await expect(page.isFocused(listbox(singleList))).resolves.toBe(false);
      await expect(page.isFocused(listbox(multiList))).resolves.toBe(true);
    })
  );

  test(
    'clicking a group header selects its enabled options',
    setupTest(async page => {
      await page.click(groupsList.findGroupHeaderByValue('storage').toSelector());
      await expect(page.getText('[data-testid="groups-value"]')).resolves.toBe('Selected: s3');
    })
  );
});
