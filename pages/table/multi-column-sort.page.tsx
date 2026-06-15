// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Table, TableProps } from '~components';

import { SimplePage } from '../app/templates';

interface Item {
  id: string;
  name: string;
  type: string;
  state: string;
  cpu: number;
}

const allItems: Item[] = [
  { id: '1', name: 'alpha-server', type: 't3.micro', state: 'running', cpu: 12 },
  { id: '2', name: 'beta-server', type: 'm5.large', state: 'stopped', cpu: 0 },
  { id: '3', name: 'gamma-worker', type: 'c5.xlarge', state: 'running', cpu: 87 },
  { id: '4', name: 'delta-proxy', type: 't3.micro', state: 'running', cpu: 45 },
  { id: '5', name: 'epsilon-db', type: 'r5.large', state: 'running', cpu: 23 },
  { id: '6', name: 'zeta-cache', type: 'r5.large', state: 'stopped', cpu: 0 },
  { id: '7', name: 'eta-gateway', type: 't3.micro', state: 'running', cpu: 56 },
  { id: '8', name: 'theta-batch', type: 'c5.xlarge', state: 'running', cpu: 91 },
];

const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  { id: 'name', header: 'Name', cell: item => item.name, sortingField: 'name' },
  { id: 'type', header: 'Type', cell: item => item.type, sortingField: 'type' },
  { id: 'state', header: 'State', cell: item => item.state, sortingField: 'state' },
  { id: 'cpu', header: 'CPU %', cell: item => `${item.cpu}%`, sortingField: 'cpu' },
];

export default function MultiColumnSortPage() {
  const [sortingColumns, setSortingColumns] = useState<ReadonlyArray<TableProps.SortingState<Item>>>([
    { sortingColumn: { sortingField: 'state' }, isDescending: false },
    { sortingColumn: { sortingField: 'cpu' }, isDescending: true },
  ]);

  const sorted = [...allItems].sort((a, b) => {
    for (const { sortingColumn, isDescending } of sortingColumns) {
      const field = sortingColumn.sortingField as keyof Item;
      const aVal = a[field];
      const bVal = b[field];
      let cmp = 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        cmp = aVal - bVal;
      } else {
        cmp = String(aVal).localeCompare(String(bVal));
      }
      if (cmp !== 0) {
        return isDescending ? -cmp : cmp;
      }
    }
    return 0;
  });

  return (
    <SimplePage title="Multi-column sort">
      <Table
          items={sorted}
          columnDefinitions={columnDefinitions}
          multiColumnSort={{
            sortingColumns,
            onChange: ({ detail }) => setSortingColumns(detail.sortingColumns),
          }}
          ariaLabels={{
            tableLabel: 'Multi-column sort demo',
            sortMenuTriggerLabel: 'Sort options',
          }}
        />
    </SimplePage>
  );
}
