// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Table, { TableProps } from '~components/table';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import Input from '~components/input';
import Link from '~components/link';
import ScreenshotArea from '../utils/screenshot-area';
import CollectionPreferences, { CollectionPreferencesProps } from '~components/collection-preferences';

const COLUMN_DEFINITIONS: TableProps.ColumnDefinition<any>[] = [
  {
    id: 'variable',
    header: 'Simple table',
    minWidth: 200,
    cell: item => {
      return item.name;
    },
  },
  {
    id: 'description',
    header: 'Description',
    cell: item => item.description || '-',
  },
  {
    id: 'description-2',
    header: 'Description',
    cell: item => item.description || '-',
  },
  {
    id: 'description-3',
    header: 'Description',
    cell: item => item.description || '-',
  },
  {
    id: 'description-4',
    header: 'Description',
    cell: item => item.description || '-',
  },
  {
    id: 'description-5',
    header: 'Description',
    cell: item => item.description || '-',
  },
  {
    id: 'description-6',
    header: 'Description',
    cell: item => item.description || '-',
  },
  {
    id: 'description-7',
    header: 'Description',
    cell: item => item.description || '-',
  },
  {
    id: 'description-8',
    header: 'Description',
    cell: item => item.description || '-',
  },
  {
    id: 'description-9',
    header: 'Description',
    cell: item => item.description || '-',
  },
  {
    id: 'description-10',
    header: 'Description',
    cell: item => <Link href="#">Link: {item.description}</Link> || '-',
  },
  {
    id: 'description-11',
    header: 'Description',
    cell: item => item.description || '-',
  },
  {
    id: 'description-12',
    minWidth: 200,
    header: 'Description',
    cell: item => item.description || '-',
  },
];

const ITEMS = [
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
];

