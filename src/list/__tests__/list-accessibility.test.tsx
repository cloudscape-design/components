// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import List, { ListProps } from '../../../lib/components/list';
import createWrapper from '../../../lib/components/test-utils/dom';

interface Item {
  id: string;
  content: string;
  announcementLabel?: string;
}
const defaultItems = [
  { id: 'item1', content: 'Item 1', announcementLabel: 'First item' },
  { id: 'item2', content: 'Item 2', announcementLabel: 'Second item' },
  { id: 'item3', content: 'Item 3', announcementLabel: 'Third item' },
];

describe('List - Accessibility', () => {
  const renderList = (props: Partial<ListProps<Item>> = {}) => {
    const defaultProps = {
      items: defaultItems,
      renderItem: (item: Item) => ({
        id: item.id,
        content: item.content,
        announcementLabel: item.announcementLabel,
      }),
    };
    const renderResult = render(<List {...defaultProps} {...props} />);
    return createWrapper(renderResult.container).findList()!;
  };

  test('applies aria-label attribute', () => {
    const wrapper = renderList({ ariaLabel: 'Important items' });
    expect(wrapper.getElement()).toHaveAttribute('aria-label', 'Important items');
  });

  test('applies aria-labelledby attribute', () => {
    const wrapper = renderList({ ariaLabelledby: 'list-title' });
    expect(wrapper.getElement()).toHaveAttribute('aria-labelledby', 'list-title');
  });

  test('applies aria-describedby attribute', () => {
    const wrapper = renderList({ ariaDescribedby: 'list-description' });
    expect(wrapper.getElement()).toHaveAttribute('aria-describedby', 'list-description');
  });

  test('uses announcementLabel for sortable items', () => {
    const onSortingChange = jest.fn();
    const wrapper = renderList({
      sortable: true,
      onSortingChange,
      i18nStrings: {
        dragHandleAriaLabel: 'Drag handle for',
      },
    });

    const dragHandles = wrapper.findItems().map(i => i.findDragHandle()!);
    expect(dragHandles).toHaveLength(3);

    expect(dragHandles[0].getElement()).toHaveAttribute('aria-label', expect.stringContaining('First item'));
  });

  test('applies i18nStrings for sortable list', () => {
    const i18nStrings: ListProps['i18nStrings'] = {
      dragHandleAriaLabel: 'Drag handle',
      dragHandleAriaDescription: 'Use space or enter to activate drag',
    };

    const wrapper = renderList({
      sortable: true,
      onSortingChange: jest.fn(),
      i18nStrings,
    });

    const dragHandle = wrapper.findItemByIndex(1)!.findDragHandle();
    expect(dragHandle).not.toBeNull();
    expect(dragHandle!.getElement()).toHaveAccessibleName('Drag handle First item');
    expect(dragHandle!.getElement()).toHaveAccessibleDescription('Use space or enter to activate drag');
  });
});
