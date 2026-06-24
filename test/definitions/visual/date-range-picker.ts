// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Date Range Picker',
  componentName: 'date-range-picker',
  tests: [
    {
      description: 'Absolute range at 450px',
      path: 'date-range-picker/with-value',
      screenshotType: 'screenshotArea',
      configuration: { width: 450, height: 950 },
      setup: async ({ page }) => {
        await page.click('#focusable-before');
        await page.focusNextElement();
        await page.keys(['Enter']);
        await page.click('[data-date="2018-01-09"]');
        await page.click('[data-date="2018-01-27"]');
      },
    },
    {
      description: 'Absolute range at 1200px',
      path: 'date-range-picker/with-value',
      screenshotType: 'screenshotArea',
      configuration: { width: 1200, height: 950 },
      setup: async ({ page }) => {
        await page.click('#focusable-before');
        await page.focusNextElement();
        await page.keys(['Enter']);
        await page.click('[data-date="2018-01-09"]');
        await page.click('[data-date="2018-02-24"]');
      },
    },
    {
      description: 'Absolute range input permutations for day granularity',
      path: 'date-range-picker/absolute-format-day-picker.permutations',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'Absolute range input permutations for month granularity',
      path: 'date-range-picker/absolute-format-month-picker.permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'Relative range at 450px',
      path: 'date-range-picker/with-value',
      screenshotType: 'screenshotArea',
      configuration: { width: 450, height: 950 },
      setup: async ({ page }) => {
        await page.click('#focusable-before');
        await page.focusNextElement();
        await page.keys(['Enter']);
        await page.focusNextElement();
        await page.keys(['Space']);
        await page.keys(['ArrowUp']);
        await page.keys(['Enter']);
        await page.focusNextElement();
        await page.keys(['ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowDown']);
      },
    },
    {
      description: 'Relative range at 1200px',
      path: 'date-range-picker/with-value',
      screenshotType: 'screenshotArea',
      configuration: { width: 1200, height: 950 },
      setup: async ({ page }) => {
        await page.click('#focusable-before');
        await page.focusNextElement();
        await page.keys(['Enter']);
        await page.focusNextElement();
        await page.keys(['ArrowLeft']);
        await page.keys(['Enter']);
        await page.focusNextElement();
        await page.keys(['ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowDown']);
      },
    },
    {
      description: 'Calendar permutations for day granularity',
      path: 'date-range-picker/month-calendar-permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'Calendar permutations for month granularity',
      path: 'date-range-picker/year-calendar-permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'selects text when double-clicking calendar header',
      path: 'date-range-picker/with-value',
      screenshotType: 'screenshotArea',
      setup: async ({ page, wrapper, browser }) => {
        await page.click('#focusable-before');
        await page.focusNextElement();
        await page.keys(['Enter']);
        const firstCalendarHeaderSelector = wrapper
          .findDateRangePicker()
          .findDropdown()
          .findHeader()
          .find('h2 span')
          .toSelector();
        browser.$(firstCalendarHeaderSelector).doubleClick();
      },
    },
    {
      description: 'does not select text when double-clicking next button',
      path: 'date-range-picker/with-value',
      screenshotType: 'screenshotArea',
      setup: async ({ page, wrapper, browser }) => {
        await page.click('#focusable-before');
        await page.focusNextElement();
        await page.keys(['Enter']);
        const nextButtonSelector = wrapper.findDateRangePicker().findDropdown().findNextMonthButton().toSelector();
        browser.$(nextButtonSelector).doubleClick();
      },
    },
  ],
};

export default suite;
