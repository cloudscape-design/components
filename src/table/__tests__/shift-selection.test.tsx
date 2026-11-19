// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import clone from 'lodash/clone';

import Table, { TableProps } from '../../../lib/components/table';
import createWrapper, { TableWrapper } from '../../../lib/components/test-utils/dom';

interface Item {
  id: number;
  name: string;
}

const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  { header: 'id', cell: item => item.id },
  { header: 'name', cell: item => item.name },
];

const items: Item[] = [
  { id: 1, name: 'Apples' },
  { id: 2, name: 'Oranges' },
  { id: 3, name: 'Bananas' },
  { id: 4, name: 'Cherries' },
  { id: 5, name: 'Mangoes' },
  { id: 6, name: 'Pineapple' },
  { id: 7, name: 'Strawberries' },
  { id: 8, name: 'Tomatoes' },
  { id: 9, name: 'Blueberries' },
];

function renderTable(tableProps: Partial<TableProps>) {
  const props: TableProps = {
    items: items,
    columnDefinitions: columnDefinitions,
    ...tableProps,
  };
  const { container } = render(<Table {...props} />);
  return createWrapper(container).findTable()!;
}

const getSelectionInput = (tableWrapper: TableWrapper, index: number) =>
  tableWrapper.findRowSelectionArea(index)?.find('input');

function shiftClickRow(tableWrapper: TableWrapper, index: number) {
  const input = tableWrapper.findRowSelectionArea(index)?.find('input');
  input?.fireEvent(new MouseEvent('mousedown', { shiftKey: true, bubbles: true }));
  input?.fireEvent(new MouseEvent('click', { shiftKey: true, bubbles: true }));
  input?.fireEvent(new MouseEvent('mouseup', { shiftKey: false, bubbles: true }));
}

describe('Shift selection', () => {
  let tableWrapper: TableWrapper;
  const handleSelectionChange = jest.fn();
  beforeEach(() => {
    handleSelectionChange.mockReset();
  });
  const expectSelected = (index: number, arr: Item[]) => {
    const { selectedItems } = handleSelectionChange.mock.calls[index][0].detail;
    expect(selectedItems).toHaveLength(arr.length);
    expect(selectedItems).toEqual(expect.arrayContaining(arr));
  };
  it('should select six items', () => {
    tableWrapper = renderTable({
      selectionType: 'multi',
      selectedItems: [],
      onSelectionChange: handleSelectionChange,
    });
    handleSelectionChange.mockReset();
    getSelectionInput(tableWrapper, 3)!.click();
    shiftClickRow(tableWrapper, 8);
    expect(handleSelectionChange).toHaveBeenCalledTimes(2);
    expectSelected(0, [items[2]]);
    expectSelected(1, [items[2], items[3], items[4], items[5], items[6], items[7]]);
  });

  it('should deselect four items in the middle', () => {
    tableWrapper = renderTable({
      selectionType: 'multi',
      selectedItems: [...items],
      onSelectionChange: handleSelectionChange,
    });
    getSelectionInput(tableWrapper, 3)!.click();
    shiftClickRow(tableWrapper, 7);
    expect(handleSelectionChange).toHaveBeenCalledTimes(2);
    expectSelected(
      0,
      items.filter(item => item.id !== 3)
    );
    expectSelected(1, [items[0], items[1], items[7], items[8]]);
  });

  it('should not select a disabled item', () => {
    tableWrapper = renderTable({
      selectionType: 'multi',
      selectedItems: [],
      onSelectionChange: handleSelectionChange,
      isItemDisabled: item => item === items[4],
    });
    getSelectionInput(tableWrapper, 2)!.click();
    shiftClickRow(tableWrapper, 6);
    expectSelected(1, [items[1], items[2], items[3], items[5]]);
  });
  it('should keep middle items selected', () => {
    tableWrapper = renderTable({
      selectionType: 'multi',
      selectedItems: [items[2], items[3]],
      onSelectionChange: handleSelectionChange,
    });
    getSelectionInput(tableWrapper, 1)!.click();
    shiftClickRow(tableWrapper, 6);
    expectSelected(1, [items[2], items[3], items[0], items[1], items[4], items[5]]);
  });
  it('should deselect partially selected', () => {
    tableWrapper = renderTable({
      selectionType: 'multi',
      selectedItems: [items[1], items[2], items[5]],
      onSelectionChange: handleSelectionChange,
    });
    getSelectionInput(tableWrapper, 1)!.click();
    shiftClickRow(tableWrapper, 6);
    expectSelected(1, []);
  });

  it('should respect trackBy property for bulk selection', () => {
    const tableProps = {
      trackBy: 'id',
      selectionType: 'multi',
      columnDefinitions,
      onSelectionChange: handleSelectionChange,
    } as const;
    const { container, rerender } = render(<Table {...tableProps} items={items} />);
    const wrapper = createWrapper(container).findTable()!;
    getSelectionInput(wrapper, 2)!.click();
    handleSelectionChange.mockReset();
    rerender(
      <Table
        {...tableProps}
        items={clone(items)} // use items clone to activate trackBy checks
      />
    );
    shiftClickRow(wrapper, 4);
    expectSelected(0, [items[1], items[2], items[3]]);
  });
  test('should not remove items that are not currently visible from the `selectedItems` array', () => {
    tableWrapper = renderTable({
      selectionType: 'multi',
      items: items.slice(2),
      selectedItems: [items[1], items[2], items[5]],
      onSelectionChange: handleSelectionChange,
    });
    // select range
    getSelectionInput(tableWrapper, 1)!.click();
    shiftClickRow(tableWrapper, 5);
    expect(handleSelectionChange).toHaveBeenCalledTimes(2);
    expectSelected(0, [items[1], items[5]]);
    expectSelected(1, items.slice(1, 7));
    handleSelectionChange.mockClear();
    // deselect range
    getSelectionInput(tableWrapper, 1)!.click();
    shiftClickRow(tableWrapper, 4);
    expect(handleSelectionChange).toHaveBeenCalledTimes(2);
    expectSelected(0, [items[1], items[5]]);
    expectSelected(1, [items[1]]);
  });
});
