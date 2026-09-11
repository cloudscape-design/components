// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { fireEvent, render } from '@testing-library/react';

import { KeyCode } from '../../../lib/components/internal/keycode';
import List, { ListProps } from '../../../lib/components/list';
import createWrapper from '../../../lib/components/test-utils/dom';
import { ListItemWrapper } from '../../../lib/components/test-utils/dom/list';

interface Item {
  id: string;
  content: string;
  disabled?: boolean;
}

const defaultItems: Item[] = [
  { id: 'item1', content: 'Item 1' },
  { id: 'item2', content: 'Item 2' },
  { id: 'item3', content: 'Item 3', disabled: true },
  { id: 'item4', content: 'Item 4' },
];

const renderItemFn = (item: Item) => ({ id: item.id, content: item.content });

const isSelected = (item: ListItemWrapper) => item.getElement().getAttribute('aria-selected') === 'true';

function StatefulList(props: Partial<ListProps<Item>> & { selectionType: ListProps.SelectionType }) {
  const [selectedItems, setSelectedItems] = useState<ReadonlyArray<Item>>(props.selectedItems ?? []);
  return (
    <List
      items={defaultItems}
      renderItem={renderItemFn}
      isItemDisabled={item => !!item.disabled}
      {...props}
      selectedItems={selectedItems}
      onSelectionChange={event => {
        setSelectedItems(event.detail.selectedItems);
        props.onSelectionChange?.(event);
      }}
    />
  );
}

const renderList = (props: Partial<ListProps<Item>> & { selectionType: ListProps.SelectionType }) => {
  const renderResult = render(<StatefulList {...props} />);
  return {
    wrapper: createWrapper(renderResult.container).findList()!,
    rerender: renderResult.rerender,
  };
};

