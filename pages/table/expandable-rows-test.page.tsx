// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import Table, { TableProps } from '~components/table';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import { EmptyState, getMatchesCountText, renderAriaLive } from './shared-configs';
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
  Toggle,
} from '~components';
import AppContext, { AppContextType } from '../app/app-context';
import { allInstances } from './expandable-rows/expandable-rows-data';
import messages from '~components/i18n/messages/all.en';
import I18nProvider from '~components/i18n';
import { createColumns, createPreferences, filteringProperties } from './expandable-rows/expandable-rows-configs';
import { Instance, ariaLabels, getHeaderCounterText } from './expandable-rows/common';
import StatusIndicator from '~components/status-indicator/internal';

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
    emulateProgressiveLoadingError: boolean;
  }>
>;

export default () => {
  const settings = usePageSettings();
  const [toolsOpen, setToolsOpen] = useState(true);
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>({
    pageSize: 10,
    wrapLines: true,
    stickyColumns: { first: 0, last: 1 },
  });
  const [selectedCluster, setSelectedCluster] = useState<null | string>(null);
  const getScopedInstances = (selected: null | string) =>
    selected === null ? allInstances : allInstances.filter(i => i.path.includes(selected));

  const { items, collectionProps, paginationProps, propertyFilterProps, filteredItemsCount, actions } = useCollection(
    getScopedInstances(selectedCluster),
    {
      pagination: settings.usePagination ? { pageSize: preferences.pageSize } : undefined,
      sorting: {},
      filtering: {},
      propertyFiltering: {
        filteringProperties,
        empty: <EmptyState title="No instances" subtitle="No instances to display." action={null} />,
        noMatch: (
          <EmptyState
            title="No matches"
            subtitle="We can’t find a match."
            action={
              <Button onClick={() => actions.setPropertyFiltering({ operation: 'and', tokens: [] })}>
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
            getParentId: item => (item.name === selectedCluster ? null : item.parentName),
          }
        : undefined,
    }
  );

  // Decorate path options to only show the last node and not the full path.
  const filteringOptions = propertyFilterProps.filteringOptions.map(option =>
    option.propertyKey === 'path' ? { ...option, value: option.value.split(',')[0] } : option
  );

  const expandedInstances = collectionProps.expandableRows?.expandedItems ?? [];

  const columnDefinitions = createColumns({
    getInstanceProps: instance => {
      const children = collectionProps.expandableRows?.getItemChildren(instance).length ?? 0;
      const scopedInstances = getScopedInstances(instance.name);
      const instanceActions = [
        {
          id: 'drill-down',
          text: `Show ${instance.name} cluster only`,
          hidden: !children,
          onClick: () => {
            actions.setExpandedItems(scopedInstances);
            setSelectedCluster(instance.name);
          },
        },
        {
          id: 'expand-all',
          text: `Expand cluster`,
          hidden: !children,
          onClick: () => {
            actions.setExpandedItems([...expandedInstances, ...scopedInstances]);
          },
        },
        {
          id: 'collapse-all',
          text: `Collapse cluster`,
          hidden: !children,
          onClick: () => {
            actions.setExpandedItems(expandedInstances.filter(i => !scopedInstances.includes(i)));
          },
        },
      ];
      return { children, actions: instanceActions };
    },
  });

  // Using a special id="ROOT" for progressive loading at the root level.
  const [loadingState, setLoadingState] = useState<LoadingState>(new Map([['ROOT', { status: 'pending', pages: 1 }]]));

  const updateLoading = (id: string) => {
    const setLoading = (id: string, state: LoadingState) =>
      new Map([...state, [id, { status: 'loading', pages: state.get(id)?.pages ?? 0 } as const]]);
    const setError = (id: string, state: LoadingState) =>
      new Map([...state, [id, { status: 'error', pages: state.get(id)?.pages ?? 0 } as const]]);
    const setPending = (id: string, state: LoadingState) =>
      new Map([...state, [id, { status: 'pending', pages: (state.get(id)?.pages ?? 0) + 1 } as const]]);
    setLoadingState(prev => setLoading(id, prev));
    setTimeout(
      () =>
        setLoadingState(prev => (settings.emulateProgressiveLoadingError ? setError(id, prev) : setPending(id, prev))),
      1500
    );
  };

  const rootPageSize = preferences.pageSize ?? 10;
  const nestedPageSize = 2;
  const expandableRows: undefined | TableProps.ExpandableRows<Instance> = settings.groupResources
    ? {
        ...collectionProps.expandableRows!,
        getItemChildren(item) {
          const children = collectionProps.expandableRows!.getItemChildren(item);
          const pages = loadingState.get(item.name)?.pages ?? 0;
          return settings.useProgressiveLoading ? children.slice(0, pages * nestedPageSize) : children;
        },
        onExpandableItemToggle: event => {
          collectionProps.expandableRows!.onExpandableItemToggle(event);
          if (event.detail.expanded) {
            updateLoading(event.detail.item.name);
          }
        },
      }
    : undefined;

  const rootPages = loadingState.get('ROOT')?.pages ?? 1;
  const paginatedItems = settings.useProgressiveLoading ? items.slice(0, rootPages * rootPageSize) : items;
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
            {...collectionProps}
            expandableRows={expandableRows}
            stickyColumns={preferences.stickyColumns}
            resizableColumns={settings.resizableColumns}
            stickyHeader={settings.stickyHeader}
            sortingDisabled={settings.sortingDisabled}
            selectionType={settings.selectionType !== 'none' ? settings.selectionType : undefined}
            stripedRows={settings.stripedRows}
            columnDefinitions={columnDefinitions}
            items={paginatedItems}
            ariaLabels={ariaLabels}
            wrapLines={preferences.wrapLines}
            pagination={settings.usePagination && <Pagination {...paginationProps} />}
            columnDisplay={preferences.contentDisplay}
            preferences={createPreferences({ preferences, setPreferences })}
            submitEdit={() => {}}
            variant="full-page"
            renderAriaLive={renderAriaLive}
            header={
              <SpaceBetween size="m">
                <Header
                  variant="h1"
                  description="Table with expandable rows test page"
                  counter={getHeaderCounterText(allInstances, collectionProps.selectedItems)}
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
                          { id: 'expand-all', text: 'Expand all', disabled: !settings.groupResources },
                          { id: 'collapse-all', text: 'Collapse all', disabled: !settings.groupResources },
                          {
                            id: 'terminate-selected',
                            text: 'Terminate selected instances',
                            disabled: collectionProps.selectedItems?.length === 0,
                          },
                        ]}
                        onItemClick={event => {
                          switch (event.detail.id) {
                            case 'expand-all':
                              return actions.setExpandedItems(allInstances);
                            case 'collapse-all':
                              return actions.setExpandedItems([]);
                            case 'terminate-selected':
                              return actions.setSelectedItems([]);
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
                {selectedCluster && (
                  <Alert
                    type="info"
                    action={<Button onClick={() => setSelectedCluster(null)}>Show all databases</Button>}
                  >
                    Showing databases that belong to{' '}
                    <Box variant="span" fontWeight="bold">
                      {selectedCluster}
                    </Box>{' '}
                    cluster.
                  </Alert>
                )}
              </SpaceBetween>
            }
            filter={
              <PropertyFilter
                {...propertyFilterProps}
                filteringOptions={filteringOptions}
                countText={getMatchesCountText(filteredItemsCount ?? 0)}
                filteringPlaceholder="Search databases"
              />
            }
            getLoadingStatus={
              settings.useProgressiveLoading
                ? item => {
                    if (!item) {
                      return loadingState.get('ROOT')?.status ?? 'finished';
                    } else {
                      const children = collectionProps.expandableRows!.getItemChildren(item);
                      const state = loadingState.get(item.name) ?? { status: 'pending', pages: 1 };
                      return state.pages * nestedPageSize < children.length ? state.status : 'finished';
                    }
                  }
                : undefined
            }
            renderLoaderPending={({ item }) => (
              <Button variant="inline-link" iconName="add-plus" onClick={() => updateLoading(item?.name ?? 'ROOT')}>
                {item ? `Load more items for ${item.name}` : 'Load more items'}
              </Button>
            )}
            renderLoaderLoading={({ item }) => (
              <StatusIndicator type="loading">
                {item ? `Loading more items for ${item.name}` : 'Loading more items'}
              </StatusIndicator>
            )}
            renderLoaderError={({ item }) => (
              <Box color="text-status-error">
                <Popover
                  header="Failed to load instances"
                  content={
                    <Form actions={<Button onClick={() => updateLoading(item?.name ?? 'ROOT')}>Retry</Button>}>
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
    emulateProgressiveLoadingError: urlParams.emulateProgressiveLoadingError ?? false,
    groupResources: urlParams.groupResources ?? true,
    setUrlParams,
  };
}

function PageSettings() {
  const selectionTypeOptions = [{ value: 'none' }, { value: 'single' }, { value: 'multi' }];
  const settings = usePageSettings();
  return (
    <Drawer header={<Header variant="h2">Page settings</Header>}>
      <SpaceBetween direction="horizontal" size="m">
        <FormField label="Table flags">
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

          <Checkbox
            checked={settings.emulateProgressiveLoadingError}
            onChange={event => settings.setUrlParams({ emulateProgressiveLoadingError: event.detail.checked })}
          >
            Emulate progressive loading error
          </Checkbox>
        </FormField>

        <FormField label="Selection type">
          <Select
            selectedOption={
              selectionTypeOptions.find(option => option.value === settings.selectionType) ?? selectionTypeOptions[0]
            }
            options={selectionTypeOptions}
            onChange={event =>
              settings.setUrlParams({
                selectionType: event.detail.selectedOption.value as 'none' | 'single' | 'multi',
              })
            }
          />
        </FormField>
      </SpaceBetween>
    </Drawer>
  );
}
