// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import PermutationsView from '../utils/permutations-view';
import createPermutations from '../utils/permutations';
import { ButtonGroup, ButtonGroupProps, StatusIndicator } from '~components';

const itemPremutations = createPermutations<ButtonGroupProps.IconButton | ButtonGroupProps.MenuDropdown>([
  {
    type: ['icon-button'],
    id: ['test'],
    iconName: ['treeview-expand'],
    text: ['Text'],
    disabled: [false, true],
    loading: [false, true],
    popoverFeedback: [
      undefined,
      'Popover feedback',
      <StatusIndicator type="success" key={'success'}>
        Liked
      </StatusIndicator>,
      <StatusIndicator type="error" key={'error'}>
        Error
      </StatusIndicator>,
    ],
  },
]).map((item, index) => ({ ...item, id: `icon-button-${index}` }));

const menuDropdownPermutations = createPermutations<ButtonGroupProps.MenuDropdown>([
  {
    type: ['menu-dropdown'],
    id: ['more-actions'],
    text: ['More actions'],
    loading: [false, true],
    dropdownExpandToViewport: [true, false],
    items: [
      [
        {
          id: 'cut',
          iconName: 'delete-marker',
          text: 'Cut',
        },
        {
          id: 'paste',
          iconName: 'add-plus',
          text: 'Paste',
          disabled: true,
          disabledReason: 'No content to paste',
        },
        {
          text: 'Misc',
          items: [
            { id: 'edit', iconName: 'edit', text: 'Edit' },
            { id: 'open', iconName: 'file-open', text: 'Open' },
            { id: 'search', iconName: 'search', text: 'Search' },
          ],
        },
      ],
    ],
  },
]).map((item, index) => ({ ...item, id: `menu-dropdown-${index}` }));

const groupPermutations = createPermutations<ButtonGroupProps.Group>([
  {
    type: ['group'],
    text: ['Vote'],
    items: [itemPremutations, menuDropdownPermutations],
  },
]);

const permutations = createPermutations<ButtonGroupProps>([
  {
    variant: ['icon'],
    ariaLabel: ['Chat actions'],
    items: [groupPermutations],
  },
]);

export default function () {
  return (
    <>
      <h1>ButtonGroup permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => <div>{<ButtonGroup {...permutation} />}</div>}
        />
      </ScreenshotArea>
    </>
  );
}
