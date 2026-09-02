// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { TableBody, TableCell, TableHead, TableHeaderCell, TableHeaderRow, TableRootProps, TableRow } from '~components';

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
      <TableHeaderRow>
        <TableHeaderCell>Name</TableHeaderCell>
        <TableHeaderCell>Type</TableHeaderCell>
        <TableHeaderCell>Size</TableHeaderCell>
        <TableHeaderCell>Status</TableHeaderCell>
      </TableHeaderRow>
    </TableHead>
  );
}

export function DataBody({ items }: { items: Item[] }) {
  return (
    <TableBody>
      {items.map(item => (
        <TableRow key={item.id}>
          <TableCell>{item.name}</TableCell>
          <TableCell>{item.type}</TableCell>
          <TableCell>{item.size}</TableCell>
          <TableCell>{item.status}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
