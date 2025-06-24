// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import List, { ListProps } from '../../../lib/components/list';
import createWrapper from '../../../lib/components/test-utils/dom';

interface Item {
  id: string;
  content: string;
}
const defaultItems: Item[] = [
  { id: 'item1', content: 'Item 1' },
  { id: 'item2', content: 'Item 2' },
  { id: 'item3', content: 'Item 3' },
];

describe('List - Sortable', () => {
  const renderSortableList = (props: Partial<ListProps<Item>> = {}) => {
    const defaultProps = {
      items: defaultItems,
      renderItem: (item: Item) => ({ id: item.id, content: item.content }),
      sortable: true,
      onSortingChange: jest.fn(),
    };
    const renderResult = render(<List {...defaultProps} {...props} />);
    return {
      wrapper: createWrapper(renderResult.container).findList()!,
      onSortingChange: defaultProps.onSortingChange,
    };
  };

  test('renders drag handles for each item', () => {
    const { wrapper } = renderSortableList();
    const items = wrapper.findItems();

    expect(items).toHaveLength(3);
    items.forEach(item => {
      expect(item.findDragHandle()).not.toBeNull();
    });
  });

  test('applies i18nStrings to drag handles', () => {
    const i18nStrings = {
      dragHandleAriaLabel: 'Drag handle',
      dragHandleAriaDescription:
        'Use space or enter to activate drag, arrow keys to move, space or enter to drop, escape to cancel',
    };

    const { wrapper } = renderSortableList({ i18nStrings });

    // The drag handle should have the aria-label from i18nStrings
    const dragHandle = wrapper.findItemByIndex(1)!.findDragHandle();
    expect(dragHandle).not.toBeNull();
    expect(dragHandle!.getElement()).toHaveAttribute(
      'aria-label',
      expect.stringContaining(i18nStrings.dragHandleAriaLabel)
    );
  });

  test('renders as ol by default when sortable', () => {
    const { wrapper } = renderSortableList();
    expect(wrapper.getElement().tagName).toBe('OL');
  });

  test('can override tag when sortable', () => {
    const { wrapper } = renderSortableList({ tag: 'ul' });
    expect(wrapper.getElement().tagName).toBe('UL');
  });

  test('disables sorting with sortDisabled prop', () => {
    const { wrapper } = renderSortableList({ sortDisabled: true });

    const dragHandle = wrapper.findItemByIndex(1)!.findDragHandle();
    expect(dragHandle!.getElement()).toHaveAttribute('aria-disabled', 'true');
  });

  test('can find item by id', () => {
    const { wrapper } = renderSortableList();
    expect(wrapper.findItemById('item2')!.getElement()).toHaveTextContent('Item 2');
  });
});
