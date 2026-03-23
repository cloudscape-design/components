// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Autosuggest, { AutosuggestProps } from '~components/autosuggest';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const style1 = {
  root: {
    borderColor: {
      default: 'light-dark(#f59e0b, #fbbf24)',
      hover: 'light-dark(#b45309, #fcd34d)',
      focus: 'light-dark(#d97706, #fde047)',
      disabled: 'light-dark(#fcd34d, #fef08a)',
      readonly: 'light-dark(#fcd34d, #fef08a)',
    },
    borderWidth: '2px',
    borderRadius: '16px',
    backgroundColor: {
      default: 'light-dark(#fef3c7, #000000)',
      hover: 'light-dark(#fefce8, #0a0a0a)',
      focus: 'light-dark(#fef9c3, #0f0f0f)',
      disabled: 'light-dark(#fcd34d, #1a1a1a)',
      readonly: 'light-dark(#fef3c7, #0a0a0a)',
    },
    boxShadow: {
      default: '0 2px 8px rgba(245, 158, 11, 0.15)',
      hover: '0 6px 16px rgba(245, 158, 11, 0.25)',
      focus: '0 0 0 4px rgba(245, 158, 11, 0.25), 0 6px 16px rgba(245, 158, 11, 0.3)',
      disabled: 'none',
      readonly: '0 2px 8px rgba(245, 158, 11, 0.15)',
    },
    color: {
      default: 'light-dark(#78350f, #fef3c7)',
      hover: 'light-dark(#78350f, #fef3c7)',
      focus: 'light-dark(#78350f, #fef3c7)',
      disabled: 'light-dark(#78350f, #fef3c7)',
      readonly: 'light-dark(#92400e, #fde68a)',
    },
  },
  placeholder: {
    color: 'light-dark(black, white)',
  },
};

const enteredTextLabel = (value: string) => `Use: ${value}`;

const permutations = createPermutations<AutosuggestProps>([
  {
    value: ['This is a test value'],
    disabled: [false, true],
    invalid: [false, true],
    warning: [false, true],
    style: [style1],
    options: [
      [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ],
    ],
    enteredTextLabel: [enteredTextLabel],
  },
  {
    value: [''],
    placeholder: ['Placeholder'],
    disabled: [false, true],
    invalid: [false, true],
    warning: [false, true],
    style: [style1],
    options: [
      [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ],
    ],
    enteredTextLabel: [enteredTextLabel],
  },
]);

export default function AutosuggestStylePermutations() {
  return (
    <>
      <h1>Autosuggest Style permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <div style={{ marginBottom: '100px' }}>
              <Autosuggest
                ariaLabel="Input field"
                clearAriaLabel="Clear"
                onChange={() => {
                  /*empty handler to suppress react controlled property warning*/
                }}
                {...permutation}
              />
            </div>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
