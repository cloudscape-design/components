// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import DatePickerPage from './page-objects/date-picker-page';

interface SetupTestOptions {
  granularity: string;
  format: string;
  inputFormat: string;
}

const setupTest = (
  testFn: (page: DatePickerPage) => Promise<void>,
  { granularity = 'day', format = 'slashed', inputFormat = 'slashed' }: SetupTestOptions
) => {
  return useBrowser(async browser => {
    const page = new DatePickerPage(createWrapper().findDatePicker().getElement(), browser);
    const params = new URLSearchParams({
      monthOnly: `${granularity === 'month'}`,
      format: `${format}`,
      ...(format === 'long-localized' ? { inputFormat: `${inputFormat},` } : {}),
    }).toString();
    await browser.url(`#/light/date-picker/simple?${params}`);
    await page.waitForLoad();
    await testFn(page);
  });
};

describe('Date Picker', () => {
  describe.each(['day', 'month'] as const)('"%s" granularity', granularity => {
    describe.each(['slashed', 'iso', 'long-localized'] as const)('"%s" format', format => {
      describe.each(['slashed', 'iso'] as const)('"%s" inputFormat', inputFormat => {
        const testParams = {
          granularity,
          format,
          inputFormat,
        };
        const isIso = format === 'iso' || (format === 'long-localized' && inputFormat === 'iso');
        const separator = isIso ? '-' : '/';
        //a false negative is given for most tests that are not reproducible in the page
        const overwrittenSeparator = format === 'long-localized' && inputFormat === 'iso' ? '/' : separator;
        const isMonthOnly = granularity === 'month';
        const calendarType = granularity === 'month' ? 'year' : 'month';

        test(
          'Removing the "/" removes previous digit of year',
          setupTest(async page => {
            await page.setInputValue('2019', false);
            await expect(page.getInputText()).resolves.toBe(`2019${overwrittenSeparator}`);
            await page.keys('Backspace');
            await expect(page.getInputText()).resolves.toBe('201');
          }, testParams)
        );

        (isMonthOnly ? test.skip : test)(
          'Removing the "/" removes previous digit of month',
          setupTest(async page => {
            await page.setInputValue('2019/12', false);
            await expect(page.getInputText()).resolves.toBe(`2019${overwrittenSeparator}12${overwrittenSeparator}`);
            await page.keys('Backspace');
            await expect(page.getInputText()).resolves.toBe(`2019${overwrittenSeparator}1`);
          }, testParams)
        );

        test(
          'Removing a digit from the middle replaces the deleted value with "0" and moves cursor left',
          setupTest(async page => {
            await page.setInputValue(`201901${isMonthOnly ? '' : '12'}`, false);
            await page.keys(['ArrowLeft', 'Backspace']);
            await expect(page.getCursorPosition()).resolves.toBe(isMonthOnly ? 5 : 8);
            await expect(page.getInputText()).resolves.toBe(
              `2019${overwrittenSeparator}01${isMonthOnly ? '' : `${overwrittenSeparator}02`}`
            );
          }, testParams)
        );

        test(
          'Removing multiple digit from the middle replaces the deleted values with "0" and moves cursor left',
          setupTest(async page => {
            await page.setInputValue(`201811${isMonthOnly ? '' : '12'}`, false);
            // move cursor left
            await page.keys('ArrowLeft');
            // select multiple digits
            await page.keys([
              'Shift',
              'ArrowLeft',
              'ArrowLeft',
              'ArrowLeft',
              'ArrowLeft',
              ...(isMonthOnly ? [] : ['ArrowLeft', 'ArrowLeft']),
              'Null',
            ]);
            // remove selected digits
            await page.keys('Backspace');
            await expect(page.getInputText()).resolves.toBe(
              `20${isMonthOnly ? '0' : '1'}0${overwrittenSeparator}01${isMonthOnly ? '' : `${overwrittenSeparator}02`}`
            );
          }, testParams)
        );

        test(
          'Removing last digit simply removes it',
          setupTest(async page => {
            await page.setInputValue(`201911${isMonthOnly ? '' : '22'}`, false);
            await page.keys('Backspace');
            await expect(page.getInputText()).resolves.toBe(
              `2019${overwrittenSeparator}1${isMonthOnly ? '' : `1${overwrittenSeparator}2`}`
            );
          }, testParams)
        );

        test(
          'Removing last digit simply removes it, even if it leaves just a 0',
          setupTest(async page => {
            await page.setInputValue(`201906${isMonthOnly ? '' : '02'}`, false);
            await page.keys('Backspace');
            await expect(page.getInputText()).resolves.toBe(
              `2019${overwrittenSeparator}0${isMonthOnly ? '' : `6${overwrittenSeparator}0`}`
            );
          }, testParams)
        );

        test(
          'Removing everything leaves the component empty',
          setupTest(async page => {
            await page.setInputValue(`201901${isMonthOnly ? '' : '02'}`, false);
            await page.clickOutside();
            await page.focusInput();
            await page.keys(Array(isMonthOnly ? 6 : 8).fill('Backspace'));
            await page.clickOutside();
            await expect(page.getInputText()).resolves.toBe('');
          }, testParams)
        );

        test(
          'Typing in the middle replaces next character',
          setupTest(async page => {
            await page.setInputValue(`201901${isMonthOnly ? '' : '22'}`, false);
            await page.keys(['ArrowLeft', 'ArrowLeft']);
            await page.keys('1');
            await expect(page.getInputText()).resolves.toBe(
              `2019${overwrittenSeparator}${isMonthOnly ? '1' : '0'}1${isMonthOnly ? '' : `${overwrittenSeparator}12`}`
            );
          }, testParams)
        );

        test(
          'Selecting a date via keyboard',
          setupTest(async page => {
            // set the fixed date to avoid issues with the variable current time
            await page.setInputValue(`201905${isMonthOnly ? '' : '22'}`, false);
            await page.keys(['Tab']);
            // move focus to the calendar
            await page.keys('Enter');
            await page.keys(['Tab', 'Tab', 'Tab']);
            await page.keys('ArrowDown');
            await page.keys('Enter');
            if (format === 'long-localized') {
              await page.focusInput();
            }
            await expect(page.getInputText()).resolves.toBe(
              `2019${overwrittenSeparator}0${isMonthOnly ? '8' : '5'}${isMonthOnly ? '' : `${overwrittenSeparator}29`}`
            );
          }, testParams)
        );

        test(
          `should navigate dates within a ${calendarType}`,
          setupTest(async page => {
            await page.setInputValue(`202201${isMonthOnly ? '' : '01'}`, false);
            await page.clickOpenCalendar();
            await page.keys(['Tab', 'Tab', 'Tab']);
            await page.keys(['ArrowRight', 'ArrowRight', 'ArrowRight']);
            await page.keys('Enter');
            if (format === 'long-localized') {
              await page.focusInput();
            }
            await expect(page.getInputText()).resolves.toBe(
              `2022${overwrittenSeparator}${isMonthOnly ? '' : `01${overwrittenSeparator}`}04`
            );
          }, testParams)
        );

        test(
          `should navigate dates between ${calendarType}s`,
          setupTest(async page => {
            await page.setInputValue(isMonthOnly ? `202212` : `20220131`);
            await page.clickOpenCalendar();
            await page.keys(['Tab', 'Tab', 'Tab']);
            await page.keys(['ArrowRight']);
            await page.keys(['ArrowRight']);
            await page.keys(['ArrowRight']);
            await page.keys('Enter');
            if (format === 'long-localized') {
              await page.focusInput();
            }
            await expect(page.getInputText()).resolves.toBe(
              isMonthOnly ? `2023${overwrittenSeparator}03` : `2022${overwrittenSeparator}02${overwrittenSeparator}03`
            );
          }, testParams)
        );

        test(
          `should navigate to the previous ${calendarType}`,
          setupTest(async page => {
            await page.setInputValue(`201911${isMonthOnly ? '' : '22'}`);
            await page.clickOpenCalendar();
            await page.clickPreviousMonth();
            await page.pause(500);
            await expect(page.getHeaderContent()).resolves.toBe(isMonthOnly ? `2018` : `October 2019`);
          }, testParams)
        );

        test(
          `should select a date by keyboard, navigate to a different month in the future, and retain next button focused`,
          setupTest(async page => {
            await page.setInputValue(`202007${isMonthOnly ? '' : '19'}`);
            await page.clickOpenCalendar();
            await expect(page.getHeaderContent()).resolves.toBe(`${isMonthOnly ? '' : 'July '}2020`);

            // select a date
            await page.keys('ArrowDown');
            await page.keys(['Tab', 'Tab', 'Tab']);
            await page.keys('ArrowDown');
            await page.keys('Enter');
            if (format === 'long-localized') {
              await page.focusInput();
            }
            await expect(page.getInputText()).resolves.toBe(
              `2020${overwrittenSeparator}${isMonthOnly ? '10' : `07${overwrittenSeparator}26`}`
            );

            // open calendar again and move to another month
            if (format === 'long-localized') {
              await page.keys(['Tab']);
            }
            await page.keys('Enter');
            await page.keys(['Tab', 'Tab']);
            await page.keys(['Enter', 'Enter', 'Enter']);
            await expect(page.getHeaderContent()).resolves.toBe(isMonthOnly ? `2023` : `October 2020`);

            await page.pause(500);
            await expect(page.isNextButtonFocused()).resolves.toBeTruthy();
          }, testParams)
        );

        test(
          `should focus the next element when tabbing out of the component`,
          setupTest(async page => {
            await page.focusInput();
            await page.keys(['Tab', 'Tab']);
            await expect(page.isFocused('#focusable-element-after-date-picker')).resolves.toBeTruthy();
          }, testParams)
        );

        test(
          'should keep focus on input when pressing Escape',
          setupTest(async page => {
            await page.focusInput();
            await page.keys(['Escape']);
            await expect(page.isInputFocused()).resolves.toBeTruthy();
          }, testParams)
        );

        test(
          `announces the ${isMonthOnly ? '' : 'month and '}year when opening the calendar`,
          setupTest(async page => {
            await page.initLiveAnnouncementsObserver();
            await page.setInputValue(`2024${separator}02${isMonthOnly ? '' : `${separator}20`}`, false);
            await page.clickOpenCalendar();
            await page.waitForAssertion(() =>
              expect(page.getLiveAnnouncements()).resolves.toContain(`${isMonthOnly ? '' : 'February '}2024`)
            );
          }, testParams)
        );
      });
    });
  });
});
