// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Table, { TableProps } from '~components/table';

const columnDefinitions: TableProps.ColumnDefinition<unknown>[] = [
  {
    header: 'A',
    id: 'a',
    cell: () => 'a',
  },
  {
    header: 'B',
    id: 'b',
    cell: () => 'a',
  },
];

export default function App() {
  return (
    <div style={{ padding: '0 12px' }}>
      <h1>Resizable Columns Flex</h1>
      <div style={{ display: 'flex', maxWidth: 400 }}>
        <Table items={[]} resizableColumns={true} columnDefinitions={columnDefinitions} />
      </div>
    </div>
  );
}
