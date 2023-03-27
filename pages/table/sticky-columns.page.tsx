// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';
import Link from '~components/link';
import Table, { TableProps } from '~components/table';
import Input from '~components/input';
import SpaceBetween from '~components/space-between';
import Select, { SelectProps } from '~components/select';
import Box from '~components/box';
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
      id: 'alt',
      header: 'Text value',
      cell: item => item.alt || '-',
      sortingField: 'alt',
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
      id: 'description-3',
      header: 'Description',
      cell: item => <Link href="#">{item.description}</Link> || '-',
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

  const [leftSticky, setLeftSticky] = React.useState<SelectProps.Option>({ label: 'First visible column', value: '1' });
  const [rightSticky, setRightSticky] = React.useState<SelectProps.Option>({
    label: 'Last visible column',
    value: '1',
  });
  const [preferences, setPreferences] = React.useState<CollectionPreferencesProps.Preferences>({
    stickyColumns: { start: 1, end: 1 },
  });

  const [stickyColumns, setStickyColumns] = React.useState<TableProps.StickyColumns>({ start: 1, end: 1 });

  useEffect(() => {
    setStickyColumns({
      start: Number(leftSticky.value) as unknown as 0 | 1 | 2,
      end: Number(rightSticky.value) as unknown as 0 | 1,
    });
  }, [leftSticky, rightSticky, preferences]);
  return (
    <ScreenshotArea>
      <SpaceBetween size="xl">
        <Table
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
          header={<Header>Simple table</Header>}
        />
        <Table
          stickyColumns={preferences.stickyColumns}
          columnDefinitions={COLUMN_DEFINITIONS}
          items={ITEMS}
          variant="embedded"
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
          header={<Header>Embedded table</Header>}
        />

        <Table
          selectionType="single"
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
          header={<Header>Simple table with selection type `single`</Header>}
        />
        <Table
          selectionType="multi"
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
        <Table
          resizableColumns={true}
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
          header={<Header>Table with resizable columns</Header>}
        />

        <Table
          stickyColumns={stickyColumns}
          stickyHeader={true}
          columnDefinitions={[
            {
              id: 'inline-edit-start',
              header: 'Edit cells',
              cell: item => item.alt || '-',
              sortingField: 'alt',
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
            ...COLUMN_DEFINITIONS,
            {
              id: 'inline-edit-end',
              header: 'Edit cells',
              cell: item => item.alt || '-',
              sortingField: 'alt',
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
          ]}
          items={[...ITEMS]}
          sortingDisabled={true}
          header={<Header>Table with sticky inline editing</Header>}
        />
        <Box float="left">
          <SpaceBetween direction="horizontal" size="xl">
            <Box>
              Stick first visible column(s):
              <Select
                selectedOption={leftSticky}
                onChange={({ detail }) => setLeftSticky(detail.selectedOption)}
                options={[
                  { label: 'None', value: '0' },
                  { label: 'First visible column', value: '1' },
                  { label: 'First two visible columns', value: '2' },
                ]}
                selectedAriaLabel="Selected"
              />
            </Box>
            <Box>
              Stick last visible column:
              <Select
                selectedOption={rightSticky}
                onChange={({ detail }) => setRightSticky(detail.selectedOption)}
                options={[
                  { label: 'None', value: '0' },
                  { label: 'Last visible column', value: '1' },
                ]}
                selectedAriaLabel="Selected"
              />
            </Box>
          </SpaceBetween>
        </Box>

        <Table
          stickyColumns={stickyColumns}
          stickyHeader={true}
          columnDefinitions={COLUMN_DEFINITIONS}
          items={[...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS]}
          sortingDisabled={true}
          header={<Header>Table sticky header</Header>}
        />
      </SpaceBetween>
      <Table
        stickyColumns={preferences.stickyColumns}
        columnDefinitions={COLUMN_DEFINITIONS}
        items={ITEMS}
        variant="stacked"
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
        header={<Header>Stacked table</Header>}
      />
      <Table
        stickyColumns={preferences.stickyColumns}
        columnDefinitions={COLUMN_DEFINITIONS}
        items={ITEMS}
        variant="stacked"
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
        header={<Header>Stacked table</Header>}
      />
    </ScreenshotArea>
  );
};
