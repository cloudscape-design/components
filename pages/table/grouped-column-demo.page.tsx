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
  StatusIndicator,
  StatusIndicatorProps,
  Table,
  TableProps,
  TextFilter,
} from '~components';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';
import { contentDisplayPreferenceI18nStrings } from '../common/i18n-strings';

// ============================================================================
// Data
// ============================================================================

type ServiceStatus = 'Available' | 'Degraded' | 'Unavailable';

interface RegionService {
  service: string;
  category: string;
  az1p1: ServiceStatus;
  az1p2: ServiceStatus;
  az2p1: ServiceStatus;
  az2p2: ServiceStatus;
  az3p1: ServiceStatus;
  az3p2: ServiceStatus;
}

const allServices: RegionService[] = [
  {
    service: 'Amazon EC2',
    category: 'Compute',
    az1p1: 'Available',
    az1p2: 'Available',
    az2p1: 'Available',
    az2p2: 'Available',
    az3p1: 'Available',
    az3p2: 'Available',
  },
  {
    service: 'Amazon S3',
    category: 'Storage',
    az1p1: 'Available',
    az1p2: 'Available',
    az2p1: 'Available',
    az2p2: 'Degraded',
    az3p1: 'Available',
    az3p2: 'Available',
  },
  {
    service: 'Amazon RDS',
    category: 'Database',
    az1p1: 'Available',
    az1p2: 'Unavailable',
    az2p1: 'Available',
    az2p2: 'Available',
    az3p1: 'Degraded',
    az3p2: 'Available',
  },
  {
    service: 'AWS Lambda',
    category: 'Compute',
    az1p1: 'Available',
    az1p2: 'Available',
    az2p1: 'Available',
    az2p2: 'Available',
    az3p1: 'Available',
    az3p2: 'Available',
  },
  {
    service: 'Amazon DynamoDB',
    category: 'Database',
    az1p1: 'Available',
    az1p2: 'Available',
    az2p1: 'Degraded',
    az2p2: 'Available',
    az3p1: 'Available',
    az3p2: 'Available',
  },
  {
    service: 'Amazon EKS',
    category: 'Containers',
    az1p1: 'Available',
    az1p2: 'Available',
    az2p1: 'Available',
    az2p2: 'Available',
    az3p1: 'Available',
    az3p2: 'Degraded',
  },
  {
    service: 'Amazon CloudFront',
    category: 'Networking',
    az1p1: 'Available',
    az1p2: 'Available',
    az2p1: 'Available',
    az2p2: 'Available',
    az3p1: 'Available',
    az3p2: 'Available',
  },
  {
    service: 'Amazon Route 53',
    category: 'Networking',
    az1p1: 'Available',
    az1p2: 'Degraded',
    az2p1: 'Available',
    az2p2: 'Available',
    az3p1: 'Available',
    az3p2: 'Available',
  },
  {
    service: 'Amazon ElastiCache',
    category: 'Database',
    az1p1: 'Available',
    az1p2: 'Available',
    az2p1: 'Available',
    az2p2: 'Unavailable',
    az3p1: 'Available',
    az3p2: 'Available',
  },
  {
    service: 'Amazon SQS',
    category: 'Messaging',
    az1p1: 'Available',
    az1p2: 'Available',
    az2p1: 'Available',
    az2p2: 'Available',
    az3p1: 'Degraded',
    az3p2: 'Available',
  },
  {
    service: 'Amazon SNS',
    category: 'Messaging',
    az1p1: 'Available',
    az1p2: 'Available',
    az2p1: 'Available',
    az2p2: 'Available',
    az3p1: 'Available',
    az3p2: 'Available',
  },
  {
    service: 'Amazon Kinesis',
    category: 'Analytics',
    az1p1: 'Degraded',
    az1p2: 'Available',
    az2p1: 'Available',
    az2p2: 'Available',
    az3p1: 'Available',
    az3p2: 'Available',
  },
  {
    service: 'AWS Glue',
    category: 'Analytics',
    az1p1: 'Available',
    az1p2: 'Available',
    az2p1: 'Available',
    az2p2: 'Available',
    az3p1: 'Available',
    az3p2: 'Unavailable',
  },
  {
    service: 'Amazon Athena',
    category: 'Analytics',
    az1p1: 'Available',
    az1p2: 'Available',
    az2p1: 'Degraded',
    az2p2: 'Available',
    az3p1: 'Available',
    az3p2: 'Available',
  },
  {
    service: 'Amazon Redshift',
    category: 'Analytics',
    az1p1: 'Available',
    az1p2: 'Available',
    az2p1: 'Available',
    az2p2: 'Available',
    az3p1: 'Available',
    az3p2: 'Available',
  },
  {
    service: 'Amazon EMR',
    category: 'Analytics',
    az1p1: 'Available',
    az1p2: 'Degraded',
    az2p1: 'Available',
    az2p2: 'Available',
    az3p1: 'Available',
    az3p2: 'Available',
  },
  {
    service: 'AWS Step Functions',
    category: 'Application Integration',
    az1p1: 'Available',
    az1p2: 'Available',
    az2p1: 'Available',
    az2p2: 'Available',
    az3p1: 'Degraded',
    az3p2: 'Available',
  },
  {
    service: 'Amazon EventBridge',
    category: 'Application Integration',
    az1p1: 'Available',
    az1p2: 'Available',
    az2p1: 'Available',
    az2p2: 'Degraded',
    az3p1: 'Available',
    az3p2: 'Available',
  },
  {
    service: 'Amazon API Gateway',
    category: 'Networking',
    az1p1: 'Available',
    az1p2: 'Available',
    az2p1: 'Available',
    az2p2: 'Available',
    az3p1: 'Available',
    az3p2: 'Available',
  },
  {
    service: 'Amazon CloudWatch',
    category: 'Management',
    az1p1: 'Available',
    az1p2: 'Available',
    az2p1: 'Available',
    az2p2: 'Available',
    az3p1: 'Available',
    az3p2: 'Degraded',
  },
  {
    service: 'AWS IAM',
    category: 'Security',
    az1p1: 'Available',
    az1p2: 'Available',
    az2p1: 'Available',
    az2p2: 'Available',
    az3p1: 'Available',
    az3p2: 'Available',
  },
  {
    service: 'AWS Secrets Manager',
    category: 'Security',
    az1p1: 'Available',
    az1p2: 'Available',
    az2p1: 'Unavailable',
    az2p2: 'Available',
    az3p1: 'Available',
    az3p2: 'Available',
  },
  {
    service: 'AWS CodePipeline',
    category: 'Developer Tools',
    az1p1: 'Available',
    az1p2: 'Available',
    az2p1: 'Available',
    az2p2: 'Available',
    az3p1: 'Degraded',
    az3p2: 'Available',
  },
  {
    service: 'Amazon ECS',
    category: 'Containers',
    az1p1: 'Available',
    az1p2: 'Degraded',
    az2p1: 'Available',
    az2p2: 'Available',
    az3p1: 'Available',
    az3p2: 'Available',
  },
  {
    service: 'Amazon ECR',
    category: 'Containers',
    az1p1: 'Available',
    az1p2: 'Available',
    az2p1: 'Available',
    az2p2: 'Available',
    az3p1: 'Available',
    az3p2: 'Available',
  },
];

