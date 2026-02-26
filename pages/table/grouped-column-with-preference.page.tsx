// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';

import {
  Box,
  Button,
  CollectionPreferences,
  CollectionPreferencesProps,
  Header,
  Input,
  Pagination,
  SpaceBetween,
  Table,
  TableProps,
  TextFilter,
} from '~components';

import { SimplePage } from '../app/templates';

interface EC2Instance {
  id: string;
  name: string;
  cpuUtilization: number;
  memoryUtilization: number;
  networkIn: number;
  networkOut: number;
  instanceType: string;
  az: string;
  state: string;
  monthlyCost: number;
  spotPrice: number;
}

const allInstances: EC2Instance[] = [
  {
    id: 'i-1234567890abcdef0',
    name: 'web-server-1',
    cpuUtilization: 45.2,
    memoryUtilization: 62.8,
    networkIn: 1250,
    networkOut: 890,
    instanceType: 't3.medium',
    az: 'us-east-1a',
    state: 'running',
    monthlyCost: 30.4,
    spotPrice: 0.0416,
  },
  {
    id: 'i-0987654321fedcba0',
    name: 'api-server-1',
    cpuUtilization: 78.5,
    memoryUtilization: 81.2,
    networkIn: 3420,
    networkOut: 2890,
    instanceType: 't3.large',
    az: 'us-east-1b',
    state: 'running',
    monthlyCost: 60.8,
    spotPrice: 0.0832,
  },
  {
    id: 'i-abcdef1234567890a',
    name: 'db-server-1',
    cpuUtilization: 23.1,
    memoryUtilization: 45.6,
    networkIn: 890,
    networkOut: 450,
    instanceType: 'r5.xlarge',
    az: 'us-east-1c',
    state: 'running',
    monthlyCost: 201.6,
    spotPrice: 0.252,
  },
  {
    id: 'i-fedcba0987654321b',
    name: 'cache-server-1',
    cpuUtilization: 12.4,
    memoryUtilization: 34.2,
    networkIn: 560,
    networkOut: 320,
    instanceType: 'r5.large',
    az: 'us-east-1a',
    state: 'stopped',
    monthlyCost: 100.8,
    spotPrice: 0.126,
  },
  {
    id: 'i-1122334455667788c',
    name: 'worker-1',
    cpuUtilization: 91.3,
    memoryUtilization: 88.7,
    networkIn: 4560,
    networkOut: 3210,
    instanceType: 'c5.2xlarge',
    az: 'us-east-1d',
    state: 'running',
    monthlyCost: 248.0,
    spotPrice: 0.34,
  },
];

const columnDefinitions: TableProps<EC2Instance>['columnDefinitions'] = [
  {
    id: 'id',
    header: 'Instance ID',
    cell: (item: EC2Instance) => item.id,
    sortingField: 'id',
    isRowHeader: true,
    groupId: 'metrics',
  },
  {
    id: 'name',
    header: 'Name',
    cell: (item: EC2Instance) => item.name,
    sortingField: 'name',
  },
  {
    id: 'cpuUtilization',
    header: 'CPU (%)',
    cell: (item: EC2Instance) => `${item.cpuUtilization.toFixed(1)}%`,
    sortingField: 'cpuUtilization',
    groupId: 'performance',
  },
  {
    id: 'memoryUtilization',
    header: 'Memory (%)',
    cell: (item: EC2Instance) => `${item.memoryUtilization.toFixed(1)}%`,
    sortingField: 'memoryUtilization',
    groupId: 'performance',
  },
  {
    id: 'networkIn',
    header: 'Network In (MB/s)',
    cell: (item: EC2Instance) => item.networkIn.toString(),
    sortingField: 'networkIn',
    groupId: 'performance',
  },
  {
    id: 'networkOut',
    header: 'Network Out (MB/s)',
    cell: (item: EC2Instance) => item.networkOut.toString(),
    sortingField: 'networkOut',
    groupId: 'performance',
  },
  {
    id: 'instanceType',
    header: 'Instance Type',
    cell: (item: EC2Instance) => item.instanceType,
    sortingField: 'instanceType',
    groupId: 'configuration',
  },
  {
    id: 'az',
    header: 'Availability Zone',
    cell: (item: EC2Instance) => item.az,
    sortingField: 'az',
    groupId: 'configuration',
  },
  {
    id: 'state',
    header: 'State',
    cell: (item: EC2Instance) => item.state,
    sortingField: 'state',
    groupId: 'configuration',
  },
  {
    id: 'monthlyCost',
    header: 'Monthly Cost ($)',
    cell: (item: EC2Instance) => `$${item.monthlyCost.toFixed(2)}`,
    sortingField: 'monthlyCost',
    groupId: 'cost',
  },
  {
    id: 'spotPrice',
    header: 'Spot Price ($/hr)',
    cell: (item: EC2Instance) => `$${item.spotPrice.toFixed(4)}`,
    sortingField: 'spotPrice',
    groupId: 'cost',
  },
];

const columnGroupingDefinitions: TableProps<EC2Instance>['columnGroupingDefinitions'] = [
  {
    id: 'cost',
    header: 'Cost',
  },
  {
    id: 'configuration',
    header: 'Configuration',
  },
  {
    id: 'performance',
    header: 'Performance',
    groupId: 'metrics',
  },
  {
    id: 'metrics',
    header: 'Metrics',
  },
];

