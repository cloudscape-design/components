// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef, useState } from 'react';
import Table, { TableProps } from '~components/table';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import Input from '~components/input';
import Link from '~components/link';
import { generateItems, Instance } from './generate-data';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { Box, Button, Checkbox, FormField, Pagination, RadioGroup, Select, StatusIndicator } from '~components';
import AppContext, { AppContextType } from '../app/app-context';
import { columnLabel, stateToStatusIndicator } from './shared-configs';
import styles from './styles.scss';

type DemoContext = React.Context<
  AppContextType<{
    resizableColumns: boolean;
    stickyHeader: boolean;
    columnSorting: boolean;
    inlineEditing: boolean;
    selectionType: undefined | 'single' | 'multi';
    stickyColumnsFirst: string;
    stickyColumnsLast: string;
    keyboardNavigation: boolean;
  }>
>;

const originalTableItems: Instance[] = generateItems(50);

const typeOptions = [...new Set(originalTableItems.map(item => item.type))].map(type => ({ value: type }));

const selectionTypeOptions = [{ value: 'none' }, { value: 'single' }, { value: 'multi' }];

const stickyColumnsOptions = [{ value: '0' }, { value: '1' }, { value: '2' }, { value: '3' }];

export default () => {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const [tableItems, setTableItems] = useState(originalTableItems);
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const { items, collectionProps, paginationProps } = useCollection(tableItems, {
    pagination: { pageSize: 25 },
    sorting: {},
  });
  const keyboardNavigation = urlParams.keyboardNavigation ?? true;

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
    {
      id: 'control',
      header: 'Control',
      cell: item => (
        <ControlCell
          value={item.state === 'STOPPED' || item.state === 'STOPPING' ? 'off' : 'on'}
          onChange={value =>
            setTableItems(items =>
              items.map(tableItem =>
                tableItem.id === item.id
                  ? {
                      ...tableItem,
                      state: value === 'on' ? 'PENDING' : 'STOPPING',
                    }
                  : tableItem
              )
            )
          }
        />
      ),
    },
  ];

  return (
    <Box margin="m">
      <h1>Grid navigation</h1>
      <SpaceBetween size="xl">
        <SpaceBetween direction="horizontal" size="m">
          <FormField label="Table flags">
            <Checkbox
              checked={keyboardNavigation}
              onChange={event => {
                setUrlParams({ keyboardNavigation: event.detail.checked });
                window.location.reload();
              }}
            >
              Keyboard navigation
            </Checkbox>

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
          keyboardNavigation={keyboardNavigation}
          sortingDisabled={!urlParams.columnSorting}
          columnDefinitions={columnDefinitions.map(def =>
            urlParams.inlineEditing ? def : { ...def, editConfig: undefined }
          )}
          selectedItems={selectedItems}
          onSelectionChange={({ detail: { selectedItems } }) => setSelectedItems(selectedItems)}
          items={items}
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

        <Button onClick={() => window.scrollTo({ top: 0, left: 0 })}>Scroll to top</Button>
      </SpaceBetween>
    </Box>
  );
};

function ControlCell({ value, onChange }: { value: 'on' | 'off'; onChange: (value: 'on' | 'off') => void }) {
  const [active, setActive] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  if (!active) {
    return (
      <button className={styles['status-trigger-button']} onClick={() => setActive(true)}>
        <StatusIndicator type={value === 'on' ? 'success' : 'stopped'}>{value}</StatusIndicator>
      </button>
    );
  }

  return (
    <span
      ref={dialogRef}
      role="dialog"
      aria-label="Set control value dialog"
      onBlur={event => {
        if (!dialogRef.current?.contains(event.target)) {
          setActive(false);
        }
      }}
      onKeyDown={event => {
        if (event.key === 'Escape' || event.key === 'F2' || event.key === 'Enter') {
          setActive(false);
        }
      }}
    >
      <RadioGroup
        items={[
          {
            value: 'on',
            label: 'On',
          },
          {
            value: 'off',
            label: 'Off',
          },
        ]}
        onChange={({ detail }) => onChange(detail.value as 'on' | 'off')}
        value={value}
      />
    </span>
  );
}
