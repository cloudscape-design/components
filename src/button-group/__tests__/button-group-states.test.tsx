// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { waitFor } from '@testing-library/react';

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

const fileButton: ButtonGroupProps.FileInput = {
  type: 'file-input',
  id: 'file',
  text: 'Choose files',
  value: [],
};

const menuButton: ButtonGroupProps.MenuDropdown = {
  type: 'menu-dropdown',
  id: 'menu',
  text: 'More actions',
  items: [],
};

const feedbackGroup: ButtonGroupProps.Group = {
  type: 'group',
  text: 'Feedback',
  items: [likeButton],
};

test('all item types have ARIA labels', () => {
  const { wrapper } = renderButtonGroup({ items: [feedbackGroup, copyButton, menuButton, fileButton] });

  expect(wrapper.find('[role="group"]')!.getElement()).toHaveAccessibleName('Feedback');
  expect(wrapper.findToggleButtonById('like')!.getElement()).toHaveAccessibleName('Like');
  expect(wrapper.findFileInputById('file')!.findNativeInput().getElement()).toHaveAccessibleName('Choose files');
  expect(wrapper.findButtonById('copy')!.getElement()).toHaveAccessibleName('Copy');
  expect(wrapper.findMenuById('menu')!.findTriggerButton()!.getElement()).toHaveAccessibleName('More actions');
});

test('toggle button has correct pressed label', () => {
  const { wrapper, rerender } = renderButtonGroup({ items: [likeButton] });

  expect(wrapper.findToggleButtonById('like')!.getElement()).toHaveAttribute('aria-pressed', 'false');
  expect(wrapper.findToggleButtonById('like')!.getElement()).toHaveAccessibleName('Like');

  rerender({ items: [{ ...likeButton, pressed: true }] });

  expect(wrapper.findToggleButtonById('like')!.getElement()).toHaveAttribute('aria-pressed', 'true');
  expect(wrapper.findToggleButtonById('like')!.getElement()).toHaveAccessibleName('Like');
});

test('all item types except file input can be disabled', () => {
  const { wrapper } = renderButtonGroup({
    items: [likeButton, copyButton, menuButton].map(item => ({ ...item, disabled: true })),
  });

  expect(wrapper.findToggleButtonById('like')!.getElement()).toBeDisabled();
  expect(wrapper.findButtonById('copy')!.getElement()).toBeDisabled();
  expect(wrapper.findMenuById('menu')!.findTriggerButton()!.getElement()).toBeDisabled();
});

test('all item types except file input can be loading', async () => {
  const { wrapper } = renderButtonGroup({
    items: [likeButton, copyButton, menuButton].map(item => ({
      ...item,
      loading: true,
      loadingText: `Loading ${item.text}`,
    })),
  });

  expect(wrapper.findToggleButtonById('like')!.getElement()).toHaveAttribute('aria-disabled', 'true');
  expect(wrapper.findToggleButtonById('copy')!.getElement()).toHaveAttribute('aria-disabled', 'true');
  expect(wrapper.findMenuById('menu')!.findTriggerButton()!.getElement()).toHaveAttribute('aria-disabled', 'true');

  await waitFor(() => expect(document.body).toHaveTextContent('Loading Like'));
  await waitFor(() => expect(document.body).toHaveTextContent('Loading Copy'));
  await waitFor(() => expect(document.body).toHaveTextContent('Loading More actions'));
});

test('button popover is shown in all states', () => {
  const { wrapper, rerender } = renderButtonGroup({ items: [copyButton] });

  wrapper.findToggleButtonById('copy')!.click();
  expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Copied');

  rerender({ items: [{ ...copyButton, loading: true }] });
  expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Copied');

  rerender({ items: [{ ...copyButton, disabled: true }] });
  expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Copied');
});

test.each([
  { ...likeButton, pressed: false },
  { ...likeButton, pressed: true },
])('toggle button popover is shown in all states, pressed=$pressed', button => {
  const { wrapper, rerender } = renderButtonGroup({ items: [button] });
  const expectedText = button.pressed ? (button.pressedPopoverFeedback as string) : (button.popoverFeedback as string);

  wrapper.findToggleButtonById('like')!.click();
  expect(wrapper.findTooltip()!.getElement()).toHaveTextContent(expectedText);

  rerender({ items: [{ ...button, loading: true }] });
  expect(wrapper.findTooltip()!.getElement()).toHaveTextContent(expectedText);

  rerender({ items: [{ ...button, disabled: true }] });
  expect(wrapper.findTooltip()!.getElement()).toHaveTextContent(expectedText);
});
