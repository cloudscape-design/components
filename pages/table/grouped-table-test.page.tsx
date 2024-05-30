// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState, useEffect, useRef } from 'react';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import { EmptyState, getMatchesCountText, renderAriaLive } from './shared-configs';
import { useCollection } from '@cloudscape-design/collection-hooks';
import {
  Alert,
  AppLayout,
  AttributeEditor,
  Box,
  Button,
  Checkbox,
  CollectionPreferencesProps,
  Drawer,
  ExpandableSection,
  Form,
  FormField,
  Pagination,
  Popover,
  PropertyFilter,
  Select,
  StatusIndicator,
  TableProps,
  Toggle,
} from '~components';
import AppContext, { AppContextType } from '../app/app-context';
import { GroupDefinition, getGroupedTransactions } from './grouped-table/grouped-table-data';
import messages from '~components/i18n/messages/all.en';
import I18nProvider from '~components/i18n';
import { createColumns, createPreferences, filteringProperties } from './grouped-table/grouped-table-configs';
import { TransactionRow, ariaLabels, getHeaderCounterText } from './grouped-table/grouped-table-common';
import { isEqual } from 'lodash';

// TODO: replace with Table once progressive loading API becomes public
import InternalTable from '~components/table/internal';

type LoadingState = Map<string, { pages: number; status: TableProps.LoadingStatus }>;

type PageContext = React.Context<
  AppContextType<{
    resizableColumns: boolean;
    sortingDisabled: boolean;
    stripedRows: boolean;
    keepSelection: boolean;
    usePagination: boolean;
    useProgressiveLoading: boolean;
    useServerMock: boolean;
    emulateServerError: boolean;
  }>
>;

const groupOptions = [
  {
    value: 'date',
    label: 'Date',
    bases: [
      { type: 'date', value: 'year' },
      { type: 'date', value: 'quarter' },
      { type: 'date', value: 'month' },
      { type: 'date', value: 'day' },
    ],
  },
  { value: 'origin', label: 'Origin', bases: [{ type: 'unique', value: 'unique' }] },
  { value: 'recipient', label: 'Recipient', bases: [{ type: 'unique', value: 'unique' }] },
  { value: 'currency', label: 'Currency', bases: [{ type: 'unique', value: 'unique' }] },
  {
    value: 'amountEur',
    label: 'Amount EUR',
    bases: [
      { type: 'number', value: '100' },
      { type: 'number', value: '250' },
      { type: 'number', value: '500' },
      { type: 'number', value: '1000' },
      { type: 'number', value: '5000' },
      { type: 'number', value: '10000' },
    ],
  },
  {
    value: 'amountUsd',
    label: 'Amount USD',
    bases: [
      { type: 'number', value: '100' },
      { type: 'number', value: '250' },
      { type: 'number', value: '500' },
      { type: 'number', value: '1000' },
      { type: 'number', value: '5000' },
      { type: 'number', value: '10000' },
    ],
  },
  { value: 'paymentMethod', label: 'Payment Method', bases: [{ type: 'unique', value: 'unique' }] },
] as const;

