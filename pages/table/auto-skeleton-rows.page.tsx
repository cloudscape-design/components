// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Header from '~components/header';
import Table, { TableProps } from '~components/table';

interface Item {
  id: string;
  name: string;
}

const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  { id: 'id', header: 'ID', cell: item => item.id },
  { id: 'name', header: 'Name', cell: item => item.name },
];

export default function AutoSkeletonRowsPage() {
  return (
    <div id="auto-skeleton-scroll-container" style={{ blockSize: '400px', overflowY: 'auto' }}>
      <div style={{ blockSize: '64px' }} />
      <div id="auto-skeleton-inner-scroll-container" style={{ blockSize: '320px', overflowY: 'auto' }}>
        <Table
          columnDefinitions={columnDefinitions}
          items={[]}
          loading={true}
          loadingText="Loading items"
          skeleton={{ totalRows: 'auto' }}
          header={<Header description="Skeleton rows fill the visible scroll viewport.">Items</Header>}
        />
      </div>
    </div>
  );
}
