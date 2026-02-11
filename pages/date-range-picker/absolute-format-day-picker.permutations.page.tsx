// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { DateRangePicker, type DateRangePickerProps } from '~components';

import { PermutationsPage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import { isValid, placeholders } from './common';

const permutations = createPermutations<DateRangePickerProps>([
  {
    absoluteFormat: ['iso', 'slashed', 'long-localized'],
    dateOnly: [true, false],
    value: [{ type: 'absolute', startDate: '2024-12-30', endDate: '2024-12-31' }],
    isValidRange: [() => ({ valid: true })],
    relativeOptions: [[]],
  },
  {
    absoluteFormat: ['iso', 'slashed', 'long-localized'],
    dateOnly: [true, false],
    hideTimeOffset: [true, false],
    value: [{ type: 'absolute', startDate: '2024-12-30T00:00:00+01:00', endDate: '2024-12-31T23:59:59+01:00' }],
    isValidRange: [() => ({ valid: true })],
    relativeOptions: [[]],
  },
]);

export default function DateRangePickerPermutations() {
  return (
    <PermutationsPage title="Date range picker permutations: absolute with day granularity" i18n={{}}>
      <PermutationsView
        permutations={permutations}
        render={permutation => (
          <DateRangePicker
            {...permutation}
            placeholder={permutation.dateOnly ? placeholders['date-only'] : placeholders.mixed}
            granularity="day"
            locale="en-US"
            rangeSelectorMode="absolute-only"
            isValidRange={value => isValid('day')(value)}
            getTimeOffset={() => 60}
          />
        )}
      />
    </PermutationsPage>
  );
}
