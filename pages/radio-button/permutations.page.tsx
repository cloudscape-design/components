// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import RadioButton, { RadioButtonProps } from '~components/radio-button';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { longText, shortText } from './common';

const permutations = createPermutations<Omit<RadioButtonProps, 'name'>>([
  {
    description: [undefined, shortText, longText],
    children: [undefined, shortText, longText],
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
          render={(permutation, index) => (
            <RadioButton
              onChange={() => {
                /*empty handler to suppress react controlled property warning*/
              }}
              {...permutation}
              name={`radio-group-${index}`}
            />
          )}
        />
      </ScreenshotArea>
    </>
  );
}
