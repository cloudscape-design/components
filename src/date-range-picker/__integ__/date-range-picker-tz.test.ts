// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import DateRangePickerPage from './page-objects/date-range-picker-page';

describe('Date Range Picker in America/Los_Angeles timezone', () => {
  const setupTest = (testFn: (page: DateRangePickerPage) => Promise<void>, granularity: 'day' | 'month') => {
    return useBrowser(async browser => {
      const params = new URLSearchParams({
        monthOnly: granularity === 'month' ? 'true' : 'false',
        dateOnly: 'true',
        absoluteFormat: 'long-localized',
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
      'Selecting a date',
      setupTest(async page => {
        await expect(page.getTriggerText()).resolves.toBe(
          granularity === 'day' ? '9 January 2018 — 19 January 2018' : 'January 2018 — January 2018'
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
        await page.keys(['Tab', 'Tab', 'Tab', 'Tab', 'Tab']);
        await page.keys('Enter');

        await expect(page.getTriggerText()).resolves.toBe(
          granularity === 'day' ? '16 January 2018 — 24 January 2018' : 'April 2018 — August 2018'
        );
      }, granularity)
    );
  });
});
