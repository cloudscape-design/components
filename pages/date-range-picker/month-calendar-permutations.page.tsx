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
  ['2021-08-01', '2021-08-31'],
  ['2021-08-02', '2021-09-01'],
  ['2021-08-09', '2021-08-16'],
  ['2021-08-30', '2021-08-31'],
  ['2021-08-31', '2021-09-22'],
  ['2021-08-10', '2021-08-14'],
  ['2021-08-03', '2021-08-09'],
  ['2021-05-10', '2021-05-31'],
  ['2021-05-10', '2021-05-30'],
  ['2024-12-15', '2025-01-15'],
  ['2025-01-15', '2025-01-15'],
];

const permutations = createPermutations<DateRangePickerCalendarProps>([
  // Selection range
  ...intervals.map(([startDate, endDate]) => ({
    value: [{ start: { date: startDate, time: '' }, end: { date: endDate, time: '' } }],
    setValue: [() => {}],
    locale: ['en-GB'],
    startOfWeek: [1],
    onChange: [() => {}],
    timeInputFormat: ['hh:mm:ss'] as const,
    customAbsoluteRangeControl: [undefined],
  })),
  // Disabled dates
  {
    value: [{ start: { date: '2021-08-30', time: '' }, end: { date: '2021-09-03', time: '' } }],
    setValue: [() => {}],
    isDateEnabled: [() => false, (date: Date) => date.getDate() % 2 !== 0],
    customAbsoluteRangeControl: [undefined],
  },
  // Date-only
  {
    value: [{ start: { date: '', time: '' }, end: { date: '', time: '' } }],
    setValue: [() => {}],
    dateOnly: [true],
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
    <PermutationsPage title="Date range picker permutations: month calendar" i18n={{}}>
      <PermutationsView
        permutations={permutations}
        render={permutation => {
          i++;
          return (
            <div style={{ insetBlockStart: `${i * 400}px`, position: 'relative' }}>
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
                  <Calendar {...permutation} />
                </Box>
              </Dropdown>
            </div>
          );
        }}
      />
    </PermutationsPage>
  );
}
