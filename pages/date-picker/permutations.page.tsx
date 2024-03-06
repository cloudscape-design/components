// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import MockDate from 'mockdate';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { Box, SpaceBetween, DatePicker, DatePickerProps } from '~components';
import i18nStrings from './i18n-strings';

// Mock the date in order to have the current day styling in place for screenshot testing.
MockDate.set(new Date(2020, 9, 8));

const openCalendarAriaLabel = (selectedDate: string | null) =>
  'Choose Date' + (selectedDate ? `, selected date is ${selectedDate}` : '');

const permutations = createPermutations<DatePickerProps>([
  {
    value: ['', '2020-10-01'],
    placeholder: [undefined, 'YYYY/MM/DD'],
    disabled: [false, true],
    readOnly: [false, true],
    invalid: [false, true],
    warning: [false, true],
    todayAriaLabel: ['Today'],
    nextMonthAriaLabel: ['Next Month'],
    previousMonthAriaLabel: ['Previous Month'],
    name: ['date-picker-name'],
    ariaLabel: ['date-picker-label'],
    openCalendarAriaLabel: [openCalendarAriaLabel],
  },
]);

export default function DatePickerScenario() {
  return (
    <Box padding="s">
      <h1>Date picker permutations</h1>
      <ScreenshotArea>
        <SpaceBetween size="m">
          <div style={{ height: '300px' }} data-testid="date-picker-expanded-example">
            <DatePicker
              value={'2020-10-26'}
              name={'date-picker-name'}
              ariaLabel={'date-picker-label'}
              locale="en-GB"
              i18nStrings={i18nStrings}
              placeholder={'YYYY/MM/DD'}
              isDateEnabled={date => date.getDay() !== 0}
              openCalendarAriaLabel={openCalendarAriaLabel}
            />
          </div>
          <PermutationsView permutations={permutations} render={permutation => <DatePicker {...permutation} />} />
        </SpaceBetween>
      </ScreenshotArea>
    </Box>
  );
}
