// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';

import { Checkbox, Pagination, SpaceBetween, Table, TableProps } from '~components';

import { useAppContext } from '../app/app-context';
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

const shortHeaders: Record<string, string> = {
  name: 'Name',
  type: 'Type',
  state: 'State',
  cpu: 'CPU %',
};

const longHeaders: Record<string, string> = {
  name: 'Fully qualified instance name and identifier',
  type: 'Compute instance type and family classification',
  state: 'Current lifecycle and operational state',
  cpu: 'Average CPU utilization over the last hour (%)',
};

const groupDefinitions: TableProps.GroupDefinition[] = [
  { id: 'identity', header: 'Identity' },
  { id: 'status', header: 'Status' },
];

const groupedColumnDisplay: TableProps.ColumnDisplayProperties[] = [
  {
    type: 'group',
    id: 'identity',
    visible: true,
    children: [
      { id: 'name', visible: true },
      { id: 'type', visible: true },
    ],
  },
  {
    type: 'group',
    id: 'status',
    visible: true,
    children: [
      { id: 'state', visible: true },
      { id: 'cpu', visible: true },
    ],
  },
];

const initialMultiColumnSort: ReadonlyArray<TableProps.SortingState<Item>> = [
  { sortingColumn: { sortingField: 'state' }, isDescending: false },
  { sortingColumn: { sortingField: 'cpu' }, isDescending: true },
];

const initialSingleColumnSort: TableProps.SortingState<Item> = initialMultiColumnSort[0];
const PAGE_SIZE = 4;

export default function MultiColumnSortPage() {
  const { urlParams, setUrlParams } = useAppContext<
    'multiSort' | 'selection' | 'grouped' | 'pagination' | 'longNames' | 'resizable'
  >();

  // `multiSort` defaults to on; the rest default to off.
  const multiSortEnabled = urlParams.multiSort !== false;
  const selectionEnabled = !!urlParams.selection;
  const groupedEnabled = !!urlParams.grouped;
  const paginationEnabled = !!urlParams.pagination;
  const longNamesEnabled = !!urlParams.longNames;
  const resizableEnabled = !!urlParams.resizable;

  const { items, collectionProps, paginationProps } = useCollection(allItems, {
    sorting: multiSortEnabled
      ? { multiColumn: true, defaultSortingColumns: initialMultiColumnSort }
      : { defaultState: initialSingleColumnSort },
    pagination: paginationEnabled ? { pageSize: PAGE_SIZE } : undefined,
    selection: selectionEnabled ? {} : undefined,
  });

  const headers = longNamesEnabled ? longHeaders : shortHeaders;
  const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
    {
      id: 'name',
      header: headers.name,
      cell: item => item.name,
      sortingField: 'name',
    },
    {
      id: 'type',
      header: headers.type,
      cell: item => item.type,
      sortingField: 'type',
    },
    {
      id: 'state',
      header: headers.state,
      cell: item => item.state,
      sortingField: 'state',
    },
    {
      id: 'cpu',
      header: headers.cpu,
      cell: item => `${item.cpu}%`,
      sortingField: 'cpu',
    },
  ];

  return (
    <SimplePage
      title="Multi-column sort"
      i18n={{}}
      settings={
        <SpaceBetween size="l" direction="horizontal">
          <Checkbox checked={multiSortEnabled} onChange={({ detail }) => setUrlParams({ multiSort: detail.checked })}>
            Multi-column sort
          </Checkbox>
          <Checkbox checked={selectionEnabled} onChange={({ detail }) => setUrlParams({ selection: detail.checked })}>
            Selection
          </Checkbox>
          <Checkbox checked={groupedEnabled} onChange={({ detail }) => setUrlParams({ grouped: detail.checked })}>
            Grouped columns
          </Checkbox>
          <Checkbox checked={paginationEnabled} onChange={({ detail }) => setUrlParams({ pagination: detail.checked })}>
            Pagination
          </Checkbox>
          <Checkbox checked={longNamesEnabled} onChange={({ detail }) => setUrlParams({ longNames: detail.checked })}>
            Long column names
          </Checkbox>
          <Checkbox checked={resizableEnabled} onChange={({ detail }) => setUrlParams({ resizable: detail.checked })}>
            Resizable columns
          </Checkbox>
        </SpaceBetween>
      }
    >
      <Table
        {...collectionProps}
        items={items}
        columnDefinitions={columnDefinitions}
        resizableColumns={resizableEnabled}
        groupDefinitions={groupedEnabled ? groupDefinitions : undefined}
        columnDisplay={groupedEnabled ? groupedColumnDisplay : undefined}
        selectionType={selectionEnabled ? 'multi' : undefined}
        pagination={paginationEnabled ? <Pagination {...paginationProps} /> : undefined}
        ariaLabels={{
          tableLabel: 'Multi-column sort demo',
          selectionGroupLabel: 'Item selection',
          allItemsSelectionLabel: () => 'Select all',
          itemSelectionLabel: (_data, item) => `Select ${item.name}`,
        }}
      />
    </SimplePage>
  );
}
