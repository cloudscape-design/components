// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Date Range Picker',
  componentName: 'date-range-picker',
  tests: [
    ...[450, 1200].flatMap<TestDefinition>(width => [
      {
        description: `Absolute range at ${width}px`,
        path: 'date-range-picker/with-value',
        screenshotType: 'screenshotArea' as const,
        configuration: { width, height: 950 },
        setup: async ({ page }) => {
          await page.click('#focusable-before');
          await page.focusNextElement();
          await page.keys(['Enter']);
          await page.click('[data-date="2018-01-09"]');
          if (width >= 1000) {
            await page.click('[data-date="2018-02-24"]');
          } else {
            await page.click('[data-date="2018-01-27"]');
          }
        },
      },
      {
        description: `Relative range at ${width}px`,
        path: 'date-range-picker/with-value',
        screenshotType: 'screenshotArea' as const,
        configuration: { width, height: 950 },
        setup: async ({ page }) => {
          await page.click('#focusable-before');
          await page.focusNextElement();
          await page.keys(['Enter']);
          await page.focusNextElement();
          if (width >= 1000) {
            await page.keys(['ArrowLeft']);
            await page.keys(['Enter']);
          } else {
            await page.keys(['Space']);
            await page.keys(['ArrowUp']);
            await page.keys(['Enter']);
          }
          await page.focusNextElement();
          await page.keys(['ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowDown']);
        },
      },
    ]),
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
        const headerSelector = wrapper.findDateRangePicker().findDropdown().findHeader().find('h2 span').toSelector();
        await browser!.execute((sel: string) => {
          const el = document.querySelector(sel);
          if (el) {
            el.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
          }
        }, headerSelector);
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
        await browser!.execute((sel: string) => {
          const el = document.querySelector(sel);
          if (el) {
            el.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
          }
        }, nextButtonSelector);
      },
    },
  ],
};

export default suite;
