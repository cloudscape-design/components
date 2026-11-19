// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import ButtonDropdown, { ButtonDropdownProps } from '../../../lib/components/button-dropdown';
import createWrapper, { ButtonDropdownWrapper } from '../../../lib/components/test-utils/dom';
import { KeyCode } from '../../internal/keycode';

import styles from '../../../lib/components/button-dropdown/category-elements/styles.selectors.js';

const renderButtonDropdown = (props: ButtonDropdownProps) => {
  const renderResult = render(<ButtonDropdown {...props} />);
  return createWrapper(renderResult.container).findButtonDropdown()!;
};

const items: ButtonDropdownProps.Items = [
  { id: 'i1', text: 'item1' },
  { id: 'i2', text: 'item2', disabled: true },
  { id: 'g1', text: 'group', disabled: true, items: [] },
  { id: 'i3', text: 'item3' },
];

[{ expandToViewport: false }, { expandToViewport: true }].forEach(props => {
  describe(`ButtonDropdown highlighted item ${props.expandToViewport ? 'with portal' : 'without portal'}`, () => {
    let wrapper: ButtonDropdownWrapper;
    beforeEach(() => {
      wrapper = renderButtonDropdown({ ...props, items });
    });

    test('should reset last highlighted item, when dropdown has been closed and opened again', () => {
      wrapper.openDropdown();
      act(() => wrapper.findOpenDropdown()!.keydown(KeyCode.down));
      expect(wrapper.findHighlightedItem()!.getElement()).toHaveTextContent('item2');

      wrapper.openDropdown();
      expect(wrapper.findOpenDropdown()).toBe(null);

      wrapper.openDropdown();
      expect(wrapper.findHighlightedItem()!.getElement()).toHaveTextContent('item1');
    });

    test('should be set to the first item when opened', () => {
      act(() => wrapper.findNativeButton().keydown(KeyCode.enter));
      expect(wrapper.findHighlightedItem()!.getElement()).toHaveTextContent('item1');
    });
  });
});

describe('ButtonDropdown - highlight disabled items', () => {
  let wrapper: ButtonDropdownWrapper;

  beforeEach(() => {
    wrapper = renderButtonDropdown({ items });
    wrapper.openDropdown();
  });

  it('highlights disabled item on hover', () => {
    act(() => {
      fireEvent.mouseEnter(wrapper.findItemById('i2')!.getElement());
    });
    expect(wrapper.findHighlightedItem()!.getElement()).toContainHTML('i2');
  });

  it('highlights disabled item on keyboard navigation', () => {
    act(() => wrapper.findOpenDropdown()!.keydown(KeyCode.down));
    expect(wrapper.findHighlightedItem()!.getElement()).toContainHTML('i2');
  });

  it('skips disabled category group on keyboard navigation', () => {
    act(() => wrapper.findOpenDropdown()!.keydown(KeyCode.down));
    act(() => wrapper.findOpenDropdown()!.keydown(KeyCode.down));
    act(() => wrapper.findOpenDropdown()!.keydown(KeyCode.down));
    expect(wrapper.findHighlightedItem()!.getElement()).toContainHTML('i3');
  });

  it('highlights disabled expandable group', () => {
    wrapper = renderButtonDropdown({ items, expandableGroups: true });
    wrapper.openDropdown();
    act(() => {
      fireEvent.mouseEnter(wrapper.findExpandableCategoryById('g1')!.getElement());
    });
    expect(wrapper.findExpandableCategoryById('g1')!.getElement().classList).toContain(styles.highlighted);
  });
});
