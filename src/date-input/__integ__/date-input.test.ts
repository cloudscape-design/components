// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const dateInputWrapper = createWrapper().findDateInput()!;
const defaultSelector = dateInputWrapper.findNativeInput().toSelector();

interface SetupTestOptions {
  granularity: string;
  format: string;
  inputFormat: string;
}

class DateInputPage extends BasePageObject {
  focusInput() {
    return this.click(defaultSelector);
  }

  getCursorPosition() {
    return this.browser.execute(defaultSelector => {
      return (document.querySelector(defaultSelector) as HTMLInputElement).selectionStart;
    }, defaultSelector);
  }

  setCursorPosition(startPosition: number, endPosition: number) {
    return this.browser.execute(
      (defaultSelector, startPosition, endPosition) => {
        return (document.querySelector(defaultSelector) as HTMLInputElement).setSelectionRange(
          startPosition,
          endPosition
        );
      },
      defaultSelector,
      startPosition,
      endPosition
    );
  }

  async type(text: string) {
    // `await this.keys(text);` doesn't work as it key presses too quickly and doesn't
    // allow the separator to be appended so the cursor position gets messed up.
    for (let k = 0; k < text.length; k++) {
      await this.keys(text[k]);
    }
  }

  async clearInput() {
    const value = await this.getValue(defaultSelector);

    await this.focusInput();
    await this.keys('End');
    for (let k = 0; k < value.length; k++) {
      await this.keys('Backspace');
    }
  }

  waitForLoad() {
    return this.waitForVisible(defaultSelector);
  }
}

const setupTest = (
  testFn: (page: DateInputPage) => Promise<void>,
  { granularity = 'day', format = 'slashed', inputFormat = 'slashed' }: SetupTestOptions
) =>
  useBrowser(async browser => {
    const page = new DateInputPage(browser);
    const params = new URLSearchParams({
      monthOnly: `${granularity === 'month'}`,
      format: `${format}`,
      ...(format === 'long-localized' ? { inputFormat: `${inputFormat},` } : {}),
    }).toString();
    await browser.url(`#/light/date-input/simple?${params}`);
    await page.waitForLoad();
    await testFn(page);
  });

