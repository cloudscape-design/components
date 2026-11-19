// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import DatePickerPage from './page-objects/date-picker-page';

class DatePickerBlurPage extends DatePickerPage {
  async clickPosition(x: number, y: number) {
    await this.browser.performActions([
      {
        type: 'pointer',
        id: 'pointer1',
        parameters: {
          pointerType: 'mouse',
        },
        actions: [
          { type: 'pointerMove', duration: 0, x, y },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);
  }
}

describe.each<boolean>([false, true])('DatePicker blur events (expandToViewport=%s)', expandToViewport => {
  const setupTest = (testFn: (page: DatePickerBlurPage) => Promise<void>) => {
    return useBrowser(async browser => {
      const page = new DatePickerBlurPage(createWrapper().findDatePicker().getElement(), browser, expandToViewport);
      await browser.url(`#/light/date-picker/with-event-handlers?expandToViewport=${expandToViewport}`);
      await page.waitForLoad();
      await testFn(page);
    });
  };

  test(
    'is fired when clicking next to the date picker',
    setupTest(async page => {
      await page.clickOpenCalendar();
      await expect(page.isDropdownOpen()).resolves.toBe(true);
      await expect(page.isDropdownFocused()).resolves.toBe(true);

      // Click below everything
      await page.clickPosition(100, 600);

      await expect(page.getText('#onBlurEvent')).resolves.toBe('onBlur event called 1 times.');
      await expect(page.isDropdownOpen()).resolves.toBe(false);

      await page.focusInput();
      await expect(page.isInputFocused()).resolves.toBe(true);

      // Click next to the date picker
      await page.clickPosition(400, 80);
      await expect(page.getText('#onBlurEvent')).resolves.toBe('onBlur event called 2 times.');
      await expect(page.isDropdownOpen()).resolves.toBe(false);
    })
  );

  test(
    'is not fired when still focused',
    setupTest(async page => {
      await page.clickOpenCalendar();
      await expect(page.isDropdownOpen()).resolves.toBe(true);
      await expect(page.isDropdownFocused()).resolves.toBe(true);
      await page.clickDate(3, 3);
      await expect(page.getText('#onBlurEvent')).resolves.toBe('onBlur event called 0 times.');
    })
  );

  test(
    'is fired after a date has been selected and clicked outside',
    setupTest(async page => {
      await page.clickOpenCalendar();
      await expect(page.isDropdownOpen()).resolves.toBe(true);
      await expect(page.isDropdownFocused()).resolves.toBe(true);
      await page.clickDate(3, 3);
      await page.clickPosition(400, 80);
      await expect(page.getText('#onBlurEvent')).resolves.toBe('onBlur event called 1 times.');
    })
  );
});