// ============================================================================
// Column definitions
// ============================================================================

function StatusCell({ status }: { status: ServiceStatus }) {
  const typeMap: Record<ServiceStatus, StatusIndicatorProps['type']> = {
    Available: 'success',
    Degraded: 'warning',
    Unavailable: 'error',
  };
  return <StatusIndicator type={typeMap[status]}>{status}</StatusIndicator>;
}

const columnDefinitions: TableProps.ColumnDefinition<RegionService>[] = [
  {
    id: 'service',
    header: 'Service',
    cell: item => item.service,
    sortingField: 'service',
    isRowHeader: true,
    minWidth: 200,
  },
  { id: 'category', header: 'Category', cell: item => item.category, sortingField: 'category', minWidth: 160 },
  { id: 'az1p1', header: 'Partition 1', cell: item => <StatusCell status={item.az1p1} />, minWidth: 140 },
  { id: 'az1p2', header: 'Partition 2', cell: item => <StatusCell status={item.az1p2} />, minWidth: 140 },
  { id: 'az2p1', header: 'Partition 1', cell: item => <StatusCell status={item.az2p1} />, minWidth: 140 },
  { id: 'az2p2', header: 'Partition 2', cell: item => <StatusCell status={item.az2p2} />, minWidth: 140 },
  { id: 'az3p1', header: 'Partition 1', cell: item => <StatusCell status={item.az3p1} />, minWidth: 140 },
  { id: 'az3p2', header: 'Partition 2', cell: item => <StatusCell status={item.az3p2} />, minWidth: 140 },
];

