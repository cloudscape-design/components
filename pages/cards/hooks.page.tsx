// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { useCollection } from '@cloudscape-design/collection-hooks';
import Button from '~components/button';
import Cards, { CardsProps } from '~components/cards';
import Header from '~components/header';
import Link from '~components/link';
import CollectionPreferences, { CollectionPreferencesProps } from '~components/collection-preferences';
import Pagination from '~components/pagination';
import TextFilter from '~components/text-filter';
import { Instance, generateItems } from '../table/generate-data';
import { EmptyState, getMatchesCountText, paginationLabels, pageSizeOptions } from '../table/shared-configs';
import ScreenshotArea from '../utils/screenshot-area';

export const cardDefinition: CardsProps.CardDefinition<Instance> = {
  header: item => (
    <Link fontSize="heading-m" href="#">
      {item.id}
    </Link>
  ),
  sections: [
    {
      id: 'type',
      header: 'Type',
      content: item => item.type,
    },
    {
      id: 'dnsName',
      header: 'DNS name',
      content: item => item.dnsName,
    },
  ],
};

const allItems = generateItems();

export default function App() {
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>({
    pageSize: 20,
    visibleContent: ['type', 'dnsName'],
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
    }
  );
  return (
    <ScreenshotArea>
      <Cards<Instance>
        {...collectionProps}
        header={
          <Header headingTagOverride="h1" counter={`(${allItems.length})`}>
            Instances
          </Header>
        }
        cardDefinition={cardDefinition}
        items={items}
        visibleSections={preferences.visibleContent}
        pagination={<Pagination {...paginationProps} ariaLabels={paginationLabels} />}
        filter={
          <TextFilter
            {...filterProps}
            countText={getMatchesCountText(filteredItemsCount!)}
            filteringAriaLabel="Filter instances"
          />
        }
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
            visibleContentPreference={{
              title: 'Select visible section',
              options: [
                {
                  label: 'Instance properties',
                  options: [
                    { id: 'type', label: 'Type', editable: false },
                    { id: 'dnsName', label: 'DNS name' },
                  ],
                },
              ],
            }}
          />
        }
      />
    </ScreenshotArea>
  );
}
