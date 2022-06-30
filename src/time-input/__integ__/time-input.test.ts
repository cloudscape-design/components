// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const timeInputWrapper = createWrapper().findTimeInput();
const defaultSelector = timeInputWrapper.findNativeInput().toSelector();

class TimeInputPage extends BasePageObject {
  async getAutocompletedValue(value: string) {
    await this.clearInput();
    await this.type(value);
    await this.keys('Tab');
    return this.getValue(defaultSelector);
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

  focusInput() {
    return this.click(defaultSelector);
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

const setupTest = (testFn: (page: TimeInputPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new TimeInputPage(browser);
    await browser.url('#/light/time-input/simple');
    await page.waitForLoad();
    await testFn(page);
  });
};

describe('Time Input', () => {
  test(
    'initial rendering',
    setupTest(async page => {
      await expect(page.getElementAttribute(defaultSelector, 'placeholder')).resolves.toBe('hh:mm:ss');
      await expect(page.getValue(defaultSelector)).resolves.toBe('');
    })
  );

  test(
    'should accept a valid time value when typed in',
    setupTest(async page => {
      await page.focusInput();
      await page.type('111111');
      await expect(page.getValue(defaultSelector)).resolves.toBe('11:11:11');
    })
  );

  test(
    'should ignore invalid input',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['a', ' ', ';']);
      await expect(page.getValue(defaultSelector)).resolves.toBe('');
    })
  );

  test(
    'should append a colons between each group',
    setupTest(async page => {
      await page.focusInput();
      await page.type('11'); // hh
      await expect(page.getValue(defaultSelector)).resolves.toBe('11:');
      await expect(page.getCursorPosition()).resolves.toBe(3);

      await page.type('11'); // mm
      await expect(page.getValue(defaultSelector)).resolves.toBe('11:11:');
      await expect(page.getCursorPosition()).resolves.toBe(6);

      await page.type('11'); // ss
      await expect(page.getValue(defaultSelector)).resolves.toBe('11:11:11');
      await expect(page.getCursorPosition()).resolves.toBe(8);
    })
  );

  test(
    'should correctly limit groups',
    setupTest(async page => {
      await page.focusInput();
      await page.type('3');
      await expect(page.getValue(defaultSelector)).resolves.toBe('03:');

      await page.type('6');
      await expect(page.getValue(defaultSelector)).resolves.toBe('03:06:');

      await page.type('6');
      await expect(page.getValue(defaultSelector)).resolves.toBe('03:06:06');
    })
  );

  test(
    'should autocomplete valid input',
    setupTest(async page => {
      await page.focusInput();
      await page.type('111111');
      await expect(page.getValue(defaultSelector)).resolves.toBe('11:11:11');

      await page.clearInput();
      await page.type('999999');
      await expect(page.getValue(defaultSelector)).resolves.toBe('09:09:09');

      await page.clearInput();
      await page.type('00000000');
      await expect(page.getValue(defaultSelector)).resolves.toBe('00:00:00');
    })
  );

  test(
    `should autocomplete segment on separator key (:)`,
    setupTest(async page => {
      await page.focusInput();
      await page.type('1:');
      await expect(page.getValue(defaultSelector)).resolves.toBe('01:');

      await page.type(':');
      await expect(page.getValue(defaultSelector)).resolves.toBe('01:');
    })
  );

  test(
    'should swallow keys at separator',
    setupTest(async page => {
      await page.focusInput();
      await page.type('123456');
      await page.setCursorPosition(2, 2);
      await page.type('55');
      await expect(page.getValue(defaultSelector)).resolves.toBe('12:54:56');

      await page.setCursorPosition(2, 2);
      await page.type(':1');
      await expect(page.getValue(defaultSelector)).resolves.toBe('12:14:56');
    })
  );

  test(
    'should autocomplete correctly with varying segments filled on tab out',
    setupTest(async page => {
      await expect(page.getAutocompletedValue('3')).resolves.toBe('03:00:00');
      await expect(page.getAutocompletedValue('33')).resolves.toBe('03:03:00');
      await expect(page.getAutocompletedValue('009')).resolves.toBe('00:09:00');
      await expect(page.getAutocompletedValue('3399')).resolves.toBe('03:39:09');
      await expect(page.getAutocompletedValue('00599')).resolves.toBe('00:59:09');
      await expect(page.getAutocompletedValue('125959')).resolves.toBe('12:59:59');
      await expect(page.getAutocompletedValue('135959')).resolves.toBe('13:59:59');
    })
  );
});