describe('List - selectable variant', () => {
  test('renders as a listbox with options when selectionType is set', () => {
    const { wrapper } = renderList({ selectionType: 'multi' });
    expect(wrapper.getElement()).toHaveAttribute('role', 'listbox');
    const items = wrapper.findItems();
    expect(items).toHaveLength(4);
    items.forEach(item => expect(item.getElement()).toHaveAttribute('role', 'option'));
  });

  test('does not add listbox semantics when selectionType is not set (backward compatible)', () => {
    const renderResult = render(<List items={defaultItems} renderItem={renderItemFn} />);
    const wrapper = createWrapper(renderResult.container).findList()!;
    expect(wrapper.getElement()).not.toHaveAttribute('role', 'listbox');
    expect(wrapper.findItemByIndex(1)!.getElement()).not.toHaveAttribute('role', 'option');
    expect(wrapper.findItemByIndex(1)!.findSelectionControl()).toBeNull();
  });

  test('sets aria-multiselectable for multi selection only', () => {
    const { wrapper: multi } = renderList({ selectionType: 'multi' });
    expect(multi.getElement()).toHaveAttribute('aria-multiselectable', 'true');

    const { wrapper: single } = renderList({ selectionType: 'single' });
    expect(single.getElement()).not.toHaveAttribute('aria-multiselectable');
  });

  test('renders a selection control for every item', () => {
    const { wrapper } = renderList({ selectionType: 'multi' });
    wrapper.findItems().forEach(item => expect(item.findSelectionControl()).not.toBeNull());
  });

  test('reflects the controlled selectedItems via aria-selected', () => {
    const { wrapper } = renderList({ selectionType: 'multi', selectedItems: [defaultItems[0], defaultItems[3]] });
    expect(isSelected(wrapper.findItemById('item1')!)).toBe(true);
    expect(isSelected(wrapper.findItemById('item2')!)).toBe(false);
    expect(isSelected(wrapper.findItemById('item4')!)).toBe(true);
    expect(wrapper.findSelectedItems()).toHaveLength(2);
  });

  test('multi selection toggles items on click', () => {
    const onSelectionChange = jest.fn();
    const { wrapper } = renderList({ selectionType: 'multi', onSelectionChange });

    wrapper.findItemById('item1')!.click();
    expect(onSelectionChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: { selectedItems: [defaultItems[0]] } })
    );
    expect(isSelected(wrapper.findItemById('item1')!)).toBe(true);

    wrapper.findItemById('item2')!.click();
    expect(wrapper.findSelectedItems().map(i => i.getElement().getAttribute('data-testid'))).toEqual([
      'item1',
      'item2',
    ]);

    // toggling off
    wrapper.findItemById('item1')!.click();
    expect(isSelected(wrapper.findItemById('item1')!)).toBe(false);
    expect(wrapper.findSelectedItems()).toHaveLength(1);
  });

  test('single selection replaces the selection and does not deselect on re-click', () => {
    const onSelectionChange = jest.fn();
    const { wrapper } = renderList({ selectionType: 'single', onSelectionChange });

    wrapper.findItemById('item1')!.click();
    expect(wrapper.findSelectedItems().map(i => i.getElement().getAttribute('data-testid'))).toEqual(['item1']);

    wrapper.findItemById('item2')!.click();
    expect(wrapper.findSelectedItems().map(i => i.getElement().getAttribute('data-testid'))).toEqual(['item2']);

    onSelectionChange.mockClear();
    // re-clicking the selected item keeps it selected and fires no event
    wrapper.findItemById('item2')!.click();
    expect(onSelectionChange).not.toHaveBeenCalled();
    expect(isSelected(wrapper.findItemById('item2')!)).toBe(true);
  });

  test('does not select disabled items', () => {
    const onSelectionChange = jest.fn();
    const { wrapper } = renderList({ selectionType: 'multi', onSelectionChange });
    const disabledItem = wrapper.findItemById('item3')!;
    expect(disabledItem.getElement()).toHaveAttribute('aria-disabled', 'true');

    disabledItem.click();
    expect(onSelectionChange).not.toHaveBeenCalled();
    expect(isSelected(disabledItem)).toBe(false);
  });

  test('toggles selection with Space and Enter keys', () => {
    const { wrapper } = renderList({ selectionType: 'multi' });
    const item1 = wrapper.findItemById('item1')!.getElement();

    fireEvent.keyDown(item1, { keyCode: KeyCode.space });
    expect(isSelected(wrapper.findItemById('item1')!)).toBe(true);

    const item2 = wrapper.findItemById('item2')!.getElement();
    fireEvent.keyDown(item2, { keyCode: KeyCode.enter });
    expect(isSelected(wrapper.findItemById('item2')!)).toBe(true);
  });

  test('manages roving tabindex and arrow-key focus', () => {
    const { wrapper } = renderList({ selectionType: 'single' });
    const items = wrapper.findItems().map(i => i.getElement());

    // first item is focusable by default
    expect(items[0]).toHaveAttribute('tabindex', '0');
    expect(items[1]).toHaveAttribute('tabindex', '-1');

    fireEvent.keyDown(items[0], { keyCode: KeyCode.down });
    expect(items[1]).toHaveAttribute('tabindex', '0');
    expect(items[1]).toHaveFocus();

    fireEvent.keyDown(items[1], { keyCode: KeyCode.up });
    expect(items[0]).toHaveAttribute('tabindex', '0');
    expect(items[0]).toHaveFocus();

    fireEvent.keyDown(items[0], { keyCode: KeyCode.end });
    expect(items[3]).toHaveFocus();

    fireEvent.keyDown(items[3], { keyCode: KeyCode.home });
    expect(items[0]).toHaveFocus();
  });

  test('sorting takes precedence over selection when both are set', () => {
    const renderResult = render(
      <List
        items={defaultItems}
        renderItem={renderItemFn}
        selectionType="multi"
        sortable={true}
        onSortingChange={() => {}}
      />
    );
    const wrapper = createWrapper(renderResult.container).findList()!;
    expect(wrapper.getElement()).not.toHaveAttribute('role', 'listbox');
    expect(wrapper.findItemByIndex(1)!.getElement()).not.toHaveAttribute('role', 'option');
  });
});
