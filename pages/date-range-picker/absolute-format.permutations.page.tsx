// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { Box, DateRangePicker, DateRangePickerProps, SpaceBetween } from '~components';
import { i18nStrings, isValid } from './common';
import ScreenshotArea from '../utils/screenshot-area';
import PermutationsView from '../utils/permutations-view';
import createPermutations from '../utils/permutations';

const permutations = createPermutations<
  Pick<DateRangePickerProps, 'absoluteFormat' | 'dateOnly' | 'hideTimeOffset' | 'value'>
>([
  {
    absoluteFormat: ['iso', 'long-localized'],
    dateOnly: [true],
    value: [
      {
        type: 'absolute',
        startDate: '2024-12-30',
        endDate: '2024-12-31',
      },
    ],
  },
  {
    absoluteFormat: ['iso', 'long-localized'],
    dateOnly: [false],
    hideTimeOffset: [true, false],
    value: [
      {
        type: 'absolute',
        startDate: '2024-12-30T00:00:00+01:00',
        endDate: '2024-12-31T23:59:59+01:00',
      },
    ],
  },
]);

export default function DateRangePickerPermutations() {
  return (
    <Box padding="s">
      <SpaceBetween direction="vertical" size="m">
        <h1>Absolute date range picker with custom absolute format</h1>
        <hr />
        <ScreenshotArea>
          <PermutationsView
            permutations={permutations}
            render={permutation => (
              <DateRangePicker
                value={permutation.value}
                absoluteFormat={permutation.absoluteFormat}
                dateOnly={permutation.dateOnly}
                hideTimeOffset={permutation.hideTimeOffset}
                locale="en-US"
                i18nStrings={i18nStrings}
                placeholder={'Filter by a date and time range'}
                relativeOptions={[]}
                isValidRange={isValid}
                rangeSelectorMode={'absolute-only'}
                getTimeOffset={() => 60}
              />
            )}
          />
        </ScreenshotArea>
      </SpaceBetween>
    </Box>
  );
}
