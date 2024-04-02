// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import DatePickerPage from './page-objects/date-picker-page';
import createWrapper from '../../../lib/components/test-utils/selectors';

describe('Date Picker', () => {
  const setupTest = (testFn: (page: DatePickerPage) => Promise<void>) => {
    return useBrowser(async browser => {
      const page = new DatePickerPage(createWrapper().findDatePicker().getElement(), browser);
      await browser.url('#/light/date-picker/simple');
      await page.waitForLoad();
      await testFn(page);
    });
  };

  test(
    'Removing the "/" removes previous digit',
    setupTest(async page => {
      await page.setInputValue('2019', false);
      await expect(page.getInputText()).resolves.toBe('2019/');
      await page.keys('Backspace');
      await expect(page.getInputText()).resolves.toBe('201');
    })
  );

  test(
    'Removing a digit from the middle replaces the deleted value with "0" and moves cursor left',
    setupTest(async page => {
      await page.setInputValue('20190112', false);
      await page.keys(['ArrowLeft', 'Backspace']);
      await expect(page.getCursorPosition()).resolves.toBe(8);
      await expect(page.getInputText()).resolves.toBe('2019/01/02');
    })
  );

  test(
    'Removing multiple digit from the middle replaces the deleted values with "0" and moves cursor left',
    setupTest(async page => {
      await page.setInputValue('20181112', false);
      // move cursor left
      await page.keys('ArrowLeft');
      // select multiple digits
      await page.keys(['Shift', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'Null']);
      // remove selected digits
      await page.keys('Backspace');
      await expect(page.getInputText()).resolves.toBe('2010/01/02');
    })
  );

  test(
    'Removing last digit simply removes it',
    setupTest(async page => {
      await page.setInputValue('20191122', false);
      await page.keys('Backspace');
      await expect(page.getInputText()).resolves.toBe('2019/11/2');
    })
  );

  test(
    'Removing last digit simply removes it, even if it leaves just a 0',
    setupTest(async page => {
      await page.setInputValue('20191102', false);
      await page.keys('Backspace');
      await expect(page.getInputText()).resolves.toBe('2019/11/0');
    })
  );

  test(
    'Removing everything leaves the component empty',
    setupTest(async page => {
      await page.setInputValue('20190102', false);
      await page.clickOutside();
      await page.focusInput();
      await page.keys(Array(8).fill('Backspace'));
      await page.clickOutside();
      await expect(page.getInputText()).resolves.toBe('');
    })
  );

  test(
    'Typing in the middle replaces next character',
    setupTest(async page => {
      await page.setInputValue('20191122', false);
      await page.keys(['ArrowLeft', 'ArrowLeft']);
      await page.keys('1');
      await expect(page.getInputText()).resolves.toBe('2019/11/12');
    })
  );

  test(
    'Selecting a date via keyboard',
    setupTest(async page => {
      // set the fixed date to avoid issues with the variable current time
      await page.setInputValue('20191122', false);
      await page.keys(['Tab']);
      // move focus to the calendar
      await page.keys('Enter');
      await page.keys(['Tab', 'Tab', 'Tab']);
      await page.keys('ArrowDown');
      await page.keys('Enter');
      await expect(page.getInputText()).resolves.toBe('2019/11/29');
    })
  );

  test(
    'should navigate dates within a month',
    setupTest(async page => {
      await page.setInputValue('20220101');
      await page.clickOpenCalendar();
      await page.keys(['Tab', 'Tab', 'Tab']);
      await page.keys(['ArrowRight', 'ArrowRight', 'ArrowRight']);
      await page.keys('Enter');
      await expect(page.getInputText()).resolves.toBe('2022/01/04');
    })
  );

  test(
    'should navigate dates between months',
    setupTest(async page => {
      await page.setInputValue('20220131');
      await page.clickOpenCalendar();
      await page.keys(['Tab', 'Tab', 'Tab']);
      await page.keys(['ArrowRight']);
      await page.keys(['ArrowRight']);
      await page.keys(['ArrowRight']);
      await page.keys('Enter');
      await expect(page.getInputText()).resolves.toBe('2022/02/03');
    })
  );

  test(
    'should navigate to a different month',
    setupTest(async page => {
      await page.setInputValue('20191122');
      await page.clickOpenCalendar();
      await page.clickPreviousMonth();
      await page.pause(500);
      await expect(page.getHeaderContent()).resolves.toBe('October 2019');
    })
  );

  test(
    'should select a date by keyboard, navigate to a different month in the future, and retain next button focused',
    setupTest(async page => {
      await page.setInputValue('20201019');
      await page.clickOpenCalendar();
      await expect(page.getHeaderContent()).resolves.toBe('October 2020');

      // select a date
      await page.keys('ArrowDown');
      await page.keys(['Tab', 'Tab', 'Tab']);
      await page.keys('ArrowDown');
      await page.keys('Enter');
      await expect(page.getInputText()).resolves.toBe('2020/10/26');

      // open calendar again and move to another month
      await page.keys('Enter');
      await page.keys(['Tab', 'Tab']);
      await page.keys(['Enter', 'Enter', 'Enter']);
      await expect(page.getHeaderContent()).resolves.toBe('January 2021');

      await page.pause(500);
      await expect(page.isNextButtonFocused()).resolves.toBeTruthy();
    })
  );

  test(
    'should focus the next element when tabing out of the component',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['Tab', 'Tab']);
      await expect(page.isFocused('#focusable-element-after-date-picker')).resolves.toBeTruthy();
    })
  );

  test(
    'should keep focus on input when pressing Escape',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['Escape']);
      await expect(page.isInputFocused()).resolves.toBeTruthy();
    })
  );

  test(
    'announces the month and year when opening the calendar',
    setupTest(async page => {
      await page.initLiveAnnouncementsObserver();
      await page.setInputValue('2024/02/20', false);
      await page.clickOpenCalendar();
      await expect(page.getLiveAnnouncements()).resolves.toContain('February 2024');
    })
  );
});
