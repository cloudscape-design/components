// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import DateInput, { DateInputProps } from '~components/date-input';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { locales } from './common';

const permutationsFormats = createPermutations<DateInputProps>([
  {
    value: ['2020-01-02'],
    ariaLabel: ['Some label'],
    format: ['iso', 'slashed', 'long-localized'],
    granularity: ['day', 'month'],
  },
]);

const permutationsLongLocalizedLocales = createPermutations<DateInputProps>([
  {
    value: ['2020-01-02'],
    ariaLabel: ['Some label'],
    format: ['long-localized'],
    granularity: ['day', 'month'],
    locale: locales,
  },
]);

export default function DateInputPermutations() {
  return (
    <Box padding="l">
      <h1>Date Input permutations - formats</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutationsFormats}
          render={permutation => <DateInput {...permutation} onChange={() => {}} />}
        />

        <br />
        <hr />
        <br />

        <PermutationsView
          permutations={permutationsLongLocalizedLocales}
          render={permutation => <DateInput {...permutation} onChange={() => {}} />}
        />
      </ScreenshotArea>
    </Box>
  );
}
