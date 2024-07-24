// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const calendarWrapper = createWrapper().findCalendar();

describe('Date picker calendar interactions', () => {
  const setupTest = (testFn: (page: BasePageObject) => Promise<void>) => {
    return useBrowser(async browser => {
      const page = new BasePageObject(browser);

      await browser.url('#/light/calendar/integ');
      await testFn(page);
    });
  };

  test(
    'should focus the element after the date picker',
    setupTest(async page => {
      await page.click('#focusable-element-before-date-picker');
      await page.keys(['Tab', 'Tab', 'Tab', 'Tab']);
      await expect(page.isFocused('#focusable-element-after-date-picker')).resolves.toBeTruthy();
    })
  );

  test(
    'should focus the element before the date picker when shift tabing',
    setupTest(async page => {
      await page.click('#focusable-element-after-date-picker');
      await page.keys(['Shift', 'Tab', 'Tab', 'Tab', 'Tab', 'Null']);
      await expect(page.isFocused('#focusable-element-before-date-picker')).resolves.toBeTruthy();
    })
  );

  test(
    'should navigate dates within a month',
    setupTest(async page => {
      await page.click('#focusable-element-before-date-picker');
      await page.keys(['Tab', 'Tab', 'Tab']);
      await page.keys(['ArrowRight', 'ArrowRight', 'ArrowRight']);
      await page.keys('Enter');

      await expect(page.getText(calendarWrapper.findSelectedDate().toSelector())).resolves.toBe('4');
    })
  );
});