export default () => {
  const [preferences, setPreferences] = React.useState<CollectionPreferencesProps.Preferences>({
    stickyColumns: { first: 1, last: 1 },
  });

  return (
    <ScreenshotArea>
      <h1>Sticky columns</h1>
      <SpaceBetween size="xl">
        <Table
          data-test-id="simple"
          stickyColumns={{ first: 1, last: 1 }}
          columnDefinitions={COLUMN_DEFINITIONS}
          items={ITEMS}
          sortingDisabled={true}
          ariaLabels={{
            tableLabel: 'simple',
          }}
          header={<Header>Simple table</Header>}
        />
        <Table
          data-test-id="resizable"
          resizableColumns={true}
          stickyColumns={{ first: 1, last: 1 }}
          columnDefinitions={COLUMN_DEFINITIONS}
          items={ITEMS}
          sortingDisabled={true}
          ariaLabels={{
            tableLabel: 'Resizable',
          }}
          header={<Header>Resizable columns</Header>}
        />
        <Table
          data-test-id="with-collection-preferences"
          stickyColumns={preferences.stickyColumns}
          stickyHeader={true}
          preferences={
            <CollectionPreferences
              title="Preferences"
              confirmLabel="Confirm"
              cancelLabel="Cancel"
              onConfirm={({ detail }) => setPreferences(detail)}
              preferences={preferences}
              stickyColumnsPreference={{
                firstColumns: {
                  title: 'Stick first column(s)',
                  description: 'Keep the first column(s) visible while horizontally scrolling table content.',
                  options: [
                    { label: 'None', value: 0 },
                    { label: 'First column', value: 1 },
                    { label: 'First two columns', value: 2 },
                  ],
                },
                lastColumns: {
                  title: 'Stick last column',
                  description: 'Keep the last column visible while horizontally scrolling table content.',
                  options: [
                    { label: 'None', value: 0 },
                    { label: 'Last column', value: 1 },
                  ],
                },
              }}
            />
          }
          ariaLabels={{
            selectionGroupLabel: 'Items selection',
            allItemsSelectionLabel: ({ selectedItems }) =>
              `${selectedItems.length} ${selectedItems.length === 1 ? 'item' : 'items'} selected`,
            itemSelectionLabel: ({ selectedItems }, item) => {
              const isItemSelected = selectedItems.filter(i => i.name === item.name).length;
              return `${item.name} is ${isItemSelected ? '' : 'not'} selected`;
            },
            tableLabel: 'With collection preferences',
          }}
          columnDefinitions={COLUMN_DEFINITIONS}
          items={ITEMS}
          sortingDisabled={true}
          header={<Header>Simple table with collection preferences & sticky-header</Header>}
        />
        <Table
          data-test-id="inline-editing"
          stickyColumns={{ first: 1, last: 1 }}
          columnDefinitions={[
            {
              id: 'inline-edit-start',
              header: 'Edit first cells',
              cell: item => item.alt || '-',
              editConfig: {
                ariaLabel: 'Domain name',
                errorIconAriaLabel: 'Domain Name Error',
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
            ...COLUMN_DEFINITIONS,
            {
              id: 'inline-edit-end',
              header: 'Edit last cells',
              cell: item => item.alt || '-',
              sortingField: 'alt',
              editConfig: {
                ariaLabel: 'Edit cell last',
                editIconAriaLabel: 'editable',
                errorIconAriaLabel: 'Edit cell last error',
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
          ]}
          items={ITEMS}
          ariaLabels={{
            selectionGroupLabel: 'Items selection',
            allItemsSelectionLabel: ({ selectedItems }) =>
              `${selectedItems.length} ${selectedItems.length === 1 ? 'item' : 'items'} selected`,
            itemSelectionLabel: ({ selectedItems }, item) => {
              const isItemSelected = selectedItems.filter(i => i.name === item.name).length;
              return `${item.name} is ${isItemSelected ? '' : 'not'} selected`;
            },
            tableLabel: 'Inline editing',
          }}
          sortingDisabled={true}
          header={<Header>Inline editing columns</Header>}
        />
        <Table
          data-test-id="selection-single"
          selectionType="single"
          stickyColumns={{ first: 1, last: 1 }}
          columnDefinitions={COLUMN_DEFINITIONS}
          items={ITEMS}
          sortingDisabled={true}
          ariaLabels={{
            selectionGroupLabel: 'Items selection',
            allItemsSelectionLabel: ({ selectedItems }) =>
              `${selectedItems.length} ${selectedItems.length === 1 ? 'item' : 'items'} selected`,
            itemSelectionLabel: ({ selectedItems }, item) => {
              const isItemSelected = selectedItems.filter(i => i.name === item.name).length;
              return `${item.name} is ${isItemSelected ? '' : 'not'} selected`;
            },
            tableLabel: 'Selection type single',
          }}
          header={<Header>Selection type single</Header>}
        />
        <Table
          data-test-id="selection-multi"
          selectionType="multi"
          stickyColumns={{ first: 1, last: 1 }}
          columnDefinitions={COLUMN_DEFINITIONS}
          items={ITEMS}
          sortingDisabled={true}
          ariaLabels={{
            selectionGroupLabel: 'Items selection',
            allItemsSelectionLabel: ({ selectedItems }) =>
              `${selectedItems.length} ${selectedItems.length === 1 ? 'item' : 'items'} selected`,
            itemSelectionLabel: ({ selectedItems }, item) => {
              const isItemSelected = selectedItems.filter(i => i.name === item.name).length;
              return `${item.name} is ${isItemSelected ? '' : 'not'} selected`;
            },
            tableLabel: 'With 5 sticky columns',
          }}
          header={<Header>Selection type multi</Header>}
        />
        <Table
          data-test-id="focusable-element"
          stickyColumns={{ first: 3, last: 2 }}
          columnDefinitions={COLUMN_DEFINITIONS}
          items={ITEMS}
          sortingDisabled={true}
          header={<Header>With 5 sticky columns</Header>}
        />
      </SpaceBetween>
    </ScreenshotArea>
  );
};
