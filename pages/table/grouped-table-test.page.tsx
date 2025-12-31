// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';

import {
  AttributeEditor,
  Box,
  Button,
  ExpandableSection,
  Modal,
  PropertyFilter,
  Select,
  StatusIndicator,
  TableProps,
} from '~components';
import Header from '~components/header';
import I18nProvider from '~components/i18n';
import messages from '~components/i18n/messages/all.en';
import SpaceBetween from '~components/space-between';
import Table from '~components/table';

import { SimplePage } from '../app/templates';
import { TransactionRow } from './grouped-table/grouped-table-common';
import { createColumnDefinitions, filteringProperties } from './grouped-table/grouped-table-configs';
import { allTransactions, getGroupedTransactions, GroupDefinition } from './grouped-table/grouped-table-data';
import {
  createIdsQuery,
  createWysiwygQuery,
  findSelectionIds,
  isItemSelected,
} from './grouped-table/grouped-table-update-query';
import { EmptyState, getMatchesCountText, renderAriaLive } from './shared-configs';

type LoadingState = Map<string, { pages: number; status: TableProps.LoadingStatus }>;

const groupOptions = [
  { value: 'date_year', label: 'Date (year)' },
  { value: 'date_quarter', label: 'Date (quarter)' },
  { value: 'date_month', label: 'Date (month)' },
  { value: 'date_day', label: 'Date (day)' },
  { value: 'type', label: 'Type' },
  { value: 'origin', label: 'Origin' },
  { value: 'recipient', label: 'Recipient' },
  { value: 'currency', label: 'Currency' },
  { value: 'amountEur_100', label: 'Amount EUR (100)' },
  { value: 'amountEur_500', label: 'Amount EUR (500)' },
  { value: 'amountEur_1000', label: 'Amount EUR (1000)' },
  { value: 'amountUsd_100', label: 'Amount USD (100)' },
  { value: 'amountUsd_500', label: 'Amount USD (500)' },
  { value: 'amountUsd_1000', label: 'Amount USD (1000)' },
  { value: 'paymentMethod', label: 'Payment Method' },
] as const;

const sortOptions = [
  { value: 'asc', label: 'Ascending (A to Z)' },
  { value: 'desc', label: 'Descending (Z to A)' },
] as const;

function getHeaderCounterText<T>(items: number, selectedItems: ReadonlyArray<T> | undefined) {
  return selectedItems && selectedItems?.length > 0 ? `(${selectedItems.length}/${items})` : `(${items})`;
}

