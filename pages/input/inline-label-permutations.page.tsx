// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Input, { InputProps } from '~components/input';

import { PermutationsPage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';

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
    <PermutationsPage title="Input inlineLabelText permutations">
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
    </PermutationsPage>
  );
}
