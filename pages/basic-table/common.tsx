// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import {
  BasicTableBody,
  BasicTableCell,
  BasicTableHeader,
  BasicTableHeaderCell,
  BasicTableRow,
} from '~components/beta/basic-table-0.1';

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

// A 4-column data layout (no control column): Name fixed, Type/Size flexible-with-min, Status flexible.
export const DATA_COLUMNS = [{ width: 220 }, { minWidth: 140 }, { minWidth: 120 }, {}];

// Renders the standard header row + body for the shared 4-column item shape.
export function DataHeader() {
  return (
    <BasicTableHeader>
      <BasicTableHeaderCell>Name</BasicTableHeaderCell>
      <BasicTableHeaderCell>Type</BasicTableHeaderCell>
      <BasicTableHeaderCell>Size</BasicTableHeaderCell>
      <BasicTableHeaderCell>Status</BasicTableHeaderCell>
    </BasicTableHeader>
  );
}

export function DataBody({ items }: { items: Item[] }) {
  return (
    <BasicTableBody>
      {items.map((item, index) => (
        <BasicTableRow key={item.id} index={index} id={item.id}>
          <BasicTableCell>{item.name}</BasicTableCell>
          <BasicTableCell>{item.type}</BasicTableCell>
          <BasicTableCell>{item.size}</BasicTableCell>
          <BasicTableCell>{item.status}</BasicTableCell>
        </BasicTableRow>
      ))}
    </BasicTableBody>
  );
}
