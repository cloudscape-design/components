// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<ButtonDropdownProps>([
  {
    disabled: [false, true],
    loading: [false, true],
    items: [[]],
    variant: ['normal', 'primary'],
    fullWidth: [false, true],
  },
  {
    disabled: [false, true],
    loading: [false, true],
    items: [[]],
    variant: ['icon', 'inline-icon'],
    ariaLabel: ['Button dropdown'],
    fullWidth: [false, true],
  },
  // Custom trigger icon
  {
    items: [[]],
    variant: ['icon', 'inline-icon'],
    ariaLabel: ['Button dropdown'],
    iconName: [undefined, 'settings'],
    iconSvg: [
      undefined,
      <svg key="custom-icon" focusable="false" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="7" stroke="currentColor" fill="none" strokeWidth="2" />
      </svg>,
    ],
  },
]);

export default function () {
  return (
    <>
      <h1>ButtonDropdown permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => <span>{<ButtonDropdown {...permutation}>Button Dropdown</ButtonDropdown>}</span>}
        />
      </ScreenshotArea>
    </>
  );
}