const groupDefinitions: TableProps.GroupDefinition<RegionService>[] = [
  { id: 'az1', header: 'us-east-1a' },
  { id: 'az2', header: 'us-east-1b' },
  { id: 'az3', header: 'us-east-1c' },
];

const collectionPreferencesProps: CollectionPreferencesProps<unknown> = {
  title: 'Preferences',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  pageSizePreference: {
    title: 'Page size',
    options: [
      { value: 5, label: '5 services' },
      { value: 10, label: '10 services' },
      { value: 25, label: 'All services' },
    ],
  },
  contentDisplayPreference: {
    title: 'Column preferences',
    description: 'Customize column visibility and order.',
    options: [
      { id: 'service', label: 'Service', alwaysVisible: true },
      { id: 'category', label: 'Category' },
      { id: 'az1p1', label: 'us-east-1a — Partition 1' },
      { id: 'az1p2', label: 'us-east-1a — Partition 2' },
      { id: 'az2p1', label: 'us-east-1b — Partition 1' },
      { id: 'az2p2', label: 'us-east-1b — Partition 2' },
      { id: 'az3p1', label: 'us-east-1c — Partition 1' },
      { id: 'az3p2', label: 'us-east-1c — Partition 2' },
    ],
    groups: [
      { id: 'az1', label: 'us-east-1a' },
      { id: 'az2', label: 'us-east-1b' },
      { id: 'az3', label: 'us-east-1c' },
    ],
    ...contentDisplayPreferenceI18nStrings,
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
  }>
>;

export default function GroupedColumnDemo() {
  const {
    urlParams: { resizable = true, firstSticky = 1, lastSticky = 0 },
    setUrlParams,
  } = useContext(AppContext as DemoContext);

  const [preferences, setPreferences] = useState<CollectionPreferencesProps['preferences']>({
    pageSize: 10,
    contentDisplay: [
      { id: 'service', visible: true },
      { id: 'category', visible: true },
      {
        type: 'group',
        id: 'az1',
        visible: true,
        children: [
          { id: 'az1p1', visible: true },
          { id: 'az1p2', visible: true },
        ],
      },
      {
        type: 'group',
        id: 'az2',
        visible: true,
        children: [
          { id: 'az2p1', visible: true },
          { id: 'az2p2', visible: true },
        ],
      },
      {
        type: 'group',
        id: 'az3',
        visible: true,
        children: [
          { id: 'az3p1', visible: true },
          { id: 'az3p2', visible: true },
        ],
      },
    ],
  });

  const ariaLabels: TableProps<RegionService>['ariaLabels'] = {
    selectionGroupLabel: 'Services selection',
    allItemsSelectionLabel: ({ selectedItems }) =>
      `${selectedItems.length} ${selectedItems.length === 1 ? 'service' : 'services'} selected`,
    itemSelectionLabel: ({ selectedItems }, item) => {
      const isSelected = selectedItems.includes(item);
      return `${item.service} is ${isSelected ? '' : 'not '}selected`;
    },
    tableLabel: 'AWS Region Services',
  };

  const { items, actions, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(
    allServices,
    {
      filtering: {
        empty: <EmptyState title="No services" subtitle="No services to display." />,
        noMatch: (
          <EmptyState
            title="No matches"
            subtitle="We can't find a match."
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

  return (
    <SimplePage title="AWS Region Services ,Grouped Columns Demo" i18n={{}} screenshotArea={{}}>
      <SpaceBetween size="m" direction="horizontal" alignItems="end">
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
        stickyColumns={{ first: +firstSticky, last: +lastSticky }}
        variant="container"
        enableKeyboardNavigation={true}
        ariaLabels={ariaLabels}
        columnDefinitions={columnDefinitions}
        groupDefinitions={groupDefinitions}
        columnDisplay={preferences?.contentDisplay}
        items={items}
        header={
          <Header
            counter={
              selectedItems && selectedItems.length
                ? `(${selectedItems.length}/${allServices.length})`
                : `(${allServices.length})`
            }
            description="Showing availability across 3 AZs × 2 partitions"
          >
            Service health
          </Header>
        }
        filter={
          <TextFilter
            {...filterProps}
            countText={`${filteredItemsCount} ${filteredItemsCount === 1 ? 'match' : 'matches'}`}
            filteringPlaceholder="Find services by name or category"
          />
        }
        pagination={<Pagination {...paginationProps} />}
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
