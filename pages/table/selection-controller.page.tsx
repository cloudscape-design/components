// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';

import Alert from '~components/alert';
import Box from '~components/box';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
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

  { id: 'description', header: 'Description', cell: item => item.description, sortingField: 'description' },
  { id: 'packageType', header: 'Package type', cell: item => item.packageType, sortingField: 'packageType' },
  { id: 'runtime', header: 'Runtime', cell: item => item.runtime, sortingField: 'runtime' },
  { id: 'type', header: 'Type', cell: item => item.type, sortingField: 'type' },
  { id: 'lastModified', header: 'Last modified', cell: item => item.lastModified, sortingField: 'lastModified' },
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

const predicates: Record<string, (f: LambdaFunction) => boolean> = {
  nodejs: f => f.runtime.startsWith('Node.js'),
  python: f => f.runtime.startsWith('Python'),
  java: f => f.runtime.startsWith('Java'),
  go: f => f.runtime.startsWith('Go'),
  zip: f => f.packageType === 'Zip',
  image: f => f.packageType === 'Image',
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

  const { items, actions, filteredItemsCount, crossPageSelectionState, collectionProps, filterProps, paginationProps } =
    useCollection(allFunctions, {
      filtering: {
        empty: <EmptyState action={<Button>Create function</Button>} />,
        noMatch: <NoMatchState onClearFilter={() => actions.setFiltering('')} />,
      },
      pagination: { pageSize: preferences.pageSize },
      sorting: { defaultState: { sortingColumn: columnDefinitions[3], isDescending: false } },
      selection: {
        trackBy: 'name',
        crossPageSelection: {},
        selectionControllerItems: (visibleItems, selectedItems) => {
          const allSelected = (pred: (f: LambdaFunction) => boolean) => {
            const m = visibleItems.filter(pred);
            return m.length > 0 && m.every(f => selectedItems.some(s => s.name === f.name));
          };
          const has = (pred: (f: LambdaFunction) => boolean) => visibleItems.some(pred);
          return [
            {
              text: 'By runtime',
              items: [
                {
                  id: 'nodejs',
                  text: 'Node.js',
                  itemType: 'checkbox' as const,
                  checked: allSelected(predicates.nodejs),
                  disabled: !has(predicates.nodejs),
                },
                {
                  id: 'python',
                  text: 'Python',
                  itemType: 'checkbox' as const,
                  checked: allSelected(predicates.python),
                  disabled: !has(predicates.python),
                },
                {
                  id: 'java',
                  text: 'Java',
                  itemType: 'checkbox' as const,
                  checked: allSelected(predicates.java),
                  disabled: !has(predicates.java),
                },
                {
                  id: 'go',
                  text: 'Go',
                  itemType: 'checkbox' as const,
                  checked: allSelected(predicates.go),
                  disabled: !has(predicates.go),
                },
              ],
            },
            {
              text: 'By package type',
              items: [
                {
                  id: 'zip',
                  text: 'Zip',
                  itemType: 'checkbox' as const,
                  checked: allSelected(predicates.zip),
                  disabled: !has(predicates.zip),
                },
                {
                  id: 'image',
                  text: 'Image',
                  itemType: 'checkbox' as const,
                  checked: allSelected(predicates.image),
                  disabled: !has(predicates.image),
                },
              ],
            },
          ];
        },
        onSelectionControllerItemClick: (detail, visibleItems, hookActions) => {
          const pred = predicates[detail.id];
          if (!pred) {
            return;
          }
          const current = (collectionProps.selectedItems ?? []) as LambdaFunction[];
          const matching = visibleItems.filter(pred) as LambdaFunction[];
          if (detail.checked) {
            const existing = new Set(current.map(s => s.name));
            hookActions.setSelectedItems([...current, ...matching.filter(m => !existing.has(m.name))]);
          } else {
            hookActions.setSelectedItems(current.filter(s => !matching.some(m => m.name === s.name)));
          }
        },
      },
    });

  const selectedItems = collectionProps.selectedItems ?? [];
  const singleSelected = selectedItems.length === 1;
  const hasSelection = selectedItems.length > 0;

  // Cross-page selection notification — state computed by the hook
  let selectionNotification: React.ReactNode = undefined;
  if (crossPageSelectionState?.type === 'all-selected') {
    selectionNotification = (
      <Alert type="warning" dismissible={true} onDismiss={() => actions.setSelectedItems([])}>
        {crossPageSelectionState.totalCount} items are selected across the table.{' '}
        <Button variant="link" onClick={() => actions.setSelectedItems([])}>
          Clear selection.
        </Button>
      </Alert>
    );
  } else if (crossPageSelectionState?.type === 'page-selected') {
    selectionNotification = (
      <Alert type="info" dismissible={true} onDismiss={() => actions.setSelectedItems([])}>
        {crossPageSelectionState.pageCount} items selected on this page.{' '}
        <Button variant="link" onClick={() => actions.selectAllAcrossPages()}>
          Select {crossPageSelectionState.totalCount} items
        </Button>{' '}
        across the table.
      </Alert>
    );
  }

  return (
    <Table<LambdaFunction>
      {...collectionProps}
      selectionNotification={selectionNotification}
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
      stickyHeader={true}
      ariaLabels={{
        selectionGroupLabel: 'Function selection',
        allItemsSelectionLabel: ({ selectedItems }) =>
          `${selectedItems.length} ${selectedItems.length === 1 ? 'function' : 'functions'} selected`,
        itemSelectionLabel: ({ selectedItems }, item) =>
          `${item.name} is ${selectedItems.indexOf(item) < 0 ? 'not ' : ''}selected`,
        tableLabel: 'Functions',
        selectionControllerLabel: 'Function selection options',
      }}
      pagination={<Pagination {...paginationProps} ariaLabels={paginationLabels} />}
      filter={
        <TextFilter
          {...filterProps}
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
          contentDisplayPreference={{ ...contentDisplayPreference, ...contentDisplayPreferenceI18nStrings }}
          wrapLinesPreference={{ label: 'Wrap lines', description: 'Wrap lines description' }}
        />
      }
    />
  );
}
