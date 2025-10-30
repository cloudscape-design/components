// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Input, { InputProps } from '~components/input';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<InputProps>([
  {
    value: ['This is an example value'],
    placeholder: [''],
    disabled: [false, true],
    readOnly: [false, true],
    invalid: [false, true],
    warning: [false, true],
    onChange: [() => {}],
    style: [
      {
        root: {
          borderColor: {
            default: '#14b8a6',
            hover: '#0f766e',
            focus: '#0d9488',
            disabled: '#99f6e4',
            readonly: '#5eead4',
          },
          borderWidth: '2px',
          borderRadius: '8px',
          backgroundColor: {
            default: '#99f6e4',
            hover: '#5eead4',
            focus: '#5eead4',
            disabled: '#5eead4',
            readonly: '#ccfbf1',
          },
          boxShadow: {
            default: '0 1px 2px rgba(0, 0, 0, 0.05)',
            hover: '0 2px 4px rgba(20, 184, 166, 0.15)',
            focus: '0 0 0 4px rgba(20, 184, 166, 0.2), 0 2px 4px rgba(20, 184, 166, 0.15)',
            disabled: 'none',
            readonly: '0 1px 2px rgba(0, 0, 0, 0.05)',
          },
          color: {
            default: '#0d5c54',
            hover: '#0d5c54',
            focus: '#0d5c54',
            disabled: '#0d5c54',
            readonly: '#0f766e',
          },
          fontSize: '16px',
          fontWeight: '500',
          paddingBlock: '12px',
          paddingInline: '16px',
        },
        placeholder: {
          color: '#14b8a6',
          fontSize: '14px',
          fontStyle: 'italic',
          fontWeight: '400',
        },
      },
      {
        root: {
          borderColor: {
            default: '#f59e0b',
            hover: '#b45309',
            focus: '#d97706',
            disabled: '#fcd34d',
            readonly: '#fcd34d',
          },
          borderWidth: '2px',
          borderRadius: '16px',
          backgroundColor: {
            default: '#fde68a',
            hover: '#fcd34d',
            focus: '#fcd34d',
            disabled: '#fcd34d',
            readonly: '#fef3c7',
          },
          boxShadow: {
            default: '0 2px 8px rgba(245, 158, 11, 0.15)',
            hover: '0 6px 16px rgba(245, 158, 11, 0.25)',
            focus: '0 0 0 4px rgba(245, 158, 11, 0.25), 0 6px 16px rgba(245, 158, 11, 0.3)',
            disabled: 'none',
            readonly: '0 2px 8px rgba(245, 158, 11, 0.15)',
          },
          color: {
            default: '#78350f',
            hover: '#78350f',
            focus: '#78350f',
            disabled: '#78350f',
            readonly: '#92400e',
          },
        },
      },
    ],
  },
]);

export default function InputStylePermutations() {
  return (
    <>
      <h1>Input Style permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => <Input ariaLabel="Input field" {...permutation} />}
        />
      </ScreenshotArea>
    </>
  );
}
