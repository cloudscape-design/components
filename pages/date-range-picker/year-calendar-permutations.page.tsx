// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

import Box from '~components/box';
import Calendar, { DateRangePickerCalendarProps } from '~components/date-range-picker/calendar';
import Dropdown from '~components/internal/components/dropdown';

import { PermutationsPage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';

const intervals = [
  ['2021-08', '2023-08'], //multi year
  ['2021-08', '2021-08'], //same month
  ['2021-05', '2022-05'], //one year
  ['2024-12', '2025-01'], //start-end
  ['2022-02', '2022-03'], //next
  ['2021-01', '2021-03'], //q1
  ['2022-04', '2022-06'], //q2
  ['2023-07', '2022-09'], //q3
  ['2024-10', '2024-12'], //q4
];

const permutations = createPermutations<DateRangePickerCalendarProps>([
  // Selection range
  ...intervals.map(([startDate, endDate]) => ({
    value: [{ start: { date: startDate, time: '' }, end: { date: endDate, time: '' } }],
    setValue: [() => {}],
    locale: ['en-GB'],
    onChange: [() => {}],
    customAbsoluteRangeControl: [undefined],
  })),
  // Disabled dates
  {
    value: [{ start: { date: '2022-04', time: '' }, end: { date: '2022-06', time: '' } }],
    setValue: [() => {}],
    isDateEnabled: [() => false],
    customAbsoluteRangeControl: [undefined],
  },
  // Custom control
  {
    value: [{ start: { date: '', time: '' }, end: { date: '', time: '' } }],
    setValue: [() => {}],
    customAbsoluteRangeControl: [() => 'Custom control'],
  },
]);

export default function DateRangePickerCalendarPage() {
  let i = -1;
  return (
    <PermutationsPage title="Date range picker permutations: year calendar" i18n={{}}>
      <div style={{ blockSize: `${(1 + permutations.length) * 300}px` }}>
        <PermutationsView
          permutations={permutations}
          render={permutation => {
            i++;
            return (
              <div style={{ insetBlockStart: `${i * 300}px`, position: 'relative' }}>
                <Dropdown
                  stretchWidth={true}
                  stretchHeight={true}
                  stretchToTriggerWidth={false}
                  open={true}
                  onDropdownClose={() => {}}
                  onMouseDown={() => {}}
                  trigger={null}
                >
                  <Box padding="m">
                    <Calendar {...permutation} granularity="month" />
                  </Box>
                </Dropdown>
              </div>
            );
          }}
        />
      </div>
    </PermutationsPage>
  );
}
