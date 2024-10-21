// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { ButtonGroupProps } from '../../../lib/components/button-group';
import { renderButtonGroup } from './common';

import buttonStyles from '../../../lib/components/button/styles.css.js';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

const emptyGroup: ButtonGroupProps.ItemOrGroup[] = [
  {
    type: 'group',
    text: 'Feedback',
    items: [],
  },
];

test('warns and renders some icon when no icon specified for icon button', () => {
  const { wrapper } = renderButtonGroup({ items: [{ type: 'icon-button', id: 'search', text: 'Search' }] });

  expect(warnOnce).toHaveBeenCalledTimes(1);
  expect(warnOnce).toHaveBeenCalledWith('ButtonGroup', 'Missing icon for item with id: search');
  expect(wrapper.findMenuById('search')!.findAll(`.${buttonStyles.icon}`)).toHaveLength(1);
});

test.each([{ pressed: false }, { pressed: true }])(
  'warns and renders some icon when no icon specified for icon toggle button, pressed=$pressed',
  ({ pressed }) => {
    const { wrapper } = renderButtonGroup({
      items: [{ type: 'icon-toggle-button', id: 'like', pressed, text: 'Like', pressedText: 'Liked' }],
    });

    expect(warnOnce).toHaveBeenCalledTimes(2);
    expect(warnOnce).toHaveBeenCalledWith('ButtonGroup', 'Missing icon for item with id: like');
    expect(warnOnce).toHaveBeenCalledWith('ButtonGroup', 'Missing pressed icon for item with id: like');
    expect(wrapper.findMenuById('like')!.findAll(`.${buttonStyles.icon}`)).toHaveLength(1);
  }
);

test('warns if empty group is provided', () => {
  renderButtonGroup({ items: emptyGroup });

  expect(warnOnce).toHaveBeenCalledTimes(1);
  expect(warnOnce).toHaveBeenCalledWith('ButtonGroup', 'Empty group detected. Empty groups are not allowed.');
});

test('uses non-pressed popover feedback if pressed is not provided', () => {
  const { wrapper } = renderButtonGroup({
    items: [
      {
        type: 'icon-toggle-button',
        id: 'like',
        pressed: true,
        text: 'Like',
        pressedText: 'Liked',
        popoverFeedback: 'You like it!',
      },
    ],
  });

  wrapper.findToggleButtonById('like')!.click();
  expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('You like it!');
});

test('handles item click', () => {
  const onItemClick = jest.fn();
  const { wrapper } = renderButtonGroup({
    items: [{ type: 'icon-button', id: 'search', text: 'Search' }],
    onItemClick,
  });

  wrapper.findButtonById('search')!.click();

  expect(onItemClick).toHaveBeenCalledWith(expect.objectContaining({ detail: { id: 'search' } }));
});

test('handles toggle item click', () => {
  const onItemClick = jest.fn();
  const { wrapper } = renderButtonGroup({
    items: [
      {
        type: 'icon-toggle-button',
        id: 'like',
        pressed: false,
        text: 'Like',
        pressedText: 'Liked',
      },
      {
        type: 'icon-toggle-button',
        id: 'dislike',
        pressed: true,
        text: 'Dislike',
        pressedText: 'Disliked',
      },
    ],
    onItemClick,
  });

  wrapper.findButtonById('like')!.click();
  wrapper.findButtonById('dislike')!.click();

  expect(onItemClick).toHaveBeenCalledWith(expect.objectContaining({ detail: { id: 'like', pressed: true } }));
  expect(onItemClick).toHaveBeenCalledWith(expect.objectContaining({ detail: { id: 'dislike', pressed: false } }));
});

test('handles menu click', () => {
  const onItemClick = jest.fn();
  const { wrapper } = renderButtonGroup({
    items: [
      {
        type: 'menu-dropdown',
        id: 'misc',
        text: 'Misc',
        items: [
          { id: 'dark-mode', itemType: 'checkbox', text: 'Dark mode', checked: false },
          { id: 'compact-mode', itemType: 'checkbox', text: 'Compact mode', checked: true },
        ],
      },
    ],
    onItemClick,
  });

  wrapper.findMenuById('misc')!.openDropdown();
  wrapper.findMenuById('misc')!.findItemById('dark-mode')!.click();
  expect(onItemClick).toHaveBeenCalledWith(expect.objectContaining({ detail: { id: 'dark-mode', checked: true } }));

  wrapper.findMenuById('misc')!.openDropdown();
  wrapper.findMenuById('misc')!.findItemById('compact-mode')!.click();
  expect(onItemClick).toHaveBeenCalledWith(expect.objectContaining({ detail: { id: 'compact-mode', checked: false } }));
});
