// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import PermutationsView from '../utils/permutations-view';
import createPermutations from '../utils/permutations';
import { ButtonGroup, ButtonGroupProps, SpaceBetween, StatusIndicator } from '~components';

const itemPremutations = createPermutations<ButtonGroupProps.IconButton>([
  {
    type: ['icon-button'],
    id: ['test'],
    iconName: [undefined, 'treeview-expand'],
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
    loadingText: ['Loading'],
    disabled: [false, true],
    expandToViewport: [true, false],
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

const items: ButtonGroupProps.ItemOrGroup[] = [
  {
    type: 'group',
    text: 'Vote',
    items: [
      {
        type: 'icon-button',
        id: 'like',
        iconName: 'thumbs-up',
        text: 'Like',
        popoverFeedback: <StatusIndicator type="success">Liked</StatusIndicator>,
      },
      {
        type: 'icon-button',
        id: 'dislike',
        iconName: 'thumbs-down',
        text: 'Dislike',
        popoverFeedback: <StatusIndicator type="error">Disliked</StatusIndicator>,
      },
    ],
  },
  {
    type: 'icon-button',
    id: 'copy',
    iconName: 'copy',
    text: 'Copy',
    popoverFeedback: <StatusIndicator type="success">Copied</StatusIndicator>,
  },
  {
    type: 'group',
    text: 'Actions',
    items: [
      {
        type: 'icon-button',
        id: 'add',
        iconName: 'add-plus',
        text: 'Add',
        popoverFeedback: 'Added',
        disabled: true,
      },
      {
        type: 'icon-button',
        id: 'remove',
        iconName: 'remove',
        text: 'Remove',
        popoverFeedback: 'Removed',
      },
    ],
  },
  {
    type: 'group',
    text: 'Vote',
    items: [],
  },
  {
    type: 'group',
    text: 'Vote',
    items: [
      {
        type: 'menu-dropdown',
        id: 'more-actions',
        text: 'More actions',
        expandToViewport: true,
        items: [
          {
            id: 'cut',
            iconName: 'delete-marker',
            text: 'Cut',
          },
        ],
      },
    ],
  },
  {
    type: 'menu-dropdown',
    id: 'more-actions',
    text: 'More actions',
    items: [
      {
        id: 'cut',
        iconName: 'delete-marker',
        text: 'Cut',
      },
    ],
  },
  {
    type: 'menu-dropdown',
    id: 'more-actions',
    text: 'More actions',
    items: [
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
  },
];

const buttonGroupPermutations = createPermutations<ButtonGroupProps>([
  {
    variant: ['icon'],
    ariaLabel: ['Chat actions'],
    items: [items],
  },
]);

export default function () {
  return (
    <ScreenshotArea disableAnimations={true}>
      <article>
        <h1>ButtonGroup permutations</h1>
        <SpaceBetween size="m">
          <ButtonGroup variant="icon" items={itemPremutations} ariaLabel="Test" />
          <ButtonGroup variant="icon" items={menuDropdownPermutations} ariaLabel="Test" />
          <PermutationsView
            permutations={buttonGroupPermutations}
            render={permutation => <div>{<ButtonGroup {...permutation} />}</div>}
          />
        </SpaceBetween>
      </article>
    </ScreenshotArea>
  );
}
