// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ToggleButton, { ToggleButtonProps } from '~components/toggle-button';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<ToggleButtonProps>([
  {
    variant: ['normal'],
    children: ['Subscribe'],
    pressed: [false, true],
    disabled: [false, true],
    iconName: ['thumbs-up'],
    pressedIconName: ['thumbs-up-filled'],
    onChange: [() => {}],
    style: [
      {
        root: {
          background: {
            default: '#2563eb',
            hover: '#1d4ed8',
            active: '#1e40af',
            disabled: '#bfdbfe',
            pressed: '#1e3a8a',
          },
          borderColor: {
            default: '#2563eb',
            hover: '#1d4ed8',
            active: '#1e3a8a',
            disabled: '#60a5fa',
            pressed: '#1e3a8a',
          },
          borderWidth: '2px',
          borderRadius: '0',
          boxShadow: {
            default: '0 1px 2px rgba(0, 0, 0, 0.05)',
            hover: '0 2px 4px rgba(59, 130, 246, 0.15)',
            active: '0 1px 2px rgba(0, 0, 0, 0.05)',
            disabled: 'none',
            pressed: '0 0 0 4px rgba(59, 130, 246, 0.2)',
          },
          color: {
            default: '#ffffff',
            hover: '#ffffff',
            active: '#ffffff',
            disabled: '#0c4a6e',
            pressed: '#ffffff',
          },
          paddingBlock: '10px',
          paddingInline: '16px',
          focusRing: {
            borderColor: '#3b82f6',
            borderRadius: '2px',
            borderWidth: '3px',
          },
        },
      },
      {
        root: {
          background: {
            default: '#7c3aed',
            hover: '#6d28d9',
            active: '#5b21b6',
            disabled: '#ddd6fe',
            pressed: '#4c1d95',
          },
          borderColor: {
            default: '#7c3aed',
            hover: '#6d28d9',
            active: '#5b21b6',
            disabled: '#c4b5fd',
            pressed: '#5b21b6',
          },
          borderWidth: '2px',
          borderRadius: '12px',
          boxShadow: {
            default: '0 1px 3px rgba(0, 0, 0, 0.1)',
            hover: '0 4px 6px rgba(139, 92, 246, 0.2)',
            active: '0 2px 4px rgba(0, 0, 0, 0.1)',
            disabled: 'none',
            pressed: '0 0 0 4px rgba(139, 92, 246, 0.3)',
          },
          color: {
            default: '#ffffff',
            hover: '#ffffff',
            active: '#ffffff',
            disabled: '#2e1065',
            pressed: '#ffffff',
          },
          paddingBlock: '12px',
          paddingInline: '20px',
          focusRing: {
            borderColor: '#8b5cf6',
            borderRadius: '14px',
            borderWidth: '3px',
          },
        },
      },
    ],
  },
  {
    variant: ['icon'],
    pressed: [false, true],
    disabled: [false, true],
    iconName: ['thumbs-up'],
    pressedIconName: ['thumbs-up-filled'],
    onChange: [() => {}],
    ariaLabel: ['Toggle'],
    style: [
      {
        root: {
          color: {
            default: 'light-dark(#3b82f6, #93c5fd)',
            hover: 'light-dark(#2563eb, #60a5fa)',
            active: 'light-dark(#1d4ed8, #3b82f6)',
            disabled: 'light-dark(#93c5fd, #94a3b8)',
            pressed: 'light-dark(#1e40af, #2563eb)',
          },
          focusRing: {
            borderColor: '#3b82f6',
            borderRadius: '50%',
            borderWidth: '3px',
          },
        },
      },
      {
        root: {
          color: {
            default: 'light-dark(#8b5cf6, #c4b5fd)',
            hover: 'light-dark(#7c3aed, #a78bfa)',
            active: 'light-dark(#6d28d9, #8b5cf6)',
            disabled: 'light-dark(#c4b5fd, #94a3b8)',
            pressed: 'light-dark(#5b21b6, #7c3aed)',
          },
          focusRing: {
            borderColor: '#8b5cf6',
            borderRadius: '10px',
            borderWidth: '3px',
          },
        },
      },
    ],
  },
]);

export default function ToggleButtonStylePermutations() {
  return (
    <>
      <h1>Toggle Button Style Permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => <ToggleButton ariaLabel="Toggle button" {...permutation} />}
        />
      </ScreenshotArea>
    </>
  );
}