export default () => {
  const settings = usePageSettings();
  const [toolsOpen, setToolsOpen] = useState(true);
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>({
    wrapLines: false,
    stickyColumns: { first: 1, last: 0 },
  });

  const tableData = useTableData();

  const columnDefinitions = createColumns();

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
            stickyColumns={preferences.stickyColumns}
            resizableColumns={settings.resizableColumns}
            sortingDisabled={settings.sortingDisabled}
            selectionType="group"
            stripedRows={settings.stripedRows}
            columnDefinitions={columnDefinitions}
            items={tableData.items}
            ariaLabels={ariaLabels}
            wrapLines={preferences.wrapLines}
            pagination={settings.usePagination && <Pagination {...tableData.paginationProps} />}
            columnDisplay={preferences.contentDisplay}
            preferences={createPreferences({ preferences, setPreferences })}
            submitEdit={() => {}}
            variant="full-page"
            renderAriaLive={renderAriaLive}
            loading={tableData.loading}
            loadingText="Loading transactions"
            empty={
              tableData.error ? (
                <Alert type="error">Error when fetching table data</Alert>
              ) : (
                tableData.collectionProps.empty
              )
            }
            header={
              <SpaceBetween size="m">
                <Header
                  variant="h1"
                  description="Table with expandable rows test page"
                  counter={getHeaderCounterText(tableData.total, tableData.collectionProps.selectedItems)}
                  actions={
                    <SpaceBetween size="s" direction="horizontal" alignItems="center">
                      <Button>Update selected</Button>
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
                              onChange={event =>
                                tableData.actions.setGroupProperty(index, event.detail.selectedOption.value!)
                              }
                            />
                          ),
                        },
                        {
                          label: 'Basis',
                          control: (item, index) => (
                            <Select
                              selectedOption={
                                (groupOptions as unknown as any[])
                                  .find((o: any) => o.value === item.property)!
                                  .bases.find((b: any) => b === item.basis)!
                              }
                              options={groupOptions.find(o => o.value === item.property)!.bases}
                              onChange={event =>
                                tableData.actions.setGroupBasis(index, event.detail.selectedOption as any)
                              }
                            />
                          ),
                        },
                        {
                          label: 'Sorting',
                          control: (item, index) => (
                            <Toggle
                              checked={item.sorting === 'desc'}
                              onChange={({ detail }) =>
                                tableData.actions.setGroupSorting(index, detail.checked ? 'desc' : 'asc')
                              }
                            >
                              Sort descending
                            </Toggle>
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
                {item ? `Load more items for ${item.group}` : 'Load more items'}
              </Button>
            )}
            renderLoaderLoading={({ item }) => (
              <StatusIndicator type="loading">
                {item ? `Loading more items for ${item.group}` : 'Loading more items'}
              </StatusIndicator>
            )}
            renderLoaderError={({ item }) => (
              <Box color="text-status-error">
                <Popover
                  header="Failed to load transactions"
                  content={
                    <Form
                      actions={
                        <Button onClick={() => tableData.actions.loadItems(item?.group ?? 'ROOT')}>Retry</Button>
                      }
                    >
                      <Alert type="error">
                        {item
                          ? `Error occurred during loading transactions for item ${item.group}. Reason: item ${item.group} not found. Refresh the page.`
                          : 'Unknown error occurred during loading transactions.'}
                      </Alert>
                    </Form>
                  }
                  renderWithPortal={true}
                >
                  <StatusIndicator type="error">Failed to load transactions</StatusIndicator>
                </Popover>
              </Box>
            )}
          />
        }
      />
    </I18nProvider>
  );
};

