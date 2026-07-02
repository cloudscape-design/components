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
  memory: number;
  az: string;
}

// Deliberate ties across `type`, `state` and `az` so that layered multi-column
// ordering (primary tie-broken by secondary, then tertiary) is visually obvious.
const allItems: Item[] = [
  { id: '1', name: 'alpha-server', type: 't3.micro', state: 'running', cpu: 12, memory: 1, az: 'us-east-1a' },
  { id: '2', name: 'beta-server', type: 'm5.large', state: 'stopped', cpu: 0, memory: 8, az: 'us-east-1b' },
  { id: '3', name: 'gamma-worker', type: 'c5.xlarge', state: 'running', cpu: 87, memory: 16, az: 'us-east-1a' },
  { id: '4', name: 'delta-proxy', type: 't3.micro', state: 'running', cpu: 45, memory: 1, az: 'us-east-1c' },
  { id: '5', name: 'epsilon-db', type: 'r5.large', state: 'running', cpu: 23, memory: 32, az: 'us-east-1b' },
  { id: '6', name: 'zeta-cache', type: 'r5.large', state: 'stopped', cpu: 0, memory: 32, az: 'us-east-1a' },
  { id: '7', name: 'eta-gateway', type: 't3.micro', state: 'running', cpu: 56, memory: 1, az: 'us-east-1b' },
  { id: '8', name: 'theta-batch', type: 'c5.xlarge', state: 'running', cpu: 91, memory: 16, az: 'us-east-1c' },
  { id: '9', name: 'iota-api', type: 'm5.large', state: 'pending', cpu: 8, memory: 8, az: 'us-east-1a' },
  { id: '10', name: 'kappa-queue', type: 't3.micro', state: 'running', cpu: 45, memory: 1, az: 'us-east-1a' },
  { id: '11', name: 'lambda-fn', type: 'c5.xlarge', state: 'stopped', cpu: 0, memory: 16, az: 'us-east-1b' },
  { id: '12', name: 'mu-metrics', type: 'r5.large', state: 'running', cpu: 67, memory: 32, az: 'us-east-1c' },
  { id: '13', name: 'nu-node', type: 'm5.large', state: 'running', cpu: 45, memory: 8, az: 'us-east-1b' },
  { id: '14', name: 'xi-index', type: 't3.micro', state: 'pending', cpu: 3, memory: 1, az: 'us-east-1a' },
  { id: '15', name: 'omicron-obj', type: 'c5.xlarge', state: 'running', cpu: 87, memory: 16, az: 'us-east-1b' },
  { id: '16', name: 'pi-pipeline', type: 'r5.large', state: 'running', cpu: 23, memory: 32, az: 'us-east-1a' },
  { id: '17', name: 'rho-router', type: 'm5.large', state: 'stopped', cpu: 0, memory: 8, az: 'us-east-1c' },
  { id: '18', name: 'sigma-store', type: 't3.micro', state: 'running', cpu: 56, memory: 1, az: 'us-east-1c' },
  { id: '19', name: 'tau-task', type: 'c5.xlarge', state: 'running', cpu: 45, memory: 16, az: 'us-east-1a' },
  { id: '20', name: 'upsilon-svc', type: 'r5.large', state: 'pending', cpu: 15, memory: 32, az: 'us-east-1b' },
  { id: '21', name: 'phi-fleet', type: 'm5.large', state: 'running', cpu: 87, memory: 8, az: 'us-east-1a' },
  { id: '22', name: 'chi-cluster', type: 't3.micro', state: 'running', cpu: 12, memory: 1, az: 'us-east-1b' },
  { id: '23', name: 'psi-proc', type: 'c5.xlarge', state: 'stopped', cpu: 0, memory: 16, az: 'us-east-1c' },
  { id: '24', name: 'omega-orch', type: 'r5.large', state: 'running', cpu: 45, memory: 32, az: 'us-east-1a' },
];

const shortHeaders: Record<string, string> = {
  name: 'Name',
  type: 'Type',
  state: 'State',
  cpu: 'CPU %',
  memory: 'Memory (GiB)',
  az: 'Availability zone',
};

const longHeaders: Record<string, string> = {
  name: 'Fully qualified instance name and identifier',
  type: 'Compute instance type and family classification',
  state: 'Current lifecycle and operational state',
  cpu: 'Average CPU utilization over the last hour (%)',
  memory: 'Provisioned memory in gibibytes (GiB)',
  az: 'Availability zone hosting the instance',
};

