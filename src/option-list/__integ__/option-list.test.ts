// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper();
const singleList = wrapper.findOptionList('[data-testid="single"]');
const multiList = wrapper.findOptionList('[data-testid="multi"]');
const singleValue = '[data-testid="single-value"]';
const multiValue = '[data-testid="multi-value"]';

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
      await page.click(singleList.findOptionById('performance').findSecondaryContent().toSelector());
      await expect(page.getText(singleValue)).resolves.toBe('Selected: performance');
      await expect(page.getElementsCount(singleList.findSelectedOptions().toSelector())).resolves.toBe(1);
    })
  );

  test(
    'selects with the keyboard: Tab into the list, arrows move, Enter selects',
    setupTest(async page => {
      await page.click('#single-heading');
      await page.keys(['Tab']);
      await expect(page.isFocused(singleList.findListbox().toSelector())).resolves.toBe(true);
      await page.keys(['ArrowDown', 'ArrowDown', 'Enter']);
      await expect(page.getText(singleValue)).resolves.toBe('Selected: reliability');
    })
  );

  test(
    'toggles several options in multi selection',
    setupTest(async page => {
      await page.click(multiList.findOptionById('cost').toSelector());
      await page.click(multiList.findOptionById('security').toSelector());
      await expect(page.getText(multiValue)).resolves.toBe('Selected: cost, security');
      await page.click(multiList.findOptionById('cost').toSelector());
      await expect(page.getText(multiValue)).resolves.toBe('Selected: security');
    })
  );

  test(
    'Tab leaves the list after one stop',
    setupTest(async page => {
      await page.click('#single-heading');
      await page.keys(['Tab', 'Tab']);
      await expect(page.isFocused(singleList.findListbox().toSelector())).resolves.toBe(false);
      await expect(page.isFocused(multiList.findListbox().toSelector())).resolves.toBe(true);
    })
  );
});
