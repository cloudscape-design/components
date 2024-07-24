// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import DateRangePickerPage from './page-objects/date-range-picker-page';

describe('Date Range Picker', () => {
  const setupTest = (testFn: (page: DateRangePickerPage) => Promise<void>) => {
    return useBrowser(async browser => {
      const page = new DateRangePickerPage(createWrapper().findDateRangePicker().getElement(), browser);
      await browser.url('#/light/date-range-picker/with-default-date');
      await page.waitForLoad();
      await testFn(page);
    });
  };

  test(
    'Selecting a date via keyboard',
    setupTest(async page => {
      await page.focusTrigger();
      await page.keys('Enter');

      // Focus grid
      await page.keys(['Tab', 'Tab', 'Tab', 'Tab']);

      await page.keys('ArrowDown');
      await page.keys('Enter');

      await page.keys(['ArrowDown', 'ArrowRight']);
      await page.keys('Enter');

      // Focus Apply button
      await page.keys(['Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab']);
      await page.keys('Enter');

      await expect(page.getTriggerText()).resolves.toBe('2018-01-16T00:00:00+00:00 — 2018-01-24T23:59:59+00:00');
    })
  );

  test(
    'should choose the correct date input to fill',
    setupTest(async page => {
      await page.focusTrigger();
      await page.keys('Enter');

      // Clear selected start date & time
      await page.keys(['Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Backspace']);
      await page.keys(['Tab', 'Backspace']);

      // Focus grid
      await page.keys(['Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab']);

      await page.keys(['ArrowRight', 'ArrowDown']);
      await page.keys('Enter');

      // Focus Apply button
      await page.keys(['Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab']);
      await page.keys('Enter');

      await expect(page.getTriggerText()).resolves.toBe('2018-01-17T00:00:00+00:00 — 2018-01-19T15:30:00+00:00');
    })
  );

  test(
    'should not steal focus when clicking away onto another element',
    setupTest(async page => {
      await page.focusTrigger();
      await page.keys('Enter');
      await page.focusPrevElement();
      await expect(page.isPrevElementFocused()).resolves.toBe(true);
    })
  );

  test(
    'should trap focus inside dropdown',
    setupTest(async page => {
      await page.focusTrigger();
      await page.keys('Enter');

      await expect(page.isDropdownFocused()).resolves.toBe(true);

      let counter = 0;
      do {
        await page.keys('Tab');
        counter++;
      } while (!(await page.isDropdownFocused()) && counter !== 12);

      await expect(page.isDropdownFocused()).resolves.toBe(true);
    })
  );
});
