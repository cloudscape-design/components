// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { strict as assert } from 'assert';

import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import DatePickerPage from './page-objects/date-picker-page';

describe('Date picker Dropdown interactions', () => {
  const setupTest = (testFn: (page: DatePickerPage) => Promise<void>) => {
    return useBrowser(async browser => {
      const page = new DatePickerPage(createWrapper().findDatePicker().getElement(), browser);
      await browser.url('#/light/date-picker/simple');
      await page.waitForLoad();
      await testFn(page);
    });
  };

  test(
    'Dropdown opens when the button is clicked',
    setupTest(async page => {
      await page.clickOpenCalendar();
      await expect(page.isDropdownOpen()).resolves.toBe(true);
    })
  );

  test(
    'Dropdown closes when clicking on the date input',
    setupTest(async page => {
      await page.clickOpenCalendar();
      await page.clickDateInput();
      await expect(page.isDropdownOpen()).resolves.toBe(false);
    })
  );

  test(
    'Dropdown closes on outside click',
    setupTest(async page => {
      await page.clickOpenCalendar();
      await page.clickOutside();
      await expect(page.isDropdownOpen()).resolves.toBe(false);
    })
  );

  test(
    'Dropdown closes on escape key. Focus goes back to the "open calendar" button',
    setupTest(async page => {
      await page.clickOpenCalendar();
      await page.keys('Escape');
      await expect(page.isDropdownOpen()).resolves.toBe(false);
      await expect(page.isOpenButtonFocused()).resolves.toBe(true);
    })
  );

  test(
    'should open dropdown downwards if below is not enough space but above is even less',
    setupTest(async page => {
      await page.setSmallWindowSize();
      await page.clickOpenCalendar();

      const { top: dropdownTop } = await page.getDropdownBoundingBox();
      const { top: inputTop } = await page.getInputBoundingBox();
      expect(inputTop).toBeGreaterThan(dropdownTop);
    })
  );

  test(
    'Dropdown can be reopened by clicking',
    setupTest(async page => {
      await page.setInputValue('2012/02/03', false);
      await page.clickOpenCalendar();
      await expect(page.isDropdownOpen()).resolves.toBe(true);
    })
  );

  test(
    'Dropdown closes when date is clicked',
    setupTest(async page => {
      await page.clickOpenCalendar();
      await page.clickDate(3, 3);
      await expect(page.isDropdownOpen()).resolves.toBe(false);
    })
  );

  test(
    'Dropdown can be closed and reopened, with mixed keyboard/mouse interaction',
    setupTest(async page => {
      await page.clickOpenCalendar();
      await page.clickDate(3, 3);
      await page.keys('Enter');
      assert.equal(await page.isDropdownOpen(), true, 'opens again with "Enter" key');
      await expect(page.isDropdownFocused()).resolves.toBe(true);
    })
  );

  test(
    'Dropdown can be closed after keyboard navigation',
    setupTest(async page => {
      await page.clickOpenCalendar();
      await page.keys(['Tab', 'Tab', 'ArrowRight']);
      await page.keys('Escape');
      await expect(page.isDropdownOpen()).resolves.toBe(false);
      await expect(page.isOpenButtonFocused()).resolves.toBe(true);
    })
  );

  test(
    'Dropdown has tab traps',
    setupTest(async page => {
      await page.clickOpenCalendar();
      await page.clickDate(3, 3);
      await page.clickOpenCalendar();
      await page.keys(['Tab', 'Tab', 'Tab', 'Tab']);
      await expect(page.isDropdownFocused()).resolves.toBe(true);
      await page.keys(['Shift', 'Tab', 'Null']);
      await expect(page.isDateFocused()).resolves.toBe(true);
    })
  );

  test(
    'month navigation using keyboard',
    setupTest(async page => {
      await page.setInputValue('2012/02/03', false);
      await page.clickOpenCalendar();
      // select next month button
      await page.keys(['Tab', 'Tab', 'Enter']);
      await expect(page.isDropdownOpen()).resolves.toBe(true);
      // select first date of month
      await page.keys(['Tab', 'Enter']);
      await expect(page.isDropdownOpen()).resolves.toBe(false);
      await expect(page.getInputText()).resolves.toBe('2012/03/01');
    })
  );
});

describe('Dropdown with default value', () => {
  const setupTest = (testFn: (page: DatePickerPage) => Promise<void>) => {
    return useBrowser(async browser => {
      const page = new DatePickerPage(createWrapper().findDatePicker().getElement(), browser);
      await browser.url('#/light/date-picker/with-default-date');
      await page.waitForLoad();
      await testFn(page);
    });
  };

  test(
    'Dropdown is closed when clicking on a previous month and blurring the date picker',
    setupTest(async page => {
      await page.clickOpenCalendar();
      await page.clickPreviousMonth();
      await page.clickOutside();
      await expect(page.isDropdownOpen()).resolves.toBe(false);
    })
  );

  test(
    'Dropdown remains open when navigating month when a default value is supplied',
    setupTest(async page => {
      await page.clickOpenCalendar();
      await page.clickPreviousMonth();
      await expect(page.isDropdownOpen()).resolves.toBe(true);
    })
  );

  test(
    'Dropdown autocompletes correctly when tabbing out after backspacing once',
    setupTest(async page => {
      await page.clickOpenCalendar();
      await page.clickDate(3, 3);

      await expect(page.getInputText()).resolves.toBe('2018/01/17');

      await page.focusInput();
      await page.keys('Backspace');

      await expect(page.getInputText()).resolves.toBe('2018/01/1');

      await page.keys('Tab');

      await expect(page.getInputText()).resolves.toBe('2018/01/01');

      await expect(page.isDropdownOpen()).resolves.toBe(false);
    })
  );

  test(
    'Selects values from dropdown after backspacing once',
    setupTest(async page => {
      await page.clickOpenCalendar();
      await page.clickDate(3, 3);

      await expect(page.getInputText()).resolves.toBe('2018/01/17');

      await page.focusInput();
      await page.keys('Backspace');
      await page.clickOpenCalendar();

      await expect(page.getInputText()).resolves.toBe('2018/01/01');
      await expect(page.isDropdownOpen()).resolves.toBe(true);

      await page.clickDate(3, 4);

      await expect(page.getInputText()).resolves.toBe('2018/01/18');
      await expect(page.isDropdownOpen()).resolves.toBe(false);
    })
  );

  test(
    'Dropdown selects values after backspacing three times',
    setupTest(async page => {
      await page.clickOpenCalendar();
      await page.clickDate(3, 3);

      await expect(page.getInputText()).resolves.toBe('2018/01/17');
      await page.focusInput();
      await page.keys(['Backspace', 'Backspace', 'Backspace']);

      await page.clickOpenCalendar();
      await expect(page.getInputText()).resolves.toBe('2018/01/01');

      await page.clickDate(3, 4);

      await expect(page.getInputText()).resolves.toBe('2018/01/18');
      await expect(page.isDropdownOpen()).resolves.toBe(false);
    })
  );

  test(
    'clearing the input removes the selected date',
    setupTest(async page => {
      await page.clickOpenCalendar();
      await page.clickDate(3, 3);
      await expect(page.getInputText()).resolves.toBe('2018/01/17');

      await page.focusInput();
      await page.keys(Array(8).fill('Backspace'));
      await expect(page.getInputText()).resolves.toBe('');

      await page.clickOpenCalendar();
      await expect(page.isDateSelected()).resolves.toBe(false);
    })
  );
});
