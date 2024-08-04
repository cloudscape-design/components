// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';

import {
  AppLayout,
  AttributeEditor,
  Box,
  Button,
  Checkbox,
  Drawer,
  ExpandableSection,
  FormField,
  Modal,
  Pagination,
  PropertyFilter,
  Select,
  TableProps,
} from '~components';
import Header from '~components/header';
import I18nProvider from '~components/i18n';
import messages from '~components/i18n/messages/all.en';
import SpaceBetween from '~components/space-between';
// TODO: replace with Table once progressive loading API becomes public
import InternalTable from '~components/table/internal';

import AppContext, { AppContextType } from '../app/app-context';
import { getHeaderCounterText, TransactionRow } from './grouped-table/grouped-table-common';
import { createColumns, filteringProperties } from './grouped-table/grouped-table-configs';
import { allTransactions, getGroupedTransactions, GroupDefinition } from './grouped-table/grouped-table-data';
import { createIdsQuery, createWysiwygQuery, findSelectionIds } from './grouped-table/grouped-table-update-query';
import { EmptyState, getMatchesCountText, renderAriaLive } from './shared-configs';

type LoadingState = Map<string, { pages: number; status: TableProps.LoadingStatus }>;

type PageContext = React.Context<
  AppContextType<{
    usePagination: boolean;
    useProgressiveLoading: boolean;
  }>
>;

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