export default () => {
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const tableData = useTableData();
  const selectedIds = findSelectionIds(tableData);

  const getItemCounters = (item: null | TransactionRow) => {
    const target = item ? item.transactions : tableData.allTransactions;
    const selected = target.filter(t => selectedIds.includes(t.id)).length;
    return { total: target.length, selected };
  };
  const getLoaderCounters = (item: null | TransactionRow) => {
    const loadedRows = item ? tableData.collectionProps.expandableRows!.getItemChildren(item) : tableData.items;
    const loadedTransactions = loadedRows.reduce((sum, i) => sum + i.transactions.length, 0);
    const totalTransactions = item ? item.transactions.length : tableData.allTransactions.length;
    const total = totalTransactions - loadedTransactions;
    const isSelected = item ? isItemSelected(item, tableData) : tableData.selectionInverted;
    const selected = isSelected ? total : 0;
    return { total, selected };
  };
  const getLoaderCounterText = (item: null | TransactionRow) => {
    const { total, selected } = getLoaderCounters(item);
    return total > 0 && selected > 0 ? `(${selected}/${total})` : total > 0 ? `(${total})` : '';
  };
  const getItemSelectionLabel = (item: null | TransactionRow, loader: boolean) => {
    const { total, selected } = loader ? getLoaderCounters(item) : getItemCounters(item);
    const resources = loader ? 'not loaded transactions' : 'transactions';
    if (!item) {
      return `${selected} of ${total} ${resources} selected`;
    } else if (total > 1) {
      return `${selected} of ${total} ${resources} from ${item.group} selected`;
    } else {
      return selected > 0 ? `${item.group} transaction is selected` : `${item.group} transaction is not selected`;
    }
  };

  return (
    <I18nProvider messages={[messages]} locale="en">
      <SimplePage title="Grouped table demo">
        <Table
          {...tableData.collectionProps}
          stickyColumns={{ first: 1 }}
          resizableColumns={true}
          selectionType="group"
          selectionInverted={tableData.selectionInverted}
          selectedItems={tableData.selectedItems}
          onSelectionChange={tableData.onSelectionChange}
          columnDefinitions={createColumnDefinitions({
            getCounterText: item => {
              const { total, selected } = getItemCounters(item);
              return total > 0 && selected > 0 ? `(${selected}/${total})` : total > 0 ? `(${total})` : '';
            },
            groups: tableData.groups.map(g => g.property),
          })}
          items={tableData.items}
          ariaLabels={{
            tableLabel: 'Transactions table',
            selectionGroupLabel: 'Transactions selection',
            allItemsSelectionLabel: () => getItemSelectionLabel(null, false),
            allItemsLoaderSelectionLabel: () => getItemSelectionLabel(null, true),
            itemSelectionLabel: (_, item) => getItemSelectionLabel(item, false),
            itemLoaderSelectionLabel: (_, item) => getItemSelectionLabel(item, true),
          }}
          wrapLines={false}
          variant="full-page"
          renderAriaLive={renderAriaLive}
          empty={tableData.collectionProps.empty}
          header={
            <SpaceBetween size="m">
              <Header
                variant="h2"
                description="Table with grouped rows example"
                counter={getHeaderCounterText(tableData.allTransactions.length, selectedIds)}
                actions={
                  <SpaceBetween size="s" direction="horizontal" alignItems="center">
                    <Button disabled={selectedIds.length === 0} onClick={() => setUpdateModalVisible(true)}>
                      Update selected
                    </Button>

                    <Modal
                      header="Update query viewer"
                      visible={updateModalVisible}
                      onDismiss={() => setUpdateModalVisible(false)}
                    >
                      <Box>Selected transactions: {selectedIds.length}</Box>
                      <hr />

                      <ExpandableSection headerText="Selection state" defaultExpanded={true}>
                        <Box variant="code">
                          {JSON.stringify(
                            {
                              selectionInverted: tableData.selectionInverted,
                              selectedItems: tableData.selectedItems.map(item => ({ key: item.group })),
                            },
                            null,
                            2
                          )}
                        </Box>
                      </ExpandableSection>

                      <ExpandableSection headerText="WYSIWYG update query" defaultExpanded={true}>
                        <Box variant="code">{createWysiwygQuery(tableData)}</Box>
                      </ExpandableSection>

                      <ExpandableSection headerText="Long update query">
                        <Box variant="code">{createIdsQuery(selectedIds)}</Box>
                      </ExpandableSection>
                    </Modal>
                  </SpaceBetween>
                }
              >
                Transactions
              </Header>

              <Box margin={{ bottom: 'xs' }}>
                <ExpandableSection headerText={`Groups (${tableData.groups.length})`}>
                  <AttributeEditor
                    onAddButtonClick={() => tableData.actions.addGroup()}
                    onRemoveButtonClick={({ detail: { itemIndex } }) => tableData.actions.deleteGroup(itemIndex)}
                    items={tableData.groups}
                    addButtonText="Add new group"
                    definition={[
                      {
                        label: 'Property',
                        control: (item, index) => (
                          <Select
                            selectedOption={groupOptions.find(o => o.value === item.property)!}
                            options={groupOptions}
                            onChange={({ detail }) =>
                              tableData.actions.setGroupProperty(index, detail.selectedOption.value!)
                            }
                          />
                        ),
                      },
                      {
                        label: 'Default sorting',
                        control: (item, index) => (
                          <Select
                            selectedOption={sortOptions.find(o => o.value === item.sorting)!}
                            options={sortOptions}
                            onChange={({ detail }) =>
                              tableData.actions.setGroupSorting(index, detail.selectedOption.value as 'asc' | 'desc')
                            }
                          />
                        ),
                      },
                    ]}
                    empty="No groups"
                  />
                </ExpandableSection>
              </Box>
            </SpaceBetween>
          }
          filter={
            <PropertyFilter
              {...tableData.propertyFilterProps}
              filteringOptions={tableData.propertyFilterProps.filteringOptions.filter(
                o => o.value !== '[object Object]'
              )}
              countText={getMatchesCountText(tableData.filteredItemsCount ?? 0)}
              filteringPlaceholder="Search transactions"
            />
          }
          getLoadingStatus={tableData.getLoadingStatus}
          renderLoaderLoading={() => <StatusIndicator type="loading">Loading items</StatusIndicator>}
          renderLoaderPending={({ item }) => (
            <Button
              variant="inline-link"
              iconName="add-plus"
              onClick={() => tableData.actions.loadItems(item?.key ?? 'ROOT')}
            >
              Show more items
            </Button>
          )}
          renderLoaderCounter={({ item }) => getLoaderCounterText(item)}
        />
      </SimplePage>
    </I18nProvider>
  );
};

