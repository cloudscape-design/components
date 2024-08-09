// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import ButtonGroup, { ButtonGroupProps } from '~components/button-group';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const itemPermutations = createPermutations<ButtonGroupProps.IconButton>([
  // Undefined icon
  {
    type: ['icon-button'],
    id: ['test'],
    iconName: [undefined, 'treeview-expand'],
    text: ['Expand'],
  },
  // Disabled and loading
  {
    type: ['icon-button'],
    id: ['test'],
    iconName: ['settings'],
    text: ['Settings'],
    disabled: [false, true],
    loading: [false, true],
    popoverFeedback: ['Text feedback'],
  },
  // Popover feedback
  {
    type: ['icon-button'],
    id: ['test'],
    iconName: ['copy'],
    text: ['Feedback'],
    popoverFeedback: [
      'Text feedback',
      <StatusIndicator type="success" key="success">
        Status indicator feedback
      </StatusIndicator>,
    ],
  },
]);

const menuDropdownPermutations = createPermutations<ButtonGroupProps.MenuDropdown>([
  // Loading and disabled
  {
    type: ['menu-dropdown'],
    id: ['more-actions'],
    text: ['More actions'],
    loading: [false, true],
    loadingText: ['Loading'],
    disabled: [false, true],
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
]);

export default function () {
  return (
    <ScreenshotArea disableAnimations={true}>
      <article>
        <h1>ButtonGroup item permutations</h1>
        <SpaceBetween size="m">
          <PermutationsView
            permutations={itemPermutations}
            render={permutation => <ButtonGroup variant="icon" items={[permutation]} ariaLabel="Test" />}
          />

          <PermutationsView
            permutations={menuDropdownPermutations}
            render={permutation => <ButtonGroup variant="icon" items={[permutation]} ariaLabel="Test" />}
          />
        </SpaceBetween>
      </article>
    </ScreenshotArea>
  );
}
