// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const dateInputWrapper = createWrapper().findDateInput()!;
const defaultSelector = dateInputWrapper.findNativeInput().toSelector();

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
    // allow the seperator to be appended so the cursor position gets messed up.
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

const createSetupTest = (url: string) => (testFn: (page: DateInputPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new DateInputPage(browser);
    await browser.url(url);
    await page.waitForLoad();
    await testFn(page);
  });
};

const setupTest = createSetupTest('#/light/date-input/simple');

describe('Date Input', () => {
  test(
    'initial rendering',
    setupTest(async page => {
      const inputSelector = dateInputWrapper.findNativeInput().toSelector();
      await expect(page.getElementAttribute(inputSelector, 'placeholder')).resolves.toBe('YYYY/MM/DD');
      await expect(page.getValue(inputSelector)).resolves.toBe('');
    })
  );

  test(
    'should accept a valid date when typed in',
    setupTest(async page => {
      await page.focusInput();
      await page.type('19890302');
      await expect(page.getValue(dateInputWrapper.findNativeInput().toSelector())).resolves.toBe('1989/03/02');
    })
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
    })
  );

  test(
    'should autocomplete valid input',
    setupTest(async page => {
      await page.focusInput();
      await page.type('22222222');
      await expect(page.getValue(defaultSelector)).resolves.toBe('2222/02/22');

      await page.clearInput();
      await page.type('99999999');
      await expect(page.getValue(defaultSelector)).resolves.toBe('9999/09/09');

      await page.clearInput();
      await page.type('00000000');
      await expect(page.getValue(defaultSelector)).resolves.toBe('0000/01/01');
    })
  );

  test(
    'should autocomplete segments correctly',
    setupTest(async page => {
      await page.focusInput();
      await page.type('20181/');
      await expect(page.getValue(defaultSelector)).resolves.toBe('2018/01/');
      await expect(page.getCursorPosition()).resolves.toBe(8);

      await page.clearInput();
      await page.type('20180/');
      await expect(page.getValue(defaultSelector)).resolves.toBe('2018/01/');
      await expect(page.getCursorPosition()).resolves.toBe(8);

      await page.clearInput();
      await page.type('2018012/');
      await expect(page.getValue(defaultSelector)).resolves.toBe('2018/01/02');
      await expect(page.getCursorPosition()).resolves.toBe(10);
    })
  );

  test(
    'should autocomplete on tab out',
    setupTest(async page => {
      await page.focusInput();
      await page.type('2');
      await page.keys('Tab');
      await expect(page.getValue(defaultSelector)).resolves.toBe('2002/01/01');

      await page.clearInput();
      await page.type('2000');
      await page.keys('Tab');
      await expect(page.getValue(defaultSelector)).resolves.toBe('2000/01/01');

      await page.clearInput();
      await page.type('20201');
      await page.keys('Tab');
      await expect(page.getValue(defaultSelector)).resolves.toBe('2020/01/01');

      await page.clearInput();
      await page.type('20209');
      await page.keys('Tab');
      await expect(page.getValue(defaultSelector)).resolves.toBe('2020/09/01');

      await page.clearInput();
      await page.type('202091');
      await page.keys('Tab');
      await expect(page.getValue(defaultSelector)).resolves.toBe('2020/09/01');
    })
  );

  ['-', '/', '.', ' '].forEach(separatorKey => {
    test(
      `should autocomplete segment on separator key (${separatorKey})`,
      setupTest(async page => {
        await page.focusInput();
        await page.type('2');
        await page.keys(separatorKey);
        await expect(page.getValue(defaultSelector)).resolves.toBe('2002/');
        await expect(page.getCursorPosition()).resolves.toBe(5);
      })
    );
  });

  test(
    'should append a colons between each group',
    setupTest(async page => {
      await page.focusInput();
      await page.type('2018'); // yyyy
      await expect(page.getValue(defaultSelector)).resolves.toBe('2018/');
      await expect(page.getCursorPosition()).resolves.toBe(5);

      await page.type('11'); // mm
      await expect(page.getValue(defaultSelector)).resolves.toBe('2018/11/');
      await expect(page.getCursorPosition()).resolves.toBe(8);

      await page.type('11'); // dd
      await expect(page.getValue(defaultSelector)).resolves.toBe('2018/11/11');
      await expect(page.getCursorPosition()).resolves.toBe(10);
    })
  );

  test(
    'should swallow characters when overwriting a separator',
    setupTest(async page => {
      await page.focusInput();
      await page.type('20181102');
      await page.setCursorPosition(7, 7);
      await page.type('/2');
      await expect(page.getValue(defaultSelector)).resolves.toBe('2018/11/22');

      await page.clearInput();
      await page.type('20181102');
      await page.setCursorPosition(7, 7);
      await page.type('32');
      await expect(page.getValue(defaultSelector)).resolves.toBe('2018/11/22');
    })
  );
});
