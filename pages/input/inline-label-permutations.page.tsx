// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Input, { InputProps } from '~components/input';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<InputProps>([
  {
    inlineLabelText: ['Region'],
    value: ['us-east-1'],
    disabled: [false, true],
    readOnly: [false, true],
    invalid: [false, true],
  },
  {
    inlineLabelText: ['Amount'],
    value: ['10'],
    prefix: ['$'],
    suffix: ['USD'],
    disabled: [false, true],
    readOnly: [false, true],
    invalid: [false, true],
  },
]);

export default function InputInlineLabelPermutations() {
  return (
    <>
      <h1>Input inlineLabelText permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <Input
              ariaLabel="Input field"
              clearAriaLabel="Clear"
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
