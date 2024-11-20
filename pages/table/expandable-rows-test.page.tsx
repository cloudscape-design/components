// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { isEqual } from 'lodash';

import { useCollection } from '@cloudscape-design/collection-hooks';

import {
  Alert,
  AppLayout,
  Box,
  Button,
  ButtonDropdown,
  Checkbox,
  CollectionPreferencesProps,
  Drawer,
  Form,
  FormField,
  Pagination,
  Popover,
  PropertyFilter,
  Select,
  StatusIndicator,
  Table,
  TableProps,
  Toggle,
} from '~components';
import Header from '~components/header';
import I18nProvider from '~components/i18n';
import messages from '~components/i18n/messages/all.en';
import SpaceBetween from '~components/space-between';

import AppContext, { AppContextType } from '../app/app-context';
import { enhanceWindow, WindowWithFlushResponse } from '../common/flush-response';
import { ariaLabels, getHeaderCounterText, Instance } from './expandable-rows/common';
import { createColumns, createPreferences, filteringProperties } from './expandable-rows/expandable-rows-configs';
import { allInstances } from './expandable-rows/expandable-rows-data';
import { EmptyState, getMatchesCountText, renderAriaLive } from './shared-configs';

declare const window: WindowWithFlushResponse;
enhanceWindow();

type LoadingState = Map<string, { pages: number; status: TableProps.LoadingStatus }>;

type PageContext = React.Context<
  AppContextType<{
    resizableColumns: boolean;
    stickyHeader: boolean;
    sortingDisabled: boolean;
    stripedRows: boolean;
    selectionType: 'none' | 'single' | 'multi';
    groupResources: boolean;
    keepSelection: boolean;
    usePagination: boolean;
    useProgressiveLoading: boolean;
    useServerMock: boolean;
    emulateServerError: boolean;
    manualServerMock: boolean;
  }>
>;

