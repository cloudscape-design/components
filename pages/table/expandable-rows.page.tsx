// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import Table, { TableProps } from '~components/table';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import Input from '~components/input';
import Link from '~components/link';
import ScreenshotArea from '../utils/screenshot-area';
import { columnsConfig } from './shared-configs';
import { generateItems, Instance } from './generate-data';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { Checkbox, FormField, Select } from '~components';
import AppContext, { AppContextType } from '../app/app-context';
import pseudoRandom from '../utils/pseudo-random';

type DemoContext = React.Context<
  AppContextType<{
    resizableColumns: boolean;
    stickyHeader: boolean;
    sortingDisabled: boolean;
    selectionType: undefined | 'single' | 'multi';
    stickyColumnsFirst: string;
  }>
>;

interface ExtendedInstance extends Instance {
  level?: number;
  parentId?: string;
  name: string;
  alt: string;
  description: string;
}

function getName(previousName: string, index: number) {
  return `${previousName}-${index + 1}`;
}

function getAlt(name: string) {
  const last = name.split('-').reverse()[0];
  return getDescription(last);
}

function getDescription(name: string) {
  return name
    .replace(/10/g, 'ten')
    .replace(/9/g, 'nine')
    .replace(/8/g, 'eight')
    .replace(/7/g, 'seven')
    .replace(/6/g, 'six')
    .replace(/5/g, 'five')
    .replace(/4/g, 'four')
    .replace(/3/g, 'three')
    .replace(/2/g, 'two')
    .replace(/1/g, 'one')
    .replace(/-/g, ' ');
}

let allItems: ExtendedInstance[] = generateItems(10).map((it, index) => ({
  ...it,
  level: 0,
  name: getName('Item', index),
  alt: getAlt(getName('Item', index)),
  description: getDescription(getName('Item', index)),
}));
for (let iteration = 0; iteration < 5; iteration++) {
  allItems = allItems.flatMap(parent => {
    const childrenCount = parent.level === iteration ? Math.floor(pseudoRandom() * 10) : 0;
    return [
      parent,
      ...generateItems(childrenCount).map((item, index) => ({
        ...item,
        level: iteration + 1,
        parentId: parent.id,
        name: getName(parent.name, index),
        alt: getAlt(getName(parent.name, index)),
        description: getDescription(getName(parent.name, index)),
      })),
    ];
  });
}

const COLUMN_DEFINITIONS: TableProps.ColumnDefinition<ExtendedInstance>[] = [
  {
    id: 'variable',
    header: 'Name',
    minWidth: 200,
    cell: item => {
      return item.name;
    },
    sortingField: 'variable',
  },
  {
    id: 'description',
    header: 'Description',
    cell: item => item.description || '-',
    sortingField: 'description',
  },
  {
    id: 'description-2',
    header: 'Description',
    cell: item => item.description || '-',
    sortingField: 'description',
  },
  {
    id: 'description-3',
    header: 'Description',
    cell: item => item.description || '-',
    sortingField: 'description',
  },
  {
    id: 'description-4',
    header: 'Description',
    cell: item => item.description || '-',
    sortingField: 'description',
  },
  {
    id: 'description-5',
    header: 'Description',
    cell: item => item.description || '-',
    sortingField: 'description',
  },
  {
    id: 'description-6',
    header: 'Description',
    cell: item => item.description || '-',
    sortingField: 'description',
  },
  {
    id: 'description-7',
    header: 'Description',
    cell: item => item.description || '-',
    sortingField: 'description',
  },
  {
    id: 'description-8',
    header: 'Description',
    cell: item => item.description || '-',
    sortingField: 'description',
  },
  {
    id: 'description-9',
    header: 'Description',
    cell: item => item.description || '-',
    sortingField: 'description',
  },
  {
    id: 'description-10',
    header: 'Description',
    cell: item => <Link href="#">Link: {item.description}</Link> || '-',
    sortingField: 'description',
  },
  {
    id: 'description-11',
    header: 'Description',
    cell: item => item.description || '-',
    sortingField: 'description',
  },
  {
    id: 'description-12',
    minWidth: 200,
    header: 'Description',
    cell: item => item.description || '-',
    sortingField: 'description',
  },
];

