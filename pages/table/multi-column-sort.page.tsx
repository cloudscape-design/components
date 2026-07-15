// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

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

const PAGE_SIZE = 4;

export default function MultiColumnSortPage() {
  const { urlParams, setUrlParams } = useAppContext<
    'multiSort' | 'selection' | 'grouped' | 'pagination' | 'longNames' | 'resizable'
  >();

  // `multiSort` defaults to on; the rest default to off.
  const multiSortEnabled = urlParams.multiSort !== 'false' && urlParams.multiSort !== false;
  const selectionEnabled = urlParams.selection === true || urlParams.selection === 'true';
  const groupedEnabled = urlParams.grouped === true || urlParams.grouped === 'true';
  const paginationEnabled = urlParams.pagination === true || urlParams.pagination === 'true';
  const longNamesEnabled = urlParams.longNames === true || urlParams.longNames === 'true';
  const resizableEnabled = urlParams.resizable === true || urlParams.resizable === 'true';

  const [sortingColumns, setSortingColumns] = useState<ReadonlyArray<TableProps.SortingState<Item>>>([
    { sortingColumn: { sortingField: 'state' }, isDescending: false },
    { sortingColumn: { sortingField: 'cpu' }, isDescending: true },
  ]);
  // Single-column sort state, used when multi-column sort is toggled off.
  const [sortingColumn, setSortingColumn] = useState<TableProps.SortingColumn<Item>>({ sortingField: 'state' });
  const [sortingDescending, setSortingDescending] = useState(false);
  const [selectedItems, setSelectedItems] = useState<ReadonlyArray<Item>>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(1);

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

  const compareField = (a: Item, b: Item, field: keyof Item, descending: boolean) => {
    const aVal = a[field];
    const bVal = b[field];
    const cmp =
      typeof aVal === 'number' && typeof bVal === 'number' ? aVal - bVal : String(aVal).localeCompare(String(bVal));
    return descending ? -cmp : cmp;
  };
  const sorted = multiSortEnabled
    ? [...allItems].sort((a, b) => {
        for (const entry of sortingColumns) {
          const cmp = compareField(a, b, entry.sortingColumn.sortingField as keyof Item, !!entry.isDescending);
          if (cmp !== 0) {
            return cmp;
          }
        }
        return 0;
      })
    : [...allItems].sort((a, b) => compareField(a, b, sortingColumn.sortingField as keyof Item, sortingDescending));

  const pagesCount = Math.ceil(sorted.length / PAGE_SIZE);
  const pageItems = paginationEnabled
    ? sorted.slice((currentPageIndex - 1) * PAGE_SIZE, currentPageIndex * PAGE_SIZE)
    : sorted;

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
        items={pageItems}
        columnDefinitions={columnDefinitions}
        resizableColumns={resizableEnabled}
        groupDefinitions={groupedEnabled ? groupDefinitions : undefined}
        columnDisplay={groupedEnabled ? groupedColumnDisplay : undefined}
        selectionType={selectionEnabled ? 'multi' : undefined}
        selectedItems={selectionEnabled ? selectedItems : undefined}
        onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
        sortingColumn={multiSortEnabled ? undefined : sortingColumn}
        sortingDescending={multiSortEnabled ? undefined : sortingDescending}
        onSortingChange={
          multiSortEnabled
            ? undefined
            : ({ detail }) => {
                setSortingColumn(detail.sortingColumn);
                setSortingDescending(!!detail.isDescending);
              }
        }
        multiColumnSort={
          multiSortEnabled
            ? { sortingColumns, onChange: ({ detail }) => setSortingColumns(detail.sortingColumns) }
            : undefined
        }
        pagination={
          paginationEnabled ? (
            <Pagination
              currentPageIndex={currentPageIndex}
              pagesCount={pagesCount}
              onChange={({ detail }) => setCurrentPageIndex(detail.currentPageIndex)}
            />
          ) : undefined
        }
        ariaLabels={{
          tableLabel: 'Multi-column sort demo',
          sortMenuTriggerLabel: 'Sort options',
          selectionGroupLabel: 'Item selection',
          allItemsSelectionLabel: () => 'Select all',
          itemSelectionLabel: (_data, item) => `Select ${item.name}`,
        }}
      />
    </SimplePage>
  );
}
