// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import RadioButton, { RadioButtonProps } from '~components/radio-button';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<RadioButtonProps>([
  {
    children: ['First choice'],
    name: ['radio-group-name'],
    readOnly: [false, true],
    disabled: [false, true],
    checked: [true, false],
  },
]);

export default function RadioButtonPermutations() {
  return (
    <>
      <h1>RadioButton permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <RadioButton
              onChange={() => {
                /*empty handler to suppress react controlled property warning*/
              }}
              {...permutation}
            />
          )}
        />
      </ScreenshotArea>
    </>
  );
}
