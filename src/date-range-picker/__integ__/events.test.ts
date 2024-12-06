// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import DateRangePickerPage from './page-objects/date-range-picker-page';

class DateRangePickerEventPage extends DateRangePickerPage {
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

describe('Date Range Picker', () => {
  const setupTest = (
    testFn: (page: DateRangePickerEventPage) => Promise<void>,
    granularity: 'day' | 'month',
    expandToViewport: boolean
  ) => {
    return useBrowser(async browser => {
      const page = new DateRangePickerEventPage(
        createWrapper().findDateRangePicker().getElement(),
        browser,
        expandToViewport
      );
      const params = new URLSearchParams({
        monthOnly: granularity === 'month' ? 'true' : 'false',
        expandToViewport: `${expandToViewport}`,
      });
      await browser.url(`#/light/date-range-picker/with-event-handlers?${params}`);
      await page.waitForLoad();
      await testFn(page);
    });
  };

  describe.each<boolean>([false, true] as const)('DatePicker blur events (expandTOViewport=%s)', expandToViewport => {
    describe.each(['day', 'month'] as const)('With granularity of %s', granularity => {
      test(
        'onBlur is fired when clicking next to the date range picker',
        setupTest(
          async page => {
            await page.focusTrigger();
            await expect(page.getText('#onFocusEvent')).resolves.toBe('onFocus event called 1 times.');
            await page.keys('Enter');
            await expect(page.isDropdownOpen()).resolves.toBe(true);
            await expect(page.isDropdownFocused()).resolves.toBe(true);

            await page.click('#onFocusEvent');

            await expect(page.getText('#onBlurEvent')).resolves.toBe('onBlur event called 1 times.');
            await expect(page.isDropdownOpen()).resolves.toBe(false);

            await page.focusTrigger();
            await expect(page.getText('#onFocusEvent')).resolves.toBe('onFocus event called 2 times.');
            await expect(page.isTriggerFocused()).resolves.toBe(true);

            // Click next to the date picker
            await page.clickPosition(400, 80);
            await expect(page.getText('#onBlurEvent')).resolves.toBe('onBlur event called 2 times.');
            await expect(page.isDropdownOpen()).resolves.toBe(false);
          },
          granularity,
          expandToViewport
        )
      );

      test(
        'onBlur is not fired when still focused',
        setupTest(
          async page => {
            await page.focusTrigger();
            await page.keys('Enter');
            await expect(page.isDropdownOpen()).resolves.toBe(true);
            await expect(page.isDropdownFocused()).resolves.toBe(true);
            await page.clickRange(`previous-6-${granularity === 'day' ? 'hours' : 'months'}`);
            await page.clickApplyButton();
            await expect(page.getText('#onChangeEvent')).resolves.toBe(
              `onChange Event: 1 times. Latest detail: {"key":"previous-6-${granularity === 'day' ? 'hours' : 'months'}","amount":6,"unit":"${granularity === 'day' ? 'hour' : 'month'}","type":"relative"}`
            );
            await expect(page.getText('#onBlurEvent')).resolves.toBe('onBlur event called 0 times.');
          },
          granularity,
          expandToViewport
        )
      );

      test(
        'onBlur is fired after a date has been selected and clicked outside',
        setupTest(
          async page => {
            await page.focusTrigger();
            await page.keys('Enter');
            await expect(page.isDropdownOpen()).resolves.toBe(true);
            await expect(page.isDropdownFocused()).resolves.toBe(true);
            await page.clickRange(`previous-6-${granularity === 'day' ? 'hours' : 'months'}`);
            await page.clickApplyButton();
            await page.clickPosition(400, 80);
            await expect(page.getText('#onBlurEvent')).resolves.toBe('onBlur event called 1 times.');
          },
          granularity,
          expandToViewport
        )
      );
    });
  });
});
