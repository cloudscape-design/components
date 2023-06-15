// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import { useCollection } from '@cloudscape-design/collection-hooks';
import Button from '~components/button';
import CollectionPreferences, { CollectionPreferencesProps } from '~components/collection-preferences';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import Pagination from '~components/pagination';
import Select from '~components/select';
import Box from '~components/box';
import Input from '~components/input';
import Table, { TableProps } from '~components/table';
import TextFilter from '~components/text-filter';
import { Instance, generateItems } from './generate-data';
import {
  columnsConfig,
  EmptyState,
  getMatchesCountText,
  paginationLabels,
  pageSizeOptions,
  contentDisplayPreference,
  defaultPreferences,
} from './shared-configs';
import { contentDisplayPreferenceI18nStrings } from '../common/i18n-strings';

const allItems = generateItems();
const ariaLabels: TableProps<Instance>['ariaLabels'] = {
  selectionGroupLabel: 'group label',
  allItemsSelectionLabel: ({ selectedItems }) => `${selectedItems.length} item selected`,
  itemSelectionLabel: ({ selectedItems }, item) =>
    `${item.id} is ${selectedItems.indexOf(item) < 0 ? 'not ' : ''}selected`,
};

export default function App() {
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>({
    ...defaultPreferences,
    // set to "compact" for default "compact density setting".
  });
  const [selectedItems, setSelectedItems] = React.useState<any>([]);

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

  const [variant, setVariant] = useState<TableProps.Variant>('container');
  const variants: TableProps.Variant[] = ['container', 'embedded', 'full-page', 'stacked', 'borderless'];

  const variantButtons = (
    <div style={{ paddingBottom: '10px', display: 'inline-flex', gap: '10px' }}>
      <b>Sticky header variant: </b>
      {variants.map((value, i) => {
        return (
          <label key={i} htmlFor={value}>
            <input
              type="radio"
              name="variant"
              id={value}
              value={value}
              onChange={() => setVariant(value)}
              checked={variant === value}
            />{' '}
            {value}
          </label>
        );
      })}
    </div>
  );
  return (
    <ScreenshotArea>
      <SpaceBetween size="l">
        <h2>Table with content density preferences</h2>
        <Table<Instance>
          {...collectionProps}
          header={
            <Header headingTagOverride="h1" counter={`(${allItems.length})`}>
              Instances
            </Header>
          }
          ariaLabels={ariaLabels}
          selectionType="multi"
          onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
          selectedItems={selectedItems}
          stripedRows={preferences.stripedRows}
          contentDensity={preferences.contentDensity}
          wrapLines={preferences.wrapLines}
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
          variant="full-page"
          columnDisplay={preferences.contentDisplay}
          footer={<a href="#">FOOTER</a>}
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
              stripedRowsPreference={{
                label: 'Striped rows',
                description: 'Striped rows description',
              }}
              contentDensityPreference={{
                label: 'Compact mode',
                description: 'Display content in a more compact, denser mode',
              }}
            />
          }
        />
        <Table<Instance>
          {...collectionProps}
          header={
            <Header headingTagOverride="h1" counter={`(${allItems.length})`}>
              Instances
            </Header>
          }
          ariaLabels={ariaLabels}
          selectionType="multi"
          onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
          selectedItems={selectedItems}
          stripedRows={preferences.stripedRows}
          contentDensity={preferences.contentDensity}
          wrapLines={preferences.wrapLines}
          columnDefinitions={columnsConfig}
          items={items}
          filter={
            <TextFilter
              {...filterProps!}
              countText={getMatchesCountText(filteredItemsCount!)}
              filteringAriaLabel="Filter instances"
            />
          }
          footer={'happy days'}
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
              stripedRowsPreference={{
                label: 'Striped rows',
                description: 'Striped rows description',
              }}
              contentDensityPreference={{
                label: 'Compact mode',
                description: 'Display content in a more compact, denser mode',
              }}
            />
          }
        />
        <Table<Instance>
          {...collectionProps}
          header={
            <Header headingTagOverride="h1" counter={`(${allItems.length})`}>
              Instances
            </Header>
          }
          ariaLabels={ariaLabels}
          selectionType="multi"
          onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
          selectedItems={selectedItems}
          stripedRows={preferences.stripedRows}
          contentDensity={preferences.contentDensity}
          wrapLines={preferences.wrapLines}
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
                ...contentDisplayPreference,
                ...contentDisplayPreferenceI18nStrings,
              }}
              wrapLinesPreference={{
                label: 'Wrap lines',
                description: 'Wrap lines description',
              }}
              stripedRowsPreference={{
                label: 'Striped rows',
                description: 'Striped rows description',
              }}
              contentDensityPreference={{
                label: 'Compact mode',
                description: 'Display content in a more compact, denser mode',
              }}
            />
          }
        />
      </SpaceBetween>
    </ScreenshotArea>
  );
}
