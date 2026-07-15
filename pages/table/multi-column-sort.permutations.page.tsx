// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Table, { TableProps } from '~components/table';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

interface Item {
  name: string;
  type: string;
  count: number;
}

const items: Item[] = [
  { name: 'alpha', type: 't3.micro', count: 12 },
  { name: 'beta', type: 'm5.large', count: 3 },
];

const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  { id: 'name', header: 'Name', cell: item => item.name, sortingField: 'name' },
  { id: 'type', header: 'Type', cell: item => item.type, sortingField: 'type' },
  { id: 'count', header: 'Count', cell: item => item.count, sortingField: 'count' },
];

const noop = () => {};

const i18nStrings: TableProps.I18nStrings = {
  sortDropdownSortAscending: 'Sort ascending',
  sortDropdownSortDescending: 'Sort descending',
  sortDropdownMultiColumnSortGroup: 'Multi-column sort (Shift + Click)',
  sortDropdownAddToSortAscending: 'Add to sort (ascending)',
  sortDropdownAddToSortDescending: 'Add to sort (descending)',
  sortDropdownRemoveFromSort: 'Remove from sort',
  sortDropdownAddToSortDisabledReason: 'This column is already sorted',
  sortDropdownRemoveFromSortDisabledReason: 'This column is not sorted',
  clearSort: 'Clear sort',
};

const ariaLabels: TableProps.AriaLabels<Item> = {
  tableLabel: 'Multi-column sort permutations',
  sortMenuTriggerLabel: 'Sort options',
  sortAscending: 'ascending',
  sortDescending: 'descending',
  liveAnnouncementSortOrder: ({ columns }) => `Table sorted by ${columns}`,
  liveAnnouncementSortCleared: 'Sorting cleared',
  sortPriority: ({ priority }) => `sort priority ${priority}`,
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
]);

export default function () {
  return (
    <>
      <h1>Table multi-column sort permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <Table
              {...permutation}
              i18nStrings={i18nStrings}
              ariaLabels={{ ...ariaLabels, tableLabel: `Items ${permutations.indexOf(permutation)}` }}
            />
          )}
        />
      </ScreenshotArea>
    </>
  );
}
