// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Button, Container, Header, Select, SpaceBetween, StatusIndicator, Table } from '~components';

import CustomAppLayout from './app-layout';

export default function ShortcutPage() {
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [submitting, setSubmitting] = useState(false);

  const removeFiles = () => {
    // const newValue = files.filter(file => !selectedItems.includes(file));
    // setFiles(newValue);

    setSelectedItems([]);
  };

  const shortcuts = [
    {
      name: 'Toggle navigation',
      shortcut: 'n',
      status: 'Enabled',
    },
  ];

  const [tableItems, setTableItems] = useState(shortcuts);

  const handleSubmit = async (currentItem: any, column: any, value: any) => {
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const fullCollection = tableItems;

    const newItem = { ...currentItem, [column.id]: value };

    setTableItems(fullCollection.map(item => (item === currentItem ? newItem : item)));
    setSubmitting(false);
  };

  return (
    <CustomAppLayout header={<Header actions={<Button variant="primary">Save</Button>}>Keyboard shortcuts</Header>}>
      <SpaceBetween size="xl">
        <Container
          header={
            <Header
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button disabled={selectedItems.length === 0 || submitting} onClick={removeFiles}>
                    Delete
                  </Button>
                  <Button>Edit</Button>
                  <Button>New shortcut</Button>
                </SpaceBetween>
              }
            >
              Keyboard shortcuts
            </Header>
          }
        >
          <Table
            variant="embedded"
            empty={'No files uploaded'}
            selectionType={'multi'}
            onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
            selectedItems={selectedItems}
            trackBy="name"
            columnDefinitions={[
              {
                id: 'name',
                header: 'Action name',
                cell: item => item.name || '-',
                sortingField: 'name',
                isRowHeader: true,
              },
              {
                id: 'type',
                header: 'Shortcut',
                cell: item => item.shortcut || '-',
                sortingField: 'alt',
              },
              {
                id: 'status',
                header: 'Status',
                cell: item =>
                  (
                    <StatusIndicator type={item.status === 'Disabled' ? 'error' : 'success'}>
                      {item.status}
                    </StatusIndicator>
                  ) || '-',
                editConfig: {
                  ariaLabel: 'Type',
                  editIconAriaLabel: 'editable',
                  editingCell: (item, { currentValue, setValue }) => {
                    const value = currentValue ?? item.status;
                    return (
                      <Select
                        autoFocus={true}
                        expandToViewport={true}
                        selectedOption={
                          [
                            { label: 'Enabled', value: 'Enabled' },
                            { label: 'Disabled', value: 'Disabled' },
                          ].find(option => option.value === value) ?? null
                        }
                        onChange={event => {
                          setValue(event.detail.selectedOption.value ?? item.status);
                        }}
                        options={[
                          { label: 'Enabled', value: 'Enabled' },
                          { label: 'Disabled', value: 'Disabled' },
                        ]}
                      />
                    );
                  },
                },
              },
            ]}
            submitEdit={handleSubmit}
            enableKeyboardNavigation={true}
            ariaLabels={{
              activateEditLabel: (column, item) => `Edit ${item.name} ${column.header}`,
              cancelEditLabel: column => `Cancel editing ${column.header}`,
              submitEditLabel: column => `Submit editing ${column.header}`,
              tableLabel: 'Table with inline editing',
              selectionGroupLabel: 'group label',
              allItemsSelectionLabel: ({ selectedItems }) => `${selectedItems.length} item selected`,
              itemSelectionLabel: ({ selectedItems }, item) =>
                `${item.name} is ${selectedItems.indexOf(item) < 0 ? 'not ' : ''}selected`,
            }}
            items={tableItems}
            loadingText="Loading resources"
            sortingDisabled={true}
          />
        </Container>
      </SpaceBetween>
    </CustomAppLayout>
  );
}
