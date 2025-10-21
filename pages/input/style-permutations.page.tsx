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
    onChange: [() => {}],
    style: [
      {
        root: {
          borderColor: {
            default: '#14b8a6',
            hover: '#0f766e',
            focus: '#0d9488',
            disabled: '#99f6e4',
          },
          borderWidth: '2px',
          borderRadius: '8px',
          backgroundColor: {
            default: '#99f6e4',
            hover: '#5eead4',
            focus: '#5eead4',
            disabled: '#5eead4',
          },
          boxShadow: {
            default: '0 1px 2px rgba(0, 0, 0, 0.05)',
            hover: '0 2px 4px rgba(20, 184, 166, 0.15)',
            focus: '0 0 0 4px rgba(20, 184, 166, 0.2), 0 2px 4px rgba(20, 184, 166, 0.15)',
            disabled: 'none',
          },
          color: {
            default: '#0d5c54',
            hover: '#0d5c54',
            focus: '#0d5c54',
            disabled: '#0d5c54',
          },
          fontSize: '16px',
          fontWeight: '500',
          paddingBlock: '12px',
          paddingInline: '16px',
          placeholder: {
            color: '#14b8a6',
            fontSize: '14px',
            fontStyle: 'italic',
            fontWeight: '400',
          },
        },
      },
      {
        root: {
          borderColor: {
            default: '#ef4444',
            hover: '#b91c1c',
            focus: '#dc2626',
            disabled: '#fca5a5',
          },
          borderWidth: '2px',
          borderRadius: '8px',
          backgroundColor: {
            default: '#fecaca',
            hover: '#fca5a5',
            focus: '#fca5a5',
            disabled: '#fca5a5',
          },
          boxShadow: {
            default: '0 1px 2px rgba(0, 0, 0, 0.05)',
            hover: '0 2px 4px rgba(239, 68, 68, 0.15)',
            focus: '0 0 0 4px rgba(239, 68, 68, 0.2), 0 2px 4px rgba(239, 68, 68, 0.15)',
            disabled: 'none',
          },
          color: {
            default: '#7f1d1d',
            hover: '#7f1d1d',
            focus: '#7f1d1d',
            disabled: '#7f1d1d',
          },
        },
      },
      {
        root: {
          borderColor: {
            default: '#f59e0b',
            hover: '#b45309',
            focus: '#d97706',
            disabled: '#fcd34d',
          },
          borderWidth: '2px',
          borderRadius: '16px',
          backgroundColor: {
            default: '#fde68a',
            hover: '#fcd34d',
            focus: '#fcd34d',
            disabled: '#fcd34d',
          },
          boxShadow: {
            default: '0 2px 8px rgba(245, 158, 11, 0.15)',
            hover: '0 6px 16px rgba(245, 158, 11, 0.25)',
            focus: '0 0 0 4px rgba(245, 158, 11, 0.25), 0 6px 16px rgba(245, 158, 11, 0.3)',
            disabled: 'none',
          },
          color: {
            default: '#78350f',
            hover: '#78350f',
            focus: '#78350f',
            disabled: '#78350f',
          },
        },
      },
      {
        root: {
          borderColor: {
            default: '#10b981',
            hover: '#047857',
            focus: '#059669',
            disabled: '#6ee7b7',
          },
          borderWidth: '3px',
          borderRadius: '0px',
          backgroundColor: {
            default: '#d1fae5',
            hover: '#a7f3d0',
            focus: '#a7f3d0',
            disabled: '#a7f3d0',
          },
          boxShadow: {
            default: '0 1px 2px rgba(0, 0, 0, 0.05)',
            hover: '0 2px 4px rgba(16, 185, 129, 0.1)',
            focus: '0 0 0 4px rgba(16, 185, 129, 0.2), 0 2px 4px rgba(16, 185, 129, 0.15)',
            disabled: 'none',
          },
          color: {
            default: '#064e3b',
            hover: '#064e3b',
            focus: '#064e3b',
            disabled: '#064e3b',
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
