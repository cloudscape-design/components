// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import Table, { TableProps } from '../../../lib/components/table';

interface Item {
  id: string;
  parentId: null | string;
}

const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  { id: 'id', header: 'id', cell: item => item.id, sortingField: 'id' },
  { id: 'other1', header: 'other 1', cell: item => item.id, sortingField: 'other1' },
  { id: 'other2', header: 'other 2', cell: item => item.id, sortingField: 'other2' },
];

const items: Item[] = [
  { id: 'a', parentId: null },
  { id: 'a.1', parentId: 'a' },
  { id: 'b', parentId: null },
  { id: 'c', parentId: null },
];

const icons: TableProps.Icons = {
  sortingIndicator: ({ sortingState }) => <span data-testid={`sort-${sortingState}`} />,
  expandToggle: ({ expanded }) => <span data-testid={expanded ? 'expanded' : 'collapsed'} />,
};

const tableProps: TableProps = {
  columnDefinitions,
  items,
  sortingColumn: { sortingField: 'id' },
  expandableRows: {
    getItemChildren: item => items.filter(child => child.parentId === item.id),
    isItemExpandable: item => !item.parentId,
    expandedItems: [items[0]],
    onExpandableItemToggle: () => {},
  },
  icons,
};

it('renders per-state custom sorting indicators', () => {
  const { queryAllByTestId, rerender } = render(<Table {...tableProps} sortingDescending={false} />);
  expect(queryAllByTestId('sort-ascending')).toHaveLength(1);
  expect(queryAllByTestId('sort-descending')).toHaveLength(0);
  expect(queryAllByTestId('sort-sortable')).toHaveLength(2);

  rerender(<Table {...tableProps} sortingDescending={true} />);
  expect(queryAllByTestId('sort-ascending')).toHaveLength(0);
  expect(queryAllByTestId('sort-descending')).toHaveLength(1);
  expect(queryAllByTestId('sort-sortable')).toHaveLength(2);
});

it('renders the custom expand toggle with the current state for expandable rows', () => {
  const { queryAllByTestId } = render(<Table {...tableProps} items={items.filter(item => !item.parentId)} />);
  expect(queryAllByTestId('expanded')).toHaveLength(1);
  expect(queryAllByTestId('collapsed')).toHaveLength(2);
});