const groupDefinitions: TableProps.GroupDefinition[] = [
  { id: 'identity', header: 'Identity' },
  { id: 'status', header: 'Status' },
  { id: 'location', header: 'Location' },
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
      { id: 'memory', visible: true },
    ],
  },
  {
    type: 'group',
    id: 'location',
    visible: true,
    children: [{ id: 'az', visible: true }],
  },
];

const PAGE_SIZE = 10;

// Module-scoped so the reference is stable across renders — multi-sort matches
// comparator columns by function identity, so an inline comparator would break
// the sort indicator after re-render.
const memoryComparator = (a: Item, b: Item) => a.memory - b.memory;

export default function MultiColumnSortPage() {
  const { urlParams, setUrlParams } = useAppContext<
    | 'multiSort'
    | 'selection'
    | 'grouped'
    | 'pagination'
    | 'longNames'
    | 'resizable'
    | 'stickyHeader'
    | 'wrapLines'
    | 'sortingDisabled'
  >();

  // `multiSort` and `pagination` default to on; the rest default to off.
  const multiSortEnabled = urlParams.multiSort !== 'false' && urlParams.multiSort !== false;
  const selectionEnabled = urlParams.selection === true || urlParams.selection === 'true';
  const groupedEnabled = urlParams.grouped === true || urlParams.grouped === 'true';
  const paginationEnabled = urlParams.pagination !== 'false' && urlParams.pagination !== false;
  const longNamesEnabled = urlParams.longNames === true || urlParams.longNames === 'true';
  const resizableEnabled = urlParams.resizable === true || urlParams.resizable === 'true';
  const stickyHeaderEnabled = urlParams.stickyHeader === true || urlParams.stickyHeader === 'true';
  const wrapLinesEnabled = urlParams.wrapLines === true || urlParams.wrapLines === 'true';
  const sortingDisabledEnabled = urlParams.sortingDisabled === true || urlParams.sortingDisabled === 'true';

  const headers = longNamesEnabled ? longHeaders : shortHeaders;
  const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
    { id: 'name', header: headers.name, cell: item => item.name, sortingField: 'name' },
    { id: 'type', header: headers.type, cell: item => item.type, sortingField: 'type' },
    { id: 'state', header: headers.state, cell: item => item.state, sortingField: 'state' },
    { id: 'cpu', header: headers.cpu, cell: item => `${item.cpu}%`, sortingField: 'cpu' },
    // Custom comparator column (not a plain sortingField) — exercises comparator-based multi-sort.
    {
      id: 'memory',
      header: headers.memory,
      cell: item => `${item.memory} GiB`,
      sortingComparator: memoryComparator,
    },
    // Non-sortable column — should show no sort affordance and be ignored by multi-sort.
    { id: 'az', header: headers.az, cell: item => item.az },
  ];

  const { items, collectionProps, paginationProps } = useCollection(allItems, {
    sorting: multiSortEnabled
      ? {
          multiColumn: true,
          defaultState: [
            { sortingColumn: { sortingField: 'state' }, isDescending: false },
            { sortingColumn: { sortingField: 'cpu' }, isDescending: true },
          ],
        }
      : undefined,
    selection: selectionEnabled ? {} : undefined,
    pagination: paginationEnabled ? { pageSize: PAGE_SIZE } : undefined,
  });

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
          <Checkbox
            checked={stickyHeaderEnabled}
            onChange={({ detail }) => setUrlParams({ stickyHeader: detail.checked })}
          >
            Sticky header
          </Checkbox>
          <Checkbox checked={wrapLinesEnabled} onChange={({ detail }) => setUrlParams({ wrapLines: detail.checked })}>
            Wrap lines
          </Checkbox>
          <Checkbox
            checked={sortingDisabledEnabled}
            onChange={({ detail }) => setUrlParams({ sortingDisabled: detail.checked })}
          >
            Sorting disabled
          </Checkbox>
        </SpaceBetween>
      }
    >
      <Table
        {...collectionProps}
        items={items}
        columnDefinitions={columnDefinitions}
        resizableColumns={resizableEnabled}
        stickyHeader={stickyHeaderEnabled}
        wrapLines={wrapLinesEnabled}
        sortingDisabled={sortingDisabledEnabled}
        groupDefinitions={groupedEnabled ? groupDefinitions : undefined}
        columnDisplay={groupedEnabled ? groupedColumnDisplay : undefined}
        selectionType={selectionEnabled ? 'multi' : undefined}
        pagination={paginationEnabled ? <Pagination {...paginationProps} /> : undefined}
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
