// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';

import Box from '~components/box';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import { ButtonDropdownProps } from '~components/button-dropdown/interfaces';
import CollectionPreferences, { CollectionPreferencesProps } from '~components/collection-preferences';
import Header from '~components/header';
import Link from '~components/link';
import Pagination from '~components/pagination';
import SpaceBetween from '~components/space-between';
import Table, { TableProps } from '~components/table';
import TextFilter from '~components/text-filter';

import { contentDisplayPreferenceI18nStrings } from '../common/i18n-strings';
import ScreenshotArea from '../utils/screenshot-area';
import { allFunctions, LambdaFunction } from './selection-controller-data';
import { paginationLabels } from './shared-configs';

const columnDefinitions: TableProps.ColumnDefinition<LambdaFunction>[] = [
  {
    id: 'name',
    header: 'Function name',
    cell: item => <Link href={`#${item.name}`}>{item.name}</Link>,
    sortingField: 'name',
  },
  {
    id: 'description',
    header: 'Description',
    cell: item => item.description,
    sortingField: 'description',
  },
  {
    id: 'packageType',
    header: 'Package type',
    cell: item => item.packageType,
    sortingField: 'packageType',
  },
  {
    id: 'runtime',
    header: 'Runtime',
    cell: item => item.runtime,
    sortingField: 'runtime',
  },
  {
    id: 'type',
    header: 'Type',
    cell: item => item.type,
    sortingField: 'type',
  },
  {
    id: 'lastModified',
    header: 'Last modified',
    cell: item => item.lastModified,
    sortingField: 'lastModified',
  },
];

const contentDisplayPreference = {
  title: 'Column preferences',
  description: 'Customize the columns visibility and order.',
  options: [
    { id: 'name', label: 'Function name', alwaysVisible: true },
    { id: 'description', label: 'Description' },
    { id: 'packageType', label: 'Package type' },
    { id: 'runtime', label: 'Runtime' },
    { id: 'type', label: 'Type' },
    { id: 'lastModified', label: 'Last modified' },
  ],
  ...contentDisplayPreferenceI18nStrings,
};

const defaultPreferences: CollectionPreferencesProps.Preferences = {
  pageSize: 10,
  contentDisplay: [
    { id: 'name', visible: true },
    { id: 'description', visible: true },
    { id: 'packageType', visible: true },
    { id: 'runtime', visible: true },
    { id: 'type', visible: true },
    { id: 'lastModified', visible: true },
  ],
  wrapLines: false,
};

function EmptyState({ action }: { action: React.ReactNode }) {
  return (
    <Box textAlign="center" color="inherit">
      <Box variant="strong" textAlign="center" color="inherit">
        No functions
      </Box>
      <Box variant="p" padding={{ bottom: 's' }} color="inherit">
        No functions to display.
      </Box>
      {action}
    </Box>
  );
}

function NoMatchState({ onClearFilter }: { onClearFilter: () => void }) {
  return (
    <Box textAlign="center" color="inherit">
      <Box variant="strong" textAlign="center" color="inherit">
        No matches
      </Box>
      <Box variant="p" padding={{ bottom: 's' }} color="inherit">
        We can&apos;t find a match.
      </Box>
      <Button onClick={onClearFilter}>Clear filter</Button>
    </Box>
  );
}

export default function SelectionControllerPage() {
  return (
    <ScreenshotArea disableAnimations={true}>
      <FunctionsTable />
    </ScreenshotArea>
  );
}

