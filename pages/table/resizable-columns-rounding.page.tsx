// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Table, { TableProps } from '~components/table';

interface Item {
  id: string;
}

const columns: Array<TableProps.ColumnDefinition<Item>> = [
  {
    header: 'Column',
    cell: item => item.id,
  },
  {
    header: 'Column',
    cell: item => item.id,
  },
  {
    header: 'Column',
    cell: item => item.id,
  },
  {
    header: 'Column',
    cell: item => item.id,
  },
  {
    header: 'Column',
    cell: item => item.id,
  },
];
const items: Array<Item> = [
  { id: 'aaaaaaaaaa' },
  { id: 'aaaaaaaaaa' },
  { id: 'aaaaaaaaaa' },
  { id: 'aaaaaaaaaa' },
  { id: 'aaaaaaaaaa' },
  { id: 'aaaaaaaaaa' },
];

export default function () {
  const [width, setWidth] = useState(609);
  return (
    <>
      <h1>Table in container with special size </h1>
      <button id="shrink-container" onClick={() => setWidth(595)}>
        Resize container
      </button>
      <div style={{ width }}>
        <Table resizableColumns={true} items={items} columnDefinitions={columns} />
      </div>
    </>
  );
}
