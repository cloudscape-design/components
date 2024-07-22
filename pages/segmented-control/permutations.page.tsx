// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import SegmentedControl, { SegmentedControlProps } from '~components/segmented-control';

import img from '../icon/custom-icon.png';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const iconSvg = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false">
    <circle cx="8" cy="8" r="7" />
    <circle cx="8" cy="8" r="3" />
  </svg>
);

const permutations = createPermutations<SegmentedControlProps>([
  {
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
      [
        { text: 'First segment', iconSvg, id: 'seg-1' },
        { iconSvg, id: 'seg-2', iconAlt: 'Second segment' },
        { text: 'Third segment', iconSvg, id: 'seg-3', disabled: true },
        { iconSvg, id: 'seg-4', iconAlt: 'Fourth segment', disabled: true },
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