function FunctionsTable() {
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>(defaultPreferences);
  const [selectedItems, setSelectedItems] = useState<LambdaFunction[]>([]);

  const { items, actions, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(
    allFunctions,
    {
      filtering: {
        empty: <EmptyState action={<Button>Create function</Button>} />,
        noMatch: <NoMatchState onClearFilter={() => actions.setFiltering('')} />,
      },
      pagination: { pageSize: preferences.pageSize },
      sorting: { defaultState: { sortingColumn: columnDefinitions[3], isDescending: false } },
    }
  );

  // Wrap collectionProps callbacks to reset selection on pagination, sorting, filtering changes.
  const wrappedCollectionProps = {
    ...collectionProps,
    onSortingChange: (event: any) => {
      setSelectedItems([]);
      collectionProps.onSortingChange?.(event);
    },
  };

  const wrappedPaginationProps = {
    ...paginationProps,
    onChange: (event: any) => {
      setSelectedItems([]);
      paginationProps.onChange?.(event);
    },
  };

  const wrappedFilterProps = {
    ...filterProps,
    onChange: (event: any) => {
      setSelectedItems([]);
      filterProps!.onChange?.(event);
    },
  };

  // Helper: check if all visible items matching a predicate are selected
  const allMatchingSelected = (predicate: (f: LambdaFunction) => boolean) => {
    const matching = items.filter(predicate);
    return matching.length > 0 && matching.every(f => selectedItems.some(s => s.name === f.name));
  };

  // Helper: check if any visible items match a predicate
  const hasMatchingItems = (predicate: (f: LambdaFunction) => boolean) => items.some(predicate);

  // Build selection controller items with dynamic checked state
  const selectionControllerItems: ButtonDropdownProps.Items = [
    {
      text: 'By runtime',
      items: [
        {
          id: 'nodejs',
          text: 'Node.js',
          itemType: 'checkbox',
          checked: allMatchingSelected(f => f.runtime.startsWith('Node.js')),
          disabled: !hasMatchingItems(f => f.runtime.startsWith('Node.js')),
        },
        {
          id: 'python',
          text: 'Python',
          itemType: 'checkbox',
          checked: allMatchingSelected(f => f.runtime.startsWith('Python')),
          disabled: !hasMatchingItems(f => f.runtime.startsWith('Python')),
        },
        {
          id: 'java',
          text: 'Java',
          itemType: 'checkbox',
          checked: allMatchingSelected(f => f.runtime.startsWith('Java')),
          disabled: !hasMatchingItems(f => f.runtime.startsWith('Java')),
        },
        {
          id: 'go',
          text: 'Go',
          itemType: 'checkbox',
          checked: allMatchingSelected(f => f.runtime.startsWith('Go')),
          disabled: !hasMatchingItems(f => f.runtime.startsWith('Go')),
        },
      ],
    },
    {
      text: 'By package type',
      items: [
        {
          id: 'zip',
          text: 'Zip',
          itemType: 'checkbox',
          checked: allMatchingSelected(f => f.packageType === 'Zip'),
          disabled: !hasMatchingItems(f => f.packageType === 'Zip'),
        },
        {
          id: 'image',
          text: 'Image',
          itemType: 'checkbox',
          checked: allMatchingSelected(f => f.packageType === 'Image'),
          disabled: !hasMatchingItems(f => f.packageType === 'Image'),
        },
      ],
    },
  ];

  const handleSelectionControllerItemClick: TableProps['onSelectionControllerItemClick'] = ({ detail }) => {
    const predicates: Record<string, (f: LambdaFunction) => boolean> = {
      nodejs: f => f.runtime.startsWith('Node.js'),
      python: f => f.runtime.startsWith('Python'),
      java: f => f.runtime.startsWith('Java'),
      go: f => f.runtime.startsWith('Go'),
      zip: f => f.packageType === 'Zip',
      image: f => f.packageType === 'Image',
    };
    const predicate = predicates[detail.id];
    if (predicate) {
      const matching = items.filter(predicate);
      // detail.checked is the NEW state after the click
      if (detail.checked) {
        // Toggled ON — add matching items to selection
        setSelectedItems(prev => {
          const existing = new Set(prev.map(s => s.name));
          return [...prev, ...matching.filter(m => !existing.has(m.name))];
        });
      } else {
        // Toggled OFF — remove matching items from selection
        setSelectedItems(prev => prev.filter(s => !matching.some(m => m.name === s.name)));
      }
    }
  };

  const singleSelected = selectedItems.length === 1;
  const hasSelection = selectedItems.length > 0;

  return (
    <Table<LambdaFunction>
      {...wrappedCollectionProps}
      header={
        <Header
          counter={`(${selectedItems.length} / ${allFunctions.length})`}
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <ButtonDropdown
                items={[
                  { id: 'view-details', text: 'View details', disabled: !singleSelected },
                  { id: 'test', text: 'Test', disabled: !singleSelected },
                  { id: 'delete', text: 'Delete', disabled: !hasSelection },
                ]}
                onItemClick={() => {}}
                disabled={!hasSelection}
              >
                Actions
              </ButtonDropdown>
              <Button variant="primary">Create function</Button>
            </SpaceBetween>
          }
        >
          Functions
        </Header>
      }
      columnDefinitions={columnDefinitions}
      items={items}
      selectionType="multi"
      selectedItems={selectedItems}
      onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
      trackBy="name"
      ariaLabels={{
        selectionGroupLabel: 'Function selection',
        allItemsSelectionLabel: ({ selectedItems }) =>
          `${selectedItems.length} ${selectedItems.length === 1 ? 'function' : 'functions'} selected`,
        itemSelectionLabel: ({ selectedItems }, item) =>
          `${item.name} is ${selectedItems.indexOf(item) < 0 ? 'not ' : ''}selected`,
        tableLabel: 'Functions',
        selectionControllerLabel: 'Function selection options',
      }}
      selectionControllerItems={selectionControllerItems}
      onSelectionControllerItemClick={handleSelectionControllerItemClick}
      stickyHeader={true}
      pagination={<Pagination {...wrappedPaginationProps} ariaLabels={paginationLabels} />}
      filter={
        <TextFilter
          {...wrappedFilterProps}
          countText={`${filteredItemsCount} ${filteredItemsCount === 1 ? 'match' : 'matches'}`}
          filteringAriaLabel="Search by attributes or search by keyword"
          filteringPlaceholder="Search by attributes or search by keyword"
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
            options: [
              { value: 10, label: '10 Functions' },
              { value: 20, label: '20 Functions' },
              { value: 50, label: '50 Functions' },
            ],
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
    />
  );
}
