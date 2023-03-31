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
import { Instance, generateItems } from '../table/generate-data';
import { EmptyState, paginationLabels, getMatchesCountText, pageSizeOptions } from '../table/shared-configs';
import ScreenshotArea from '../utils/screenshot-area';
import { SegmentedControl, Select, SelectProps, TextFilter } from '~components';
import styles from './styles.scss';

const iconAscending = (
  <svg width="13" height="12" viewBox="0 0 13 12" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.5 0L13 3.89736L11.6648 5.38415L10.4441 4.0249V12H8.55587V4.0249L7.3352 5.38415L6 3.89736L9.5 0Z" />
    <rect x="0.5" y="0.5" width="3" height="1" />
    <rect x="0.5" y="5.5" width="4" height="1" />
    <rect x="0.5" y="10.5" width="5" height="1" />
  </svg>
);

const iconDescending = (
  <svg width="14" height="12" viewBox="0 0 14 12" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.70696 11.4142L5.99985 7.70711L7.41406 6.29289L8.70696 7.58579V1.90735e-06H10.707V7.58579L11.9998 6.29289L13.4141 7.70711L9.70696 11.4142Z" />
    <rect x="0.5" y="10.5" width="3" height="1" />
    <rect x="0.5" y="5.50003" width="4" height="1" />
    <rect x="0.5" y="0.500031" width="5" height="1" />
  </svg>
);

export const cardDefinition: CardsProps.CardDefinition<Instance> = {
  header: item => <Link fontSize="heading-m">{item.id}</Link>,
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

const sortingOptions: Array<SelectProps.Option> = [
  { value: 'id', label: 'Sort by ID' },
  { value: 'type', label: 'Sort by Type' },
  { value: 'dnsName', label: 'Sort by DNS name' },
];

export default function App() {
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>({
    pageSize: 20,
    visibleContent: ['type', 'dnsName'],
  });

  const [sortingOrder, setSortingOrder] = useState('ascending');
  const [sortingProperty, setSortingProperty] = useState(sortingOptions[0]);

  const sortedItems = [...allItems].sort((a, b) => {
    const firstItem = sortingOrder === 'ascending' ? a : b;
    const secondItem = sortingOrder === 'ascending' ? b : a;

    switch (sortingProperty.value) {
      case 'type':
        return firstItem.type.localeCompare(secondItem.type);
      case 'dnsName':
        return (firstItem.dnsName ?? '').localeCompare(secondItem.dnsName ?? '');
      default:
        return firstItem.id.localeCompare(secondItem.id);
    }
  });

  const { items, actions, collectionProps, filterProps, filteredItemsCount, paginationProps } = useCollection(
    sortedItems,
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
          <div className={styles['input-container']}>
            <div className={styles['input-filter']}>
              <TextFilter
                {...filterProps}
                countText={getMatchesCountText(filteredItemsCount!)}
                filteringAriaLabel="Filter instances"
              />
            </div>
            <div className={styles['select-filter']}>
              <Select
                selectedOption={sortingProperty}
                options={sortingOptions}
                onChange={event => setSortingProperty(event.detail.selectedOption)}
              />
              <SegmentedControl
                label="Sorting order"
                selectedId={sortingOrder}
                options={[
                  { id: 'ascending', iconSvg: iconAscending },
                  { id: 'descending', iconSvg: iconDescending },
                ]}
                onChange={event => setSortingOrder(event.detail.selectedId)}
              />
            </div>
          </div>
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
