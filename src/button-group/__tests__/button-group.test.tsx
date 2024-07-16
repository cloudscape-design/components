// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { KeyCode } from '@cloudscape-design/component-toolkit/internal';
import ButtonGroup, { ButtonGroupProps } from '../../../lib/components/button-group';
import buttonStyles from '../../../lib/components/button/styles.css.js';
import createWrapper from '../../../lib/components/test-utils/dom';

const renderButtonGroup = (props: ButtonGroupProps, ref?: React.Ref<ButtonGroupProps.Ref>) => {
  const renderResult = render(<ButtonGroup ref={ref} {...props} />);
  return createWrapper(renderResult.container).findButtonGroup()!;
};

const items1: ButtonGroupProps.ItemOrGroup[] = [
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
  {
    type: 'icon-button',
    id: 'test-button',
    iconName: 'file-open',
    text: 'Test Button',
    popoverFeedback: 'Action Popover',
  },
  { type: 'icon-button', id: 'search', text: 'Search' },
  {
    type: 'menu-dropdown',
    id: 'misc',
    text: 'Misc',
    items: [
      { id: 'edit', iconName: 'edit', text: 'Edit' },
      { id: 'open', iconName: 'file-open', text: 'Open' },
      { id: 'upload', iconName: 'upload', text: 'Upload' },
    ],
  },
];

test('renders all items', () => {
  const wrapper = renderButtonGroup({ variant: 'icon', items: items1, ariaLabel: 'Chat actions' });

  expect(wrapper.findItems()).toHaveLength(7);
  expect(wrapper.findButtonById('edit')).not.toBe(null);
  expect(wrapper.findMenuById('misc')).not.toBe(null);
});

test('renders stub icon when no icon specified', () => {
  const wrapper = renderButtonGroup({ variant: 'icon', items: items1, ariaLabel: 'Chat actions' });

  expect(wrapper.findMenuById('search')?.findAll(`.${buttonStyles.icon}`)).toHaveLength(1);
});

describe('focus', () => {
  test('focuses the correct item', () => {
    const ref: { current: ButtonGroupProps.Ref | null } = { current: null };
    const wrapper = renderButtonGroup({ variant: 'icon', items: items1, ariaLabel: 'Chat actions' }, ref);
    ref.current?.focus('copy');

    expect(wrapper.findButtonById('copy')!.getElement()).toHaveFocus();
  });

  test('focuses on show more button', () => {
    const ref: { current: ButtonGroupProps.Ref | null } = { current: null };
    const wrapper = renderButtonGroup({ variant: 'icon', items: items1, ariaLabel: 'Chat actions' }, ref);
    ref.current?.focus('misc');

    expect(wrapper.findMenuById('misc')!.getElement().getElementsByTagName('button')[0]).toHaveFocus();
  });

  test('focuses the correct item', () => {
    const ref: { current: ButtonGroupProps.Ref | null } = { current: null };
    const wrapper = renderButtonGroup({ variant: 'icon', items: items1, ariaLabel: 'Chat actions' }, ref);
    ref.current?.focus('copy');
    console.log(wrapper.getElement());

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
    const wrapper = renderButtonGroup({ variant: 'icon', items: items1, ariaLabel: 'Chat actions' });

    expect(wrapper.findTooltip()).toBeNull();
  });

  test('shows the tooltip on pointer enter', () => {
    const wrapper = renderButtonGroup({ variant: 'icon', items: items1, ariaLabel: 'Chat actions' });
    const button = wrapper.findButtonById('test-button')!;
    fireEvent.pointerEnter(button.getElement());

    expect(wrapper.findTooltip()).not.toBeNull();
    expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Test Button');
  });

  test('hides the tooltip on pointer leave', () => {
    const wrapper = renderButtonGroup({ variant: 'icon', items: items1, ariaLabel: 'Chat actions' });
    const button = wrapper.findButtonById('test-button')!;
    fireEvent.pointerEnter(button.getElement());
    fireEvent.pointerLeave(button.getElement());

    expect(wrapper.findTooltip()).toBeNull();
  });

  test('shows popover on click', () => {
    const wrapper = renderButtonGroup({ variant: 'icon', items: items1, ariaLabel: 'Chat actions' });
    const button = wrapper.findButtonById('test-button')!;
    fireEvent.click(button.getElement());
    fireEvent.pointerLeave(button.getElement());

    expect(wrapper.findTooltip()).not.toBeNull();
    expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Action Popover');
  });

  test('shows no popover on click if popover not defined', () => {
    const wrapper = renderButtonGroup({ variant: 'icon', items: items1, ariaLabel: 'Chat actions' });
    const button = wrapper.findButtonById('search')!;
    fireEvent.click(button.getElement());

    expect(wrapper.findTooltip()).toBeNull();
  });

  test('closes popover on pointer down', () => {
    const wrapper = renderButtonGroup({ variant: 'icon', items: items1, ariaLabel: 'Chat actions' });
    const button = wrapper.findButtonById('test-button')!;
    fireEvent.click(button.getElement());

    expect(wrapper.findTooltip()).not.toBeNull();
    fireEvent.pointerDown(document);
    expect(wrapper.findTooltip()).toBeNull();
  });

  test('not closes popover on pointer down on the button', () => {
    const wrapper = renderButtonGroup({ variant: 'icon', items: items1, ariaLabel: 'Chat actions' });
    const button = wrapper.findButtonById('test-button')!;
    fireEvent.click(button.getElement());

    expect(wrapper.findTooltip()).not.toBeNull();
    fireEvent.pointerDown(button.getElement());
    expect(wrapper.findTooltip()).not.toBeNull();
  });

  test('closes popover on toggle event', () => {
    const wrapper = renderButtonGroup({ variant: 'icon', items: items1, ariaLabel: 'Chat actions' });
    const button = wrapper.findButtonById('test-button')!;
    fireEvent.click(button.getElement());

    expect(wrapper.findTooltip()).not.toBeNull();
    window.dispatchEvent(new CustomEvent('btngroup-tooltip:toggle', { detail: { open: true, trackKey: '123' } }));
    expect(wrapper.findTooltip()).toBeNull();
  });

  test('closes popover on esc key', () => {
    const wrapper = renderButtonGroup({ variant: 'icon', items: items1, ariaLabel: 'Chat actions' });
    const button = wrapper.findButtonById('test-button')!;
    fireEvent.click(button.getElement());

    expect(wrapper.findTooltip()).not.toBeNull();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(wrapper.findTooltip()).toBeNull();
  });
});
