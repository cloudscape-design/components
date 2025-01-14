// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { fireEvent } from '@testing-library/react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { ButtonGroupProps } from '../../../lib/components/button-group';
import useBaseComponent from '../../../lib/components/internal/hooks/use-base-component';
import { renderButtonGroup } from './common';

import buttonStyles from '../../../lib/components/button/styles.css.js';

jest.mock('../../../lib/components/internal/hooks/use-base-component', () => jest.fn().mockReturnValue({}));

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
  (useBaseComponent as jest.Mock).mockReset();
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
      items: [{ type: 'icon-toggle-button', id: 'like', pressed, text: 'Like' }],
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
      },
      {
        type: 'icon-toggle-button',
        id: 'dislike',
        pressed: true,
        text: 'Dislike',
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

test('handles file upload', () => {
  const file = new File([new Blob(['Test content'], { type: 'text/plain' })], 'test-file.txt', {
    type: 'text/plain',
    lastModified: 1590962400000,
  });
  const onFilesChange = jest.fn();

  const { wrapper } = renderButtonGroup({
    items: [{ type: 'icon-file-input', id: 'file', text: 'Choose files' }],
    onFilesChange,
  });

  const input = wrapper.findFileInputById('file')!.findNativeInput().getElement();
  Object.defineProperty(input, 'files', { value: [file] });
  fireEvent(input, new CustomEvent('change', { bubbles: true }));

  expect(onFilesChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { id: 'file', files: [file] } }));
});

test('adds feature metrics', () => {
  renderButtonGroup({
    items: [
      { type: 'icon-button', id: 'icon1', text: 'icon1' },
      {
        type: 'group',
        text: 'group1',
        items: [
          { type: 'icon-toggle-button', id: 'toggle1', text: 'toggle1', pressed: false },
          { type: 'icon-toggle-button', id: 'toggle2', text: 'toggle2', pressed: false },
        ],
      },
      { type: 'icon-file-input', id: 'file1', text: 'file1' },
      { type: 'menu-dropdown', id: 'menu1', text: 'menu1', items: [] },
    ],
  });
  expect(useBaseComponent).toHaveBeenCalledWith('ButtonGroup', {
    props: {
      variant: 'icon',
      dropdownExpandToViewport: false,
    },
    metadata: {
      iconButtonsCount: 1,
      iconToggleButtonsCount: 2,
      iconFileInputsCount: 1,
      menuDropdownsCount: 1,
      groupsCount: 1,
    },
  });
});
