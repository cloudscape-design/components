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
};

const style2 = {
  root: {
    borderColor: {
      default: 'light-dark(#10b981, #34d399)',
      hover: 'light-dark(#047857, #6ee7b7)',
      focus: 'light-dark(#059669, #4ade80)',
      disabled: 'light-dark(#6ee7b7, #a7f3d0)',
      readonly: 'light-dark(#6ee7b7, #a7f3d0)',
    },
    borderWidth: '3px',
    borderRadius: '0px',
    backgroundColor: {
      default: 'light-dark(#ecfdf5, #000000)',
      hover: 'light-dark(#f0fdf4, #0a0a0a)',
      focus: 'light-dark(#ecfdf5, #0f0f0f)',
      disabled: 'light-dark(#a7f3d0, #1a1a1a)',
      readonly: 'light-dark(#ecfdf5, #0a0a0a)',
    },
    boxShadow: {
      default: '0 1px 2px rgba(0, 0, 0, 0.05)',
      hover: '0 2px 4px rgba(16, 185, 129, 0.1)',
      focus: '0 0 0 4px rgba(16, 185, 129, 0.2), 0 2px 4px rgba(16, 185, 129, 0.15)',
      disabled: 'none',
      readonly: '0 1px 2px rgba(0, 0, 0, 0.05)',
    },
    color: {
      default: 'light-dark(#064e3b, #d1fae5)',
      hover: 'light-dark(#064e3b, #d1fae5)',
      focus: 'light-dark(#064e3b, #d1fae5)',
      disabled: 'light-dark(#064e3b, #d1fae5)',
      readonly: 'light-dark(#065f46, #a7f3d0)',
    },
  },
};

const enteredTextLabel = (value: string) => `Use: ${value}`;

const permutations = createPermutations<AutosuggestProps>([
  {
    value: ['This is a test value'],
    placeholder: [''],
    disabled: [false, true],
    readOnly: [false, true],
    invalid: [false, true],
    options: [
      [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ],
      undefined,
    ],
    enteredTextLabel: [enteredTextLabel],
    style: [style1, style2],
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