export default () => {
  const settings = usePageSettings();
  const [toolsOpen, setToolsOpen] = useState(true);
  const [terminationReasons, setTerminationReasons] = useState(() => new Map<string, string>());
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>({
    wrapLines: true,
    stickyColumns: { first: 0, last: 0 },
  });

  const tableData = useTableData();

  const columnDefinitions = createColumns({ terminationReasons });

  const handleSubmit: TableProps.SubmitEditFunction<Instance> = (currentItem, column, newValue) => {
    if (column.id === 'termination-reason' && typeof newValue === 'string') {
      setTerminationReasons(prev => new Map(prev).set(currentItem.name, newValue));
    }
    return Promise.resolve();
  };

  return (
    <I18nProvider messages={[messages]} locale="en">
      <AppLayout
        contentType="table"
        navigationHide={true}
        tools={<PageSettings />}
        toolsOpen={toolsOpen}
        onToolsChange={({ detail: { open } }) => setToolsOpen(open)}
        content={
          <Table
            {...tableData.collectionProps}
            stickyColumns={preferences.stickyColumns}
            resizableColumns={settings.resizableColumns}
            stickyHeader={settings.stickyHeader}
            sortingDisabled={settings.sortingDisabled}
            selectionType={settings.selectionType !== 'none' ? settings.selectionType : undefined}
            stripedRows={settings.stripedRows}
            columnDefinitions={columnDefinitions}
            items={tableData.items}
            ariaLabels={ariaLabels}
            wrapLines={preferences.wrapLines}
            pagination={settings.usePagination && <Pagination {...tableData.paginationProps} />}
            columnDisplay={preferences.contentDisplay}
            preferences={createPreferences({ preferences, setPreferences })}
            submitEdit={handleSubmit}
            variant="full-page"
            renderAriaLive={renderAriaLive}
            loading={tableData.loading}
            loadingText="Loading instances"
            empty={
              tableData.error ? (
                <Alert type="error">Error when fetching table data</Alert>
              ) : (
                tableData.collectionProps.empty
              )
            }
            header={
              <Header
                variant="h1"
                description="Table with expandable rows test page"
                counter={getHeaderCounterText(allInstances, tableData.collectionProps.selectedItems)}
                actions={
                  <SpaceBetween size="s" direction="horizontal" alignItems="center">
                    <Toggle
                      checked={settings.groupResources}
                      onChange={event => settings.setUrlParams({ groupResources: event.detail.checked })}
                    >
                      Group resources
                    </Toggle>

                    <ButtonDropdown
                      variant="normal"
                      items={[
                        {
                          id: 'terminate-selected',
                          text: 'Terminate selected instances',
                          disabled: tableData.collectionProps.selectedItems?.length === 0,
                        },
                      ]}
                      onItemClick={event => {
                        switch (event.detail.id) {
                          case 'terminate-selected':
                            return tableData.actions.clearSelection();
                          default:
                            throw new Error('Invariant violation: unsupported action.');
                        }
                      }}
                    >
                      Actions
                    </ButtonDropdown>
                  </SpaceBetween>
                }
              >
                Databases
              </Header>
            }
            filter={
              <PropertyFilter
                {...tableData.propertyFilterProps}
                countText={getMatchesCountText(tableData.filteredItemsCount ?? 0)}
                filteringPlaceholder="Search databases"
              />
            }
            getLoadingStatus={tableData.getLoadingStatus}
            renderLoaderPending={({ item }) => (
              <Button
                variant="inline-link"
                iconName="add-plus"
                onClick={() => tableData.actions.loadItems(item?.name ?? 'ROOT')}
                ariaLabel={item ? `Load more items for ${item.name}` : 'Load more items'}
              >
                Load more items
              </Button>
            )}
            renderLoaderLoading={() => <StatusIndicator type="loading">Loading items</StatusIndicator>}
            renderLoaderError={({ item }) => (
              <Box color="text-status-error">
                <Popover
                  header="Failed to load instances"
                  content={
                    <Form
                      actions={<Button onClick={() => tableData.actions.loadItems(item?.name ?? 'ROOT')}>Retry</Button>}
                    >
                      <Alert type="error">
                        {item
                          ? `Error occurred during loading instances for item ${item.name}. Reason: item ${item.name} not found. Refresh the page.`
                          : 'Unknown error occurred during loading instances.'}
                      </Alert>
                    </Form>
                  }
                  renderWithPortal={true}
                >
                  <StatusIndicator type="error">Failed to load instances</StatusIndicator>
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
const NESTED_PAGE_SIZE = 2;
function useTableData() {
  const settings = usePageSettings();
  const delay = settings.useServerMock ? SERVER_DELAY : 0;
  const getServerResponse = useCallback(
    (cb: () => void) => {
      if (settings.manualServerMock) {
        window.__pendingCallbacks.push(cb);
        return () => {};
      } else {
        const timerRef = setTimeout(cb, delay);
        return () => clearTimeout(timerRef);
      }
    },
    [delay, settings.manualServerMock]
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Imitate server-side delay when fetching items for the first time.
  const [readyInstances, setReadyInstances] = useState(settings.useServerMock ? [] : allInstances);
  useEffect(() => {
    setLoading(true);
    setError(false);
    return getServerResponse(() => {
      setReadyInstances(allInstances);
      setLoading(false);
      setError(settings.emulateServerError);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getServerResponse, setLoading, setError, setReadyInstances]);

  const collectionResult = useCollection(readyInstances, {
    pagination: settings.usePagination ? { pageSize: ROOT_PAGE_SIZE } : undefined,
    sorting: {},
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
    selection: { trackBy: 'name', keepSelection: settings.keepSelection },
    expandableRows: settings.groupResources
      ? {
          getId: item => item.name,
          getParentId: item => item.parentName,
        }
      : undefined,
  });

  // Imitate server-side delay when items update.
  const memoItems = useEqualsMemo(collectionResult.items);
  const [readyItems, setReadyItems] = useState(memoItems);
  useEffect(() => {
    setLoading(true);
    setError(false);
    return getServerResponse(() => {
      setLoading(false);
      setReadyItems(memoItems);
      setError(settings.emulateServerError);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getServerResponse, memoItems, setLoading, setError, setReadyItems]);

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
      getServerResponse(() => setLoadingState(settings.emulateServerError ? nextError(id) : nextPending(id)));
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
      const pages = loadingState.get(item.name)?.pages ?? 0;
      return children.slice(0, pages * NESTED_PAGE_SIZE);
    };
    // Decorate onExpandableItemToggle to trigger loading when expanded.
    collectionResult.collectionProps.expandableRows.onExpandableItemToggle = event => {
      onExpandableItemToggle!(event);
      if (event.detail.expanded) {
        loadItems(event.detail.item.name);
      } else {
        setLoadingState(resetLoading(event.detail.item.name));
      }
    };
  }

  const rootPages = loadingState.get('ROOT')!.pages;
  const rootProgressiveLoading = settings.useProgressiveLoading && !settings.usePagination;

  const allItems = settings.useServerMock ? readyItems : memoItems;
  const paginatedItems = rootProgressiveLoading ? allItems.slice(0, rootPages * ROOT_PAGE_SIZE) : allItems;

  const getLoadingStatus = settings.useProgressiveLoading
    ? (item: null | Instance): TableProps.LoadingStatus => {
        const id = item ? item.name : 'ROOT';
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

  return {
    ...collectionResult,
    error: settings.useServerMock ? error : false,
    loading: settings.useServerMock ? loading : false,
    items: settings.useServerMock && error ? [] : paginatedItems,
    actions: {
      clearSelection: () => {
        collectionResult.actions.setSelectedItems([]);
      },
      loadItems,
    },
    getLoadingStatus,
  };
}

function usePageSettings() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  return {
    resizableColumns: urlParams.resizableColumns ?? true,
    stickyHeader: urlParams.stickyHeader ?? true,
    sortingDisabled: urlParams.sortingDisabled ?? false,
    stripedRows: urlParams.stripedRows ?? false,
    selectionType: urlParams.selectionType ?? 'multi',
    keepSelection: urlParams.keepSelection ?? false,
    usePagination: urlParams.usePagination ?? false,
    useProgressiveLoading: urlParams.useProgressiveLoading ?? true,
    groupResources: urlParams.groupResources ?? true,
    useServerMock: urlParams.useServerMock ?? false,
    manualServerMock: urlParams.manualServerMock ?? false,
    emulateServerError: urlParams.emulateServerError ?? false,
    setUrlParams,
  };
}

function PageSettings() {
  const selectionTypeOptions = [{ value: 'none' }, { value: 'single' }, { value: 'multi' }];
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
            checked={settings.stickyHeader}
            onChange={event => {
              settings.setUrlParams({ stickyHeader: event.detail.checked });
              window.location.reload();
            }}
          >
            Sticky header
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

          <Box margin={{ top: 'xs' }}>
            <FormField label={<Box>Selection type</Box>}>
              <Select
                selectedOption={
                  selectionTypeOptions.find(option => option.value === settings.selectionType) ??
                  selectionTypeOptions[0]
                }
                options={selectionTypeOptions}
                onChange={event =>
                  settings.setUrlParams({
                    selectionType: event.detail.selectedOption.value as 'none' | 'single' | 'multi',
                  })
                }
              />
            </FormField>
          </Box>
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
