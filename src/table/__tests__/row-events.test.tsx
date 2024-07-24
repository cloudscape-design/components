// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';

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
  { id: 1, name: 'Coffee' },
  { id: 2, name: 'Tea' },
  { id: 3, name: 'Lemonade' },
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
let onRowClickSpy: jest.Mock;
let onRowContextMenuSpy: jest.Mock;
let tableWrapper: TableWrapper;

describe('fires the row events:', () => {
  beforeEach(() => {
    onRowClickSpy = jest.fn();
    onRowContextMenuSpy = jest.fn();
    tableWrapper = renderTable({
      selectedItems: [items[0]],
      onRowClick: onRowClickSpy,
      onRowContextMenu: onRowContextMenuSpy,
    });
  });
  test('rowClick, when clicking left mouse button on a row', () => {
    tableWrapper.findRows()[0].click();
    expect(onRowClickSpy).toHaveBeenCalledTimes(1);
    expect(onRowClickSpy).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { item: { id: 1, name: 'Coffee' }, rowIndex: 0 } })
    );
  });
  test('rowContextMenu, when firing contextmenu on a row', () => {
    fireEvent.contextMenu(tableWrapper.findRows()[1].getElement());
    expect(onRowContextMenuSpy).toHaveBeenCalledTimes(1);
    expect(onRowContextMenuSpy).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { item: { id: 2, name: 'Tea' }, rowIndex: 1, clientX: 0, clientY: 0 } })
    );
  });
  test('rowContextMenu with event.preventDefault() should be prevented from execution', () => {
    tableWrapper = renderTable({
      selectedItems: [items[0]],
      onRowContextMenu: event => {
        event.preventDefault();
      },
    });
    const isExecuted = fireEvent.contextMenu(tableWrapper.findRows()[1].getElement());
    expect(isExecuted).toBe(false);
  });
});
