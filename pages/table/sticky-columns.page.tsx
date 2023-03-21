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
    stickyColumns: { left: 1, right: 1 },
  });

  const [stickyColumns, setStickyColumns] = React.useState<TableProps.StickyColumns>({ left: 1, right: 1 });

  useEffect(() => {
    setStickyColumns({
      left: Number(leftSticky.value) as unknown as 0 | 1 | 2,
      right: Number(rightSticky.value) as unknown as 0 | 1,
    });
    console.log(preferences);
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
                leftColumns: {
                  title: 'Stick first visible column(s)',
                  description: 'Keep the first column(s) visible while horizontally scrolling table content.',
                  options: [
                    { label: 'None', value: 0 },
                    { label: 'First visible column', value: 1 },
                    { label: 'First two visible columns', value: 2 },
                  ],
                },
                rightColumns: {
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
          resizableColumns={true}
          stickyColumns={preferences.stickyColumns}
          stickyHeader={true}
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
                leftColumns: {
                  title: 'Stick first visible column(s)',
                  description: 'Keep the first column(s) visible while horizontally scrolling table content.',
                  options: [
                    { label: 'None', value: 0 },
                    { label: 'First visible column', value: 1 },
                    { label: 'First two visible columns', value: 2 },
                  ],
                },
                rightColumns: {
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

        {/* <Table
          stickyColumns={{ left: ['variable', 'alt'], right: ['descriptio7'] }}
          columnDefinitions={[
            {
              id: 'variable',
              header: 'Variable name',
              cell: item => item.name || '-',
              sortingField: 'name',
              width: '300px',
              minWidth: '300px',
              maxWidth: '300px',
            },
            {
              id: 'alt',
              header: 'Text value',
              cell: item => item.alt || '-',
              sortingField: 'alt',
            },
            {
              id: 'description',
              header: 'Description',
              cell: item => <Link href="#">{item.description}</Link> || '-',
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
              id: 'descriptio7',
              header: 'Description',
              cell: item => item.description || '-',
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
          sortingDisabled={true}
          empty={
            <Box textAlign="center" color="inherit">
              <b>No resources</b>
              <Box padding={{ bottom: 's' }} variant="p" color="inherit">
                No resources to display.
              </Box>
              <Button>Create resource</Button>
            </Box>
          }
          header={<Header>Table with 3 sticky columns</Header>}
        />
        <Table
          resizableColumns={true}
          columnDefinitions={[
            {
              id: 'variable',
              header: (
                <Box fontWeight="bold" color="text-body-secondary">
                  Variable name
                </Box>
              ),
              cell: item => item.name || '-',
              sortingField: 'name',
              width: '300px',
              minWidth: '300px',
              maxWidth: '300px',
            },
            {
              id: 'alt',
              header: (
                <Box fontWeight="bold" color="text-body-secondary">
                  Text value
                </Box>
              ),
              cell: item => item.alt || '-',
              width: '300px',
              minWidth: '300px',
              maxWidth: '300px',
              sortingField: 'alt',
            },
            {
              id: 'description',
              header: (
                <Box fontWeight="bold" color="text-body-secondary">
                  Description
                </Box>
              ),
              cell: item => item.description || '-',
            },
            {
              id: 'description-2',
              header: (
                <Box fontWeight="bold" color="text-body-secondary">
                  Description
                </Box>
              ),
              cell: item => item.description || '-',
            },
            {
              id: 'description-3',
              header: (
                <Box fontWeight="bold" color="text-body-secondary">
                  Description
                </Box>
              ),
              cell: item => item.description || '-',
            },
            {
              id: 'description-4',
              header: (
                <Box fontWeight="bold" color="text-body-secondary">
                  Description
                </Box>
              ),
              cell: item => item.description || '-',
            },
            {
              id: 'description-5',
              header: (
                <Box fontWeight="bold" color="text-body-secondary">
                  Description
                </Box>
              ),
              cell: item => item.description || '-',
            },
            {
              id: 'description-6',
              header: (
                <Box fontWeight="bold" color="text-body-secondary">
                  Description
                </Box>
              ),
              cell: item => item.description || '-',
            },
            {
              id: 'description-7',
              header: (
                <Box fontWeight="bold" color="text-body-secondary">
                  Description
                </Box>
              ),
              cell: item => item.description || '-',
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
          sortingDisabled={true}
          empty={
            <Box textAlign="center" color="inherit">
              <b>No resources</b>
              <Box padding={{ bottom: 's' }} variant="p" color="inherit">
                No resources to display.
              </Box>
              <Button>Create resource</Button>
            </Box>
          }
          header={<Header>Table with dynamic sticky columns and resizable columns</Header>}
        /> */}
      </SpaceBetween>
    </ScreenshotArea>
  );
};
