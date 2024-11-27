// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { fireEvent } from '@testing-library/react';

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
  type: 'file-input',
  id: 'file',
  text: 'Choose files',
};

test('tooltip not shown by default', () => {
  const { wrapper } = renderButtonGroup({ items: [likeButton, copyButton, menuButton, fileInput] });

  expect(wrapper.findTooltip()).toBeNull();
});

test.each([copyButton, likeButton, menuButton, fileInput])(
  'shows the tooltip on pointer enter and hides on pointer leave, item id=$id',
  item => {
    const { wrapper } = renderButtonGroup({ items: [likeButton, copyButton, menuButton, fileInput] });
    const button = item.id === 'file' ? wrapper.findFileInputById(item.id)! : wrapper.findButtonById(item.id)!;

    fireEvent.pointerEnter(button.getElement());
    expect(wrapper.findTooltip()!.getElement()).toHaveTextContent(item.text);

    fireEvent.pointerLeave(button.getElement());
    expect(wrapper.findTooltip()).toBeNull();
  }
);

test.each([copyButton, likeButton, menuButton])('shows no tooltip in loading state, item id=$id', item => {
  const { wrapper } = renderButtonGroup({
    items: [likeButton, copyButton, menuButton].map(item => ({ ...item, loading: true })),
  });
  const button = wrapper.findButtonById(item.id)!;

  fireEvent.pointerEnter(button.getElement());
  expect(wrapper.findTooltip()).toBeNull();
});

test.each([copyButton, likeButton, menuButton])('shows no tooltip in disabled state, item id=$id', item => {
  const { wrapper } = renderButtonGroup({
    items: [likeButton, copyButton, menuButton].map(item => ({ ...item, disabled: true })),
  });
  const button = wrapper.findButtonById(item.id)!;

  fireEvent.pointerEnter(button.getElement());
  expect(wrapper.findTooltip()).toBeNull();
});

test.each([copyButton, likeButton])('shows popover on click if defined, item id=$id', item => {
  const { wrapper } = renderButtonGroup({ items: [likeButton, copyButton, menuButton] });
  const button = wrapper.findButtonById(item.id)!;

  button.click();
  expect(wrapper.findTooltip()!.getElement()).toHaveTextContent(item.popoverFeedback as string);

  // Keeps popover if the button is clicked again
  fireEvent.pointerDown(button.getElement());
  expect(wrapper.findTooltip()!.getElement()).toHaveTextContent(item.popoverFeedback as string);

  // Closes popover on click outside
  fireEvent.pointerDown(document);
  expect(wrapper.findTooltip()).toBeNull();
});

test.each([copyButton, likeButton])('shows no popover on click if popover not defined, item id=$id', item => {
  const { wrapper } = renderButtonGroup({
    items: [likeButton, copyButton, menuButton].map(item => ({ ...item, popoverFeedback: undefined })),
  });
  const button = wrapper.findButtonById(item.id)!;

  fireEvent.pointerEnter(button.getElement());
  expect(wrapper.findTooltip()!.getElement()).toHaveTextContent(item.text);

  button.click();
  expect(wrapper.findTooltip()!.getElement()).toHaveTextContent(item.text);
});