const collectionPreferencesProps: CollectionPreferencesProps<unknown> = {
  title: 'Preferences',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  pageSizePreference: {
    title: 'Page size',
    options: [
      { value: 2, label: '2 instances' },
      { value: 10, label: '10 instances' },
      { value: 30, label: '30 instances' },
    ],
  },
  contentDisplayPreference: {
    title: 'Column preferences',
    description: 'Customize the columns visibility and order.',
    options: [
      { id: 'id', label: 'Instance ID', alwaysVisible: true },
      { id: 'name', label: 'Name' },
      { id: 'cpuUtilization', label: 'CPU (%)', groupId: 'performance' },
      { id: 'memoryUtilization', label: 'Memory (%)', groupId: 'performance' },
      { id: 'networkIn', label: 'Network In (MB/s)', groupId: 'performance' },
      { id: 'networkOut', label: 'Network Out (MB/s)', groupId: 'performance' },
      { id: 'instanceType', label: 'Instance Type', groupId: 'configuration' },
      { id: 'az', label: 'Availability Zone', groupId: 'configuration' },
      { id: 'state', label: 'State', groupId: 'configuration' },
      { id: 'monthlyCost', label: 'Monthly Cost ($)', groupId: 'cost' },
      { id: 'spotPrice', label: 'Spot Price ($/hr)', groupId: 'cost' },
    ],
    groups: [
      { id: 'cost', label: 'Cost' },
      { id: 'configuration', label: 'Configuration' },
      { id: 'performance', label: 'Performance' },
    ],
  },
};

function EmptyState({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <Box textAlign="center" color="inherit">
      <Box variant="strong" textAlign="center" color="inherit">
        {title}
      </Box>
      {subtitle && (
        <Box variant="p" padding={{ bottom: 's' }} color="inherit">
          {subtitle}
        </Box>
      )}
      {action}
    </Box>
  );
}

export default function EC2TableDemo() {
  const [preferences, setPreferences] = useState<CollectionPreferencesProps['preferences']>({
    pageSize: 10,
    contentDisplay: [
      { id: 'cpuUtilization', visible: true },
      { id: 'memoryUtilization', visible: true },
      { id: 'networkIn', visible: true },
      { id: 'networkOut', visible: true },
      { id: 'id', visible: true },
      { id: 'name', visible: true },
      { id: 'instanceType', visible: true },
      { id: 'az', visible: true },
      { id: 'state', visible: true },
      { id: 'monthlyCost', visible: false },
      { id: 'spotPrice', visible: false },
    ],
  });

  const ariaLabels: TableProps<EC2Instance>['ariaLabels'] = {
    selectionGroupLabel: 'EC2 instances selection',
    allItemsSelectionLabel: ({ selectedItems }) =>
      `${selectedItems.length} ${selectedItems.length === 1 ? 'instance' : 'instances'} selected`,
    itemSelectionLabel: ({ selectedItems }, item) => {
      const isItemSelected = selectedItems.includes(item);
      return `${item.name} is ${isItemSelected ? '' : 'not '}selected`;
    },
    tableLabel: 'EC2 Instances',
  };

  const { items, actions, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(
    allInstances,
    {
      filtering: {
        empty: (
          <EmptyState
            title="No instances"
            subtitle="No EC2 instances to display"
            action={<Button>Launch instance</Button>}
          />
        ),
        noMatch: (
          <EmptyState
            title="No matches"
            subtitle="We can't find a match"
            action={<Button onClick={() => actions.setFiltering('')}>Clear filter</Button>}
          />
        ),
      },
      pagination: { pageSize: preferences?.pageSize },
      sorting: {},
      selection: {},
    }
  );

  const { selectedItems } = collectionProps;

  const [firstSticky, setFirstSticky] = useState('0');
  const [lastSticky, setLastSticky] = useState('0');

  return (
    <SimplePage title="Grouped Column table demo with collection hooks" i18n={{}} screenshotArea={{}}>
      <h1>EC2 Instances Table</h1>
      <Table
        {...collectionProps}
        selectionType="multi"
        resizableColumns={true}
        stickyColumns={{
          first: +firstSticky,
          last: +lastSticky,
        }}
        // variant="stacked"
        enableKeyboardNavigation={true}
        ariaLabels={ariaLabels}
        header={
          <Header
            counter={
              selectedItems && selectedItems.length
                ? `(${selectedItems.length}/${allInstances.length})`
                : `(${allInstances.length})`
            }
          >
            EC2 Instances
          </Header>
        }
        columnDefinitions={columnDefinitions}
        columnGroupingDefinitions={columnGroupingDefinitions}
        columnDisplay={preferences?.contentDisplay}
        items={items}
        pagination={<Pagination {...paginationProps} />}
        filter={
          <SpaceBetween size="m" direction="horizontal">
            {/* first */}
            <Input
              ariaLabel="First sticky column count"
              onChange={({ detail }) => setFirstSticky(detail.value)}
              value={firstSticky}
              name="first"
              inputMode="numeric"
              type="number"
            />
            <Input
              ariaLabel="Last sticky column count"
              onChange={({ detail }) => setLastSticky(detail.value)}
              value={lastSticky}
              name="last"
              inputMode="numeric"
              type="number"
            />

            <TextFilter
              {...filterProps}
              countText={`${filteredItemsCount} ${filteredItemsCount === 1 ? 'match' : 'matches'}`}
              filteringPlaceholder="Find instances"
            />
          </SpaceBetween>
        }
        preferences={
          <CollectionPreferences
            {...collectionPreferencesProps}
            preferences={preferences}
            onConfirm={({ detail }) => setPreferences(detail)}
          />
        }
      />
    </SimplePage>
  );
}