describe('Date Input', () => {
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

        test(
          'initial rendering',
          setupTest(async page => {
            const inputSelector = dateInputWrapper.findNativeInput().toSelector();
            await expect(page.getElementAttribute(inputSelector, 'placeholder')).resolves.toBe(
              `YYYY${overwrittenSeparator}MM${isMonthOnly ? '' : `${overwrittenSeparator}DD`}`
            );
            await expect(page.getValue(inputSelector)).resolves.toBe('');
          }, testParams)
        );

        test(
          'should accept a valid date when typed in',
          setupTest(async page => {
            await page.focusInput();
            await page.type(`198903${isMonthOnly ? '' : '02'}`);
            await expect(page.getValue(dateInputWrapper.findNativeInput().toSelector())).resolves.toBe(
              `1989${overwrittenSeparator}03${isMonthOnly ? '' : `${overwrittenSeparator}02`}`
            );
          }, testParams)
        );

        test(
          'should not autocomplete an empty value',
          setupTest(async page => {
            await page.focusInput();
            await page.keys('Tab');
            await expect(page.getValue(defaultSelector)).resolves.toBe('');

            await page.focusInput();
            await page.keys(['1', 'Backspace', 'Tab']);
            await expect(page.getValue(defaultSelector)).resolves.toBe('');
          }, testParams)
        );

        test(
          'should autocomplete valid input',
          setupTest(async page => {
            await page.focusInput();
            await page.type(isMonthOnly ? `22222` : `22222222`);
            await expect(page.getValue(defaultSelector)).resolves.toBe(
              `2222${overwrittenSeparator}02${isMonthOnly ? '' : `${overwrittenSeparator}22`}`
            );

            await page.clearInput();
            await page.type(isMonthOnly ? `99999` : `99999999`);
            await expect(page.getValue(defaultSelector)).resolves.toBe(
              `9999${overwrittenSeparator}09${isMonthOnly ? '' : `${overwrittenSeparator}09`}`
            );

            await page.clearInput();
            await page.type(isMonthOnly ? `000000` : `00000000`);
            await expect(page.getValue(defaultSelector)).resolves.toBe(
              `0000${overwrittenSeparator}01${isMonthOnly ? '' : `${overwrittenSeparator}01`}`
            );
          }, testParams)
        );

        test(
          'should autocomplete segments correctly',
          setupTest(async page => {
            await page.focusInput();
            await page.type(`2018`);
            await expect(page.getValue(defaultSelector)).resolves.toBe(`2018${overwrittenSeparator}`);
            await expect(page.getCursorPosition()).resolves.toBe(5);

            await page.clearInput();
            await page.type(`20181/`);
            await expect(page.getValue(defaultSelector)).resolves.toBe(
              `2018${overwrittenSeparator}01${isMonthOnly ? '' : overwrittenSeparator}`
            );
            await expect(page.getCursorPosition()).resolves.toBe(isMonthOnly ? 7 : 8);

            if (!isMonthOnly) {
              await page.clearInput();
              await page.type(`20180/`);
              await expect(page.getValue(defaultSelector)).resolves.toBe(
                `2018${overwrittenSeparator}01${overwrittenSeparator}`
              );
              await expect(page.getCursorPosition()).resolves.toBe(8);

              await page.clearInput();
              await page.type(`2018012/`);
              await expect(page.getValue(defaultSelector)).resolves.toBe(
                `2018${overwrittenSeparator}01${overwrittenSeparator}02`
              );
              await expect(page.getCursorPosition()).resolves.toBe(10);
            }
          }, testParams)
        );

        test(
          'should autocomplete on tab out',
          setupTest(async page => {
            await page.focusInput();
            await page.type('2');
            await page.keys('Tab');
            await expect(page.getValue(defaultSelector)).resolves.toBe(
              format === 'long-localized'
                ? `January${isMonthOnly ? '' : ' 1,'} 2002`
                : `2002${separator}01${isMonthOnly ? '' : `${separator}01`}`
            );

            await page.clearInput();
            await page.type(`2000`);
            await page.keys('Tab');
            await expect(page.getValue(defaultSelector)).resolves.toBe(
              format === 'long-localized'
                ? `January${isMonthOnly ? '' : ' 1,'} 2000`
                : `2000${separator}01${isMonthOnly ? '' : `${separator}01`}`
            );

            await page.clearInput();
            await page.type(`20201`);
            await page.keys('Tab');
            await expect(page.getValue(defaultSelector)).resolves.toBe(
              format === 'long-localized'
                ? `January${isMonthOnly ? '' : ' 1,'} 2020`
                : `2020${separator}01${isMonthOnly ? '' : `${separator}01`}`
            );

            await page.clearInput();
            await page.type(`20209`);
            await page.keys('Tab');
            await expect(page.getValue(defaultSelector)).resolves.toBe(
              format === 'long-localized'
                ? `September${isMonthOnly ? '' : ' 1,'} 2020`
                : `2020${separator}09${isMonthOnly ? '' : `${separator}01`}`
            );

            await page.clearInput();
            await page.type(`202091`);
            await page.keys('Tab');
            await expect(page.getValue(defaultSelector)).resolves.toBe(
              format === 'long-localized'
                ? `September${isMonthOnly ? '' : ' 1,'} 2020`
                : `2020${separator}09${isMonthOnly ? '' : `${separator}01`}`
            );
          }, testParams)
        );

        ['-', '/', '.', ' '].forEach(separatorKey => {
          test(
            `should autocomplete segment on separator key (${separatorKey})`,
            setupTest(async page => {
              await page.focusInput();
              await page.type('2');
              await page.keys(separatorKey);
              await expect(page.getValue(defaultSelector)).resolves.toBe(`2002${overwrittenSeparator}`);
              await expect(page.getCursorPosition()).resolves.toBe(5);
            }, testParams)
          );
        });

        test(
          'should append a colons between each group',
          setupTest(async page => {
            await page.focusInput();
            await page.type('2018'); // yyyy
            await expect(page.getValue(defaultSelector)).resolves.toBe(`2018${overwrittenSeparator}`);
            await expect(page.getCursorPosition()).resolves.toBe(5);

            await page.type('11'); // mm
            await expect(page.getValue(defaultSelector)).resolves.toBe(
              `2018${overwrittenSeparator}11${isMonthOnly ? '' : overwrittenSeparator}`
            );
            await expect(page.getCursorPosition()).resolves.toBe(isMonthOnly ? 7 : 8);

            if (!isMonthOnly) {
              await page.type('11'); // dd
              await expect(page.getValue(defaultSelector)).resolves.toBe(
                `2018${overwrittenSeparator}11${overwrittenSeparator}11`
              );
              await expect(page.getCursorPosition()).resolves.toBe(10);
            }
          }, testParams)
        );

        test(
          'should swallow characters when overwriting a separator',
          setupTest(async page => {
            const lastSeparatorLocation = isMonthOnly ? 5 : 7;
            await page.focusInput();
            await page.type(`201801${isMonthOnly ? '' : '02'}`);
            await page.setCursorPosition(lastSeparatorLocation, lastSeparatorLocation);
            await page.type('/1');
            await expect(page.getValue(defaultSelector)).resolves.toBe(
              `2018${overwrittenSeparator}${isMonthOnly ? '11' : `01${overwrittenSeparator}12`}`
            );

            await page.clearInput();
            await page.type(`201801${isMonthOnly ? '' : '02'}`);
            await page.setCursorPosition(lastSeparatorLocation, lastSeparatorLocation);
            await page.type('32');
            await expect(page.getValue(defaultSelector)).resolves.toBe(
              `2018${overwrittenSeparator}${isMonthOnly ? '12' : `01${overwrittenSeparator}22`}`
            );
          }, testParams)
        );
      });
    });
  });
});
