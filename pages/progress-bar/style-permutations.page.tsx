// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ProgressBar, { ProgressBarProps } from '~components/progress-bar';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<ProgressBarProps>([
  {
    value: [45, 75, 99, 100],
    status: ['in-progress'],
    style: [
      {
        progress: {
          backgroundColor: '#ccfbf1',
          borderRadius: '8px',
          height: '8px',
        },
        progressValue: {
          backgroundColor: '#14b8a6',
        },
        progressPercentage: {
          color: 'light-dark(#0d5c54, #5eead4)',
          fontSize: '14px',
          fontWeight: '600',
        },
      },
      {
        progress: {
          backgroundColor: '#fee2e2',
          borderRadius: '4px',
          height: '10px',
        },
        progressValue: {
          backgroundColor: '#ef4444',
        },
        progressPercentage: {
          color: 'light-dark(#7f1d1d, #fca5a5)',
          fontSize: '14px',
          fontWeight: '600',
        },
      },
      {
        progress: {
          backgroundColor: '#fef3c7',
          borderRadius: '16px',
          height: '10px',
        },
        progressValue: {
          backgroundColor: '#f59e0b',
        },
        progressPercentage: {
          color: 'light-dark(#78350f, #fcd34d)',
          fontSize: '16px',
          fontWeight: '700',
        },
      },
      {
        progress: {
          backgroundColor: '#dbeafe',
          borderRadius: '4px',
          height: '6px',
        },
        progressValue: {
          backgroundColor: '#3b82f6',
        },
        progressPercentage: {
          color: 'light-dark(#1e40af, #93c5fd)',
          fontSize: '12px',
          fontWeight: '500',
        },
      },
      {
        progress: {
          backgroundColor: '#f3e8ff',
          borderRadius: '0px',
          height: '12px',
        },
        progressValue: {
          backgroundColor: '#a855f7',
        },
        progressPercentage: {
          color: 'light-dark(#6b21a8, #d8b4fe)',
          fontSize: '16px',
          fontWeight: '700',
        },
      },
    ],
  },
]);

export default function ProgressBarStylePermutations() {
  return (
    <>
      <h1>Progress Bar Style permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView permutations={permutations} render={permutation => <ProgressBar {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
