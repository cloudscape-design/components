// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import DateRangePickerPage from './page-objects/date-range-picker-page';

describe('Date Range Picker', () => {
  const setupTest = (testFn: (page: DateRangePickerPage) => Promise<void>, granularity: 'day' | 'month') => {
    return useBrowser(async browser => {
      const params = new URLSearchParams({
        monthOnly: granularity === 'month' ? 'true' : 'false',
      });
      const page = new DateRangePickerPage(createWrapper().findDateRangePicker().getElement(), browser);
      await browser.setTimeZone('America/Los_Angeles');
      await browser.url(`#/light/date-range-picker/with-value?${params}`);
      await page.waitForLoad();
      await testFn(page);
    });
  };

  describe.each(['day', 'month'] as const)('With granularity of %s', granularity => {
    test(
      'Selecting a date via keyboard',
      setupTest(async page => {
        await expect(page.getTriggerText()).resolves.toBe(
          granularity === 'day' ? '2018-01-09T20:34:56+00:00 — 2018-01-19T23:30:00+00:00' : '2018-01 — 2018-01'
        );
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

        await expect(page.getTriggerText()).resolves.toBe(
          granularity === 'day' ? '2018-01-16T00:00:00+00:00 — 2018-01-24T23:59:59+00:00' : '2018-01 — 2018-01'
        );
      }, granularity)
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

        await expect(page.getTriggerText()).resolves.toBe(
          granularity === 'day' ? '2018-01-17T00:00:00+00:00 — 2018-01-19T23:30:00+00:00' : '2018-01 — 2018-01'
        );
      }, granularity)
    );

    test(
      'should not steal focus when clicking away onto another element',
      setupTest(async page => {
        await page.focusTrigger();
        await page.keys('Enter');
        await page.focusPrevElement();
        await expect(page.isPrevElementFocused()).resolves.toBe(true);
      }, granularity)
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
      }, granularity)
    );
  });
});
