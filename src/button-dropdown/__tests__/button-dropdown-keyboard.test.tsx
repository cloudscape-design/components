// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, act } from '@testing-library/react';

import ButtonDropdown, { ButtonDropdownProps } from '../../../lib/components/button-dropdown';
import createWrapper, { ButtonDropdownWrapper } from '../../../lib/components/test-utils/dom';
import { KeyCode } from '../../internal/keycode';

const renderButtonDropdown = (props: ButtonDropdownProps) => {
  const renderResult = render(<ButtonDropdown {...props} />);
  return createWrapper(renderResult.container).findButtonDropdown()!;
};

const items: ButtonDropdownProps.Items = [
  { id: 'i1', text: 'item1' },
  { id: 'i2', text: 'item2', href: 'http://amazon.com' },
  { id: 'i3', text: 'item3', disabled: true },
  { id: 'i4', text: 'item4' },
];

[{ expandToViewport: false }, { expandToViewport: true }].forEach(props => {
  describe(`ButtonDropdown keyboard interaction ${props.expandToViewport ? 'with portal' : 'without portal'}`, () => {
    let wrapper: ButtonDropdownWrapper;
    let onClickSpy = jest.fn();
    let onFollowSpy = jest.fn();
    beforeEach(() => {
      onClickSpy = jest.fn();
      onFollowSpy = jest.fn();
      wrapper = renderButtonDropdown({ ...props, items, onItemClick: onClickSpy, onItemFollow: onFollowSpy });
      act(() => wrapper.findNativeButton().keydown(KeyCode.enter));
    });

    test('should close the dropdown when escape is pressed', () => {
      expect(wrapper.findOpenDropdown()).not.toBe(null);
      act(() => wrapper.findOpenDropdown()!.keydown(KeyCode.escape));
      expect(wrapper.findOpenDropdown()).toBe(null);
    });
    test('should select the next item if "down" is pressed', () => {
      expect(wrapper.findHighlightedItem()!.getElement()).toHaveTextContent('item1');
      act(() => wrapper.findOpenDropdown()!.keydown(KeyCode.down));
      expect(wrapper.findHighlightedItem()!.getElement()).toHaveTextContent('item2');
    });

    test('should select the previous item if "up" is pressed', () => {
      act(() => wrapper.findOpenDropdown()!.keydown(KeyCode.down));
      act(() => wrapper.findOpenDropdown()!.keydown(KeyCode.up));
      expect(wrapper.findHighlightedItem()!.getElement()).toHaveTextContent('item1');
    });

    test('should include disabled items', () => {
      act(() => wrapper.findOpenDropdown()!.keydown(KeyCode.down));
      act(() => wrapper.findOpenDropdown()!.keydown(KeyCode.down));
      expect(wrapper.findHighlightedItem()!.getElement()).toHaveTextContent('item3');
    });

    test('should call onClick on enter', () => {
      act(() => wrapper.findOpenDropdown()!.keydown(KeyCode.enter));
      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });

    test('should not call onClick on enter a disabled item', () => {
      act(() => wrapper.findOpenDropdown()!.keydown(KeyCode.down));
      act(() => wrapper.findOpenDropdown()!.keydown(KeyCode.down));
      act(() => wrapper.findOpenDropdown()!.keydown(KeyCode.enter));
      expect(onClickSpy).not.toHaveBeenCalled();
    });

    test('should call onClick on space', () => {
      act(() => wrapper.findOpenDropdown()!.keydown(KeyCode.space));
      act(() => wrapper.findOpenDropdown()!.keyup(KeyCode.space));
      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });

    test('should not call onClick on space a disabled item', () => {
      act(() => wrapper.findOpenDropdown()!.keydown(KeyCode.down));
      act(() => wrapper.findOpenDropdown()!.keydown(KeyCode.down));
      act(() => wrapper.findOpenDropdown()!.keydown(KeyCode.space));
      expect(onClickSpy).not.toHaveBeenCalled();
    });

    test('should call onFollow on space if item has href', () => {
      act(() => wrapper.findOpenDropdown()!.keydown(KeyCode.down));
      act(() => wrapper.findOpenDropdown()!.keydown(KeyCode.space));
      act(() => wrapper.findOpenDropdown()!.keyup(KeyCode.space));
      expect(onFollowSpy).toHaveBeenCalledTimes(1);
    });
  });
});
