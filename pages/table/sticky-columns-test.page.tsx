// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Table, { TableProps } from '~components/table';
import SpaceBetween from '~components/space-between';
import Header from '~components/header';
import ScreenshotArea from '../utils/screenshot-area';
import CollectionPreferences, { CollectionPreferencesProps } from '~components/collection-preferences';

export default () => {
  const COLUMN_DEFINITIONS: TableProps.ColumnDefinition<any>[] = [
    {
      id: 'variable',
      header: 'Variable name',
      minWidth: 176,
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
      id: 'description-20',
      header: 'Description',
      cell: item => item.description || '-',
    },
    {
      id: 'description-30',
      header: 'Description',
      cell: item => item.description || '-',
    },
    {
      id: 'description-40',
      header: 'Description',
      cell: item => item.description || '-',
    },
    {
      id: 'description-50',
      header: 'Description',
      cell: item => item.description || '-',
    },
    {
      id: 'description-60',
      header: 'Description',
      cell: item => item.description || '-',
    },
    {
      id: 'description-70',
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

  const [preferences, setPreferences] = React.useState<CollectionPreferencesProps.Preferences>({
    stickyColumns: { start: 2, end: 1 },
  });

  return (
    <ScreenshotArea>
      <SpaceBetween size="xl">
        {/* <Table
          stickyColumns={preferences.stickyColumns}
          columnDefinitions={COLUMN_DEFINITIONS}
          resizableColumns={true}
          items={ITEMS}
          sortingDisabled={true}
          preferences={
            <CollectionPreferences
              title="Preferences"
              confirmLabel="Confirm"
              cancelLabel="Cancel"
              onConfirm={({ detail }) => setPreferences(detail)}
              preferences={preferences}
              stickyColumnsPreference={{
                startColumns: {
                  title: 'Stick first visible column(s)',
                  description: 'Keep the first column(s) visible while horizontally scrolling table content.',
                  options: [
                    { label: 'None', value: 0 },
                    { label: 'First visible column', value: 1 },
                    { label: 'First two visible columns', value: 2 },
                  ],
                },
                endColumns: {
                  title: 'Stick last visible column',
                  description: 'Keep the last column visible when tables are wider than the viewport.',
                  options: [
                    { label: 'None', value: 0 },
                    { label: 'Last visible column', value: 1 },
                  ],
                },
              }}
            />
          }
          header={<Header>Simple table</Header>}
        /> */}
        <Table
          selectionType="multi"
          trackBy={item => item.alt}
          stickyColumns={preferences.stickyColumns}
          columnDefinitions={COLUMN_DEFINITIONS}
          items={ITEMS}
          sortingDisabled={true}
          preferences={
            <CollectionPreferences
              title="Preferences"
              confirmLabel="Confirm"
              cancelLabel="Cancel"
              onConfirm={({ detail }) => setPreferences(detail)}
              preferences={preferences}
              stickyColumnsPreference={{
                startColumns: {
                  title: 'Stick first visible column(s)',
                  description: 'Keep the first column(s) visible while horizontally scrolling table content.',
                  options: [
                    { label: 'None', value: 0 },
                    { label: 'First visible column', value: 1 },
                    { label: 'First two visible columns', value: 2 },
                  ],
                },
                endColumns: {
                  title: 'Stick last visible column',
                  description: 'Keep the last column visible when tables are wider than the viewport.',
                  options: [
                    { label: 'None', value: 0 },
                    { label: 'Last visible column', value: 1 },
                  ],
                },
              }}
            />
          }
          header={<Header>Simple table with selection type `multi`</Header>}
        />
      </SpaceBetween>
    </ScreenshotArea>
  );
};
