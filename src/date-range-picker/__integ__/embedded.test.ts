// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import { DrpDropdownWrapper } from '../../../lib/components/test-utils/selectors/date-range-picker';

const embeddedWrapper = createWrapper().findComponent('', DrpDropdownWrapper);

describe('Date Range Picker', () => {
  const setupTest = (testFn: (page: BasePageObject) => Promise<void>) => {
    return useBrowser(async browser => {
      const page = new BasePageObject(browser);
      await browser.url('#/light/date-range-picker/embedded');
      await testFn(page);
    });
  };

  test(
    'should focus the next element when tabing out of the component',
    setupTest(async page => {
      await page.click('#focusable-element-before-date-range-picker');
      await page.keys(['Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab']);
      await expect(page.isFocused('#focusable-element-after-date-range-picker')).resolves.toBeTruthy();
    })
  );

  test(
    'should focus the previous element when shift tabing out of the embedded component',
    setupTest(async page => {
      await page.click('#focusable-element-after-date-range-picker');
      await page.keys(['Shift', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Null']);
      await expect(page.isFocused('#focusable-element-before-date-range-picker')).resolves.toBeTruthy();
    })
  );

  test(
    'Selecting a date via keyboard',
    setupTest(async page => {
      await page.click('#focusable-element-before-date-range-picker');

      // Focus grid
      await page.keys(['Tab', 'Tab', 'Tab', 'Tab']);

      await page.keys(['ArrowRight', 'ArrowRight']);
      await page.keys('Enter');

      await page.keys(['ArrowDown', 'ArrowRight']);
      await page.keys('Enter');

      await expect(page.getText(embeddedWrapper.findSelectedStartDate()!.toSelector())).resolves.toBe('11');

      await expect(page.getText(embeddedWrapper.findSelectedEndDate()!.toSelector())).resolves.toBe('19');
    })
  );
});
