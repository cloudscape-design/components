// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { KeyCode } from '@cloudscape-design/component-toolkit/internal';

import { ButtonGroupProps } from '../../../lib/components/button-group';
import { renderButtonGroup } from './common';

const copyButton: ButtonGroupProps.IconButton = {
  type: 'icon-button',
  id: 'copy',
  text: 'Copy',
  iconName: 'copy',
  popoverFeedback: 'Copied',
};

const likeButton: ButtonGroupProps.IconToggleButton = {
  type: 'icon-toggle-button',
  id: 'like',
  pressed: false,
  text: 'Like',
  iconName: 'thumbs-up',
  pressedIconName: 'thumbs-up-filled',
  popoverFeedback: 'No longer liking',
  pressedPopoverFeedback: 'You like it',
};

const menuButton: ButtonGroupProps.MenuDropdown = {
  type: 'menu-dropdown',
  id: 'menu',
  text: 'More actions',
  items: [{ id: 'search', text: 'Search' }],
};

const fileInput: ButtonGroupProps.IconFileInput = {
  type: 'icon-file-input',
  id: 'file',
  text: 'Choose files',
};

test('focuses on all item types', () => {
  const ref: { current: ButtonGroupProps.Ref | null } = { current: null };
  const { wrapper } = renderButtonGroup({ items: [likeButton, copyButton, menuButton, fileInput] }, ref);

  ref.current!.focus('copy');
  expect(wrapper.findButtonById('copy')!.getElement()).toHaveFocus();

  ref.current!.focus('like');
  expect(wrapper.findToggleButtonById('like')!.getElement()).toHaveFocus();

  ref.current!.focus('menu');
  expect(wrapper.findMenuById('menu')!.findTriggerButton()!.getElement()).toHaveFocus();

  ref.current!.focus('file');
  expect(wrapper.findFileInputById('file')!.findNativeInput().getElement()).toHaveFocus();
});

test('moves focus to menu trigger after menu is dismissed', () => {
  const { wrapper } = renderButtonGroup({ items: [likeButton, menuButton] });

  wrapper.findMenuById('menu')!.openDropdown();
  expect(wrapper.findMenuById('menu')!.findOpenDropdown()).not.toBe(null);

  wrapper.findMenuById('menu')!.findItemById('search')!.click();
  expect(wrapper.findMenuById('menu')!.findOpenDropdown()).toBe(null);
  expect(wrapper.findMenuById('menu')!.findTriggerButton()!.getElement()).toHaveFocus();

  wrapper.findMenuById('menu')!.openDropdown();
  expect(wrapper.findMenuById('menu')!.findOpenDropdown()).not.toBe(null);

  wrapper.findMenuById('menu')!.findTriggerButton()!.keydown(KeyCode.escape);
  expect(wrapper.findMenuById('menu')!.findOpenDropdown()).toBe(null);
  expect(wrapper.findMenuById('menu')!.findTriggerButton()!.getElement()).toHaveFocus();
});
