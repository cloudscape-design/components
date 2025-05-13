// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';

import {
  Button,
  CollectionPreferences,
  CollectionPreferencesProps,
  Header,
  Pagination,
  Table,
  TableProps,
  TextFilter,
} from '~components';

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
import { useFunnelLogger } from './hooks/use-funnel-logger';

const allItems = generateItems();

export default function TablePage() {
  useFunnelLogger();

  const [selectedItems, setSelectedItems] = useState<TableProps['selectedItems']>([]);
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>(defaultPreferences);
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
    <>
      <Table<Instance>
        {...collectionProps}
        selectionType="multi"
        header={
          <Header headingTagOverride="h1" counter={`(${allItems.length})`}>
            Instances
          </Header>
        }
        selectedItems={selectedItems}
        columnDefinitions={columnsConfig}
        items={items}
        pagination={<Pagination {...paginationProps} ariaLabels={paginationLabels} openEnd={true} />}
        filter={
          <TextFilter
            {...filterProps!}
            countText={getMatchesCountText(filteredItemsCount!)}
            filteringAriaLabel="Filter instances"
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
