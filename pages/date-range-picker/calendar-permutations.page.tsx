// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import Box from '~components/box';
import Calendar, { DateRangePickerCalendarProps } from '~components/date-range-picker/calendar';
import Dropdown from '~components/internal/components/dropdown';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { i18nStrings } from './common';

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
];

const permutations = createPermutations<DateRangePickerCalendarProps>(
  intervals.map(([startDate, endDate]) => ({
    value: [{ start: { date: startDate, time: '' }, end: { date: endDate, time: '' } }],
    setValue: [() => {}],
    locale: ['en-GB'],
    startOfWeek: [1],
    isDateEnabled: [() => true],
    onChange: [() => {}],
    timeInputFormat: ['hh:mm:ss'],
    i18nStrings: [i18nStrings],
    dateOnly: [false, true],
  }))
);

export default function DateRangePickerCalendarPage() {
  let i = -1;
  return (
    <>
      <h1>Date-range-picker calendar page for screenshot tests</h1>
      <ScreenshotArea>
        <div style={{ height: `${intervals.length * 400}px` }}>
          <PermutationsView
            permutations={permutations}
            render={permutation => {
              i++;
              return (
                <div style={{ top: `${i * 400}px`, position: 'relative' }}>
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
        </div>
      </ScreenshotArea>
    </>
  );
}
