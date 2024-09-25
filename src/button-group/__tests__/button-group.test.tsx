// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/component-toolkit/internal';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import ButtonGroup, { ButtonGroupProps } from '../../../lib/components/button-group';
import createWrapper from '../../../lib/components/test-utils/dom';

import buttonStyles from '../../../lib/components/button/styles.css.js';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

const defaultProps: ButtonGroupProps = {
  variant: 'icon',
  ariaLabel: 'Chat actions',
  items: [],
};

const renderButtonGroup = (props: Partial<ButtonGroupProps>, ref?: React.Ref<ButtonGroupProps.Ref>) => {
  const renderResult = render(<ButtonGroup ref={ref} {...defaultProps} {...props} />);
  return createWrapper(renderResult.container).findButtonGroup()!;
};

const items: ButtonGroupProps.ItemOrGroup[] = [
  {
    type: 'group',
    text: 'Feedback',
    items: [
      { type: 'icon-button', id: 'like', text: 'Like', iconName: 'thumbs-up', popoverFeedback: 'Liked' },
      {
        type: 'icon-button',
        id: 'dislike',
        disabled: true,
        text: 'dislike',
        iconName: 'thumbs-down',
        popoverFeedback: 'Disliked',
      },
    ],
  },
  { type: 'icon-button', id: 'copy', iconName: 'copy', text: 'Copy', popoverFeedback: 'Copied' },
  { type: 'icon-button', id: 'edit', iconName: 'edit', text: 'Edit' },
  { type: 'icon-button', id: 'search', text: 'Search' },
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

const emptyGroup: ButtonGroupProps.ItemOrGroup[] = [
  {
    type: 'group',
    text: 'Feedback',
    items: [],
  },
];

test('renders all items', () => {
  const wrapper = renderButtonGroup({ items });

  expect(wrapper.findItems()).toHaveLength(6);
});

test('renders stub icon when no icon specified', () => {
  const wrapper = renderButtonGroup({ items });

  expect(wrapper.findMenuById('search')?.findAll(`.${buttonStyles.icon}`)).toHaveLength(1);
});

test('handles menu click event correctly', () => {
  const onItemClick = jest.fn();
  const wrapper = renderButtonGroup({ items, onItemClick });
  const buttonDropdown = wrapper.findMenuById('misc')!;
  buttonDropdown.openDropdown();
  buttonDropdown.findItemById('menu-open')!.click();

  expect(onItemClick).toHaveBeenCalledWith(expect.objectContaining({ detail: { id: 'menu-open' } }));
  expect(buttonDropdown!.getElement().getElementsByTagName('button')[0]).toHaveFocus();
});

describe('focus', () => {
  test('focuses the correct item', () => {
    const ref: { current: ButtonGroupProps.Ref | null } = { current: null };
    const wrapper = renderButtonGroup({ items }, ref);
    ref.current?.focus('copy');

    expect(wrapper.findButtonById('copy')!.getElement()).toHaveFocus();
  });

  test('focuses on show more button', () => {
    const ref: { current: ButtonGroupProps.Ref | null } = { current: null };
    const wrapper = renderButtonGroup({ items }, ref);
    ref.current?.focus('misc');

    expect(wrapper.findMenuById('misc')!.getElement().getElementsByTagName('button')[0]).toHaveFocus();
  });

  test('focuses the correct item with keyboard', () => {
    const ref: { current: ButtonGroupProps.Ref | null } = { current: null };
    const wrapper = renderButtonGroup({ items }, ref);
    ref.current?.focus('copy');

    fireEvent.keyDown(wrapper.getElement(), { keyCode: KeyCode.right });
    expect(wrapper.findButtonById('edit')!.getElement()).toHaveFocus();
    fireEvent.keyDown(wrapper.getElement(), { keyCode: KeyCode.left });
    expect(wrapper.findButtonById('copy')!.getElement()).toHaveFocus();
    fireEvent.keyDown(wrapper.getElement(), { keyCode: KeyCode.home });
    expect(wrapper.findButtonById('like')!.getElement()).toHaveFocus();
    fireEvent.keyDown(wrapper.getElement(), { keyCode: KeyCode.end });
    expect(wrapper.findMenuById('misc')!.getElement().getElementsByTagName('button')[0]).toHaveFocus();
    ref.current?.focus('like');
    fireEvent.keyDown(wrapper.getElement(), { keyCode: KeyCode.right });
    expect(wrapper.findButtonById('copy')!.getElement()).toHaveFocus();
    fireEvent.keyDown(wrapper.getElement(), { keyCode: KeyCode.space });
    expect(wrapper.findButtonById('copy')!.getElement()).toHaveFocus();
    fireEvent.keyDown(wrapper.getElement(), { keyCode: KeyCode.left, ctrlKey: true });
    expect(wrapper.findButtonById('copy')!.getElement()).toHaveFocus();
  });
});

describe('tooltips', () => {
  test('tooltip not shown by default', () => {
    const wrapper = renderButtonGroup({ items });

    expect(wrapper.findTooltip()).toBeNull();
  });

  test('shows the tooltip on pointer enter and hides on pointer leave', () => {
    const wrapper = renderButtonGroup({ items });
    const button = wrapper.findButtonById('copy')!;

    fireEvent.pointerEnter(button.getElement());
    expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Copy');

    fireEvent.pointerLeave(button.getElement());
    expect(wrapper.findTooltip()).toBeNull();
  });

  test('shows popover on click', () => {
    const wrapper = renderButtonGroup({ items });
    const button = wrapper.findButtonById('copy')!;

    button.click();
    fireEvent.pointerLeave(button.getElement());

    expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Copied');
  });

  test('shows no popover on click if popover not defined', () => {
    const wrapper = renderButtonGroup({ items });
    const button = wrapper.findButtonById('search')!;

    fireEvent.pointerEnter(button.getElement());
    expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Search');

    button.click();
    expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Search');
  });

  test('closes popover on pointer down', () => {
    const wrapper = renderButtonGroup({ items });
    const button = wrapper.findButtonById('copy')!;

    button.click();
    expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Copied');

    fireEvent.pointerDown(document);
    expect(wrapper.findTooltip()).toBeNull();
  });

  test('not closes popover on pointer down on the button', () => {
    const wrapper = renderButtonGroup({ items });
    const button = wrapper.findButtonById('copy')!;

    button.click();
    expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Copied');

    fireEvent.pointerDown(button.getElement());
    expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Copied');
  });

  test('closes popover on esc key', () => {
    const wrapper = renderButtonGroup({ items });
    const button = wrapper.findButtonById('copy')!;

    button.click();
    expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Copied');

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(wrapper.findTooltip()).toBeNull();
  });

  describe.each(['loading', 'disabled'] as const)('hides tooltip for %s', property => {
    test.each(['icon-button', 'menu-dropdown'])('%s', id => {
      const items: ButtonGroupProps.Item[] = [
        { type: 'icon-button', id: 'icon-button', text: 'icon-button' },
        { type: 'menu-dropdown', id: 'menu-dropdown', text: 'menu-dropdown', items: [] },
      ];
      const { rerender } = render(<ButtonGroup {...defaultProps} items={items} />);
      const wrapper = createWrapper().findButtonGroup()!;

      fireEvent.pointerEnter(wrapper.findButtonById(id)!.getElement());
      expect(wrapper.findTooltip()!.getElement()).toHaveTextContent(id);

      rerender(<ButtonGroup {...defaultProps} items={items.map(item => ({ ...item, [property]: item.id === id }))} />);
      expect(wrapper.findTooltip()).toBeNull();
    });
  });
});

describe('dev warnings', () => {
  const componentName = 'ButtonGroup';

  test('missing icon warning', () => {
    renderButtonGroup({ items });

    expect(warnOnce).toHaveBeenCalledTimes(1);
    expect(warnOnce).toHaveBeenCalledWith(componentName, 'Missing icon for item with id: search');
  });

  test('empty group warning', () => {
    renderButtonGroup({ items: emptyGroup });

    expect(warnOnce).toHaveBeenCalledTimes(1);
    expect(warnOnce).toHaveBeenCalledWith(componentName, 'Empty group detected. Empty groups are not allowed.');
  });
});
