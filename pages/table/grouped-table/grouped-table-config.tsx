// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { format } from 'date-fns';

import { useCollection, UseCollectionResult } from '@cloudscape-design/collection-hooks';

import { Button, Link, PropertyFilterProps, TableProps } from '~components';
import { getTrackableValue } from '~components/table/utils';

import { columnLabel, EmptyState } from '../shared-configs';
import {
  allTransactions,
  getGroupedTransactions,
  GroupDefinition,
  isGroupRow,
  TransactionRow,
  TransactionRowGroup,
  TransactionRowItem,
} from './grouped-table-data';

export function getHeaderCounterText<T>(items: number, selectedItems: ReadonlyArray<T> | undefined) {
  return selectedItems && selectedItems?.length > 0 ? `(${selectedItems.length}/${items})` : `(${items})`;
}

export function getSelectionAriaLabel(
  { itemsCount: total, selectedItemsCount: selected }: { itemsCount?: number; selectedItemsCount?: number },
  item?: TransactionRow
) {
  const state = total !== undefined && selected ? `${selected} of ${total} selected` : '0 selected';
  return !item ? state : isGroupRow(item) ? `${state} from ${formatGroup(item)}` : formatGroup(item);
}

export function getLoaderSelectionAriaLabel(_: unknown, item?: TransactionRow) {
  return item ? `more transactions for ${formatGroup(item)}` : 'more transactions';
}

const fields: Record<
  string,
  {
    label: string;
    header?: string;
    grouping: { key: string; label?: string; format?: (value: string) => React.ReactNode }[];
    format: (row: TransactionRowItem) => React.ReactNode;
    groupFormat: (row: TransactionRowGroup) => React.ReactNode;
    filtering?: Omit<PropertyFilterProps.FilteringProperty, 'key' | 'propertyLabel' | 'groupValuesLabel'>;
  } & Omit<TableProps.ColumnDefinition<unknown>, 'header' | 'cell'>
> = (() => {
  const $ = (val: number) => '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return {
    type: {
      label: 'Type',
      grouping: [{ key: 'type' }],
      format: row => row.type,
      groupFormat: row => `${row.uniqueTypes} type(s)`,
      sortingField: 'type',
      filtering: { operators: ['=', '!='].map(operator => ({ operator, tokenType: 'enum' })) },
    },
    data: {
      label: 'Date',
      grouping: [
        { key: 'date_year', label: 'Year', format: group => format(new Date(parseInt(group)), 'yyyy') },
        { key: 'date_quarter', label: 'Quarter', format: group => format(new Date(parseInt(group)), 'QQQ yyyy') },
        { key: 'date_month', label: 'Month', format: group => format(new Date(parseInt(group)), 'MMMM yyyy') },
        { key: 'date_day', label: 'Day', format: group => format(new Date(parseInt(group)), 'yyyy-MM-dd') },
      ],
      format: row => format(row.date, 'yyyy-MM-dd HH:mm'),
      groupFormat: row => `${format(row.dateRange[0], 'yyyy-MM-dd')} - ${format(row.dateRange[1], 'yyyy-MM-dd')}`,
      sortingField: 'date',
      width: 200,
    },
    origin: {
      label: 'Origin',
      grouping: [{ key: 'origin' }],
      format: row => row.origin,
      groupFormat: row => `${row.uniqueOrigins} origin(s)`,
      sortingField: 'origin',
      filtering: { operators: ['=', '!='].map(operator => ({ operator, tokenType: 'enum' })) },
    },
    recipient: {
      label: 'Recipient',
      grouping: [{ key: 'recipient' }],
      format: row => row.recipient,
      groupFormat: row => `${row.uniqueRecipients} recipient(s)`,
      sortingField: 'recipient',
      filtering: { operators: ['=', '!='].map(operator => ({ operator, tokenType: 'enum' })) },
    },
    amount: {
      label: 'Amount',
      header: 'Amount (total)',
      grouping: [
        { key: 'amount_100k', label: 'Amount ($100k)', format: group => $(parseInt(group)) },
        { key: 'amount_500k', label: 'Amount ($500k)', format: group => $(parseInt(group)) },
        { key: 'amount_1000k', label: 'Amount ($1M)', format: group => $(parseInt(group)) },
      ],
      format: row => $(row.amount),
      groupFormat: row => $(row.amount),
      sortingField: 'amount',
      filtering: { defaultOperator: '>', operators: ['>', '>=', '<', '<='] },
    },
    purpose: { label: 'Purpose', grouping: [], format: row => row.purpose, groupFormat: () => '' },
  };
})();

export const groupOptions = Object.values(fields).flatMap(p =>
  p.grouping.map(g => ({ ...g, value: g.key, label: g.label ?? p.label }))
);

const groupOptionByProperty = new Map(groupOptions.map(g => [g.key, g]));
const getGroupLabel = (property: string) => groupOptionByProperty.get(property)!.label;
const formatGroup = (row: TransactionRow) => {
  const format = groupOptionByProperty.get(row.groupKey)?.format ?? (v => v);
  return format(row.group) as string;
};

