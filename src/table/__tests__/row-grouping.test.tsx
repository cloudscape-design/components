// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Table, { TableProps } from '../../../lib/components/table';
import createWrapper from '../../../lib/components/test-utils/dom';

interface Item {
  id: number;
  name: string;
  group: string;
}

const columns: TableProps.ColumnDefinition<Item>[] = [
  { header: 'id', cell: item => item.id, isRowHeader: true },
  { header: 'name', cell: item => item.name },
];

const items: Item[] = [
  { id: 1, name: 'Apples', group: 'Fruit' },
  { id: 2, name: 'Oranges', group: 'Fruit' },
  { id: 3, name: 'Carrots', group: 'Vegetable' },
  { id: 4, name: 'Potatoes', group: 'Vegetable' },
  { id: 5, name: 'Bread', group: 'Bakery' },
];

const rowGrouping: TableProps.RowGrouping<Item> = {
  getGroupId: item => item.group,
  renderGroupHeader: ({ groupId, items }) => `${groupId} (${items.length})`,
};

function renderTable(props?: Partial<TableProps<Item>>) {
  const { container } = render(<Table items={items} columnDefinitions={columns} trackBy="id" {...props} />);
  return createWrapper(container).findTable()!;
}

describe('Table row grouping', () => {
  test('does not render group header rows when rowGrouping is not set', () => {
    const wrapper = renderTable();
    expect(wrapper.findRowGroupHeaders()).toHaveLength(0);
    expect(wrapper.findRows()).toHaveLength(5);
  });

  test('renders one group header per distinct group in order', () => {
    const wrapper = renderTable({ rowGrouping });
    const headers = wrapper.findRowGroupHeaders();
    expect(headers).toHaveLength(3);
    expect(headers.map(h => h.getElement().textContent)).toEqual(['Fruit (2)', 'Vegetable (2)', 'Bakery (1)']);
  });

  test('findRows excludes group header rows', () => {
    const wrapper = renderTable({ rowGrouping });
    expect(wrapper.findRows()).toHaveLength(5);
  });

  test('group header cell spans all columns (including selection column)', () => {
    const wrapper = renderTable({ rowGrouping, selectionType: 'multi' });
    const cell = wrapper.findRowGroupHeaders()[0].find('td')!.getElement();
    // 2 data columns + 1 selection column = 3
    expect(cell).toHaveAttribute('colspan', '3');
  });

  test('group header cell colspan matches column count without selection', () => {
    const wrapper = renderTable({ rowGrouping });
    const cell = wrapper.findRowGroupHeaders()[0].find('td')!.getElement();
    expect(cell).toHaveAttribute('colspan', '2');
  });

  test('group header rows are not selectable (single spanning cell, no controls)', () => {
    const wrapper = renderTable({ rowGrouping, selectionType: 'multi' });
    const header = wrapper.findRowGroupHeaders()[0];
    expect(header.findAll('td')).toHaveLength(1);
    expect(header.findAll('input')).toHaveLength(0);
  });

  test('exposes the group id via data attribute', () => {
    const wrapper = renderTable({ rowGrouping });
    expect(wrapper.findRowGroupHeaders()[0].getElement()).toHaveAttribute('data-group-id', 'Fruit');
    expect(wrapper.findRowGroupHeaders()[1].getElement()).toHaveAttribute('data-group-id', 'Vegetable');
  });

  test('creates separate groups for non-consecutive items with the same id', () => {
    const wrapper = renderTable({
      items: [
        { id: 1, name: 'Apples', group: 'Fruit' },
        { id: 2, name: 'Carrots', group: 'Vegetable' },
        { id: 3, name: 'Oranges', group: 'Fruit' },
      ],
      rowGrouping,
    });
    const headers = wrapper.findRowGroupHeaders();
    expect(headers.map(h => h.getElement().getAttribute('data-group-id'))).toEqual(['Fruit', 'Vegetable', 'Fruit']);
  });

  test('findRowGroupHeaders returns an empty array when no grouping is configured', () => {
    const wrapper = renderTable();
    expect(wrapper.findRowGroupHeaders()).toEqual([]);
  });
});
