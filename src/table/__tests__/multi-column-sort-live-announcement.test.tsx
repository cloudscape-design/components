// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render, waitFor } from '@testing-library/react';

import Table from '../../../lib/components/table';
import { TableProps } from '../../../lib/components/table/interfaces';

interface Item {
  id: string;
  name: string;
}

const items: Item[] = [
  { id: '1', name: 'alpha' },
  { id: '2', name: 'beta' },
];

// ReactNode (non-string) headers, like a translation component, so the announcement can only produce
// these names by reading the rendered DOM text — not `columnDefinitions[].header`.
const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  { id: 'name', header: <span>Rendered name</span>, cell: item => item.name, sortingField: 'name' },
  { id: 'id', header: <span>Rendered id</span>, cell: item => item.id, sortingField: 'id' },
];

const i18nStrings: TableProps.I18nStrings = {
  liveAnnouncementSortColumn: ({ columnLabel, isDescending }) =>
    `${columnLabel} ${isDescending ? 'descending' : 'ascending'}`,
  liveAnnouncementSortOrder: ({ columns }) => `Table sorted by ${columns}`,
  liveAnnouncementSortCleared: 'Sorting cleared',
};

function TableWithSort({ sortingColumns }: { sortingColumns: ReadonlyArray<TableProps.SortingState<Item>> }) {
  return (
    <Table
      items={items}
      columnDefinitions={columnDefinitions}
      multiColumnSort={{ sortingColumns, onChange: () => {} }}
      i18nStrings={i18nStrings}
    />
  );
}

const nameAsc: TableProps.SortingState<Item> = { sortingColumn: { sortingField: 'name' }, isDescending: false };
const idDesc: TableProps.SortingState<Item> = { sortingColumn: { sortingField: 'id' }, isDescending: true };

test('does not announce the initial sort state on mount', () => {
  const { container } = render(<TableWithSort sortingColumns={[nameAsc]} />);
  expect(container.textContent).not.toContain('Table sorted by');
});

test('announces a sort change using the rendered (DOM) header text', async () => {
  const { container, rerender } = render(<TableWithSort sortingColumns={[]} />);
  rerender(<TableWithSort sortingColumns={[nameAsc, idDesc]} />);
  await waitFor(() =>
    expect(container.textContent).toContain('Table sorted by Rendered name ascending, Rendered id descending')
  );
});

test('announces when sorting is cleared', async () => {
  const { container, rerender } = render(<TableWithSort sortingColumns={[nameAsc]} />);
  rerender(<TableWithSort sortingColumns={[]} />);
  await waitFor(() => expect(container.textContent).toContain('Sorting cleared'));
});
