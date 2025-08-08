// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import MockDate from 'mockdate';

import { Box, DatePicker, DatePickerProps, SpaceBetween } from '~components';

import { locales } from '../date-input/common';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

// Mock the date in order to have the current day styling in place for screenshot testing.
MockDate.set(new Date(2020, 9, 8));

const openCalendarAriaLabel = (selectedDate: string | null) =>
  'Choose Date' + (selectedDate ? `, selected date is ${selectedDate}` : '');

const common = {
  todayAriaLabel: ['Today'],
  nextMonthAriaLabel: ['Next Month'],
  previousMonthAriaLabel: ['Previous Month'],
  name: ['date-picker-name'],
  ariaLabel: ['date-picker-label'],
  openCalendarAriaLabel: [openCalendarAriaLabel],
} as const;

const permutationsFormatsDay = createPermutations<DatePickerProps>([
  {
    value: ['2020-01-02'],
    format: ['iso', 'slashed', 'long-localized'],
    granularity: ['day'],
    ...common,
  },
]);

const permutationsFormatsMonth = createPermutations<DatePickerProps>([
  {
    value: ['2020-01'],
    format: ['iso', 'slashed', 'long-localized'],
    granularity: ['month'],
    ...common,
  },
]);

const permutationsLongLocalizedLocales = createPermutations<DatePickerProps>([
  {
    value: ['2020-01-02'],
    format: ['long-localized'],
    granularity: ['day', 'month'],
    locale: locales,
    ...common,
  },
]);

export default function DatePickerScenario() {
  return (
    <Box padding="s">
      <h1>Date picker permutations - formats</h1>
      <ScreenshotArea>
        <SpaceBetween size="m">
          <PermutationsView
            permutations={permutationsFormatsDay}
            render={permutation => <DatePicker {...permutation} onChange={() => {}} />}
          />
          <PermutationsView
            permutations={permutationsFormatsMonth}
            render={permutation => <DatePicker {...permutation} onChange={() => {}} />}
          />

          <br />
          <hr />
          <br />

          <PermutationsView
            permutations={permutationsLongLocalizedLocales}
            render={permutation => <DatePicker {...permutation} onChange={() => {}} />}
          />
        </SpaceBetween>
      </ScreenshotArea>
    </Box>
  );
}
