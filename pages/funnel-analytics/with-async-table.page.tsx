// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';

import {
  Box,
  Button,
  CollectionPreferences,
  CollectionPreferencesProps,
  Header,
  Pagination,
  SpaceBetween,
  Table,
  TableProps,
  TextFilter,
} from '~components';
import { setComponentMetrics } from '~components/internal/analytics';

import { contentDisplayPreferenceI18nStrings } from '../common/i18n-strings';
import { generateItems, Instance } from '../table/generate-data';
import {
  columnsConfig,
  contentDisplayPreference,
  defaultPreferences,
  EmptyState,
  getMatchesCountText,
  pageSizeOptions,
  paginationLabels,
} from '../table/shared-configs';

const componentMetricsLog: any[] = [];
(window as any).__awsuiComponentlMetrics__ = componentMetricsLog;

setComponentMetrics({
  componentMounted: props => {
    componentMetricsLog.push({ name: 'componentMounted', detail: { ...props } });
    return props.taskInteractionId || 'mocked-task-interaction-id';
  },
  componentUpdated: props => {
    componentMetricsLog.push({ name: 'componentUpdated', detail: { ...props } });
  },
});

const allItems = generateItems();

const MINIMUM_LOADING_TIME_MS = 500;
const MAXIMUM_ADDITIONAL_LOADING_TIME_MS = 1000;

function useLoading() {
  const [loading, setLoading] = useState(false);
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  return {
    loading,
    load: () => {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = setTimeout(
        () => setLoading(false),
        MINIMUM_LOADING_TIME_MS + Math.random() * MAXIMUM_ADDITIONAL_LOADING_TIME_MS
      );
      setLoading(true);
    },
  };
}

export default function WithAsyncTablePage() {
  const [selectedItems, setSelectedItems] = useState<TableProps['selectedItems']>([]);
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>(defaultPreferences);
  const { loading, load } = useLoading();

  const { items, actions, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(
    allItems,
    {
      filtering: {
        empty: (
          <EmptyState
            title="No resources"
            subtitle="No resources to display."
            action={<Button>Create resource</Button>}
          />
        ),
        noMatch: (
          <EmptyState
            title="No matches"
            subtitle="We can’t find a match."
            action={<Button onClick={() => actions.setFiltering('')}>Clear filter</Button>}
          />
        ),
      },
      pagination: { pageSize: preferences.pageSize },
      sorting: {},
    }
  );

  return (
    <Box padding="l">
      <SpaceBetween size="xxl">
        <Button onClick={load} loading={loading} data-testid="refresh-table">
          Refresh the table without user interaction
        </Button>
        <Table<Instance>
          ariaLabels={{
            selectionGroupLabel: 'selectionGroupLabel',
            activateEditLabel: () => 'activateEditLabel',
            cancelEditLabel: () => 'cancelEditLabel',
            submitEditLabel: () => 'submitEditLabel',
            allItemsSelectionLabel: () => 'allItemsSelectionLabel',
            itemSelectionLabel: () => 'itemSelectionLabel',
            tableLabel: 'tableLabel',
            expandButtonLabel: () => 'expand row',
            collapseButtonLabel: () => 'collapse row',
          }}
          {...collectionProps}
          analyticsMetadata={{
            instanceIdentifier: 'the-instances-table',
            flowType: 'view-resource',
            resourceType: 'table-resource-type',
          }}
          selectionType="single"
          variant="full-page"
          selectedItems={selectedItems}
          onSortingChange={e => {
            collectionProps.onSortingChange!(e);
            load();
          }}
          header={
            <Header headingTagOverride="h1" counter={`(${allItems.length})`}>
              Instances
            </Header>
          }
          loading={loading}
          columnDefinitions={columnsConfig}
          items={items}
          pagination={
            <Pagination
              {...paginationProps}
              onChange={e => {
                paginationProps.onChange(e);
                load();
              }}
              ariaLabels={paginationLabels}
            />
          }
          filter={
            <TextFilter
              {...filterProps!}
              countText={getMatchesCountText(filteredItemsCount!)}
              onChange={e => {
                filterProps!.onChange(e);
                load();
              }}
              filteringAriaLabel="Filter instances"
            />
          }
          columnDisplay={preferences.contentDisplay}
          preferences={
            <CollectionPreferences
              title="Preferences"
              confirmLabel="Confirm"
              cancelLabel="Cancel"
              onConfirm={({ detail }) => {
                setPreferences(detail);
                load();
              }}
              preferences={preferences}
              pageSizePreference={{
                title: 'Select page size',
                options: pageSizeOptions,
              }}
              contentDisplayPreference={{
                ...contentDisplayPreference,
                ...contentDisplayPreferenceI18nStrings,
              }}
              wrapLinesPreference={{
                label: 'Wrap lines',
                description: 'Wrap lines description',
              }}
            />
          }
          stickyHeader={true}
          onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
        />
      </SpaceBetween>
    </Box>
  );
}