const ariaLabels: TableProps<ExtendedInstance>['ariaLabels'] = {
  selectionGroupLabel: 'group label',
  activateEditLabel: column => `Edit ${column.header}`,
  cancelEditLabel: column => `Cancel editing ${column.header}`,
  submitEditLabel: column => `Submit edit ${column.header}`,
  allItemsSelectionLabel: ({ selectedItems }) =>
    `${selectedItems.length} ${selectedItems.length === 1 ? 'item' : 'items'} selected`,
  itemSelectionLabel: ({ selectedItems }, item) => {
    const isItemSelected = selectedItems.filter(i => i.name === item.name).length;
    return `${item.name} is ${isItemSelected ? '' : 'not'} selected`;
  },
  tableLabel: 'Demo table',
};

const selectionTypeOptions = [{ value: 'none' }, { value: 'single' }, { value: 'multi' }];

const stickyColumnsOptions = [{ value: '0' }, { value: '1' }, { value: '2' }, { value: '3' }];

export default () => {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const { items, collectionProps } = useCollection(allItems, {
    pagination: { pageSize: 999 },
    sorting: {},
    expandableRows: {
      getId: item => item.id,
      getParentId: item => item.parentId ?? null,
    },
  });
  return (
    <ScreenshotArea>
      <h1>Expandable rows</h1>
      <SpaceBetween size="xl">
        <SpaceBetween direction="horizontal" size="m">
          <FormField label="Table flags">
            <Checkbox
              checked={urlParams.resizableColumns}
              onChange={event => setUrlParams({ resizableColumns: event.detail.checked })}
            >
              Resizable columns
            </Checkbox>

            <Checkbox
              checked={urlParams.stickyHeader}
              onChange={event => setUrlParams({ stickyHeader: event.detail.checked })}
            >
              Sticky header
            </Checkbox>

            <Checkbox
              checked={urlParams.sortingDisabled}
              onChange={event => setUrlParams({ sortingDisabled: event.detail.checked })}
            >
              Sorting disabled
            </Checkbox>
          </FormField>

          <FormField label="Selection type">
            <Select
              selectedOption={
                selectionTypeOptions.find(option => option.value === urlParams.selectionType) ?? selectionTypeOptions[0]
              }
              options={selectionTypeOptions}
              onChange={event =>
                setUrlParams({
                  selectionType:
                    event.detail.selectedOption.value === 'single' || event.detail.selectedOption.value === 'multi'
                      ? event.detail.selectedOption.value
                      : undefined,
                })
              }
            />
          </FormField>

          <FormField label="Sticky columns first">
            <Select
              selectedOption={
                stickyColumnsOptions.find(option => option.value === urlParams.stickyColumnsFirst) ??
                stickyColumnsOptions[0]
              }
              options={stickyColumnsOptions}
              onChange={event => setUrlParams({ stickyColumnsFirst: event.detail.selectedOption.value })}
            />
          </FormField>
        </SpaceBetween>

        <Table
          {...collectionProps}
          data-test-id="small-table"
          stickyColumns={{
            first: parseInt(urlParams.stickyColumnsFirst || '0'),
          }}
          {...urlParams}
          columnDefinitions={columnsConfig}
          selectedItems={selectedItems}
          onSelectionChange={({ detail: { selectedItems } }) => setSelectedItems(selectedItems)}
          items={items}
          ariaLabels={{ ...ariaLabels, tableLabel: 'Small table' }}
          header={<Header>Simple table</Header>}
        />
        <Table
          {...collectionProps}
          data-test-id="large-table"
          stickyColumns={{
            first: parseInt(urlParams.stickyColumnsFirst || '0'),
          }}
          {...urlParams}
          ariaLabels={{ ...ariaLabels, tableLabel: 'Large table' }}
          columnDefinitions={COLUMN_DEFINITIONS}
          selectedItems={selectedItems}
          onSelectionChange={({ detail: { selectedItems } }) => setSelectedItems(selectedItems)}
          items={items}
          header={<Header>Large table</Header>}
        />
        <Table
          {...collectionProps}
          data-test-id="inline-editing-table"
          stickyColumns={{
            first: parseInt(urlParams.stickyColumnsFirst || '0'),
          }}
          {...urlParams}
          columnDefinitions={[
            {
              id: 'inline-edit-start',
              header: 'Edit first cells',
              cell: item => item.alt || '-',
              editConfig: {
                ariaLabel: 'Edit first cell',
                editIconAriaLabel: 'editable',
                errorIconAriaLabel: 'Edit first cell error',
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
          selectedItems={selectedItems}
          onSelectionChange={({ detail: { selectedItems } }) => setSelectedItems(selectedItems)}
          items={items}
          ariaLabels={{ ...ariaLabels, tableLabel: 'Inline editing table' }}
          header={<Header>Large table with inline editing</Header>}
        />
      </SpaceBetween>
    </ScreenshotArea>
  );
};
