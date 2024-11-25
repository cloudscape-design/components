// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { fireEvent } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/component-toolkit/internal';

import { ButtonGroupProps } from '../../../lib/components/button-group';
import { renderButtonGroup } from './common';

const items: ButtonGroupProps.ItemOrGroup[] = [
  {
    type: 'group',
    text: 'Feedback',
    items: [
      {
        type: 'icon-toggle-button',
        id: 'like',
        pressed: false,
        text: 'Like',
        iconName: 'thumbs-up',
        pressedIconName: 'thumbs-up-filled',
      },
      {
        type: 'icon-toggle-button',
        id: 'dislike',
        pressed: false,
        disabled: true,
        text: 'Dislike',
        iconName: 'thumbs-down',
        pressedIconName: 'thumbs-down-filled',
        popoverFeedback: 'Disliked!',
        pressedPopoverFeedback: 'No longer disliking',
      },
    ],
  },
  { type: 'icon-button', id: 'copy', iconName: 'copy', text: 'Copy', popoverFeedback: 'Copied' },
  { type: 'file-input', id: 'file', text: 'Choose files' },
  {
    type: 'menu-dropdown',
    id: 'misc',
    text: 'Misc',
    items: [
      { id: 'menu-open', iconName: 'file-open', text: 'Open' },
      { id: 'menu-upload', iconName: 'upload', text: 'Upload' },
    ],
  },
];

test('navigates button dropdown with keyboard', () => {
  const ref: { current: ButtonGroupProps.Ref | null } = { current: null };
  const { wrapper } = renderButtonGroup({ items }, ref);

  ref.current?.focus('like');

  fireEvent.keyDown(wrapper.getElement(), { keyCode: KeyCode.right });
  expect(wrapper.findButtonById('copy')!.getElement()).toHaveFocus();
  expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Copy');

  fireEvent.keyDown(wrapper.getElement(), { keyCode: KeyCode.left });
  expect(wrapper.findToggleButtonById('like')!.getElement()).toHaveFocus();
  expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Like');

  fireEvent.keyDown(wrapper.getElement(), { keyCode: KeyCode.right });
  fireEvent.keyDown(wrapper.getElement(), { keyCode: KeyCode.right });
  expect(wrapper.findFileInputById('file')!.findNativeInput().getElement()).toHaveFocus();
  expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Choose files');

  fireEvent.keyDown(wrapper.getElement(), { keyCode: KeyCode.end });
  expect(wrapper.findMenuById('misc')!.findTriggerButton()!.getElement()).toHaveFocus();
  expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Misc');

  fireEvent.keyDown(wrapper.getElement(), { keyCode: KeyCode.home });
  expect(wrapper.findToggleButtonById('like')!.getElement()).toHaveFocus();
  expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Like');

  fireEvent.keyDown(wrapper.getElement(), { keyCode: KeyCode.right, ctrlKey: true });
  expect(wrapper.findButtonById('like')!.getElement()).toHaveFocus();
  expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Like');

  fireEvent.keyDown(window, { key: 'Escape' });
  expect(wrapper.findButtonById('like')!.getElement()).toHaveFocus();
  expect(wrapper.findTooltip()).toBe(null);
});

test('hides popover with Escape', () => {
  const { wrapper } = renderButtonGroup({ items });

  wrapper.findButtonById('copy')!.click();
  expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Copied');

  fireEvent.keyDown(window, { key: 'Escape' });
  expect(wrapper.findTooltip()).toBe(null);
});

test('closes menu with Escape', () => {
  const { wrapper } = renderButtonGroup({ items });

  wrapper.findMenuById('misc')!.openDropdown();
  expect(wrapper.findMenuById('misc')!.findOpenDropdown()).not.toBe(null);

  wrapper.findMenuById('misc')!.findTriggerButton()!.keydown(KeyCode.escape);
  expect(wrapper.findMenuById('misc')!.findOpenDropdown()).toBe(null);
});