const ROOT_PAGE_SIZE = 10;
const NESTED_PAGE_SIZE = 10;
function useTableData() {
  const [groups, setGroups] = useState<GroupDefinition[]>([
    {
      property: 'date_year',
      sorting: 'desc',
    },
    {
      property: 'date_quarter',
      sorting: 'desc',
    },
    {
      property: 'amountEur_500',
      sorting: 'desc',
    },
  ]);
  const collectionResultTransactions = useCollection(allTransactions, {
    sorting: {},
    propertyFiltering: {
      filteringProperties,
      noMatch: (
        <EmptyState
          title="No matches"
          subtitle="We can’t find a match."
          action={
            <Button onClick={() => collectionResult.actions.setPropertyFiltering({ operation: 'and', tokens: [] })}>
              Clear filter
            </Button>
          }
        />
      ),
    },
  });
  const collectionResult = useCollection(
    getGroupedTransactions(collectionResultTransactions.items, groups, collectionResultTransactions.collectionProps),
    {
      pagination: undefined,
      expandableRows: {
        getId: item => item.key,
        getParentId: item => item.parent,
      },
    }
  );

  const [selectionInverted, setSelectionInverted] = useState(false);
  const [selectedItems, setSelectedItems] = useState<TransactionRow[]>([]);

  // Decorate path options to only show the last node and not the full path.
  collectionResult.propertyFilterProps.filteringOptions = collectionResult.propertyFilterProps.filteringOptions.map(
    option => (option.propertyKey === 'path' ? { ...option, value: option.value.split(',')[0] } : option)
  );

  // Using a special id="ROOT" for progressive loading at the root level.
  const [loadingState, setLoadingState] = useState<LoadingState>(new Map([['ROOT', { status: 'pending', pages: 1 }]]));
  const nextLoading = (id: string) => (state: LoadingState) =>
    new Map([...state, [id, { status: 'loading', pages: state.get(id)?.pages ?? 0 }]]) as LoadingState;
  const nextPending = (id: string) => (state: LoadingState) =>
    new Map([...state, [id, { status: 'pending', pages: (state.get(id)?.pages ?? 0) + 1 }]]) as LoadingState;
  const loadItems = (id: string) => {
    setLoadingState(nextLoading(id));
    setTimeout(() => setLoadingState(nextPending(id)), 1000);
  };

  const getItemChildren = collectionResult.collectionProps.expandableRows
    ? collectionResult.collectionProps.expandableRows.getItemChildren.bind(null)
    : undefined;
  const onExpandableItemToggle = collectionResult.collectionProps.expandableRows
    ? collectionResult.collectionProps.expandableRows.onExpandableItemToggle.bind(null)
    : undefined;

  if (collectionResult.collectionProps.expandableRows) {
    // Decorate getItemChildren to paginate nested items.
    collectionResult.collectionProps.expandableRows.getItemChildren = item => {
      const children = getItemChildren!(item);
      const pages = loadingState.get(item.key)?.pages ?? 0;
      return children.slice(0, pages * NESTED_PAGE_SIZE);
    };
    // Decorate onExpandableItemToggle to trigger loading when expanded.
    collectionResult.collectionProps.expandableRows.onExpandableItemToggle = event => {
      onExpandableItemToggle!(event);
      if (event.detail.expanded) {
        loadItems(event.detail.item.key);
      }
    };
  }

  const rootPages = loadingState.get('ROOT')!.pages;

  const allItems = collectionResult.items;
  const paginatedItems = allItems.slice(0, rootPages * ROOT_PAGE_SIZE);

  const getLoadingStatus = (item: null | TransactionRow): TableProps.LoadingStatus => {
    const id = item ? item.key : 'ROOT';
    const state = loadingState.get(id);
    if (state && state.status === 'loading') {
      return state.status;
    }
    const pages = state?.pages ?? 0;
    const pageSize = item ? NESTED_PAGE_SIZE : ROOT_PAGE_SIZE;
    const totalItems = item ? getItemChildren!(item).length : allItems.length;
    return pages * pageSize < totalItems ? 'pending' : 'finished';
  };

  const addGroup = () => {
    setGroups(prev => [...prev, { property: 'date_year', sorting: 'asc' }]);
  };
  const deleteGroup = (index: number) => {
    setGroups(prev => {
      const tmpGroups = [...prev];
      tmpGroups.splice(index, 1);
      return tmpGroups;
    });
  };
  const setGroupProperty = (index: number, property: string) => {
    setGroups(prev =>
      prev.map((group, groupIndex) => {
        if (index !== groupIndex) {
          return group;
        }
        return { property, sorting: group.sorting };
      })
    );
  };
  const setGroupSorting = (index: number, sorting: GroupDefinition['sorting']) => {
    setGroups(prev =>
      prev.map((group, groupIndex) => {
        if (index !== groupIndex) {
          return group;
        }
        return { ...group, sorting };
      })
    );
  };

  return {
    ...collectionResult,
    collectionProps: {
      ...collectionResult.collectionProps,
      sortingColumn: collectionResultTransactions.collectionProps.sortingColumn as any,
      sortingDescending: collectionResultTransactions.collectionProps.sortingDescending,
      onSortingChange: collectionResultTransactions.collectionProps.onSortingChange as any,
    },
    propertyFilterProps: collectionResultTransactions.propertyFilterProps,
    filteredItemsCount: collectionResultTransactions.filteredItemsCount,
    allTransactions,
    items: paginatedItems,
    groups,
    selectedItems,
    selectionInverted,
    onSelectionChange: ({ detail }: { detail: TableProps.SelectionChangeDetail<TransactionRow> }) => {
      setSelectionInverted(detail.selectionInverted ?? false);
      setSelectedItems(detail.selectedItems);
    },
    trackBy: (row: TransactionRow) => row.key,
    getItemChildren,
    actions: {
      loadItems,
      addGroup,
      deleteGroup,
      setGroupProperty,
      setGroupSorting,
    },
    getLoadingStatus,
  };
}
