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
    children: ['Favorite', undefined],
    iconName: ['star'],
    ariaLabel: ['Favorite'],
    pressedIconName: ['star-filled'],
    pressed: [false, true],
    disabled: [false, true],
  },
  {
    variant: ['icon'],
    iconName: ['star'],
    ariaLabel: ['Favorite'],
    pressedIconName: ['star-filled'],
    pressed: [false, true],
    disabled: [false, true],
  },
]);

export default function ToggleButtonPermutations() {
  return (
    <>
      <h1>Toggle button permutations</h1>
      <ScreenshotArea>
        <PermutationsView permutations={permutations} render={permutation => <ToggleButton {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
