// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';

const permutations = createPermutations<ButtonDropdownProps>([
  {
    disabled: [false, true],
    loading: [false, true],
    items: [[]],
    variant: ['normal', 'primary'],
    children: ['Button Dropdown'],
  },
  {
    disabled: [false, true],
    loading: [false, true],
    items: [[]],
    variant: ['icon'],
    ariaLabel: ['Button dropdown'],
    children: ['Button Dropdown'],
  },
]);

export default function () {
  return (
    <>
      <h1>ButtonDropdown permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => <span>{<ButtonDropdown {...permutation} />}</span>}
        />
      </ScreenshotArea>
    </>
  );
}