const SERVER_DELAY = 1500;
const ROOT_PAGE_SIZE = 10;
const NESTED_PAGE_SIZE = 10;
function useTableData() {
  const settings = usePageSettings();
  const delay = settings.useServerMock ? SERVER_DELAY : 0;

  const [groups, setGroups] = useState<GroupDefinition[]>([
    {
      property: 'date',
      basis: groupOptions.find(o => o.value === 'date')!.bases[0],
      sorting: 'desc',
    },
    {
      property: 'date',
      basis: groupOptions.find(o => o.value === 'date')!.bases[1] as any,
      sorting: 'desc',
    },
    {
      property: 'amountEur',
      basis: groupOptions.find(o => o.value === 'amountEur')!.bases[0],
      sorting: 'asc',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const allTransactionRows = getGroupedTransactions(groups);

  // Imitate server-side delay when fetching items for the first time.
  const [readyTransactions, setReadyTransactions] = useState(settings.useServerMock ? [] : allTransactionRows);
  useEffect(() => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setReadyTransactions(getGroupedTransactions(groups));
      setLoading(false);
      setError(settings.emulateServerError);
    }, delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, delay, setLoading, setError, setReadyTransactions]);

  const collectionResult = useCollection(readyTransactions, {
    pagination: settings.usePagination ? { pageSize: ROOT_PAGE_SIZE } : undefined,
    // sorting: {},
    filtering: {},
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
    selection: { trackBy: 'key', keepSelection: settings.keepSelection },
    expandableRows: {
      getId: item => item.key,
      getParentId: item => item.parent,
    },
  });

  // Imitate server-side delay when items update.
  const memoItems = useEqualsMemo(collectionResult.items);
  const [readyItems, setReadyItems] = useState(memoItems);
  useEffect(() => {
    setLoading(true);
    setError(false);
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setReadyItems(memoItems);
      setError(settings.emulateServerError);
    }, delay);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, memoItems, setLoading, setError, setReadyItems]);

  // Decorate path options to only show the last node and not the full path.
  collectionResult.propertyFilterProps.filteringOptions = collectionResult.propertyFilterProps.filteringOptions.map(
    option => (option.propertyKey === 'path' ? { ...option, value: option.value.split(',')[0] } : option)
  );

  // Using a special id="ROOT" for progressive loading at the root level.
  const [loadingState, setLoadingState] = useState<LoadingState>(new Map([['ROOT', { status: 'pending', pages: 1 }]]));
  const resetLoading = (id: string) => (state: LoadingState) => {
    return new Map([...state, [id, { status: 'loading', pages: 0 }]]) as LoadingState;
  };
  const nextLoading = (id: string) => (state: LoadingState) => {
    return new Map([...state, [id, { status: 'loading', pages: state.get(id)?.pages ?? 0 }]]) as LoadingState;
  };
  const nextError = (id: string) => (state: LoadingState) => {
    return new Map([...state, [id, { status: 'error', pages: state.get(id)?.pages ?? 0 }]]) as LoadingState;
  };
  const nextPending = (id: string) => (state: LoadingState) => {
    return new Map([...state, [id, { status: 'pending', pages: (state.get(id)?.pages ?? 0) + 1 }]]) as LoadingState;
  };

  const loadItems = (id: string) => {
    setLoadingState(nextLoading(id));
    if (delay) {
      setTimeout(() => setLoadingState(settings.emulateServerError ? nextError(id) : nextPending(id)), delay);
    } else {
      setLoadingState(nextPending(id));
    }
  };

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
      } else {
        setLoadingState(resetLoading(event.detail.item.group));
      }
    };
  }

  const rootPages = loadingState.get('ROOT')!.pages;
  const rootProgressiveLoading = settings.useProgressiveLoading && !settings.usePagination;

  const allItems = settings.useServerMock ? readyItems : memoItems;
  const paginatedItems = rootProgressiveLoading ? allItems.slice(0, rootPages * ROOT_PAGE_SIZE) : allItems;

  const getLoadingStatus = settings.useProgressiveLoading
    ? (item: null | TransactionRow): TableProps.LoadingStatus => {
        const id = item ? item.group : 'ROOT';
        const state = loadingState.get(id);
        if (settings.useServerMock && state && (state.status === 'loading' || state.status === 'error')) {
          return state.status;
        }
        const pages = state?.pages ?? 0;
        const pageSize = item ? NESTED_PAGE_SIZE : ROOT_PAGE_SIZE;
        const totalItems = item ? getItemChildren!(item).length : allItems.length;
        return pages * pageSize < totalItems ? 'pending' : 'finished';
      }
    : undefined;

  const addGroup = () => {
    setGroups(prev => [
      ...prev,
      { property: 'date', basis: groupOptions.find(o => o.value === 'date')!.bases[0], sorting: 'asc' },
    ]);
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
        return {
          property,
          basis: groupOptions.find(o => o.value === property)!.bases[0],
          sorting: group.sorting,
        } as GroupDefinition;
      })
    );
  };
  const setGroupBasis = (index: number, basis: GroupDefinition['basis']) => {
    setGroups(prev =>
      prev.map((group, groupIndex) => {
        if (index !== groupIndex) {
          return group;
        }
        return { ...group, basis };
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
    total: allTransactionRows.filter(t => t.children.length === 0).length,
    ...collectionResult,
    error: settings.useServerMock ? error : false,
    loading: settings.useServerMock ? loading : false,
    items: settings.useServerMock && error ? [] : paginatedItems,
    groups,
    actions: {
      expandAll: () => {
        collectionResult.actions.setExpandedItems(allTransactionRows);
      },
      collapseAll: () => {
        collectionResult.actions.setExpandedItems([]);
      },
      clearSelection: () => {
        collectionResult.actions.setSelectedItems([]);
      },
      loadItems,
      addGroup,
      deleteGroup,
      setGroupProperty,
      setGroupBasis,
      setGroupSorting,
    },
    getLoadingStatus,
  };
}

function usePageSettings() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  return {
    resizableColumns: urlParams.resizableColumns ?? true,
    sortingDisabled: urlParams.sortingDisabled ?? false,
    stripedRows: urlParams.stripedRows ?? false,
    keepSelection: urlParams.keepSelection ?? false,
    usePagination: urlParams.usePagination ?? false,
    useProgressiveLoading: urlParams.useProgressiveLoading ?? true,
    useServerMock: urlParams.useServerMock ?? false,
    emulateServerError: urlParams.emulateServerError ?? false,
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
            checked={settings.resizableColumns}
            onChange={event => settings.setUrlParams({ resizableColumns: event.detail.checked })}
          >
            Resizable columns
          </Checkbox>

          <Checkbox
            checked={settings.sortingDisabled}
            onChange={event => settings.setUrlParams({ sortingDisabled: event.detail.checked })}
          >
            Sorting disabled
          </Checkbox>

          <Checkbox
            checked={settings.stripedRows}
            onChange={event => settings.setUrlParams({ stripedRows: event.detail.checked })}
          >
            Striped rows
          </Checkbox>

          <Checkbox
            checked={settings.keepSelection}
            onChange={event => settings.setUrlParams({ keepSelection: event.detail.checked })}
          >
            Keep selection
          </Checkbox>

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

        <FormField label="Mock server settings">
          <Checkbox
            checked={settings.useServerMock}
            onChange={event => settings.setUrlParams({ useServerMock: event.detail.checked })}
          >
            Use server mock
          </Checkbox>

          <Checkbox
            checked={settings.emulateServerError}
            onChange={event => settings.setUrlParams({ emulateServerError: event.detail.checked })}
          >
            Emulate server error
          </Checkbox>
        </FormField>
      </SpaceBetween>
    </Drawer>
  );
}

function useEqualsMemo<T>(value: T): T {
  const ref = useRef<T>(value);
  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }
  return ref.current;
}
