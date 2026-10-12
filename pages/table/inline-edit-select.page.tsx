// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Header from '~components/header';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';
import Table, { TableProps } from '~components/table';

import ScreenshotArea from '../utils/screenshot-area';

interface ItemType {
  id: string;
  name: string;
  // Value edited via a Select that submits on selection.
  status: string;
  // Value edited via a Select that uses the classic setValue + submit-button flow.
  size: string;
}

const statusOptions: SelectProps.Option[] = [
  { label: 'Active', value: 'active' },
  { label: 'Deactivated', value: 'deactivated' },
  { label: 'Suspended', value: 'suspended' },
];

const sizeOptions: SelectProps.Option[] = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
];

const labelFor = (options: SelectProps.Option[], value: string) =>
  options.find(option => option.value === value)?.label ?? value;

const initialItems: ItemType[] = [
  { id: '1', name: 'Instance alpha', status: 'active', size: 'small' },
  { id: '2', name: 'Instance beta', status: 'deactivated', size: 'medium' },
  { id: '3', name: 'Instance gamma', status: 'suspended', size: 'large' },
  { id: '4', name: 'Instance delta', status: 'active', size: 'small' },
];

const ariaLabels: TableProps.AriaLabels<ItemType> = {
  tableLabel: 'Inline editable select cells',
  activateEditLabel: (column, item) => `Edit ${item.name} ${column.header}`,
  cancelEditLabel: column => `Cancel editing ${column.header}`,
  submitEditLabel: column => `Submit edit ${column.header}`,
  submittingEditText: () => 'Submitting edit',
  successfulEditLabel: () => 'Edit successful',
};

export default function InlineEditSelectPage() {
  const [items, setItems] = useState(initialItems);

  const handleSubmit: TableProps.SubmitEditFunction<ItemType> = async (currentItem, column, newValue) => {
    // Emulate a small async round-trip like a real server call.
    await new Promise(resolve => setTimeout(resolve, 300));
    const field = column.id as 'status' | 'size';
    setItems(prev => prev.map(item => (item.id === currentItem.id ? { ...item, [field]: newValue as string } : item)));
  };

  const columns: TableProps.ColumnDefinition<ItemType>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: item => item.name,
      isRowHeader: true,
    },
    {
      id: 'status',
      header: 'Status (submit on selection)',
      minWidth: 220,
      cell: item => labelFor(statusOptions, item.status),
      editConfig: {
        ariaLabel: 'Status',
        editIconAriaLabel: 'editable',
        // No native form is needed: the Select submits the chosen value immediately.
        disableNativeForm: true,
        editingCell(item, { currentValue, submitValue }: TableProps.CellContext<string>) {
          const value = currentValue ?? item.status;
          return (
            <Select
              autoFocus={true}
              expandToViewport={true}
              selectedOption={statusOptions.find(option => option.value === value) ?? null}
              options={statusOptions}
              // Submit the chosen value straight away, without waiting for a setValue state update.
              onChange={({ detail }) => submitValue(detail.selectedOption.value)}
            />
          );
        },
      },
    },
    {
      id: 'size',
      header: 'Size (classic submit button)',
      minWidth: 220,
      cell: item => labelFor(sizeOptions, item.size),
      editConfig: {
        ariaLabel: 'Size',
        editIconAriaLabel: 'editable',
        editingCell(item, { currentValue, setValue }: TableProps.CellContext<string>) {
          const value = currentValue ?? item.size;
          return (
            <Select
              autoFocus={true}
              expandToViewport={true}
              selectedOption={sizeOptions.find(option => option.value === value) ?? null}
              options={sizeOptions}
              // Classic flow: track the value; the user confirms with the submit button.
              onChange={({ detail }) => setValue(detail.selectedOption.value ?? item.size)}
            />
          );
        },
      },
    },
  ];

  return (
    <ScreenshotArea>
      <Box padding="l">
        <SpaceBetween size="l">
          <Header variant="h1">Table inline-edit with a Select editor</Header>
          <Box>
            The <b>Status</b> column submits the chosen value immediately from the Select&apos;s change handler using{' '}
            <code>submitValue(detail.selectedOption.value)</code>. The <b>Size</b> column uses the classic{' '}
            <code>setValue</code> flow where the edit is confirmed with the submit button.
          </Box>
          <Table
            ariaLabels={ariaLabels}
            columnDefinitions={columns}
            items={items}
            submitEdit={handleSubmit}
            variant="container"
          />
        </SpaceBetween>
      </Box>
    </ScreenshotArea>
  );
}
