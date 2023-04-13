// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { useCollection } from '@cloudscape-design/collection-hooks';
import Button from '~components/button';
import CollectionPreferences, { CollectionPreferencesProps } from '~components/collection-preferences';
import Header from '~components/header';
import Pagination from '~components/pagination';
import Table from '~components/table';
import TextFilter from '~components/text-filter';
import { Instance, generateItems } from './generate-data';
import { columnsConfig, EmptyState, getMatchesCountText, paginationLabels, pageSizeOptions } from './shared-configs';
import ScreenshotArea from '../utils/screenshot-area';
import { contentDisplayPreferenceI18nStrings } from '../common/i18n-strings';

const allItems = generateItems();

const visibleContentOptions: ReadonlyArray<CollectionPreferencesProps.ContentDisplayPreference> = [
  {
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
  },
];

export default function App() {
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>({
    pageSize: 20,
    contentDisplay: [
      { id: 'id', visible: true },
      { id: 'type', visible: true },
      { id: 'dnsName', visible: true },
      { id: 'imageId', visible: false },
      { id: 'state', visible: true },
    ],
    wrapLines: false,
  });
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
    <ScreenshotArea>
      <Table<Instance>
        {...collectionProps}
        header={
          <Header headingTagOverride="h1" counter={`(${allItems.length})`}>
            Instances
          </Header>
        }
        columnDefinitions={columnsConfig}
        items={items}
        pagination={<Pagination {...paginationProps} ariaLabels={paginationLabels} />}
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
              title: 'Column preferences',
              description: 'Customize the columns visibility and order.',
              options: visibleContentOptions[0].options,
              ...contentDisplayPreferenceI18nStrings,
            }}
            wrapLinesPreference={{
              label: 'Wrap lines',
              description: 'Wrap lines description',
            }}
          />
        }
        stickyHeader={true}
      />
    </ScreenshotArea>
  );
}
