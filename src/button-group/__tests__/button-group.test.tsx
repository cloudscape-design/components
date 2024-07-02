// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ButtonGroup, { ButtonGroupProps } from '../../../lib/components/button-group';
import createWrapper from '../../../lib/components/test-utils/dom';

const renderButtonGroup = (props: ButtonGroupProps, ref?: React.Ref<ButtonGroupProps.Ref>) => {
  const renderResult = render(<ButtonGroup ref={ref} {...props} />);
  return createWrapper(renderResult.container).findButtonGroup()!;
};

const items1: ButtonGroupProps.Item[] = [
  {
    type: 'group',
    text: 'Feedback',
    items: [
      { type: 'icon-button', id: 'like', text: 'Like', iconName: 'thumbs-up', feedbackText: 'Liked' },
      { type: 'icon-button', id: 'dislike', text: 'dislike', iconName: 'thumbs-down', feedbackText: 'Disliked' },
    ],
  },
  { type: 'icon-button', id: 'copy', iconName: 'copy', text: 'Copy', feedbackText: 'Copied' },
  { type: 'icon-button', id: 'edit', iconName: 'edit', text: 'Edit' },
  { type: 'icon-button', id: 'open', iconName: 'file-open', text: 'Open' },
  { type: 'icon-button', id: 'search', iconName: 'search', text: 'Search' },
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
  const wrapper = renderButtonGroup({ variant: 'icon', items: items1 });

  expect(wrapper.findItems()).toHaveLength(7);
  expect(wrapper.findButtonById('edit')).not.toBe(null);
  expect(wrapper.findMenuById('misc')).not.toBe(null);
});

describe('focus', () => {
  test('focuses the correct item', () => {
    const TestComponent = () => {
      const ref = useRef<ButtonGroupProps.Ref>(null);

      return (
        <div>
          <button onClick={() => ref.current?.focus('copy')}>Focus on copy</button>
          <ButtonGroup ref={ref} variant="icon" items={items1} />
        </div>
      );
    };

    const { container } = render(<TestComponent />);
    const buttonGroup = createWrapper(container).findButtonGroup()!;
    fireEvent.click(screen.getByText('Focus on copy'));

    expect(buttonGroup.findButtonById('copy')!.getElement()).toHaveFocus();
  });

  test('focuses on show more button', () => {
    const TestComponent = () => {
      const ref = useRef<ButtonGroupProps.Ref>(null);

      return (
        <div>
          <button onClick={() => ref.current?.focus('misc')}>Focus on misc</button>
          <ButtonGroup ref={ref} variant="icon" items={items1} />
        </div>
      );
    };

    const { container } = render(<TestComponent />);
    const buttonGroup = createWrapper(container).findButtonGroup()!;

    fireEvent.click(screen.getByText('Focus on misc'));
    const showMoreButton = buttonGroup.findMenuById('misc')!.getElement();
    expect(showMoreButton.getElementsByTagName('button')[0]).toHaveFocus();
  });
});
