// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { DateRangePicker, DateRangePickerProps } from '~components';

import { PermutationsPage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import { isValid, placeholders } from './common';

const permutations = createPermutations<DateRangePickerProps>([
  {
    absoluteFormat: ['iso', 'long-localized'],
    value: [
      {
        type: 'absolute',
        startDate: '2024-12',
        endDate: '2025-01',
      },
    ],
    isValidRange: [() => ({ valid: true })],
    relativeOptions: [[]],
  },
  {
    absoluteFormat: ['iso', 'long-localized'],
    hideTimeOffset: [true, false],
    value: [
      {
        type: 'absolute',
        startDate: '2023-06',
        endDate: '2024-02',
      },
    ],
    isValidRange: [() => ({ valid: true })],
    relativeOptions: [[]],
  },
]);

export default function DateRangePickerPermutations() {
  return (
    <PermutationsPage title="Date range picker permutations: absolute with month granularity" i18n={{}}>
      <PermutationsView
        permutations={permutations}
        render={permutation => (
          <DateRangePicker
            {...permutation}
            placeholder={placeholders['month-only']}
            dateOnly={false}
            granularity="month"
            locale="en-US"
            rangeSelectorMode="absolute-only"
            isValidRange={value => isValid('month')(value)}
            getTimeOffset={() => 60}
          />
        )}
      />
    </PermutationsPage>
  );
}
