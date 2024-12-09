// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import DateRangePickerPage from './page-objects/date-range-picker-page';

describe('Date Range Picker in America/Los_Angeles timezone', () => {
  const setupTest = (testFn: (page: DateRangePickerPage) => Promise<void>) => {
    return useBrowser(async browser => {
      const page = new DateRangePickerPage(createWrapper().findDateRangePicker().getElement(), browser);
      await browser.setTimeZone('America/Los_Angeles');
      await browser.url('#/light/date-range-picker/with-default-date-only');
      await page.waitForLoad();
      await testFn(page);
    });
  };

  test(
    'Selecting a date',
    setupTest(async page => {
      await page.focusTrigger();
      await expect(page.getTriggerText()).resolves.toBe('9 January 2018 — 19 January 2018');
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

      await expect(page.getTriggerText()).resolves.toBe('16 January 2018 — 24 January 2018');
    })
  );
});
