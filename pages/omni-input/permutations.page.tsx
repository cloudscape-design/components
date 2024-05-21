// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Input, { InputProps } from '~components/input';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<InputProps>([
  {
    disabled: [false, true],
    type: ['text', 'password', 'search', 'email', 'url'] as const,
    invalid: [false, true],
    warning: [false, true],
    value: [
      '',
      'Short value',
      'Long value, enough to extend beyond the input width.  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
  },
  {
    value: [''],
    disabled: [false, true],
    type: ['text', 'password', 'search', 'email', 'url'] as const,
    placeholder: [
      'Short placeholder',
      'Long placeholder, enough to extend beyond the input width.  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
  },
  {
    disabled: [false, true],
    type: ['text', 'password', 'search', 'email', 'url'] as const,
    value: ['Non-empty value: Placeholder should be hidden'],
    placeholder: ['Short placeholder'],
  },
  {
    disabled: [false, true],
    type: ['number'] as const,
    value: ['-1', '1'],
    placeholder: ['Short placeholder'],
  },
  {
    readOnly: [true],
    type: ['text', 'password', 'search', 'number', 'email', 'url'] as const,
    value: ['100000000'],
    placeholder: ['Short placeholder'],
  },
]);

export default function InputPermutations() {
  return (
    <>
      <h1>Input permutations</h1>
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
