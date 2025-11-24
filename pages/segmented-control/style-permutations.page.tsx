// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import SegmentedControl, { SegmentedControlProps } from '~components/segmented-control';

import img from '../icon/custom-icon.png';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const style1: SegmentedControlProps['style'] = {
  root: {
    borderRadius: '12px',
  },
  segment: {
    borderRadius: '10px',
    paddingBlock: '12px',
    paddingInline: '20px',
    fontSize: '15px',
    background: {
      active: 'light-dark(#5f6ac3, #7c3aed)',
      default: 'light-dark(#f7fafc, #1a202c)',
      disabled: 'light-dark(#e2e8f0, #2d3748)',
      hover: 'light-dark(#edf2f7, #2d3748)',
    },
    color: {
      active: 'light-dark(#ffffff, #ffffff)',
      default: 'light-dark(#2d3748, #e2e8f0)',
      disabled: 'light-dark(#a0aec0, #718096)',
      hover: 'light-dark(#1a202c, #f7fafc)',
    },
    focusRing: {
      borderColor: 'light-dark(#5f6ac3, #7c3aed)',
      borderRadius: '12px',
      borderWidth: '2px',
    },
  },
};

const iconSvg = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false">
    <circle cx="8" cy="8" r="7" />
    <circle cx="8" cy="8" r="3" />
  </svg>
);

const permutations = createPermutations<SegmentedControlProps>([
  {
    style: [style1],
    selectedId: ['seg-1', ''],
    options: [
      [
        { text: 'First segment', iconName: 'settings', id: 'seg-1', disabled: false },
        { text: 'Second longer segment', iconName: 'settings', id: 'seg-2', disabled: true },
        { text: 'Third even longer segment', iconName: 'settings', id: 'seg-3', disabled: false },
        { text: 'Segment-4', iconName: 'settings', id: 'seg-4', disabled: false },
      ],
      [
        { text: 'First segment', id: 'seg-1', disabled: false },
        { text: '', iconAlt: 'Alternative text', iconName: 'settings', id: 'seg-2', disabled: true },
        { text: 'Third even longer segment', iconSvg, id: 'seg-3', disabled: false },
        {
          text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Whatever.',
          iconUrl: img,
          iconAlt: 'Amazon',
          id: 'seg-4',
          disabled: false,
        },
      ],
    ],
    label: ['Segmented Control Label'],
  },
]);

export default function SegmentedControlScenario() {
  return (
    <article>
      <h1>SegmentedControl permutations</h1>
      <ScreenshotArea>
        <PermutationsView permutations={permutations} render={permutation => <SegmentedControl {...permutation} />} />
      </ScreenshotArea>
    </article>
  );
}
