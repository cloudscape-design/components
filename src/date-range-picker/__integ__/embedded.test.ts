// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import DateRangePickerPage from './page-objects/date-range-picker-page';
import createWrapper from '../../../lib/components/test-utils/selectors';

describe('Date Range Picker', () => {
  const setupTest = (testFn: (page: DateRangePickerPage) => Promise<void>) => {
    return useBrowser(async browser => {
      const page = new DateRangePickerPage(createWrapper().findDateRangePicker().getElement(), browser);
      await browser.url('#/light/date-range-picker/embedded');
      await testFn(page);
    });
  };

  test(
    'should focus the next element when tabing out of the component',
    setupTest(async page => {
      await page.click('#focusable-element-before-date-picker');
      await page.keys(['Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab']);
      await expect(page.isFocused('#focusable-element-after-date-picker')).resolves.toBeTruthy();
    })
  );

  test(
    'should focus the previous element when shift tabing out of the embedded component',
    setupTest(async page => {
      await page.click('#focusable-element-after-date-picker');
      await page.keys(['Shift', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Null']);
      await expect(page.isFocused('#focusable-element-before-date-picker')).resolves.toBeTruthy();
    })
  );
});
