// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Header from '~components/header';
import Skeleton from '~components/skeleton';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import Table, { TableProps } from '~components/table';

interface Item {
  name: string;
  summary: string;
  detail: string;
  status: 'available' | 'error';
}

// Columns whose settled content is not a single line of text: a two-line cell,
// a status indicator, and an actions button. A single one-line skeleton bar
// mismatches these and causes a layout jump when data lands.
const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  { id: 'name', header: 'Name', cell: item => item.name },
  {
    id: 'description',
    header: 'Description',
    cell: item => (
      <SpaceBetween size="xxs">
        <Box>{item.summary}</Box>
        <Box color="text-body-secondary" fontSize="body-s">
          {item.detail}
        </Box>
      </SpaceBetween>
    ),
  },
  { id: 'status', header: 'Status', cell: item => <StatusIndicator type={item.status === 'error' ? 'error' : 'success'}>{item.status}</StatusIndicator> },
  { id: 'actions', header: '', cell: () => <Button>Edit</Button> },
];

// A single central render function keyed on the column definition. Return
// `undefined` to fall back to the default single-line skeleton (here, the Name column).
const renderCell: NonNullable<TableProps.SkeletonConfig<Item>['renderCell']> = column => {
  switch (column.id) {
    case 'description':
      return (
        <SpaceBetween size="xxs">
          <Skeleton variant="text-body-m" width="90%" />
          <Skeleton variant="text-body-s" width="60%" />
        </SpaceBetween>
      );
    case 'status':
      return <Skeleton variant="text-body-m" width="80px" />;
    case 'actions':
      return <Skeleton variant="text-body-m" display="inline-block" width="64px" height="2rem" />;
    default:
      return undefined;
  }
};

export default function SkeletonRenderCellPage() {
  return (
    <Box padding="l">
      <SpaceBetween size="xl">
        <h1>Table skeleton — per-column renderCell</h1>

        <Table
          items={[]}
          loading={true}
          loadingText="Loading resources"
          columnDefinitions={columnDefinitions}
          skeleton={{ totalRows: 5 }}
          header={<Header>Default single-line skeleton</Header>}
        />

        <Table
          items={[]}
          loading={true}
          loadingText="Loading resources"
          columnDefinitions={columnDefinitions}
          skeleton={{ totalRows: 5, renderCell }}
          header={<Header>Column-shaped skeleton (renderCell)</Header>}
        />
      </SpaceBetween>
    </Box>
  );
}
