// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import DateInput, { DateInputProps } from '~components/date-input';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { generatePlaceholder } from './common';

const permutations = createPermutations<DateInputProps>([
  {
    value: ['', '2020-01-01'],
    placeholder: ['', 'applied'],
    format: ['slashed', 'iso', 'long-localized'],
    inputFormat: ['slashed', 'iso'],
    ariaLabel: ['Some label'],
    invalid: [false, true],
    readOnly: [false, true],
    disabled: [false, true],
  },
]);

export default function DateInputPermutations() {
  return (
    <Box padding="l">
      <h1>Date Input permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <DateInput
              onChange={() => {
                /*empty handler to suppress react controlled property warning*/
              }}
              {...permutation}
              granularity="day"
              locale="en-US"
              placeholder={
                permutation.placeholder
                  ? generatePlaceholder(
                      false,
                      permutation.format === 'iso' ||
                        (permutation.format === 'long-localized' && permutation.inputFormat === 'iso')
                    )
                  : ''
              }
            />
          )}
        />
      </ScreenshotArea>
    </Box>
  );
}
