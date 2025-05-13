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
  PropertyFilter,
  PropertyFilterProps,
  Table,
} from '~components';
import { I18nProvider } from '~components/i18n';
import messages from '~components/i18n/messages/all.en';

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

const propertyFilterI18nStrings: PropertyFilterProps.I18nStrings = {
  filteringAriaLabel: 'Find instances',
  filteringPlaceholder: 'Find instances',
};

const allItems = generateItems();

const stringOperators = [':', '!:', '=', '!=', '^', '!^'];

const enumOperators = [{ operator: '=', tokenType: 'enum' }, { operator: '!=', tokenType: 'enum' }, ':', '!:'] as const;
const filteringProperties = [
  {
    propertyLabel: 'Id',
    key: 'id',
    groupValuesLabel: 'Id values',
    operators: stringOperators,
  },
  {
    propertyLabel: 'State',
    key: 'state',
    groupValuesLabel: 'State values',
    operators: enumOperators,
  },
  {
    propertyLabel: 'Type',
    key: 'type',
    groupValuesLabel: 'Type values',
    operators: enumOperators,
  },
  {
    propertyLabel: 'Image Id',
    key: 'imageId',
    groupValuesLabel: 'Image Id values',
    operators: enumOperators,
  },
];

export default function TablePage() {
  useFunnelLogger();

  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>(defaultPreferences);
  const { items, actions, filteredItemsCount, collectionProps, propertyFilterProps, paginationProps } = useCollection(
    allItems,
    {
      propertyFiltering: {
        filteringProperties,
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
    <I18nProvider messages={[messages]} locale="en">
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
          <PropertyFilter
            {...propertyFilterProps}
            i18nStrings={propertyFilterI18nStrings}
            countText={filteredItemsCount !== undefined ? getMatchesCountText(filteredItemsCount) : undefined}
            expandToViewport={true}
            enableTokenGroups={true}
            onChange={event => {
              propertyFilterProps.onChange(event);
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
      />
    </I18nProvider>
  );
}
