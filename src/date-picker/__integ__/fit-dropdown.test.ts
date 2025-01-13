// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { strict as assert } from 'assert';

import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import DatePickerPage from './page-objects/date-picker-page';

class DatePickerDropdownTestPage extends DatePickerPage {
  async getDropdownDirection() {
    if (!(await this.isDropdownOpen())) {
      return null;
    }

    const dropdownPosition = await this.getDropdownBoundingBox();
    const inputPosition = await this.getInputBoundingBox();

    assert.ok(
      // dropdown is bellow the input
      inputPosition.bottom <= dropdownPosition.top ||
        // dropdown is above the input
        dropdownPosition.bottom <= inputPosition.top,
      'Input and dropdown should not overlap'
    );

    const vertical = dropdownPosition.top < inputPosition.top ? 'up' : 'down';
    const horizontal = dropdownPosition.left < inputPosition.left ? 'left' : 'right';

    return {
      horizontal,
      vertical,
    };
  }
}

describe('Dropdown fitHandler ', () => {
  const dropDownHeight = 800;
  const dropUpHeight = 450;

  const dropLeftWidth = 400;
  const dropRightWidth = 650;

  const setupTest = (testFn: (page: DatePickerDropdownTestPage) => Promise<void>) => {
    return useBrowser(async browser => {
      const page = new DatePickerDropdownTestPage(createWrapper().findDatePicker().getElement(), browser);
      await browser.url('#/light/date-picker/positioning');
      await page.waitForLoad();
      await testFn(page);
    });
  };

  [dropDownHeight, dropUpHeight].forEach(height => {
    const verticalDirection = height === dropUpHeight ? 'up' : 'down';

    describe(`Open dropdown ${verticalDirection} `, () => {
      test(
        'and to the left if on the right is not enough space and left is enough space',
        setupTest(async page => {
          await page.setWindowSize({
            width: dropLeftWidth,
            height,
          });

          await page.clickOpenCalendar();
          expect(await page.getDropdownDirection()).toEqual({
            horizontal: 'left',
            vertical: verticalDirection,
          });

          await page.click('body');
          expect(await page.getDropdownDirection()).toBe(null);

          await page.setWindowSize({
            width: dropRightWidth,
            height,
          });

          await page.clickOpenCalendar();
          expect(await page.getDropdownDirection()).toEqual({
            horizontal: 'right',
            vertical: verticalDirection,
          });
        })
      );
    });
  });
});
