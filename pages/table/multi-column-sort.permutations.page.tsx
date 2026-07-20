// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Table, { TableProps } from '~components/table';

import { PermutationsPage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';

interface Item {
  name: string;
  type: string;
  count: number;
}

const items: Item[] = [
  { name: 'alpha', type: 't3.micro', count: 12 },
  { name: 'beta', type: 'm5.large', count: 3 },
];

const layoutItems: Item[] = [
  {
    name: 'alpha with a deliberately long resource name that demonstrates the table wrapping behavior',
    type: 't3.micro instance type with an intentionally long description for the layout scenarios',
    count: 12,
  },
  {
    name: 'beta with another long resource name that demonstrates the table wrapping behavior',
    type: 'm5.large instance type with an intentionally long description for the layout scenarios',
    count: 3,
  },
];

const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  { id: 'name', header: 'Name', cell: item => item.name, sortingField: 'name' },
  { id: 'type', header: 'Type', cell: item => item.type, sortingField: 'type' },
  { id: 'count', header: 'Count', cell: item => item.count, sortingField: 'count' },
];

const longColumnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  {
    id: 'name',
    header: 'Resource name with a deliberately long sortable column header',
    cell: item => item.name,
    sortingField: 'name',
  },
  {
    id: 'type',
    header: 'Instance type with a deliberately long sortable column header',
    cell: item => item.type,
    sortingField: 'type',
  },
  {
    id: 'count',
    header: 'Number of associated resources',
    cell: item => item.count,
    sortingField: 'count',
  },
];

const noop = () => {};

const ariaLabels: TableProps.AriaLabels<Item> = {
  tableLabel: 'Multi-column sort permutations',
  selectionGroupLabel: 'Item selection',
  allItemsSelectionLabel: () => 'Select all',
  itemSelectionLabel: (_data, item) => `Select ${item.name}`,
};

const permutations = createPermutations<TableProps<Item>>([
  {
    selectionType: [undefined, 'multi'],
    multiColumnSort: [
      // No active sort: kebab present, no priority badge, aria-sort="none".
      { sortingColumns: [], onChange: noop },
      // Single column: sorted icon, no priority badge (priority adds no info).
      { sortingColumns: [{ sortingColumn: { sortingField: 'name' }, isDescending: false }], onChange: noop },
      // Two columns: primary ascending (badge 1, declares aria-sort) + secondary descending (badge 2, suppressed).
      {
        sortingColumns: [
          { sortingColumn: { sortingField: 'name' }, isDescending: false },
          { sortingColumn: { sortingField: 'type' }, isDescending: true },
        ],
        onChange: noop,
      },
    ],
    items: [items],
    columnDefinitions: [columnDefinitions],
  },
  {
    selectionType: [undefined],
    multiColumnSort: [
      {
        sortingColumns: [
          { sortingColumn: { sortingField: 'name' }, isDescending: false },
          { sortingColumn: { sortingField: 'type' }, isDescending: true },
        ],
        onChange: noop,
      },
    ],
    items: [layoutItems],
    columnDefinitions: [longColumnDefinitions],
    resizableColumns: [false, true],
    wrapLines: [false, true],
  },
]);

export default function MultiColumnSortPermutationsPage() {
  return (
    <PermutationsPage title="Table multi-column sort permutations" i18n={{}}>
      <PermutationsView
        permutations={permutations}
        render={permutation => (
          <Table
            {...permutation}
            ariaLabels={{ ...ariaLabels, tableLabel: `Items ${permutations.indexOf(permutation)}` }}
          />
        )}
      />
    </PermutationsPage>
  );
}
