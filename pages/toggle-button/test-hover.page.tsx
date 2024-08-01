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
    children: ['Favorite'],
    iconName: ['star'],
    pressedIconName: ['star-filled'],
    pressed: [false, true],
  },
  {
    variant: ['icon'],
    iconName: ['star'],
    ariaLabel: ['Favorite'],
    pressedIconName: ['star-filled'],
    pressed: [false, true],
  },
]);

export default function ToggleButtonTestHover() {
  return (
    <>
      <h1>Toggle button test hover</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => {
            const testId = `variant-${permutation.variant ?? 'normal'}-${permutation.pressed ? 'pressed' : 'not-pressed'}`;
            return <ToggleButton {...permutation} data-testid={testId} />;
          }}
        />
      </ScreenshotArea>
    </>
  );
}
