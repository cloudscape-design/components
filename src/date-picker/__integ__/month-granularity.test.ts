// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';
import DatePickerPage from './page-objects/date-picker-page';

describe('Date picker at month granularity', () => {
  test(
    'announces the year without the month when opening the calendar',
    useBrowser(async browser => {
      await browser.url('#/light/date-picker/month-picker');
      const page = new DatePickerPage(createWrapper().findDatePicker().getElement(), browser);
      await page.initLiveAnnouncementsObserver();
      await page.waitForLoad();
      await page.clickOpenCalendar();
      await expect(page.getLiveAnnouncements()).resolves.toContain('2024');
    })
  );
});
