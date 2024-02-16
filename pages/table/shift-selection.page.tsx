// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import { useCollection } from '@cloudscape-design/collection-hooks';
import Button from '~components/button';
import CollectionPreferences, { CollectionPreferencesProps } from '~components/collection-preferences';
import Header from '~components/header';
import Pagination from '~components/pagination';
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
import ScreenshotArea from '../utils/screenshot-area';
import { contentDisplayPreferenceI18nStrings } from '../common/i18n-strings';
import { Box, Checkbox } from '~components';
import AppContext, { AppContextType } from '../app/app-context';

type PageContext = React.Context<
  AppContextType<{
    enableKeyboardNavigation: boolean;
  }>
>;

const allItems = generateItems();
const ariaLabels: TableProps<Instance>['ariaLabels'] = {
  selectionGroupLabel: 'group label',
  allItemsSelectionLabel: ({ selectedItems }) => `${selectedItems.length} item selected`,
  itemSelectionLabel: ({ selectedItems }, item) =>
    `${item.id} is ${selectedItems.indexOf(item) < 0 ? 'not ' : ''}selected`,
};

export default function App() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
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
  const [selectedItems, setSelectedItems] = useState<any>([]);

  return (
    <Box>
      <Checkbox
        checked={urlParams.enableKeyboardNavigation}
        onChange={event => {
          setUrlParams({ enableKeyboardNavigation: event.detail.checked });
          window.location.reload();
        }}
      >
        Keyboard navigation
      </Checkbox>
      <ScreenshotArea>
        <Table<Instance>
          {...collectionProps}
          header={
            <Header headingTagOverride="h1" counter={`(${allItems.length})`}>
              Multiple selection and hooks
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
          selectedItems={selectedItems}
          selectionType={'multi'}
          trackBy={'id'}
          onSelectionChange={({ detail: { selectedItems } }) => setSelectedItems(selectedItems)}
          ariaLabels={ariaLabels}
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
          enableKeyboardNavigation={urlParams.enableKeyboardNavigation}
        />
      </ScreenshotArea>
    </Box>
  );
}
