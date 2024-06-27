// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import PermutationsView from '../utils/permutations-view';
import createPermutations from '../utils/permutations';
import { ButtonGroup, ButtonGroupProps } from '~components';

const permutations = createPermutations<ButtonGroupProps>([
  {
    variant: ['icon'],
    ariaLabel: ['Chat actions'],
    dropdownExpandToViewport: [true, false],
    items: [
      [
        {
          type: 'group',
          text: 'Vote',
          items: [
            {
              type: 'icon-button',
              id: 'thumbs-up',
              text: 'Like',
              actionPopoverText: 'Liked',
            },
            {
              type: 'icon-button',
              id: 'thumbs-down',
              iconName: 'thumbs-down',
              text: 'Dislike',
              actionPopoverText: 'Disliked',
            },
          ],
        },
        {
          type: 'icon-button',
          id: 'expand',
          iconName: 'treeview-expand',
          text: 'View',
        },
        {
          type: 'icon-button',
          id: 'favorite',
          iconName: 'star',
          text: 'Favorite',
          actionPopoverText: 'Added to favorites',
          loading: true,
        },
        {
          type: 'icon-button',
          id: 'script',
          iconName: 'script',
          text: 'Script',
          disabled: true,
        },
      ],
      [
        {
          type: 'group',
          text: 'Vote',
          items: [
            {
              type: 'icon-button',
              id: 'thumbs-up',
              iconName: 'thumbs-up',
              text: 'Like',
              actionPopoverText: 'Liked',
            },
            {
              type: 'icon-button',
              id: 'thumbs-down',
              iconName: 'thumbs-down',
              text: 'Dislike',
              actionPopoverText: 'Disliked',
            },
          ],
        },
        {
          type: 'icon-button',
          id: 'copy',
          iconName: 'copy',
          text: 'Copy',
          actionPopoverText: 'Copied',
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
              actionPopoverText: 'Added',
              disabled: true,
              disabledReason: 'No content to add',
            },
            {
              type: 'icon-button',
              id: 'remove',
              iconName: 'remove',
              text: 'Remove',
              actionPopoverText: 'Removed',
              popoverFeedbackType: 'error',
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
      ],
    ],
  },
]);

export default function () {
  return (
    <>
      <h1>ButtonGroup permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => <span>{<ButtonGroup {...permutation} />}</span>}
        />
      </ScreenshotArea>
    </>
  );
}
