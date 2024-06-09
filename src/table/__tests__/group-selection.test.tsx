// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { render } from '@testing-library/react';
import Table, { TableProps } from '../../../lib/components/table';
import createWrapper, { TableWrapper } from '../../../lib/components/test-utils/dom';

interface Item {
  id: string;
  name: string;
  children?: Item[];
}

const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  { header: 'id', cell: item => item.id },
  { header: 'name', cell: item => item.name },
];

const items: Item[] = [
  {
    id: '1',
    name: 'Apples',
    children: [
      { id: '1.1', name: 'Gala' },
      { id: '1.2', name: 'Red Delicious' },
      {
        id: '1.3',
        name: 'Fuji',
        children: [
          { id: '1.3.1', name: 'Fuji 1' },
          { id: '1.3.2', name: 'Fuji 2' },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Oranges',
    children: [
      { id: '2.1', name: 'Dream navel' },
      { id: '2.2', name: 'Tangerine' },
    ],
  },
  { id: '3', name: 'Bananas', children: [{ id: '3.1', name: 'Cavendish' }] },
];

function SelectableTable(tableProps: TableProps<Item>) {
  const [selectionInverted, setSelectionInverted] = useState(tableProps.selectionInverted ?? false);
  const [selectedItems, setSelectedItems] = useState(tableProps.selectedItems ?? []);
  return (
    <Table
      {...tableProps}
      selectionInverted={selectionInverted}
      selectedItems={selectedItems}
      onSelectionChange={event => {
        setSelectionInverted(!!event.detail.selectionInverted);
        setSelectedItems(event.detail.selectedItems);
        tableProps.onSelectionChange?.(event);
      }}
    />
  );
}

function renderTable(tableProps: Partial<TableProps>, selectedItems: string[], expandedItems?: string[]) {
  const props: TableProps = {
    items,
    columnDefinitions,
    selectionType: 'group',
    trackBy: 'id',
    selectionInverted: selectedItems.includes('ALL'),
    selectedItems: selectedItems.filter(id => id !== 'ALL').map(id => ({ id, name: '' })),
    expandableRows: expandedItems
      ? {
          getItemChildren: item => item.children ?? [],
          isItemExpandable: item => !!item.children,
          expandedItems: expandedItems.map(id => ({ id, name: '' })),
          onExpandableItemToggle: () => {},
        }
      : undefined,
    ...tableProps,
  };
  const { container, rerender } = render(<SelectableTable {...props} />);
  const wrapper = createWrapper(container).findTable()!;
  return {
    wrapper,
    rerender: (extraProps: Partial<TableProps>) => rerender(<SelectableTable {...props} {...extraProps} />),
  };
}

function getTableSelection(tableWrapper: TableWrapper) {
  const selectionState: Record<string, 'empty' | 'indeterminate' | 'checked'> = {};
  const getInputState = (input: HTMLInputElement): 'empty' | 'indeterminate' | 'checked' => {
    return input.checked ? 'checked' : input.indeterminate ? 'indeterminate' : 'empty';
  };

  const selectAllInput = tableWrapper.findSelectAllTrigger()!.find<HTMLInputElement>('input')!.getElement();
  selectionState.ALL = getInputState(selectAllInput);

  for (let i = 0; i < tableWrapper.findRows().length; i++) {
    const key = tableWrapper.findBodyCell(i + 1, 2)!.getElement().textContent!;
    const input = tableWrapper
      .findRowSelectionArea(i + 1)!
      .find<HTMLInputElement>('input')!
      .getElement();
    selectionState[key] = getInputState(input);
  }

  return selectionState;
}

test('selects all items one by one and makes select-all indeterminate and then checked', () => {
  const { wrapper } = renderTable({}, []);
  expect(getTableSelection(wrapper)).toEqual({
    ALL: 'empty',
    '1': 'empty',
    '2': 'empty',
    '3': 'empty',
  });

  wrapper.findRowSelectionArea(1)!.click();
  expect(getTableSelection(wrapper)).toEqual({
    ALL: 'indeterminate',
    '1': 'checked',
    '2': 'empty',
    '3': 'empty',
  });

  wrapper.findRowSelectionArea(2)!.click();
  expect(getTableSelection(wrapper)).toEqual({
    ALL: 'indeterminate',
    '1': 'checked',
    '2': 'checked',
    '3': 'empty',
  });

  wrapper.findRowSelectionArea(3)!.click();
  expect(getTableSelection(wrapper)).toEqual({
    ALL: 'checked',
    '1': 'checked',
    '2': 'checked',
    '3': 'checked',
  });
});

test('selects all items using select-all when no items selected', () => {
  const { wrapper } = renderTable({}, []);
  expect(getTableSelection(wrapper)).toEqual({
    ALL: 'empty',
    '1': 'empty',
    '2': 'empty',
    '3': 'empty',
  });

  wrapper.findSelectAllTrigger()!.click();
  expect(getTableSelection(wrapper)).toEqual({
    ALL: 'checked',
    '1': 'checked',
    '2': 'checked',
    '3': 'checked',
  });
});

test('selects all items using select-all when some items selected', () => {
  const { wrapper } = renderTable({}, ['2', '3']);
  expect(getTableSelection(wrapper)).toEqual({
    ALL: 'indeterminate',
    '1': 'empty',
    '2': 'checked',
    '3': 'checked',
  });

  wrapper.findSelectAllTrigger()!.click();
  expect(getTableSelection(wrapper)).toEqual({
    ALL: 'checked',
    '1': 'checked',
    '2': 'checked',
    '3': 'checked',
  });
});

test('unselects all items using select-all when all items selected', () => {
  const { wrapper } = renderTable({}, ['ALL']);
  expect(getTableSelection(wrapper)).toEqual({
    ALL: 'checked',
    '1': 'checked',
    '2': 'checked',
    '3': 'checked',
  });

  wrapper.findSelectAllTrigger()!.click();
  expect(getTableSelection(wrapper)).toEqual({
    ALL: 'empty',
    '1': 'empty',
    '2': 'empty',
    '3': 'empty',
  });
});
