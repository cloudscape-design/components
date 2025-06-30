// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import MockDate from 'mockdate';

import { Box, DatePicker, DatePickerProps, SpaceBetween } from '~components';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

// Mock the date in order to have the current day styling in place for screenshot testing.
MockDate.set(new Date(2020, 9, 8));

const openCalendarAriaLabel = (selectedDate: string | null) =>
  'Choose Date' + (selectedDate ? `, selected date is ${selectedDate}` : '');

const permutations = createPermutations<DatePickerProps>([
  {
    value: ['2020-03-01'],
    todayAriaLabel: ['Today'],
    nextMonthAriaLabel: ['Next Month'],
    previousMonthAriaLabel: ['Previous Month'],
    name: ['date-picker-name'],
    locale: ['en-US', 'de'],
    ariaLabel: ['date-picker-label'],
    granularity: ['day', 'month'],
    openCalendarAriaLabel: [openCalendarAriaLabel],
    format: ['iso', 'long-localized', 'slashed'],
    inputFormat: ['iso', 'slashed'],
  },
]);

export default function DatePickerScenario() {
  return (
    <Box padding="s">
      <h1>Date picker permutations</h1>
      <ScreenshotArea>
        <SpaceBetween size="m">
          <PermutationsView permutations={permutations} render={permutation => <DatePicker {...permutation} />} />
        </SpaceBetween>
      </ScreenshotArea>
    </Box>
  );
}