export const createColumnDefinitions = ({
  groups,
}: {
  groups: GroupDefinition[];
}): TableProps.ColumnDefinition<TransactionRow>[] => {
  return [
    {
      id: 'group',
      header: [...groups.map(g => getGroupLabel(g.property)), 'ID'].join(' / '),
      cell: row => (isGroupRow(row) ? (formatGroup(row) ?? row.group) : <Link href="#">{row.group}</Link>),
      counter: ({ item, itemsCount, selectedItemsCount }) => {
        if (isGroupRow(item) && itemsCount && selectedItemsCount) {
          return `(${selectedItemsCount}/${itemsCount})`;
        }
        if (isGroupRow(item) && itemsCount) {
          return `(${itemsCount})`;
        }
        return '';
      },
      minWidth: 200,
      width: 350,
      isRowHeader: true,
    },
    ...Object.values(fields).map(field => ({
      ...field,
      header: field.header ?? field.label,
      ariaLabel: field.sortingField ? columnLabel(field.label) : undefined,
      cell: (row: TransactionRow) => (isGroupRow(row) ? field.groupFormat(row) : field.format(row)),
    })),
  ];
};

export const sortOptions = [
  { value: 'asc', label: 'Ascending (A to Z)' },
  { value: 'desc', label: 'Descending (Z to A)' },
] as const;

export function useTransactions(): UseCollectionResult<TransactionRow> & {
  groups: GroupDefinition[];
  setGroups: (groups: GroupDefinition[]) => void;
} {
  const [groups, setGroups] = useState<GroupDefinition[]>([
    { property: 'date_quarter', sorting: 'desc' },
    { property: 'type', sorting: 'asc' },
  ]);
  const all = useCollection(allTransactions, {
    propertyFiltering: {
      filteringProperties: Object.entries(fields)
        .filter(([, field]) => field.filtering)
        .map(([key, field]) => ({
          key,
          propertyLabel: field.label,
          groupValuesLabel: `${field.label} values`,
          ...field,
        })),
      noMatch: (
        <EmptyState
          title="No matches"
          subtitle=""
          action={
            <Button onClick={() => all.actions.setPropertyFiltering({ operation: 'and', tokens: [] })}>
              Clear filter
            </Button>
          }
        />
      ),
    },
  });

  // Remove extracted property options for amount as unwanted.
  all.propertyFilterProps.filteringOptions = all.propertyFilterProps.filteringOptions.filter(
    o => o.propertyKey !== 'amount'
  );

  const grouped = useCollection(getGroupedTransactions(all.items, groups), {
    expandableRows: { getId: item => item.key, getParentId: item => item.parent, dataGrouping: {} },
    selection: {},
    sorting: {},
  });

  return {
    ...grouped,
    propertyFilterProps: all.propertyFilterProps,
    filteredItemsCount: all.filteredItemsCount,
    collectionProps: { ...grouped.collectionProps, empty: all.collectionProps.empty },
    groups,
    setGroups,
  };
}

export function useProgressiveLoading<T, C extends UseCollectionResult<T>>(
  collection: C,
  options: { getLabel: (item: T) => string; getCount: (item: T) => number }
): C {
  const pageSize = 10;
  const [pages, setPages] = useState<Record<any, number>>({});

  const getChildren = collection.collectionProps.expandableRows!.getItemChildren;
  const getKey = (item: null | T) => (!item ? '__ROOT__' : getTrackableValue(collection.collectionProps.trackBy, item));
  const getPage = (item: null | T) => pages[getKey(item)] ?? 1;

  const items = collection.items.slice(0, getPage(null) * pageSize);

  const expandableRows: TableProps.ExpandableRows<T> = {
    ...collection.collectionProps.expandableRows!,
    getItemChildren: item => getChildren(item).slice(0, getPage(item) * pageSize),
  };

  const getLoadingStatus: TableProps.GetLoadingStatus<T> = item => {
    const allData = item ? getChildren(item) : collection.items;
    const loadedData = allData.slice(0, getPage(item) * pageSize);
    return loadedData.length < allData.length ? 'pending' : 'finished';
  };

  const renderLoaderPending = ({ item }: TableProps.RenderLoaderDetail<T>): React.ReactNode => {
    return (
      <Button
        variant="inline-link"
        iconName="add-plus"
        onClick={() => setPages(prev => ({ ...prev, [getKey(item)]: (prev[getKey(item)] ?? 1) + 1 }))}
        ariaLabel={item ? `Load more items for ${options.getLabel(item)}` : 'Load more items'}
      >
        Load more items
      </Button>
    );
  };

  const renderLoaderCounter = ({ item, selected }: TableProps.RenderLoaderCounterDetail<T>): React.ReactNode => {
    const allData = item ? getChildren(item) : collection.items;
    const remainedRows = allData.slice(getPage(item) * pageSize);
    const remainedTransactions = remainedRows.reduce((acc, row) => acc + options.getCount(row), 0);
    return selected ? `(${remainedTransactions}/${remainedTransactions})` : `(${remainedTransactions})`;
  };

  const collectionProps = {
    ...collection.collectionProps,
    expandableRows,
    getLoadingStatus,
    renderLoaderPending,
    renderLoaderCounter,
  };
  return { ...collection, items, collectionProps };
}
