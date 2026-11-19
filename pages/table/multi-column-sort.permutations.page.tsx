// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Pagination, { PaginationProps } from '~components/pagination';
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

const paginationLabels: PaginationProps.Labels = {
  nextPageLabel: 'Next page',
  previousPageLabel: 'Previous page',
  pageLabel: pageNumber => `Page ${pageNumber} of all pages`,
};

function getTableLabel(permutation: TableProps<Item>, index: number) {
  const sortingCount = permutation.multiColumnSort?.sortingColumns.length ?? 0;
  const sortingDescription = sortingCount === 0 ? 'no active sort' : `${sortingCount}-column sort`;
  const selectionDescription = permutation.selectionType ? `${permutation.selectionType} selection` : 'no selection';
  const resizingDescription = permutation.resizableColumns ? 'resizable columns' : 'fixed columns';
  const wrappingDescription = permutation.wrapLines ? 'wrapped lines' : 'unwrapped lines';
  const paginationDescription = permutation.pagination ? 'with pagination' : 'no pagination';

  return `Multi-column sort example ${index + 1}: ${sortingDescription}, ${selectionDescription}, ${resizingDescription}, ${wrappingDescription}, ${paginationDescription}`;
}

// createPermutations values are rendered by PermutationsView, not React array mapping, so JSX
// nodes used as prop values (e.g. pagination) do not need a key. Matches table/permutations.page.tsx.
/* eslint-disable react/jsx-key */
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
  {
    // Pagination alignment: the auto-rendered "Clear sort" button and Pagination share the header tools row.
    selectionType: [undefined],
    multiColumnSort: [
      // Pagination alone (no active sort, so no "Clear sort" button).
      { sortingColumns: [], onChange: noop },
      // Active two-column sort renders "Clear sort" alongside Pagination.
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
    pagination: [<Pagination currentPageIndex={1} pagesCount={3} ariaLabels={paginationLabels} />],
  },
]);

export default function MultiColumnSortPermutationsPage() {
  return (
    <PermutationsPage title="Table multi-column sort permutations" i18n={{}}>
      <PermutationsView
        permutations={permutations}
        render={(permutation, index = 0) => (
          <Table {...permutation} ariaLabels={{ ...ariaLabels, tableLabel: getTableLabel(permutation, index) }} />
        )}
      />
    </PermutationsPage>
  );
}
