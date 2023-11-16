// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import range from 'lodash/range';
import Box from '~components/box';
import { TableProps } from '~components/table';
import { PaginationProps } from '~components/pagination';
import { CollectionPreferencesProps } from '~components/collection-preferences';
import { Instance, InstanceState } from './generate-data';
import Link from '~components/link';
import StatusIndicator, { StatusIndicatorProps } from '~components/status-indicator';
import { contentDisplayPreferenceI18nStrings } from '../common/i18n-strings';

export function EmptyState({
  title,
  subtitle,
  action,
}: {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  action: React.ReactNode;
}) {
  return (
    <Box textAlign="center" color="inherit">
      <Box variant="strong" textAlign="center" color="inherit">
        {title}
      </Box>
      <Box variant="p" padding={{ bottom: 's' }} color="inherit">
        {subtitle}
      </Box>
      {action}
    </Box>
  );
}

export function getMatchesCountText(count: number) {
  return count === 1 ? `1 match` : `${count} matches`;
}

export const stateToStatusIndicator: Record<InstanceState, StatusIndicatorProps> = {
  PENDING: { type: 'pending', children: 'Pending' },
  RUNNING: { type: 'success', children: 'Running' },
  STOPPING: { type: 'in-progress', children: 'Stopping' },
  STOPPED: { type: 'stopped', children: 'Stopped' },
  TERMINATING: { type: 'in-progress', children: 'Terminating' },
  TERMINATED: { type: 'error', children: 'Terminated' },
};

export const selectionLabels: TableProps<Instance>['ariaLabels'] = {
  selectionGroupLabel: 'group label',
  allItemsSelectionLabel: ({ selectedItems }) => `${selectedItems.length} item selected`,
  itemSelectionLabel: ({ selectedItems }, item) =>
    `${item.id} is ${selectedItems.indexOf(item) < 0 ? 'not ' : ''}selected`,
};

const columnLabel = (column: string) => (sortState: TableProps.LabelData) => {
  const ascending = !sortState.descending;
  return `${column}, ${sortState.sorted ? `sorted ${ascending ? 'ascending' : 'descending'}` : 'not sorted'}.`;
};

export const columnsConfig: TableProps.ColumnDefinition<Instance>[] = [
  {
    id: 'id',
    header: 'ID',
    cell: item => <Link href={`#${item.id}`}>{item.id}</Link>,
    ariaLabel: columnLabel('id'),
    sortingField: 'id',
  },
  { id: 'type', header: 'Type', cell: item => item.type, ariaLabel: columnLabel('type'), sortingField: 'type' },
  {
    id: 'dnsName',
    header: 'DNS name',
    cell: item => item.dnsName || '-',
    ariaLabel: columnLabel('dnsName'),
    sortingField: 'dnsName',
  },
  {
    id: 'imageId',
    header: 'Image ID',
    cell: item => item.imageId,
    ariaLabel: columnLabel('imageId'),
    sortingField: 'imageId',
  },
  {
    id: 'state',
    header: 'State',
    cell: item => <StatusIndicator {...stateToStatusIndicator[item.state]} />,
    ariaLabel: columnLabel('state'),
    sortingField: 'state',
  },
];

export const paginationLabels: PaginationProps.Labels = {
  nextPageLabel: 'Next page',
  pageLabel: pageNumber => `Go to page ${pageNumber}`,
  previousPageLabel: 'Previous page',
};

export const ariaLabels: Required<TableProps<Item>>['ariaLabels'] = {
  selectionGroupLabel: 'group label',
  allItemsSelectionLabel: ({ selectedItems }) => `${selectedItems.length} item selected`,
  itemSelectionLabel: ({ selectedItems }, item) =>
    `${item.text} is ${selectedItems.indexOf(item) < 0 ? 'not ' : ''}selected`,
  tableLabel: 'Items',
};

export const pageSizeOptions: ReadonlyArray<CollectionPreferencesProps.PageSizeOption> = [
  { value: 20, label: '20 Instances' },
  { value: 50, label: '50 Instances' },
  { value: 100, label: '100 Instances' },
];

export const contentDisplayPreference = {
  title: 'Column preferences',
  description: 'Customize the columns visibility and order.',
  options: [
    {
      id: 'id',
      label: 'ID',
      alwaysVisible: true,
    },
    { id: 'type', label: 'Type' },
    {
      id: 'dnsName',
      label: 'DNS name',
    },
    {
      id: 'imageId',
      label: 'Image ID',
    },
    {
      id: 'state',
      label: 'State',
    },
  ],
  ...contentDisplayPreferenceI18nStrings,
};

export const defaultPreferences = {
  pageSize: 20,
  contentDisplay: [
    { id: 'id', visible: true },
    { id: 'type', visible: true },
    { id: 'dnsName', visible: true },
    { id: 'imageId', visible: false },
    { id: 'state', visible: true },
  ],
  wrapLines: false,
};

export interface Item {
  number: number;
  text: string;
}

export function createSimpleItems(count: number): Item[] {
  const texts = ['One', 'Two', 'Three', 'Four'];
  return range(count).map(number => ({ number, text: texts[number % texts.length] }));
}

export const simpleColumns: TableProps.ColumnDefinition<Item>[] = [
  {
    id: 'text',
    cell: item => item.text,
    header: 'Text',
  },
  {
    id: 'number',
    cell: item => item.number,
    header: 'Number',
  },
];

export const ARIA_LABELS: TableProps['ariaLabels'] = {
  selectionGroupLabel: 'group label',
  allItemsSelectionLabel: ({ selectedItems }) => `${selectedItems.length} item selected`,
  itemSelectionLabel: ({ selectedItems }, item) =>
    `${item.text} is ${selectedItems.indexOf(item) < 0 ? 'not ' : ''}selected`,
};
