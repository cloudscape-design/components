// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import Table, { TableProps } from '~components/table';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import Input from '~components/input';
import Link from '~components/link';
import { generateItems, Instance } from './generate-data';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { Box, Checkbox, FormField, Pagination, Select, StatusIndicator } from '~components';
import AppContext, { AppContextType } from '../app/app-context';
import { columnLabel, stateToStatusIndicator } from './shared-configs';

type DemoContext = React.Context<
  AppContextType<{
    resizableColumns: boolean;
    stickyHeader: boolean;
    columnSorting: boolean;
    inlineEditing: boolean;
    selectionType: undefined | 'single' | 'multi';
    stickyColumnsFirst: string;
    stickyColumnsLast: string;
    tableRole: 'default' | 'table' | 'grid';
  }>
>;

interface ExtendedInstance extends Instance {
  name: string;
  alt: string;
  description: string;
}

const alts = ['First', 'Second', 'Third', 'Fourth', '-', 'Sixth', '-', '-', '-', '-'];

const descriptions = [
  'This is the first item',
  'This is the second item',
  '-',
  'This is the fourth item',
  'This is the fifth item with a longer description',
  'This is the sixth item',
  '-',
  '-',
  '-',
  '-',
];

const originalTableItems: ExtendedInstance[] = generateItems(50).map((it, index) => ({
  ...it,
  name: `Item ${index + 1}`,
  alt: alts[index],
  description: descriptions[index],
}));

const typeOptions = [...new Set(originalTableItems.map(item => item.type))].map(type => ({ value: type }));

const columnDefinitions: TableProps.ColumnDefinition<Instance>[] = [
  {
    id: 'id',
    header: 'ID',
    cell: item => <Link href={`#${item.id}`}>{item.id}</Link>,
    ariaLabel: columnLabel('id'),
    sortingField: 'id',
  },
  {
    id: 'type',
    header: 'Type',
    cell: item => item.type,
    ariaLabel: columnLabel('type'),
    sortingField: 'type',
    editConfig: {
      ariaLabel: 'Edit type',
      editIconAriaLabel: 'editable',
      errorIconAriaLabel: 'Edit type error',
      editingCell: (item, { currentValue, setValue }) => {
        return (
          <Select
            autoFocus={true}
            selectedOption={typeOptions.find(option => option.value === (currentValue ?? item.type)) ?? null}
            options={typeOptions}
            onChange={event => setValue(event.detail.selectedOption.value)}
          />
        );
      },
    },
  },
  {
    id: 'dnsName',
    header: 'DNS name',
    cell: item => item.dnsName || '-',
    ariaLabel: columnLabel('dnsName'),
    sortingField: 'dnsName',
    editConfig: {
      ariaLabel: 'Edit dnsName',
      editIconAriaLabel: 'editable',
      errorIconAriaLabel: 'Edit dnsName error',
      editingCell: (item, { currentValue, setValue }) => {
        return (
          <Input
            autoFocus={true}
            value={currentValue ?? item.dnsName}
            onChange={event => setValue(event.detail.value)}
          />
        );
      },
    },
  },
  {
    id: 'imageId',
    header: 'Image ID',
    cell: item => item.imageId,
    ariaLabel: columnLabel('imageId'),
    sortingField: 'imageId',
    editConfig: {
      ariaLabel: 'Edit imageId',
      editIconAriaLabel: 'editable',
      errorIconAriaLabel: 'Edit imageId error',
      editingCell: (item, { currentValue, setValue }) => {
        return (
          <Input
            autoFocus={true}
            value={currentValue ?? item.imageId}
            onChange={event => setValue(event.detail.value)}
          />
        );
      },
    },
  },
  {
    id: 'state',
    header: 'State',
    cell: item => <StatusIndicator {...stateToStatusIndicator[item.state]} />,
    ariaLabel: columnLabel('state'),
    sortingField: 'state',
  },
];

const selectionTypeOptions = [{ value: 'none' }, { value: 'single' }, { value: 'multi' }];

const stickyColumnsOptions = [{ value: '0' }, { value: '1' }, { value: '2' }, { value: '3' }];

const tableRoleOptions = [{ value: 'default' }, { value: 'table' }, { value: 'grid' }];

export default () => {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const [tableItems, setTableItems] = useState(originalTableItems);
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const { items, collectionProps, paginationProps } = useCollection(tableItems, {
    pagination: { pageSize: 25 },
    sorting: {},
  });
  const tableRole = urlParams.tableRole === 'default' ? undefined : urlParams.tableRole;
  return (
    <Box margin="m">
      <h1>Grid navigation</h1>
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
              checked={urlParams.columnSorting}
              onChange={event => setUrlParams({ columnSorting: event.detail.checked })}
            >
              Column sorting
            </Checkbox>

            <Checkbox
              checked={urlParams.inlineEditing}
              onChange={event => setUrlParams({ inlineEditing: event.detail.checked })}
            >
              Inline editing
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

          <FormField label="Sticky columns last">
            <Select
              selectedOption={
                stickyColumnsOptions.find(option => option.value === urlParams.stickyColumnsLast) ??
                stickyColumnsOptions[0]
              }
              options={stickyColumnsOptions}
              onChange={event => setUrlParams({ stickyColumnsLast: event.detail.selectedOption.value })}
            />
          </FormField>

          <FormField label="Table role">
            <Select
              selectedOption={
                tableRoleOptions.find(option => option.value === urlParams.tableRole) ?? tableRoleOptions[0]
              }
              options={tableRoleOptions}
              onChange={event => setUrlParams({ tableRole: event.detail.selectedOption.value as any })}
            />
          </FormField>

          <FormField label="Page">
            <Pagination
              {...paginationProps}
              ariaLabels={{
                nextPageLabel: 'Next page',
                paginationLabel: 'Table pagination',
                previousPageLabel: 'Previous page',
                pageLabel: pageNumber => `Page ${pageNumber}`,
              }}
            />
          </FormField>
        </SpaceBetween>

        <Table
          {...collectionProps}
          data-test-id="small-table"
          stickyColumns={{
            first: parseInt(urlParams.stickyColumnsFirst || '0'),
            last: parseInt(urlParams.stickyColumnsLast || '0'),
          }}
          {...urlParams}
          tableRole={tableRole}
          sortingDisabled={!urlParams.columnSorting}
          columnDefinitions={columnDefinitions.map(def =>
            urlParams.inlineEditing ? def : { ...def, editConfig: undefined }
          )}
          selectedItems={selectedItems}
          onSelectionChange={({ detail: { selectedItems } }) => setSelectedItems(selectedItems)}
          items={items}
          ariaLabels={{
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
          }}
          header={<Header>Simple table</Header>}
          submitEdit={
            urlParams.inlineEditing
              ? (item, column, newValue) => {
                  setTableItems(items =>
                    items.map(tableItem =>
                      tableItem.id === item.id ? { ...item, [column.id as keyof typeof item]: newValue } : tableItem
                    )
                  );
                }
              : undefined
          }
        />
      </SpaceBetween>
    </Box>
  );
};
