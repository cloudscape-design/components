// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import Table, { TableProps } from '~components/table';

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'active' | 'on-leave';
}

const items: Employee[] = [
  { id: '1', name: 'Alice Johnson', role: 'Frontend Engineer', department: 'Engineering', status: 'active' },
  { id: '2', name: 'Bob Smith', role: 'Backend Engineer', department: 'Engineering', status: 'on-leave' },
  { id: '3', name: 'Carol White', role: 'Engineering Manager', department: 'Engineering', status: 'active' },
  { id: '4', name: 'Dan Brown', role: 'Product Manager', department: 'Product', status: 'active' },
  { id: '5', name: 'Eve Davis', role: 'Product Designer', department: 'Product', status: 'active' },
  { id: '6', name: 'Frank Miller', role: 'Account Executive', department: 'Sales', status: 'on-leave' },
  { id: '7', name: 'Grace Lee', role: 'Sales Development Rep', department: 'Sales', status: 'active' },
];

const columnDefinitions: TableProps.ColumnDefinition<Employee>[] = [
  { id: 'name', header: 'Name', cell: item => item.name, isRowHeader: true },
  { id: 'role', header: 'Role', cell: item => item.role },
  {
    id: 'status',
    header: 'Status',
    cell: item => (
      <StatusIndicator type={item.status === 'active' ? 'success' : 'stopped'}>
        {item.status === 'active' ? 'Active' : 'On leave'}
      </StatusIndicator>
    ),
  },
];

const rowGrouping: TableProps.RowGrouping<Employee> = {
  getGroupId: item => item.department,
  renderGroupHeader: ({ groupId, items }) => (
    <SpaceBetween size="xs" direction="horizontal">
      <Box variant="strong">{groupId}</Box>
      <Box color="text-body-secondary">({items.length})</Box>
    </SpaceBetween>
  ),
};

export default function RowGroupingPage() {
  const [selectedItems, setSelectedItems] = useState<Employee[]>([]);
  return (
    <Box padding="l">
      <h1>Table row group headers</h1>
      <SpaceBetween size="l">
        <Table
          header={<Header headingTagOverride="h2">Employees grouped by department</Header>}
          columnDefinitions={columnDefinitions}
          items={items}
          trackBy="id"
          selectionType="multi"
          selectedItems={selectedItems}
          onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
          rowGrouping={rowGrouping}
          ariaLabels={{
            selectionGroupLabel: 'Employee selection',
            allItemsSelectionLabel: () => 'Select all employees',
            itemSelectionLabel: (_data, item) => `Select ${item.name}`,
            tableLabel: 'Employees',
          }}
        />

        <Table
          header={<Header headingTagOverride="h2">Grouped without selection</Header>}
          columnDefinitions={columnDefinitions}
          items={items}
          trackBy="id"
          rowGrouping={rowGrouping}
          ariaLabels={{ tableLabel: 'Employees without selection' }}
        />
      </SpaceBetween>
    </Box>
  );
}
