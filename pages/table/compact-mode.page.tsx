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
    contentDensity: 'compact',
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
  const [inlineEditTableDensity, setInlineEditTableDensity] = useState('compact' as 'comfortable' | 'compact');
  const [stickyHeaderTableDensity, setStickyHeaderTableDensity] = useState('compact' as 'comfortable' | 'compact');

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
        <h2>Table with inline edit</h2>
        <button
          aria-label="Toggle inline edit table content density"
          onClick={() =>
            setInlineEditTableDensity(inlineEditTableDensity === 'comfortable' ? 'compact' : 'comfortable')
          }
        >
          Toggle inline edit table content density
        </button>
        <Table
          columnDefinitions={[
            {
              id: 'variable',
              header: 'Variable name',
              minWidth: 176,
              cell: item => {
                return item.name;
              },
              editConfig: {
                ariaLabel: 'Name',
                editIconAriaLabel: 'editable',
                errorIconAriaLabel: 'Name Error',
                editingCell: (item, { currentValue, setValue }) => {
                  return (
                    <Input
                      autoFocus={true}
                      value={currentValue ?? item.name}
                      onChange={event => setValue(event.detail.value)}
                    />
                  );
                },
              },
            },
            {
              id: 'type',
              header: 'Type',
              minWidth: 176,
              editConfig: {
                ariaLabel: 'Type',
                editIconAriaLabel: 'editable',
                editingCell: (item, { currentValue, setValue }) => {
                  const value = currentValue ?? item.type;
                  return (
                    <Select
                      autoFocus={true}
                      selectedOption={
                        [
                          { label: '1A', value: '1A' },
                          { label: '1B', value: '1B' },
                          { label: '2A', value: '2A' },
                          { label: '2B', value: '2B' },
                        ].find(option => option.value === value) ?? null
                      }
                      onChange={event => {
                        setValue(event.detail.selectedOption.value ?? item.type);
                      }}
                      options={[
                        { label: '1A', value: '1A' },
                        { label: '1B', value: '1B' },
                        { label: '2A', value: '2A' },
                        { label: '2B', value: '2B' },
                      ]}
                    />
                  );
                },
              },
              cell: item => {
                return item.type;
              },
            },
            {
              id: 'description',
              header: 'Description',
              cell: e => e.description,
            },
          ]}
          items={[
            {
              name: 'Item 1',
              alt: 'First',
              description: 'This is the first item',
              type: '1A',
              size: 'Small',
            },
            {
              name: 'Item 2',
              alt: 'Second',
              description: 'This is the second item',
              type: '1B',
              size: 'Large',
            },
            {
              name: 'Item 3',
              alt: 'Third',
              description: '-',
              type: '1A',
              size: 'Large',
            },
            {
              name: 'Item 4',
              alt: 'Fourth',
              description: 'This is the fourth item',
              type: '2A',
              size: 'Small',
            },
            {
              name: 'Item 5',
              alt: '-',
              description: 'This is the fifth item with a longer description',
              type: '2A',
              size: 'Large',
            },
            {
              name: 'Item 6',
              alt: 'Sixth',
              description: 'This is the sixth item',
              type: '1A',
              size: 'Small',
            },
          ]}
          loadingText="Loading resources"
          submitEdit={async () => {
            await new Promise(e => setTimeout(e, 1e3));
          }}
          ariaLabels={{
            tableLabel: 'Distributions',
            activateEditLabel: (column, item) => `Edit ${item.name} ${column.header}`,
            cancelEditLabel: column => `Cancel editing ${column.header}`,
            submitEditLabel: column => `Submit edit ${column.header}`,
            submittingEditText: () => 'Loading edit response',
            successfulEditLabel: () => 'Edit successful',
          }}
          contentDensity={inlineEditTableDensity}
          empty={
            <Box textAlign="center" color="inherit">
              <b>No resources</b>
              <Box padding={{ bottom: 's' }} variant="p" color="inherit">
                No resources to display.
              </Box>
              <Button>Create resource</Button>
            </Box>
          }
          header={<Header>Table with inline editing</Header>}
        />

        <h2>Sticky header table variants</h2>
        {variantButtons}
        <button
          aria-label="Toggle sticky header table content density"
          onClick={() =>
            setStickyHeaderTableDensity(stickyHeaderTableDensity === 'comfortable' ? 'compact' : 'comfortable')
          }
        >
          Toggle sticky header table content density
        </button>
        <Table
          header={<Header headingTagOverride="h1">Sticky header table</Header>}
          columnDefinitions={columnsConfig}
          items={items}
          stickyHeader={true}
          variant={variant}
          contentDensity={stickyHeaderTableDensity}
        />
        <div style={{ blockSize: '90vh', padding: 10 }}>Placeholder to allow page scroll beyond table</div>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
