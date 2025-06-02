// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';

import {
  Button,
  CollectionPreferences,
  CollectionPreferencesProps,
  Header,
  Input,
  Pagination,
  Table,
  TableProps,
} from '~components';
import { setComponentMetrics } from '~components/internal/analytics';

import { contentDisplayPreferenceI18nStrings } from '../common/i18n-strings';
import { generateItems, Instance } from '../table/generate-data';
import {
  columnsConfig,
  contentDisplayPreference,
  defaultPreferences,
  EmptyState,
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

export default function WithTablePage() {
  const [selectedItems, setSelectedItems] = useState<TableProps['selectedItems']>([]);
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>(defaultPreferences);
  const { items, actions, collectionProps, filterProps, paginationProps } = useCollection(allItems, {
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
  });

  return (
    <>
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
          resourceType: 'table-resource-type',
          flowType: 'view-resource',
        }}
        selectionType="multi"
        header={
          <Header headingTagOverride="h1" counter={`(${allItems.length})`}>
            Table title
          </Header>
        }
        selectedItems={selectedItems}
        columnDefinitions={columnsConfig}
        items={items}
        pagination={<Pagination {...paginationProps} ariaLabels={paginationLabels} />}
        filter={
          <Input
            value={filterProps.filteringText}
            onChange={event => {
              filterProps.onChange({ ...event, detail: { filteringText: event.detail.value } });
            }}
          />
        }
        columnDisplay={preferences.contentDisplay}
        preferences={
          <CollectionPreferences
            title="Preferences"
            confirmLabel="Confirm"
            cancelLabel="Cancel"
            onConfirm={({ detail }) => setPreferences(detail)}
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
    </>
  );
}
