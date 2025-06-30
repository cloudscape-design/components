// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import DateRangePickerPage from './page-objects/date-range-picker-page';

interface SetupTestOptions {
  granularity: string;
  dateOnly: boolean;
  format: string;
  inputFormat: string;
}

const setupTest = (
  testFn: (page: DateRangePickerPage) => Promise<void>,
  { granularity = 'day', format = 'slashed', inputFormat = 'slashed', dateOnly = false }: SetupTestOptions
) => {
  return useBrowser(async browser => {
    const params = new URLSearchParams({
      monthOnly: `${granularity === 'month'}`,
      dateOnly: `${dateOnly}`,
      absoluteFormat: `${format}`,
      ...(format === 'long-localized' ? { dateInputFormat: `${inputFormat},` } : {}),
    }).toString();
    const page = new DateRangePickerPage(createWrapper().findDateRangePicker().getElement(), browser);
    await browser.url(`#/light/date-range-picker/with-value?${params}`);
    await page.waitForLoad();
    await testFn(page);
  });
};

interface GenerateTriggerTextProps {
  isMonthOnly: boolean;
  isDateOnly: boolean;
  isHumanReadable: boolean;
  isIso: boolean;
  startDay: string;
  startTime?: string;
  endDay: string;
  endTime?: string;
}

const generateTriggerText = ({
  isMonthOnly,
  isDateOnly,
  isHumanReadable,
  isIso,
  startDay,
  startTime,
  endDay,
  endTime,
}: GenerateTriggerTextProps) => {
  const hasTime = !isMonthOnly && !isDateOnly;
  const separator = isIso ? '-' : '/';
  const startDateTimeStringNumeric = `2018${separator}01${isMonthOnly ? '' : `${separator}${startDay}`}${
    hasTime ? `T${startTime}+00:00` : ''
  }`;
  const startDateTimeStringHumanReadable = `${isMonthOnly ? '' : `${parseInt(startDay)} `}January 2018${
    hasTime ? `, ${startTime} (UTC)` : ''
  }`;

  const endDateTimeStringNumeric = `2018${separator}01${isMonthOnly ? '' : `${separator}${endDay}`}${
    hasTime ? `T${endTime}+00:00` : ''
  }`;
  const endDateTimeStringHumanReadable = `${isMonthOnly ? '' : `${parseInt(endDay)} `}January 2018${
    hasTime ? `, ${endTime} (UTC)` : ''
  }`;
  if (isHumanReadable) {
    return `${startDateTimeStringHumanReadable} — ${endDateTimeStringHumanReadable}`;
  }
  return `${startDateTimeStringNumeric} — ${endDateTimeStringNumeric}`;
};

describe('Date Range Picker', () => {
  describe.each(['day', 'month'] as const)('With granularity of %s', granularity => {
    describe.each([true, false] as const)('"%s" dateOnly', dateOnly => {
      describe.each(['slashed', 'iso', 'long-localized'] as const)('"%s" format', format => {
        describe.each(['slashed', 'iso'] as const)('"%s" inputFormat', inputFormat => {
          const testParams: SetupTestOptions = { granularity, dateOnly, format, inputFormat };
          test(
            'Selecting a date via keyboard',
            setupTest(async page => {
              await page.focusTrigger();
              await page.keys('Enter');

              // Focus grid
              await page.keys(['Tab', 'Tab', 'Tab', 'Tab']);

              await page.keys('ArrowDown');
              await page.keys('Enter');

              await page.keys(['ArrowDown', 'ArrowRight']);
              await page.keys('Enter');

              // Focus Apply button
              await page.keys(['Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab']);
              await page.keys('Enter');

              await expect(page.getTriggerText()).resolves.toBe(
                generateTriggerText({
                  isMonthOnly: granularity === 'month',
                  isDateOnly: dateOnly,
                  isHumanReadable: format === 'long-localized',
                  isIso: format === 'iso' || (format === 'long-localized' && inputFormat === 'iso'),
                  startDay: '09', //16
                  startTime: '00:00:00',
                  endDay: '19', //'24',
                  endTime: '23:59:59',
                })
              );
            }, testParams)
          );

          test(
            'should choose the correct date input to fill',
            setupTest(async page => {
              await page.focusTrigger();
              await page.keys('Enter');

              // Clear selected start date & time
              await page.keys(['Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Backspace']);
              await page.keys(['Tab', 'Backspace']);

              // Focus grid
              await page.keys(['Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab']);

              await page.keys(['ArrowRight', 'ArrowDown']);
              await page.keys('Enter');

              // Focus Apply button
              await page.keys(['Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab']);
              await page.keys('Enter');

              await expect(page.getTriggerText()).resolves.toBe(
                generateTriggerText({
                  isMonthOnly: granularity === 'month',
                  isDateOnly: dateOnly,
                  isHumanReadable: format === 'long-localized',
                  isIso: format === 'iso' || (format === 'long-localized' && inputFormat === 'iso'),
                  startDay: '09', //'17',
                  startTime: '00:00:00',
                  endDay: '19',
                  endTime: '15:30:00',
                })
              );
            }, testParams)
          );

          test(
            'should not steal focus when clicking away onto another element',
            setupTest(async page => {
              await page.focusTrigger();
              await page.keys('Enter');
              await page.focusPrevElement();
              await expect(page.isPrevElementFocused()).resolves.toBe(true);
            }, testParams)
          );

          test(
            'should trap focus inside dropdown',
            setupTest(async page => {
              await page.focusTrigger();
              await page.keys('Enter');

              await expect(page.isDropdownFocused()).resolves.toBe(true);

              let counter = 0;
              do {
                await page.keys('Tab');
                counter++;
              } while (!(await page.isDropdownFocused()) && counter !== 12);

              await expect(page.isDropdownFocused()).resolves.toBe(true);
            }, testParams)
          );
        });
      });
    });
  });
});
