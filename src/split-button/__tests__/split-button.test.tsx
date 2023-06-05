// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import SplitButton, { SplitButtonProps } from '../../../lib/components/split-button';
import createWrapper from '../../../lib/components/test-utils/dom';
import { warnOnce } from '../../../lib/components/internal/logging';

jest.mock('../../../lib/components/internal/logging', () => ({
  warnOnce: jest.fn(),
}));

afterEach(() => {
  jest.resetAllMocks();
});

function renderSplitButton(props: SplitButtonProps = { items: [] }, ref?: React.Ref<SplitButtonProps.Ref>) {
  const renderResult = render(<SplitButton ref={ref} {...props} />);
  return createWrapper(renderResult.container).findSplitButton()!;
}

test('warns if less than two segments are rendered', () => {
  renderSplitButton({ items: [{ id: '1', type: 'button' }] });

  expect(warnOnce).toHaveBeenCalledTimes(1);
  expect(warnOnce).toHaveBeenCalledWith('SplitButton', 'The component must have at least two items.');
});

test('warns if button-dropdown segment is not in the last position', () => {
  renderSplitButton({
    items: [
      { id: '1', type: 'button' },
      { id: '2', type: 'button-dropdown', ariaLabel: 'dropdown', items: [] },
      { id: '3', type: 'button' },
    ],
  });

  expect(warnOnce).toHaveBeenCalledTimes(1);
  expect(warnOnce).toHaveBeenCalledWith('SplitButton', 'Only the last item can be of type "button-dropdown".');
});

test('segments can be found by IDs', () => {
  const wrapper = renderSplitButton({
    items: [
      { id: '1', type: 'button' },
      { id: '2', type: 'button-dropdown', ariaLabel: ' dropdown', items: [] },
    ],
  });

  const items = wrapper.findItems();
  expect(items).toHaveLength(2);

  expect(wrapper.findItemById('1')!.getElement()).toBe(items[0].getElement());
  expect(wrapper.findItemById('2')!.getElement()).toBe(items[1].getElement());
});

test('segments can be casted to respective wrappers', () => {
  const wrapper = renderSplitButton({
    items: [
      { id: '1', type: 'button', text: 'Click me' },
      {
        id: '2',
        type: 'button-dropdown',
        ariaLabel: 'Dropdown',
        items: [
          { id: '1', text: '1' },
          { id: '2', text: '2' },
        ],
      },
    ],
  });

  const buttonWrapper = wrapper.findItemById('1')!.findButtonType()!;
  expect(buttonWrapper.findTextRegion()!.getElement()).toHaveTextContent('Click me');

  const buttonDropdownWrapper = wrapper.findItemById('2')!.findButtonDropdownType()!;
  expect(buttonDropdownWrapper.findNativeButton().getElement()).toHaveAccessibleName('Dropdown');
});

test('segments can be clicked', () => {
  const onClickButton = jest.fn();
  const onFollowLink = jest.fn();
  const onClickDropdownItem = jest.fn();
  const wrapper = renderSplitButton({
    items: [
      { id: '1', type: 'button', onClick: onClickButton },
      { id: '2', type: 'button', href: '#', onFollow: onFollowLink },
      {
        id: '3',
        type: 'button-dropdown',
        ariaLabel: 'dropdown',
        items: [{ id: '1', text: '1' }],
        onItemClick: onClickDropdownItem,
      },
    ],
  });

  wrapper.findItemById('1')!.findButtonType()!.click();
  expect(onClickButton).toHaveBeenCalledTimes(1);

  wrapper.findItemById('2')!.findButtonType()!.click();
  expect(onFollowLink).toHaveBeenCalledTimes(1);

  wrapper.findItemById('3')!.findButtonDropdownType()!.openDropdown();
  wrapper.findItemById('3')!.findButtonDropdownType()!.findItemById('1')!.click();
  expect(onClickDropdownItem).toHaveBeenCalledTimes(1);
});

test('segments can be focused by ID', () => {
  const ref: React.Ref<SplitButtonProps.Ref> = React.createRef();
  const wrapper = renderSplitButton(
    {
      items: [
        { id: '1', type: 'button' },
        {
          id: '2',
          type: 'button-dropdown',
          ariaLabel: 'dropdown',
          items: [{ id: '1', text: '1' }],
        },
      ],
    },
    ref
  );

  const buttonWrapper = wrapper.findItemById('1')!.findButtonType()!;
  const buttonDropdownWrapper = wrapper.findItemById('3')!.findButtonDropdownType()!;

  ref.current!.focus('1');
  expect(buttonWrapper.getElement()).toHaveFocus();

  ref.current!.focus('2');
  expect(buttonDropdownWrapper.findNativeButton().getElement()).toHaveFocus();
});
