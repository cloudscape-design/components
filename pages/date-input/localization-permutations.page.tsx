// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import DateInput, { DateInputProps } from '~components/date-input';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const locales = [
  'ar',
  'de',
  'en-GB',
  'en-US',
  'es',
  'fr',
  'he',
  'id',
  'it',
  'ja',
  'ko',
  'ms',
  'pt-BR',
  'th',
  'tr',
  'vi',
  'zh-CN',
  'zh-TW',
];
const permutations = createPermutations<DateInputProps>([
  {
    value: ['2020-01-01'],
    format: ['long-localized'],
    locale: [...locales],
    granularity: ['day', 'month'],
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
            />
          )}
        />
      </ScreenshotArea>
    </Box>
  );
}
