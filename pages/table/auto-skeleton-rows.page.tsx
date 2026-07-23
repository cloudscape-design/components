// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import Table, { TableProps } from '~components/table';

interface Item {
  id: string;
  name: string;
  owner: string;
}

const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  { id: 'id', header: 'ID', cell: item => item.id },
  { id: 'name', header: 'Name', cell: item => item.name },
];

const longHeaderColumnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  {
    id: 'id',
    header: 'Resource identifier used to locate the item in the inventory',
    cell: item => item.id,
  },
  {
    id: 'name',
    header: 'Resource name shown to customers in the management console',
    cell: item => item.name,
  },
  {
    id: 'owner',
    header: 'Owning team responsible for operating this resource',
    cell: item => item.owner,
  },
];

const partialItems: Item[] = [
  { id: '1', name: 'First resource', owner: 'Team A' },
  { id: '2', name: 'Second resource', owner: 'Team B' },
  { id: '3', name: 'Third resource', owner: 'Team C' },
];

interface SkeletonScenarioProps {
  footer?: boolean;
  id: string;
  items?: readonly Item[];
  longHeaders?: boolean;
  stickyHeader?: boolean;
  wrapLines?: boolean;
}

function SkeletonScenario({ footer, id, items = [], longHeaders, stickyHeader, wrapLines }: SkeletonScenarioProps) {
  return (
    <div id={id} style={{ blockSize: '320px', inlineSize: longHeaders ? '360px' : undefined, overflowY: 'auto' }}>
      <Table
        columnDefinitions={longHeaders ? longHeaderColumnDefinitions : columnDefinitions}
        items={items}
        loading={true}
        loadingText="Loading items"
        skeleton={{ totalRows: 'auto' }}
        stickyHeader={stickyHeader}
        wrapLines={wrapLines}
        footer={footer ? <div id={`${id}-footer`}>Footer content</div> : undefined}
        header={<Header description="Skeleton rows fill the visible scroll viewport.">Items</Header>}
      />
    </div>
  );
}

export default function AutoSkeletonRowsPage() {
  return (
    <SpaceBetween size="l">
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
      <SkeletonScenario id="auto-skeleton-sticky-header" stickyHeader={true} />
      <SkeletonScenario footer={true} id="auto-skeleton-footer" />
      <SkeletonScenario id="auto-skeleton-long-headers-nowrap" longHeaders={true} wrapLines={false} />
      <SkeletonScenario id="auto-skeleton-long-headers-wrap" longHeaders={true} wrapLines={true} />
      <SkeletonScenario id="auto-skeleton-mixed-rows" items={partialItems} />
      <SkeletonScenario
        footer={true}
        id="auto-skeleton-all-features"
        longHeaders={true}
        stickyHeader={true}
        wrapLines={true}
      />
    </SpaceBetween>
  );
}
