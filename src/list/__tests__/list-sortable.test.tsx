// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import TestI18nProvider from '../../../lib/components/i18n/testing';
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

const i18nMessages = {
  list: {
    dragHandleAriaLabel: 'Drag handle',
    dragHandleAriaDescription:
      "Use Space or Enter to activate drag for an item, then use the arrow keys to move the item's position. To complete the position move, use Space or Enter, or to discard the move, use Escape.",
    liveAnnouncementDndStarted: 'Picked up item at position {position} of {total}',
    liveAnnouncementDndDiscarded: 'Reordering canceled',
    liveAnnouncementDndItemReordered:
      '{isInitialPosition, select, true {Moving item back to position {currentPosition} of {total}} false {Moving item to position {currentPosition} of {total}} other {}}',
    liveAnnouncementDndItemCommitted:
      '{isInitialPosition, select, true {Item moved back to its original position {initialPosition} of {total}} false {Item moved from position {initialPosition} to position {finalPosition} of {total}} other {}}',
  },
};

const ControlledList = (props: ListProps<Item>) => {
  const [items, setItems] = React.useState(props.items);

  const onSortingChange: ListProps<Item>['onSortingChange'] = event => {
    setItems(event.detail.items);
    props.onSortingChange && props.onSortingChange(event);
  };

  return (
    <TestI18nProvider messages={i18nMessages}>
      <List {...props} items={items} onSortingChange={onSortingChange} />
    </TestI18nProvider>
  );
};

function pressKey(element: HTMLElement, key: string) {
  fireEvent.keyDown(element, { key, code: key });
}

async function expectAnnouncement(announcement: string) {
  await new Promise(resolve => setTimeout(resolve, 0));
  const liveRegion = createWrapper().find('[aria-live="assertive"]');
  expect(liveRegion!.getElement()).toHaveTextContent(announcement);
}

describe('List - Sortable', () => {
  const renderSortableList = (props: Partial<ListProps<Item>> = {}) => {
    const defaultProps = {
      items: defaultItems,
      renderItem: (item: Item) => ({ id: item.id, content: item.content }),
      sortable: true,
      onSortingChange: jest.fn(),
    };
    const renderResult = render(<ControlledList {...defaultProps} {...props} />);
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

  test('can move an item', async () => {
    const { wrapper } = renderSortableList();
    const dragHandle = wrapper.findItemByIndex(1)!.findDragHandle()!.getElement();
    pressKey(dragHandle, 'Space');
    await expectAnnouncement('Picked up item at position 1 of 3');
    pressKey(dragHandle, 'ArrowDown');
    await expectAnnouncement('Moving item to position 2 of 3');
    pressKey(dragHandle, 'Space');
    expect(wrapper.findItemByIndex(1)!.getElement()).toHaveTextContent('Item 2');
    expect(wrapper.findItemByIndex(2)!.getElement()).toHaveTextContent('Item 1');
    await expectAnnouncement('Item moved from position 1 to position 2 of 3');
  });
});
