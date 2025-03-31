// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import ButtonGroup, { ButtonGroupProps } from '~components/button-group';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const toggleFeedbackGroup: ButtonGroupProps.Group = {
  type: 'group',
  text: 'Vote',
  items: [
    {
      type: 'icon-toggle-button',
      id: 'like',
      iconName: 'thumbs-up',
      pressedIconName: 'thumbs-up-filled',
      text: 'Like - toggleable',
      pressed: true,
    },
    {
      type: 'icon-toggle-button',
      id: 'dislike',
      iconName: 'thumbs-down',
      pressedIconName: 'thumbs-down-filled',
      text: 'Dislike - toggleable',
      pressed: false,
    },
  ],
};

const feedbackGroup: ButtonGroupProps.Group = {
  type: 'group',
  text: 'Vote',
  items: [
    {
      type: 'icon-button',
      id: 'helpful',
      iconName: 'thumbs-up-filled',
      text: 'Helpful',
      popoverFeedback: 'Already voted popover feedback',
    },
    {
      type: 'icon-button',
      id: 'not-helpful',
      iconName: 'thumbs-down',
      text: 'Not helpful',
      disabled: true,
      disabledReason: 'Disabled reason',
    },
  ],
};

const disabledReasonGroup: ButtonGroupProps.Group = {
  type: 'group',
  text: 'Disabled reason group',
  items: [
    {
      type: 'icon-button',
      id: 'icon-button-disabled-reason',
      iconName: 'thumbs-up',
      text: 'Helpful',
      disabled: true,
      disabledReason: 'Disabled reason icon-button',
    },
    {
      type: 'icon-toggle-button',
      id: 'icon-toggle-button-disabled-reason',
      iconName: 'thumbs-down',
      pressedIconName: 'thumbs-down-filled',
      text: 'Not helpful',
      pressed: false,
      disabled: true,
      disabledReason: 'Disabled reason icon-toggle-button',
    },
  ],
};

const copy: ButtonGroupProps.Item = {
  type: 'icon-button',
  id: 'copy',
  iconName: 'copy',
  text: 'Copy',
};

const add: ButtonGroupProps.Item = {
  type: 'icon-button',
  id: 'add',
  iconName: 'add-plus',
  text: 'Add',
};

const cut: ButtonGroupProps.Item = {
  type: 'icon-button',
  id: 'cut',
  iconName: 'delete-marker',
  text: 'Cut',
};

const remove: ButtonGroupProps.Item = {
  type: 'icon-button',
  id: 'remove',
  iconName: 'remove',
  text: 'Remove',
};

const actionsGroup: ButtonGroupProps.Group = {
  type: 'group',
  text: 'Actions',
  items: [add, remove],
};

const moreActionsMenu: ButtonGroupProps.MenuDropdown = {
  type: 'menu-dropdown',
  id: 'more-actions',
  text: 'More actions',
  items: [cut],
};

const moreActionsMenuDisabledReason: ButtonGroupProps.MenuDropdown = {
  type: 'menu-dropdown',
  id: 'menu-dropdown-disabled-reason',
  text: 'More actions',
  disabled: true,
  disabledReason: 'Disabled reason menu-dropdown',
  items: [cut],
};

const actionsGroupsWithMenu: ButtonGroupProps.Group = {
  type: 'group',
  text: 'Actions',
  items: [add, remove, moreActionsMenu],
};

const buttonGroupPermutations = createPermutations<ButtonGroupProps>([
  {
    variant: ['icon'],
    ariaLabel: ['Chat actions'],
    items: [
      [add],
      [add, remove],
      [actionsGroup],
      [feedbackGroup, copy],
      [feedbackGroup, actionsGroup],
      [feedbackGroup, copy, actionsGroup],
      [toggleFeedbackGroup, copy],
      [toggleFeedbackGroup, actionsGroup],
      [toggleFeedbackGroup, copy, actionsGroup],
      [actionsGroupsWithMenu, copy],
      [disabledReasonGroup, moreActionsMenuDisabledReason],
    ],
  },
]);

export default function () {
  return (
    <ScreenshotArea disableAnimations={true}>
      <article>
        <h1>ButtonGroup permutations</h1>
        <PermutationsView
          permutations={buttonGroupPermutations}
          render={permutation => <div>{<ButtonGroup {...permutation} />}</div>}
        />
      </article>
    </ScreenshotArea>
  );
}
