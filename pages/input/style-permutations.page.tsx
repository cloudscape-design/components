// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Input, { InputProps } from '~components/input';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<InputProps>([
  {
    value: [''],
    placeholder: ['Sample placeholder'],
    disabled: [false, true],
    invalid: [false, true],
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
            default: '#f0fdfa',
            hover: '#ccfbf1',
            focus: '#ccfbf1',
            disabled: '#ccfbf1',
          },
          boxShadow: {
            default: '0 1px 2px rgba(0, 0, 0, 0.05)',
            hover: '0 2px 4px rgba(20, 184, 166, 0.15)',
            focus: '0 0 0 4px rgba(20, 184, 166, 0.2), 0 2px 4px rgba(20, 184, 166, 0.15)',
            disabled: 'none',
          },
          color: {
            default: '#0f766e',
            hover: '#0f766e',
            focus: '#0f766e',
            disabled: '#0d9488',
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
            default: '#fef2f2',
            hover: '#fee2e2',
            focus: '#fee2e2',
            disabled: '#fee2e2',
          },
          boxShadow: {
            default: '0 1px 2px rgba(0, 0, 0, 0.05)',
            hover: '0 2px 4px rgba(239, 68, 68, 0.15)',
            focus: '0 0 0 4px rgba(239, 68, 68, 0.2), 0 2px 4px rgba(239, 68, 68, 0.15)',
            disabled: 'none',
          },
          color: {
            default: '#991b1b',
            hover: '#991b1b',
            focus: '#991b1b',
            disabled: '#b91c1c',
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
          borderRadius: '12px',
          backgroundColor: {
            default: '#fffbeb',
            hover: '#fef3c7',
            focus: '#fef3c7',
            disabled: '#fef3c7',
          },
          boxShadow: {
            default: '0 2px 8px rgba(245, 158, 11, 0.15)',
            hover: '0 6px 16px rgba(245, 158, 11, 0.25)',
            focus: '0 0 0 4px rgba(245, 158, 11, 0.25), 0 6px 16px rgba(245, 158, 11, 0.3)',
            disabled: 'none',
          },
          color: {
            default: '#92400e',
            hover: '#92400e',
            focus: '#92400e',
            disabled: '#92400e',
          },
        },
      },
      {
        root: {
          borderColor: {
            default: '#c084fc',
            hover: '#9333ea',
            focus: '#7c3aed',
          },
          borderWidth: '2px',
          borderRadius: '16px',
          backgroundColor: {
            default: '#faf5ff',
            hover: '#f3e8ff',
            focus: '#e9d5ff',
            disabled: '#f3e8ff',
          },
          boxShadow: {
            default: '0 4px 6px rgba(168, 85, 247, 0.1)',
            hover: '0 8px 12px rgba(168, 85, 247, 0.2)',
            focus: '0 0 0 4px rgba(168, 85, 247, 0.2), 0 8px 16px rgba(168, 85, 247, 0.25)',
          },
          color: {
            default: '#6b21a8',
            hover: '#6b21a8',
            focus: '#6b21a8',
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
          borderRadius: '8px',
          backgroundColor: {
            default: '#ffffff',
            hover: '#f0fdf4',
            focus: '#ecfdf5',
            disabled: '#d1fae5',
          },
          boxShadow: {
            default: '0 1px 2px rgba(0, 0, 0, 0.05)',
            hover: '0 2px 4px rgba(16, 185, 129, 0.1)',
            focus: '0 0 0 4px rgba(16, 185, 129, 0.2), 0 2px 4px rgba(16, 185, 129, 0.15)',
            disabled: 'none',
          },
          color: {
            default: '#065f46',
            hover: '#065f46',
            focus: '#065f46',
            disabled: '#047857',
          },
        },
      },
      {
        root: {
          borderColor: {
            default: '#3b82f6',
            hover: '#1d4ed8',
            focus: '#2563eb',
            disabled: '#93c5fd',
          },
          borderWidth: '2px',
          borderRadius: '0px',
          backgroundColor: {
            default: '#eff6ff',
            hover: '#dbeafe',
            focus: '#dbeafe',
            disabled: '#dbeafe',
          },
          boxShadow: {
            default: 'none',
            hover: '0 2px 4px rgba(59, 130, 246, 0.1)',
            focus: '0 0 0 4px rgba(59, 130, 246, 0.15), 0 2px 4px rgba(59, 130, 246, 0.15)',
            disabled: 'none',
          },
          color: {
            default: '#1e40af',
            hover: '#1e40af',
            focus: '#1e40af',
            disabled: '#1d4ed8',
          },
        },
      },
      {
        root: {
          borderColor: {
            default: '#a78bfa',
            hover: '#7c3aed',
            focus: '#8b5cf6',
            disabled: '#ddd6fe',
          },
          borderWidth: '2px',
          borderRadius: '8px',
          backgroundColor: {
            default: '#faf5ff',
            hover: '#f3e8ff',
            focus: '#f3e8ff',
            disabled: '#f3e8ff',
          },
          boxShadow: {
            default: '0 1px 2px rgba(0, 0, 0, 0.05)',
            hover: '0 2px 4px rgba(139, 92, 246, 0.15)',
            focus: '0 0 0 4px rgba(139, 92, 246, 0.2), 0 2px 4px rgba(139, 92, 246, 0.15)',
            disabled: 'none',
          },
          color: {
            default: '#5b21b6',
            hover: '#5b21b6',
            focus: '#5b21b6',
            disabled: '#6b21a8',
          },
          fontSize: '22px',
          fontWeight: '700',
          paddingBlock: '20px',
          paddingInline: '28px',
          placeholder: {
            color: '#7c3aed',
            fontStyle: 'italic',
            fontSize: '18px',
            fontWeight: '400',
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
        <PermutationsView permutations={permutations} render={permutation => <Input {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
