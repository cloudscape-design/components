// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { TableBody, TableBodyCell, TableHead, TableHeaderCell, TableRootProps, TableRow } from '~components';

export interface Item {
  id: string;
  name: string;
  type: string;
  size: string;
  status: string;
}

export const makeItems = (n: number): Item[] =>
  Array.from({ length: n }, (_, index) => ({
    id: `resource-${index}`,
    name: `Resource ${index}`,
    type: index % 3 === 0 ? 'Compute' : index % 3 === 1 ? 'Storage' : 'Network',
    size: `${(index % 8) + 1} GiB`,
    status: index % 2 === 0 ? 'Available' : 'Pending',
  }));

export type SortKey = 'name' | 'type' | 'size' | 'status';

export interface SortEntry {
  key: SortKey;
  descending: boolean;
}

export function compareItems(key: SortKey, a: Item, b: Item): number {
  if (key === 'size') {
    return parseInt(a.size, 10) - parseInt(b.size, 10);
  }
  return a[key].localeCompare(b[key]);
}

// Sorts by each entry in turn, as in a multi-column sort.
export function sortItems(items: ReadonlyArray<Item>, sorting: ReadonlyArray<SortEntry>): Item[] {
  return [...items].sort((a, b) => {
    for (const { key, descending } of sorting) {
      const result = compareItems(key, a, b);
      if (result !== 0) {
        return descending ? -result : result;
      }
    }
    return 0;
  });
}

// A 4-column grid layout (no control column): Name fixed, Type/Size flexible-with-min, Status flexible.
export const DATA_COLUMNS: ReadonlyArray<TableRootProps.ColumnDefinition> = [
  { size: 220 },
  { minWidth: 140 },
  { minWidth: 120 },
  {},
];

// Renders the standard header row for the shared 4-column item shape: a TableRow of TableHeaderCells.
export function DataHeader() {
  return (
    <TableHead>
      <TableRow>
        <TableHeaderCell>Name</TableHeaderCell>
        <TableHeaderCell>Type</TableHeaderCell>
        <TableHeaderCell>Size</TableHeaderCell>
        <TableHeaderCell>Status</TableHeaderCell>
      </TableRow>
    </TableHead>
  );
}

export function DataBody({ items }: { items: Item[] }) {
  return (
    <TableBody>
      {items.map(item => (
        <TableRow key={item.id}>
          <TableBodyCell>{item.name}</TableBodyCell>
          <TableBodyCell>{item.type}</TableBodyCell>
          <TableBodyCell>{item.size}</TableBodyCell>
          <TableBodyCell>{item.status}</TableBodyCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
