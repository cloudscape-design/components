// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';

import {
  Box,
  Button,
  CollectionPreferences,
  CollectionPreferencesProps,
  FormField,
  Header,
  Input,
  Pagination,
  SpaceBetween,
  Table,
  TableProps,
  TextFilter,
  Toggle,
} from '~components';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

interface Instance {
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

const allInstances: Instance[] = [
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

const columnDefinitions: TableProps<Instance>['columnDefinitions'] = [
  {
    id: 'id',
    header: 'Instance ID',
    cell: (item: Instance) => item.id,
    sortingField: 'id',
    isRowHeader: true,
  },
  {
    id: 'name',
    header: 'Name',
    cell: (item: Instance) => item.name,
    sortingField: 'name',
  },
  {
    id: 'cpuUtilization',
    header: 'CPU (%)',
    cell: (item: Instance) => `${item.cpuUtilization.toFixed(1)}%`,
    sortingField: 'cpuUtilization',
  },
  {
    id: 'memoryUtilization',
    header: 'Memory (%)',
    cell: (item: Instance) => `${item.memoryUtilization.toFixed(1)}%`,
    sortingField: 'memoryUtilization',
  },
  {
    id: 'networkIn',
    header: 'Network In (MB/s)',
    cell: (item: Instance) => item.networkIn.toString(),
    sortingField: 'networkIn',
  },
  {
    id: 'networkOut',
    header: 'Network Out (MB/s)',
    cell: (item: Instance) => item.networkOut.toString(),
    sortingField: 'networkOut',
  },
  {
    id: 'instanceType',
    header: 'Instance Type',
    cell: (item: Instance) => item.instanceType,
    sortingField: 'instanceType',
  },
  {
    id: 'az',
    header: 'Availability Zone',
    cell: (item: Instance) => item.az,
    sortingField: 'az',
  },
  {
    id: 'state',
    header: 'State',
    cell: (item: Instance) => item.state,
    sortingField: 'state',
  },
  {
    id: 'monthlyCost',
    header: 'Monthly Cost ($)',
    cell: (item: Instance) => `$${item.monthlyCost.toFixed(2)}`,
    sortingField: 'monthlyCost',
  },
  {
    id: 'spotPrice',
    header: 'Spot Price ($/hr)',
    cell: (item: Instance) => `$${item.spotPrice.toFixed(4)}`,
    sortingField: 'spotPrice',
  },
];

const groupDefinitions: TableProps<Instance>['groupDefinitions'] = [
  { id: 'cost', header: 'Cost' },
  { id: 'configuration', header: 'Configuration' },
  { id: 'performance', header: 'Performance' },
  { id: 'metrics', header: 'Metrics' },
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
      { id: 'cpuUtilization', label: 'CPU (%)' },
      { id: 'memoryUtilization', label: 'Memory (%)' },
      { id: 'networkIn', label: 'Network In (MB/s)' },
      { id: 'networkOut', label: 'Network Out (MB/s)' },
      { id: 'instanceType', label: 'Instance Type' },
      { id: 'az', label: 'Availability Zone' },
      { id: 'state', label: 'State' },
      { id: 'monthlyCost', label: 'Monthly Cost ($)' },
      { id: 'spotPrice', label: 'Spot Price ($/hr)' },
    ],
    groups: [
      { id: 'cost', label: 'Cost' },
      { id: 'configuration', label: 'Configuration' },
      { id: 'performance', label: 'Performance' },
      { id: 'metrics', label: 'Metrics' },
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

type DemoContext = React.Context<
  AppContextType<{
    resizable: boolean;
    firstSticky: number;
    lastSticky: number;
    gap: number;
  }>
>;

export default function TableDemo() {
  const [preferences, setPreferences] = useState<CollectionPreferencesProps['preferences']>({
    pageSize: 10,
    contentDisplay: [
      { id: 'id', visible: true },
      { id: 'name', visible: true },
      {
        type: 'group',
        id: 'metrics',
        visible: true,
        children: [
          {
            type: 'group',
            id: 'performance',
            visible: true,
            children: [
              { id: 'cpuUtilization', visible: true },
              { id: 'memoryUtilization', visible: true },
              { id: 'networkIn', visible: true },
              { id: 'networkOut', visible: true },
            ],
          },
        ],
      },
      {
        type: 'group',
        id: 'configuration',
        visible: true,
        children: [
          { id: 'instanceType', visible: true },
          { id: 'az', visible: true },
          { id: 'state', visible: true },
        ],
      },
      {
        type: 'group',
        id: 'cost',
        visible: true,
        children: [
          { id: 'monthlyCost', visible: false },
          { id: 'spotPrice', visible: false },
        ],
      },
    ],
  });

  const ariaLabels: TableProps<Instance>['ariaLabels'] = {
    selectionGroupLabel: 'instances selection',
    allItemsSelectionLabel: ({ selectedItems }) =>
      `${selectedItems.length} ${selectedItems.length === 1 ? 'instance' : 'instances'} selected`,
    itemSelectionLabel: ({ selectedItems }, item) => {
      const isItemSelected = selectedItems.includes(item);
      return `${item.name} is ${isItemSelected ? '' : 'not '}selected`;
    },
    tableLabel: 'Instances',
  };

  const { items, actions, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(
    allInstances,
    {
      filtering: {
        empty: (
          <EmptyState
            title="No instances"
            subtitle="No instances to display"
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

  const {
    urlParams: { resizable = true, firstSticky = 0, lastSticky = 0 },
    setUrlParams,
  } = useContext(AppContext as DemoContext);

  return (
    <SimplePage title="Grouped Column table demo with collection hooks" i18n={{}} screenshotArea={{}}>
      <h1>Instances Table</h1>

      <SpaceBetween size="m" direction="horizontal" alignItems="end">
        <Toggle onChange={({ detail }) => setUrlParams({ resizable: detail.checked })} checked={resizable}>
          Resizable
        </Toggle>

        <FormField label="Sticky First">
          <Input
            ariaLabel="First sticky column count"
            onChange={({ detail }) => setUrlParams({ firstSticky: +detail.value })}
            value={String(firstSticky)}
            name="first"
            inputMode="numeric"
            type="number"
          />
        </FormField>
        <FormField label="Sticky Last">
          <Input
            ariaLabel="Last sticky column count"
            onChange={({ detail }) => setUrlParams({ lastSticky: +detail.value })}
            value={String(lastSticky)}
            name="last"
            inputMode="numeric"
            type="number"
          />
        </FormField>
      </SpaceBetween>

      <Table
        {...collectionProps}
        selectionType="multi"
        resizableColumns={resizable}
        stickyColumns={{
          first: +firstSticky,
          last: +lastSticky,
        }}
        variant="stacked"
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
            Instances
          </Header>
        }
        columnDefinitions={columnDefinitions}
        groupDefinitions={groupDefinitions}
        columnDisplay={preferences?.contentDisplay}
        items={items}
        pagination={<Pagination {...paginationProps} />}
        filter={
          <TextFilter
            {...filterProps}
            countText={`${filteredItemsCount} ${filteredItemsCount === 1 ? 'match' : 'matches'}`}
            filteringPlaceholder="Find instances"
          />
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