export default () => {
  const settings = usePageSettings();
  const [toolsOpen, setToolsOpen] = useState(true);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const tableData = useTableData();
  const columnDefinitions = createColumns();
  const [selectedIds, selectedGroups] = findSelectionIds(tableData);
  return (
    <I18nProvider messages={[messages]} locale="en">
      <AppLayout
        contentType="table"
        navigationHide={true}
        tools={<PageSettings />}
        toolsOpen={toolsOpen}
        onToolsChange={({ detail: { open } }) => setToolsOpen(open)}
        content={
          <InternalTable
            {...tableData.collectionProps}
            stickyColumns={{ first: 1 }}
            resizableColumns={true}
            selectionType="group"
            selectionInverted={tableData.selectionInverted}
            selectedItems={tableData.selectedItems}
            onSelectionChange={tableData.onSelectionChange}
            columnDefinitions={columnDefinitions}
            items={tableData.items}
            ariaLabels={{
              tableLabel: 'Transactions table',
              selectionGroupLabel: 'Transactions selection',
              allItemsSelectionLabel: () =>
                `${selectedIds.length} ${selectedIds.length === 1 ? 'item' : 'items'} selected`,
              itemSelectionLabel: (_, item) => {
                const isSelected = selectedGroups.some(id => id === item.group);
                return `${item.group} is ${isSelected ? '' : 'not'} selected`;
              },
            }}
            wrapLines={false}
            pagination={settings.usePagination && <Pagination {...tableData.paginationProps} />}
            variant="full-page"
            renderAriaLive={renderAriaLive}
            empty={tableData.collectionProps.empty}
            header={
              <SpaceBetween size="m">
                <Header
                  variant="h1"
                  description="Table with grouped rows test page"
                  counter={getHeaderCounterText(tableData.totalItemsCount, selectedIds)}
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
                        <ExpandableSection headerText="Selection state">
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

                        <ExpandableSection headerText="WYSIWYG update query">
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
                  <ExpandableSection headerText={`Groups configuration (${tableData.groups.length})`}>
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
                          label: 'Sorting',
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
            renderLoaderPending={({ item }) => (
              <Button
                variant="inline-link"
                iconName="add-plus"
                onClick={() => tableData.actions.loadItems(item?.group ?? 'ROOT')}
              >
                Show more items
              </Button>
            )}
          />
        }
      />
    </I18nProvider>
  );
};

const ROOT_PAGE_SIZE = 10;
const NESTED_PAGE_SIZE = 10;
function useTableData() {
  const settings = usePageSettings();
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
  const collectionResult = useCollection(getGroupedTransactions(collectionResultTransactions.items, groups), {
    pagination: settings.usePagination ? { pageSize: ROOT_PAGE_SIZE } : undefined,
    expandableRows: {
      getId: item => item.key,
      getParentId: item => item.parent,
    },
  });

  const [selectionInverted, setSelectionInverted] = useState(false);
  const [selectedItems, setSelectedItems] = useState<TransactionRow[]>([]);

  // Decorate path options to only show the last node and not the full path.
  collectionResult.propertyFilterProps.filteringOptions = collectionResult.propertyFilterProps.filteringOptions.map(
    option => (option.propertyKey === 'path' ? { ...option, value: option.value.split(',')[0] } : option)
  );

  // Using a special id="ROOT" for progressive loading at the root level.
  const [loadingState, setLoadingState] = useState<LoadingState>(new Map([['ROOT', { status: 'pending', pages: 1 }]]));
  const nextPending = (id: string) => (state: LoadingState) =>
    new Map([...state, [id, { status: 'pending', pages: (state.get(id)?.pages ?? 0) + 1 }]]) as LoadingState;
  const loadItems = (id: string) => setLoadingState(nextPending(id));

  const getItemChildren = collectionResult.collectionProps.expandableRows
    ? collectionResult.collectionProps.expandableRows.getItemChildren.bind(null)
    : undefined;
  const onExpandableItemToggle = collectionResult.collectionProps.expandableRows
    ? collectionResult.collectionProps.expandableRows.onExpandableItemToggle.bind(null)
    : undefined;
  if (collectionResult.collectionProps.expandableRows && settings.useProgressiveLoading) {
    // Decorate getItemChildren to paginate nested items.
    collectionResult.collectionProps.expandableRows.getItemChildren = item => {
      const children = getItemChildren!(item);
      const pages = loadingState.get(item.group)?.pages ?? 0;
      return children.slice(0, pages * NESTED_PAGE_SIZE);
    };
    // Decorate onExpandableItemToggle to trigger loading when expanded.
    collectionResult.collectionProps.expandableRows.onExpandableItemToggle = event => {
      onExpandableItemToggle!(event);
      if (event.detail.expanded) {
        loadItems(event.detail.item.group);
      }
    };
  }

  const rootPages = loadingState.get('ROOT')!.pages;
  const rootProgressiveLoading = settings.useProgressiveLoading && !settings.usePagination;

  const allItems = collectionResult.items;
  const paginatedItems = rootProgressiveLoading ? allItems.slice(0, rootPages * ROOT_PAGE_SIZE) : allItems;

  const getLoadingStatus = settings.useProgressiveLoading
    ? (item: null | TransactionRow): TableProps.LoadingStatus => {
        const id = item ? item.group : 'ROOT';
        const state = loadingState.get(id);
        const pages = state?.pages ?? 0;
        const pageSize = item ? NESTED_PAGE_SIZE : ROOT_PAGE_SIZE;
        const totalItems = item ? getItemChildren!(item).length : allItems.length;
        return pages * pageSize < totalItems ? 'pending' : 'finished';
      }
    : undefined;

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
    totalItemsCount: collectionResultTransactions.allPageItems.length,
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

function usePageSettings() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  return {
    usePagination: urlParams.usePagination ?? false,
    useProgressiveLoading: urlParams.useProgressiveLoading ?? true,
    setUrlParams,
  };
}

function PageSettings() {
  const settings = usePageSettings();
  return (
    <Drawer header={<Header variant="h2">Page settings</Header>}>
      <SpaceBetween size="l">
        <FormField label="Table settings">
          <Checkbox
            checked={settings.usePagination}
            onChange={event => settings.setUrlParams({ usePagination: event.detail.checked })}
          >
            Use pagination
          </Checkbox>

          <Checkbox
            checked={settings.useProgressiveLoading}
            onChange={event => settings.setUrlParams({ useProgressiveLoading: event.detail.checked })}
          >
            Use progressive loading
          </Checkbox>
        </FormField>
      </SpaceBetween>
    </Drawer>
  );
}
