// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import DatePickerPage from './page-objects/date-picker-page';
import createWrapper from '../../../lib/components/test-utils/selectors';

describe('Date picker embedded interactions', () => {
  const setupTest = (testFn: (page: DatePickerPage) => Promise<void>) => {
    return useBrowser(async browser => {
      const page = new DatePickerPage(createWrapper().findDatePicker().getElement(), browser);
      await browser.url('#/light/date-picker/embedded');
      await testFn(page);
    });
  };

  test(
    'should focus the next element when tabing out of the component',
    setupTest(async page => {
      await expect(page.findCalendar()).toBeTruthy();
      await page.keys(['Tab', 'Tab', 'Tab', 'Tab']);
      await expect(page.isFocused('#focusable-element-after-date-picker')).resolves.toBeTruthy();
    })
  );

  test(
    'should focus the previous element when shift tabing out of the embedded component',
    setupTest(async page => {
      await expect(page.findCalendar()).toBeTruthy();
      await page.keys(['Shift', 'Tab', 'Null']);
      await expect(page.isFocused('#focusable-element-before-date-picker')).resolves.toBeTruthy();
    })
  );
});
