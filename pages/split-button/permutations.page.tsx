// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import SplitButton, { SplitButtonProps } from '~components/split-button';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<SplitButtonProps>([
  {
    variant: ['normal', 'primary'],
    items: [
      [
        { id: '1', type: 'button', text: 'Button' },
        { id: '2', type: 'link', text: 'Link' },
        { id: '3', type: 'button-dropdown', ariaLabel: 'Dropdown', items: [] },
      ],
      [
        { id: '1', type: 'button', text: 'Button' },
        { id: '2', type: 'link', text: 'Link' },
      ],
    ],
  },
  {
    variant: ['normal', 'primary'],
    items: [
      [
        { id: '1', type: 'button', text: 'Button', iconName: 'add-plus' },
        { id: '2', type: 'link', text: 'Link', external: true },
        { id: '3', type: 'button-dropdown', ariaLabel: 'Dropdown', items: [], loading: true, loadingText: 'Loading' },
      ],
    ],
  },
]);

export default function SplitButtonPermutations() {
  return (
    <>
      <h1>SplitButton permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView permutations={permutations} render={permutation => <SplitButton {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
