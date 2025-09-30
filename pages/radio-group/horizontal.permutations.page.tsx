// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import RadioGroup, { RadioGroupProps } from '~components/radio-group';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import permutations from './common-permutations';

const extraPermutations = createPermutations<RadioGroupProps>([
  {
    value: ['first'],
    items: [
      [
        { value: 'first', label: 'First Button' },
        { value: 'second', label: 'Second Button' },
        { value: 'third', label: 'Third Button' },
        { value: 'fourth', label: 'Fourth Button' },
        { value: 'fifth', label: 'Fifth Button' },
        { value: 'sixth', label: 'Sixth Button' },
        { value: 'seventh', label: 'Seventh Button' },
        { value: 'eighth', label: 'Eighth Button' },
        { value: 'ninth', label: 'Ninth Button' },
        { value: 'tenth', label: 'Tenth Button' },
        { value: 'eleventh', label: 'Eleventh Button' },
        { value: 'twelfth', label: 'Twelfth Button' },
      ],
    ],
  },
]);

export default function HorizontalRadioGroupPermutations() {
  return (
    <>
      <h1>RadioGroup horizontal permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={[...permutations, ...extraPermutations]}
          render={permutation => (
            <>
              <div style={{ borderBlockEnd: '1px solid #DDD', paddingBlockStart: 64, paddingBlockEnd: 80 }}>
                <RadioGroup
                  direction="horizontal"
                  onChange={() => {
                    /*empty handler to suppress react controlled property warning*/
                  }}
                  {...permutation}
                />
              </div>
            </>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
