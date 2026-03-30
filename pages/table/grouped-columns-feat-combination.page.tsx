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
  Link,
  Pagination,
  Select,
  SpaceBetween,
  StatusIndicator,
  StatusIndicatorProps,
  Table,
  TableProps,
  TextFilter,
  Toggle,
} from '~components';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';
import { contentDisplayPreferenceI18nStrings } from '../common/i18n-strings';

// ============================================================================
// Data model
// ============================================================================

type InstanceState = 'running' | 'stopped' | 'pending' | 'terminated';

interface Instance {
  id: string;
  name: string;
  type: string;
  az: string;
  state: InstanceState;
  cpuUtilization: number;
  memoryUtilization: number;
  networkIn: number;
  networkOut: number;
  monthlyCost: number;
  spotPrice: number;
  launchDate: string;
}

const stateIndicator: Record<InstanceState, StatusIndicatorProps['type']> = {
  running: 'success',
  stopped: 'stopped',
  pending: 'pending',
  terminated: 'error',
};

const allInstances: Instance[] = [
  {
    id: 'i-001',
    name: 'web-server-1',
    type: 't3.medium',
    az: 'us-east-1a',
    state: 'running',
    cpuUtilization: 45.2,
    memoryUtilization: 62.8,
    networkIn: 1250,
    networkOut: 890,
    monthlyCost: 30.4,
    spotPrice: 0.0416,
    launchDate: '2025-01-15',
  },
  {
    id: 'i-002',
    name: 'api-server-1',
    type: 't3.large',
    az: 'us-east-1b',
    state: 'running',
    cpuUtilization: 78.5,
    memoryUtilization: 81.2,
    networkIn: 3420,
    networkOut: 2890,
    monthlyCost: 60.8,
    spotPrice: 0.0832,
    launchDate: '2025-02-20',
  },
  {
    id: 'i-003',
    name: 'db-server-1',
    type: 'r5.xlarge',
    az: 'us-east-1c',
    state: 'running',
    cpuUtilization: 23.1,
    memoryUtilization: 45.6,
    networkIn: 890,
    networkOut: 450,
    monthlyCost: 201.6,
    spotPrice: 0.252,
    launchDate: '2024-11-03',
  },
  {
    id: 'i-004',
    name: 'cache-server-1',
    type: 'r5.large',
    az: 'us-east-1a',
    state: 'stopped',
    cpuUtilization: 0,
    memoryUtilization: 0,
    networkIn: 0,
    networkOut: 0,
    monthlyCost: 100.8,
    spotPrice: 0.126,
    launchDate: '2024-08-12',
  },
  {
    id: 'i-005',
    name: 'worker-1',
    type: 'c5.2xlarge',
    az: 'us-east-1d',
    state: 'running',
    cpuUtilization: 91.3,
    memoryUtilization: 88.7,
    networkIn: 4560,
    networkOut: 3210,
    monthlyCost: 248.0,
    spotPrice: 0.34,
    launchDate: '2025-03-01',
  },
  {
    id: 'i-006',
    name: 'batch-processor',
    type: 'c5.xlarge',
    az: 'us-east-1a',
    state: 'pending',
    cpuUtilization: 0,
    memoryUtilization: 0,
    networkIn: 0,
    networkOut: 0,
    monthlyCost: 124.0,
    spotPrice: 0.17,
    launchDate: '2025-03-25',
  },
  {
    id: 'i-007',
    name: 'ml-training-1',
    type: 'p3.2xlarge',
    az: 'us-east-1b',
    state: 'running',
    cpuUtilization: 95.8,
    memoryUtilization: 92.1,
    networkIn: 8900,
    networkOut: 7200,
    monthlyCost: 2203.2,
    spotPrice: 0.918,
    launchDate: '2025-01-10',
  },
  {
    id: 'i-008',
    name: 'dev-server-1',
    type: 't3.micro',
    az: 'us-east-1c',
    state: 'stopped',
    cpuUtilization: 0,
    memoryUtilization: 0,
    networkIn: 0,
    networkOut: 0,
    monthlyCost: 7.6,
    spotPrice: 0.0031,
    launchDate: '2024-06-15',
  },
  {
    id: 'i-009',
    name: 'load-balancer-1',
    type: 't3.small',
    az: 'us-east-1a',
    state: 'running',
    cpuUtilization: 12.4,
    memoryUtilization: 28.3,
    networkIn: 15600,
    networkOut: 14200,
    monthlyCost: 15.2,
    spotPrice: 0.0104,
    launchDate: '2024-12-01',
  },
  {
    id: 'i-010',
    name: 'monitoring-1',
    type: 't3.medium',
    az: 'us-east-1b',
    state: 'running',
    cpuUtilization: 34.7,
    memoryUtilization: 55.9,
    networkIn: 2100,
    networkOut: 1800,
    monthlyCost: 30.4,
    spotPrice: 0.0416,
    launchDate: '2025-02-14',
  },
  {
    id: 'i-011',
    name: 'staging-web',
    type: 't3.medium',
    az: 'us-east-1c',
    state: 'terminated',
    cpuUtilization: 0,
    memoryUtilization: 0,
    networkIn: 0,
    networkOut: 0,
    monthlyCost: 0,
    spotPrice: 0.0416,
    launchDate: '2024-05-20',
  },
  {
    id: 'i-012',
    name: 'analytics-1',
    type: 'r5.2xlarge',
    az: 'us-east-1a',
    state: 'running',
    cpuUtilization: 67.2,
    memoryUtilization: 78.4,
    networkIn: 5600,
    networkOut: 4300,
    monthlyCost: 403.2,
    spotPrice: 0.504,
    launchDate: '2025-01-28',
  },
  {
    id: 'i-013',
    name: 'queue-worker-1',
    type: 'c5.large',
    az: 'us-east-1b',
    state: 'running',
    cpuUtilization: 55.1,
    memoryUtilization: 42.3,
    networkIn: 1800,
    networkOut: 1200,
    monthlyCost: 62.0,
    spotPrice: 0.085,
    launchDate: '2025-03-10',
  },
  {
    id: 'i-014',
    name: 'search-node-1',
    type: 'r5.xlarge',
    az: 'us-east-1c',
    state: 'running',
    cpuUtilization: 41.8,
    memoryUtilization: 71.2,
    networkIn: 3200,
    networkOut: 2800,
    monthlyCost: 201.6,
    spotPrice: 0.252,
    launchDate: '2024-10-05',
  },
  {
    id: 'i-015',
    name: 'gateway-1',
    type: 't3.large',
    az: 'us-east-1a',
    state: 'running',
    cpuUtilization: 28.9,
    memoryUtilization: 35.6,
    networkIn: 12400,
    networkOut: 11800,
    monthlyCost: 60.8,
    spotPrice: 0.0832,
    launchDate: '2024-09-18',
  },
];

// ============================================================================
// Column definitions with editConfig for inline editing tests
// ============================================================================

const columnDefinitions: TableProps.ColumnDefinition<Instance>[] = [
  {
    id: 'id',
    header: 'Instance ID',
    cell: item => <Link href="#">{item.id}</Link>,
    sortingField: 'id',
    isRowHeader: true,
    minWidth: 160,
  },
  {
    id: 'name',
    header: 'Name',
    cell: item => item.name,
    sortingField: 'name',
    minWidth: 180,
    editConfig: {
      ariaLabel: 'Edit name',
      editIconAriaLabel: 'editable',
      errorIconAriaLabel: 'Error',
      editingCell: (item, { currentValue, setValue }) => (
        <Input
          autoFocus={true}
          value={currentValue ?? item.name}
          onChange={event => setValue(event.detail.value)}
          ariaLabel="Edit instance name"
        />
      ),
    },
  },
  {
    id: 'type',
    header: 'Instance type',
    cell: item => item.type,
    sortingField: 'type',
    minWidth: 140,
  },
  {
    id: 'az',
    header: 'Availability zone',
    cell: item => item.az,
    sortingField: 'az',
    minWidth: 160,
  },
  {
    id: 'state',
    header: 'State',
    cell: item => <StatusIndicator type={stateIndicator[item.state]}>{item.state}</StatusIndicator>,
    sortingField: 'state',
    minWidth: 130,
  },
  {
    id: 'cpuUtilization',
    header: 'CPU (%)',
    cell: item => `${item.cpuUtilization.toFixed(1)}%`,
    sortingField: 'cpuUtilization',
    minWidth: 110,
  },
  {
    id: 'memoryUtilization',
    header: 'Memory (%)',
    cell: item => `${item.memoryUtilization.toFixed(1)}%`,
    sortingField: 'memoryUtilization',
    minWidth: 120,
  },
  {
    id: 'networkIn',
    header: 'Network in (MB/s)',
    cell: item => item.networkIn.toLocaleString(),
    sortingField: 'networkIn',
    minWidth: 150,
  },
  {
    id: 'networkOut',
    header: 'Network out (MB/s)',
    cell: item => item.networkOut.toLocaleString(),
    sortingField: 'networkOut',
    minWidth: 160,
  },
  {
    id: 'monthlyCost',
    header: 'Monthly cost ($)',
    cell: item => `$${item.monthlyCost.toFixed(2)}`,
    sortingField: 'monthlyCost',
    minWidth: 150,
    editConfig: {
      ariaLabel: 'Edit monthly cost',
      editIconAriaLabel: 'editable',
      errorIconAriaLabel: 'Error',
      editingCell: (item, { currentValue, setValue }) => (
        <Input
          autoFocus={true}
          value={currentValue ?? String(item.monthlyCost)}
          onChange={event => setValue(event.detail.value)}
          ariaLabel="Edit monthly cost"
          inputMode="decimal"
        />
      ),
      validation: (_item, value) => {
        if (value !== undefined && isNaN(Number(value))) {
          return 'Must be a number';
        }
        return undefined;
      },
    },
  },
  {
    id: 'spotPrice',
    header: 'Spot price ($/hr)',
    cell: item => `$${item.spotPrice.toFixed(4)}`,
    sortingField: 'spotPrice',
    minWidth: 150,
  },
  {
    id: 'launchDate',
    header: 'Launch date',
    cell: item => item.launchDate,
    sortingField: 'launchDate',
    minWidth: 140,
  },
];

// ============================================================================
// Group definitions (supports flat + nested)
// ============================================================================

const groupDefinitions: TableProps.GroupDefinition<Instance>[] = [
  { id: 'identity', header: 'Identity' },
  { id: 'configuration', header: 'Configuration' },
  { id: 'performance', header: 'Performance' },
  { id: 'metrics', header: 'Metrics' },
  { id: 'network', header: 'Network' },
  { id: 'cost', header: 'Cost' },
];

// ============================================================================
// Column display presets
// ============================================================================

type GroupingPreset = 'nested' | 'flat' | 'single-level' | 'mixed' | 'single-child-groups';

const columnDisplayPresets: Record<GroupingPreset, TableProps.ColumnDisplayProperties[]> = {
  flat: [
    { id: 'id', visible: true },
    { id: 'name', visible: true },
    { id: 'type', visible: true },
    { id: 'az', visible: true },
    { id: 'state', visible: true },
    { id: 'cpuUtilization', visible: true },
    { id: 'memoryUtilization', visible: true },
    { id: 'networkIn', visible: true },
    { id: 'networkOut', visible: true },
    { id: 'monthlyCost', visible: true },
    { id: 'spotPrice', visible: true },
    { id: 'launchDate', visible: true },
  ],
  'single-level': [
    { id: 'id', visible: true },
    { id: 'name', visible: true },
    {
      type: 'group',
      id: 'configuration',
      visible: true,
      children: [
        { id: 'type', visible: true },
        { id: 'az', visible: true },
        { id: 'state', visible: true },
      ],
    },
    {
      type: 'group',
      id: 'performance',
      visible: true,
      children: [
        { id: 'cpuUtilization', visible: true },
        { id: 'memoryUtilization', visible: true },
      ],
    },
    {
      type: 'group',
      id: 'network',
      visible: true,
      children: [
        { id: 'networkIn', visible: true },
        { id: 'networkOut', visible: true },
      ],
    },
    {
      type: 'group',
      id: 'cost',
      visible: true,
      children: [
        { id: 'monthlyCost', visible: true },
        { id: 'spotPrice', visible: true },
      ],
    },
    { id: 'launchDate', visible: true },
  ],
  nested: [
    { id: 'id', visible: true },
    { id: 'name', visible: true },
    {
      type: 'group',
      id: 'configuration',
      visible: true,
      children: [
        { id: 'type', visible: true },
        { id: 'az', visible: true },
        { id: 'state', visible: true },
      ],
    },
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
          ],
        },
        {
          type: 'group',
          id: 'network',
          visible: true,
          children: [
            { id: 'networkIn', visible: true },
            { id: 'networkOut', visible: true },
          ],
        },
      ],
    },
    {
      type: 'group',
      id: 'cost',
      visible: true,
      children: [
        { id: 'monthlyCost', visible: true },
        { id: 'spotPrice', visible: true },
      ],
    },
    { id: 'launchDate', visible: true },
  ],
  mixed: [
    { id: 'id', visible: true },
    {
      type: 'group',
      id: 'identity',
      visible: true,
      children: [
        { id: 'name', visible: true },
        { id: 'type', visible: true },
      ],
    },
    { id: 'az', visible: true },
    { id: 'state', visible: true },
    {
      type: 'group',
      id: 'performance',
      visible: true,
      children: [
        { id: 'cpuUtilization', visible: true },
        { id: 'memoryUtilization', visible: true },
      ],
    },
    { id: 'networkIn', visible: true },
    { id: 'networkOut', visible: true },
    {
      type: 'group',
      id: 'cost',
      visible: true,
      children: [
        { id: 'monthlyCost', visible: true },
        { id: 'spotPrice', visible: true },
      ],
    },
    { id: 'launchDate', visible: true },
  ],
  'single-child-groups': [
    { id: 'id', visible: true },
    { id: 'name', visible: true },
    {
      type: 'group',
      id: 'configuration',
      visible: true,
      children: [{ id: 'type', visible: true }],
    },
    { id: 'az', visible: true },
    { id: 'state', visible: true },
    {
      type: 'group',
      id: 'performance',
      visible: true,
      children: [{ id: 'cpuUtilization', visible: true }],
    },
    {
      type: 'group',
      id: 'cost',
      visible: true,
      children: [{ id: 'monthlyCost', visible: true }],
    },
    { id: 'launchDate', visible: true },
  ],
};

const groupingPresetOptions = [
  { value: 'single-level', label: 'Single-level groups' },
  { value: 'nested', label: 'Nested groups (3 levels)' },
  { value: 'mixed', label: 'Mixed grouped + ungrouped' },
  { value: 'single-child-groups', label: 'Single-child groups' },
  { value: 'flat', label: 'No grouping (flat) current ¯\\_(ツ)_/¯' },
];

// ============================================================================
// Collection preferences config
// ============================================================================

const collectionPreferencesProps: CollectionPreferencesProps<unknown> = {
  title: 'Preferences',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  pageSizePreference: {
    title: 'Page size',
    options: [
      { value: 5, label: '5 instances' },
      { value: 10, label: '10 instances' },
      { value: 15, label: '15 instances' },
    ],
  },
  wrapLinesPreference: {
    label: 'Wrap lines',
    description: 'Wrap long text in table cells',
  },
  stripedRowsPreference: {
    label: 'Striped rows',
    description: 'Alternate row shading',
  },
  contentDensityPreference: {
    label: 'Compact mode',
    description: 'Reduce spacing between rows',
  },
  stickyColumnsPreference: {
    firstColumns: {
      title: 'First column(s)',
      description: 'Keep the first column(s) visible while scrolling horizontally',
      options: [
        { label: 'None', value: 0 },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
      ],
    },
    lastColumns: {
      title: 'Last column(s)',
      description: 'Keep the last column(s) visible while scrolling horizontally',
      options: [
        { label: 'None', value: 0 },
        { label: '1', value: 1 },
      ],
    },
  },
  contentDisplayPreference: {
    title: 'Column preferences',
    description: 'Customize column visibility and order.',
    options: [
      { id: 'id', label: 'Instance ID', alwaysVisible: true },
      { id: 'name', label: 'Name' },
      { id: 'type', label: 'Instance type' },
      { id: 'az', label: 'Availability zone' },
      { id: 'state', label: 'State' },
      { id: 'cpuUtilization', label: 'CPU (%)' },
      { id: 'memoryUtilization', label: 'Memory (%)' },
      { id: 'networkIn', label: 'Network in (MB/s)' },
      { id: 'networkOut', label: 'Network out (MB/s)' },
      { id: 'monthlyCost', label: 'Monthly cost ($)' },
      { id: 'spotPrice', label: 'Spot price ($/hr)' },
      { id: 'launchDate', label: 'Launch date' },
    ],
    groups: [
      { id: 'identity', label: 'Identity' },
      { id: 'configuration', label: 'Configuration' },
      { id: 'performance', label: 'Performance' },
      { id: 'metrics', label: 'Metrics' },
      { id: 'network', label: 'Network' },
      { id: 'cost', label: 'Cost' },
    ],
    enableColumnFiltering: true,
    ...contentDisplayPreferenceI18nStrings,
  },
};

// ============================================================================
// Helpers
// ============================================================================

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

// ============================================================================
// URL params type
// ============================================================================

type DemoContext = React.Context<
  AppContextType<{
    groupingPreset: GroupingPreset;
    variant: TableProps.Variant;
    selectionType: string;
    resizable: boolean;
    stickyHeader: boolean;
    stickyHeaderOffset: number;
    firstSticky: number;
    lastSticky: number;
    wrapLines: boolean;
    stripedRows: boolean;
    contentDensity: string;
    enableKeyboardNavigation: boolean;
    loading: boolean;
    empty: boolean;
    cellVerticalAlign: string;
    sortingDisabled: boolean;
    enableColumnFiltering: boolean;
  }>
>;

// ============================================================================
// Main page component
// ============================================================================

export default function GroupedColumnsBugBash() {
  const {
    urlParams: {
      direction = 'ltr' as 'ltr' | 'rtl',
      groupingPreset = 'single-level' as GroupingPreset,
      variant = 'container' as TableProps.Variant,
      selectionType = 'multi',
      resizable = true,
      stickyHeader = false,
      stickyHeaderOffset = 0,
      firstSticky = 0,
      lastSticky = 0,
      wrapLines = false,
      stripedRows = false,
      contentDensity = 'comfortable',
      enableKeyboardNavigation = true,
      loading = false,
      empty = false,
      cellVerticalAlign = 'middle',
      sortingDisabled = false,
      enableColumnFiltering = true,
    },
    setUrlParams,
  } = useContext(AppContext as DemoContext);

  const [preferences, setPreferences] = useState<CollectionPreferencesProps['preferences']>({
    pageSize: 10,
    contentDisplay: columnDisplayPresets[groupingPreset],
    wrapLines,
    stripedRows,
    contentDensity: contentDensity as 'comfortable' | 'compact',
    stickyColumns: { first: +firstSticky, last: +lastSticky },
  });

  // Sync preferences when URL params change
  const effectiveColumnDisplay = preferences?.contentDisplay ?? columnDisplayPresets[groupingPreset];

  const ariaLabels: TableProps<Instance>['ariaLabels'] = {
    selectionGroupLabel: 'Instance selection',
    allItemsSelectionLabel: ({ selectedItems }) =>
      `${selectedItems.length} ${selectedItems.length === 1 ? 'instance' : 'instances'} selected`,
    itemSelectionLabel: ({ selectedItems }, item) => {
      const isSelected = selectedItems.includes(item);
      return `${item.name} is ${isSelected ? '' : 'not '}selected`;
    },
    tableLabel: 'Instances',
    resizerRoleDescription: 'Resize button',
    activateEditLabel: (column, item) => `Edit ${column.header} for ${item.name}`,
    cancelEditLabel: column => `Cancel editing ${column.header}`,
    submitEditLabel: column => `Submit edit for ${column.header}`,
    successfulEditLabel: column => `Successfully edited ${column.header}`,
    submittingEditText: column => `Submitting edit for ${column.header}`,
  };

  const tableItems = empty ? [] : allInstances;

  const { items, actions, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(
    tableItems,
    {
      filtering: {
        empty: <EmptyState title="No instances" subtitle="No instances to display." />,
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

  const handleSubmitEdit: TableProps.SubmitEditFunction<Instance> = async () => {
    // Simulate async save
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  // Determine if we should pass groupDefinitions (not for flat preset)
  const effectiveGroupDefinitions = groupingPreset === 'flat' ? undefined : groupDefinitions;

  return (
    <SimplePage title="Column Grouping - Feature Combination page" i18n={{}} screenshotArea={{}}>
      <SpaceBetween size="l">
        {/* ============================================================ */}
        {/* Control panel */}
        {/* ============================================================ */}
        <SpaceBetween size="xs">
          <Header variant="h2" description="Toggle features to test every combination with column grouping, go crazy :">
            Feature controls
          </Header>

          {/* Row 1: Grouping preset + variant + selection */}
          <SpaceBetween size="m" direction="horizontal" alignItems="end">
            <FormField label="Grouping preset">
              <Select
                selectedOption={groupingPresetOptions.find(o => o.value === groupingPreset) ?? groupingPresetOptions[1]}
                options={groupingPresetOptions}
                onChange={({ detail }) => {
                  const preset = detail.selectedOption.value as GroupingPreset;
                  setUrlParams({ groupingPreset: preset });
                  setPreferences(prev => ({ ...prev, contentDisplay: columnDisplayPresets[preset] }));
                }}
                ariaLabel="Grouping preset"
              />
            </FormField>
            <FormField label="Table variant">
              <Select
                selectedOption={{ value: variant, label: variant }}
                options={[
                  { value: 'container', label: 'container' },
                  { value: 'borderless', label: 'borderless' },
                  { value: 'stacked', label: 'stacked' },
                  { value: 'embedded', label: 'embedded' },
                  { value: 'full-page', label: 'full-page' },
                ]}
                onChange={({ detail }) => setUrlParams({ variant: detail.selectedOption.value as TableProps.Variant })}
                ariaLabel="Table variant"
              />
            </FormField>
            <FormField label="Selection type">
              <Select
                selectedOption={{ value: selectionType, label: selectionType }}
                options={[
                  { value: 'none', label: 'none' },
                  { value: 'single', label: 'single' },
                  { value: 'multi', label: 'multi' },
                ]}
                onChange={({ detail }) => setUrlParams({ selectionType: detail.selectedOption.value! })}
                ariaLabel="Selection type"
              />
            </FormField>
            <FormField label="Cell vertical align">
              <Select
                selectedOption={{ value: cellVerticalAlign, label: cellVerticalAlign }}
                options={[
                  { value: 'middle', label: 'middle' },
                  { value: 'top', label: 'top' },
                ]}
                onChange={({ detail }) => setUrlParams({ cellVerticalAlign: detail.selectedOption.value! })}
                ariaLabel="Cell vertical align"
              />
            </FormField>
          </SpaceBetween>

          {/* Row 2: Sticky columns */}
          <SpaceBetween size="m" direction="horizontal" alignItems="end">
            <FormField label="Sticky first columns">
              <Input
                ariaLabel="First sticky column count"
                onChange={({ detail }) => setUrlParams({ firstSticky: +detail.value })}
                value={String(firstSticky)}
                inputMode="numeric"
                type="number"
              />
            </FormField>
            <FormField label="Sticky last columns">
              <Input
                ariaLabel="Last sticky column count"
                onChange={({ detail }) => setUrlParams({ lastSticky: +detail.value })}
                value={String(lastSticky)}
                inputMode="numeric"
                type="number"
              />
            </FormField>
            <FormField label="Sticky header offset (px)">
              <Input
                ariaLabel="Sticky header vertical offset"
                onChange={({ detail }) => setUrlParams({ stickyHeaderOffset: +detail.value })}
                value={String(stickyHeaderOffset)}
                inputMode="numeric"
                type="number"
              />
            </FormField>
          </SpaceBetween>

          {/* Row 3: Toggles */}
          <SpaceBetween size="m" direction="horizontal" alignItems="center">
            <Toggle checked={resizable} onChange={({ detail }) => setUrlParams({ resizable: detail.checked })}>
              Resizable columns
            </Toggle>
            <Toggle checked={stickyHeader} onChange={({ detail }) => setUrlParams({ stickyHeader: detail.checked })}>
              Sticky header
            </Toggle>
            <Toggle checked={wrapLines} onChange={({ detail }) => setUrlParams({ wrapLines: detail.checked })}>
              Wrap lines
            </Toggle>
            <Toggle checked={stripedRows} onChange={({ detail }) => setUrlParams({ stripedRows: detail.checked })}>
              Striped rows
            </Toggle>
            <Toggle
              checked={contentDensity === 'compact'}
              onChange={({ detail }) => setUrlParams({ contentDensity: detail.checked ? 'compact' : 'comfortable' })}
            >
              Compact mode
            </Toggle>
            <Toggle
              checked={enableKeyboardNavigation}
              onChange={({ detail }) => setUrlParams({ enableKeyboardNavigation: detail.checked })}
            >
              Keyboard navigation
            </Toggle>
            <Toggle
              checked={sortingDisabled}
              onChange={({ detail }) => setUrlParams({ sortingDisabled: detail.checked })}
            >
              Sorting disabled
            </Toggle>
            <Toggle checked={loading} onChange={({ detail }) => setUrlParams({ loading: detail.checked })}>
              Loading state
            </Toggle>
            <Toggle checked={empty} onChange={({ detail }) => setUrlParams({ empty: detail.checked })}>
              Empty state
            </Toggle>
            <Toggle
              checked={direction === 'rtl'}
              onChange={({ detail }) => {
                setUrlParams({ direction: detail.checked ? 'rtl' : 'ltr' });
              }}
            >
              RTL
            </Toggle>
            <Toggle
              checked={enableColumnFiltering}
              onChange={({ detail }) => setUrlParams({ enableColumnFiltering: detail.checked })}
            >
              Column filtering
            </Toggle>
          </SpaceBetween>
        </SpaceBetween>

        {/* ============================================================ */}
        {/* The table */}
        {/* ============================================================ */}
        <div dir={direction}>
          <Table
            {...collectionProps}
            selectionType={selectionType === 'none' ? undefined : (selectionType as TableProps.SelectionType)}
            resizableColumns={resizable}
            stickyHeader={stickyHeader}
            stickyHeaderVerticalOffset={stickyHeaderOffset}
            stickyColumns={{ first: +firstSticky, last: +lastSticky }}
            variant={variant}
            enableKeyboardNavigation={enableKeyboardNavigation}
            wrapLines={wrapLines}
            stripedRows={stripedRows}
            contentDensity={contentDensity as 'comfortable' | 'compact'}
            cellVerticalAlign={cellVerticalAlign as 'middle' | 'top'}
            sortingDisabled={sortingDisabled}
            loading={loading}
            loadingText="Loading instances..."
            ariaLabels={ariaLabels}
            columnDefinitions={columnDefinitions}
            groupDefinitions={effectiveGroupDefinitions}
            columnDisplay={effectiveColumnDisplay}
            items={items}
            trackBy="id"
            totalItemsCount={tableItems.length}
            firstIndex={1}
            submitEdit={handleSubmitEdit}
            isItemDisabled={item => item.state === 'terminated'}
            renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) =>
              `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
            }
            onColumnWidthsChange={({ detail }) => {
              console.log('Column widths changed:', detail.widths);
            }}
            header={
              <Header
                variant={variant === 'full-page' ? 'awsui-h1-sticky' : 'h2'}
                counter={
                  selectedItems && selectedItems.length
                    ? `(${selectedItems.length}/${tableItems.length})`
                    : `(${tableItems.length})`
                }
                description="Feature Combination test page — toggle features above to test every combination"
                actions={
                  <SpaceBetween size="xs" direction="horizontal">
                    <Button disabled={!selectedItems?.length}>Stop</Button>
                    <Button disabled={!selectedItems?.length}>Terminate</Button>
                    <Button variant="primary">Launch instance</Button>
                  </SpaceBetween>
                }
              >
                Instances
              </Header>
            }
            filter={
              <TextFilter
                {...filterProps}
                countText={`${filteredItemsCount} ${filteredItemsCount === 1 ? 'match' : 'matches'}`}
                filteringPlaceholder="Find instances"
              />
            }
            pagination={<Pagination {...paginationProps} />}
            preferences={
              <CollectionPreferences
                {...collectionPreferencesProps}
                contentDisplayPreference={{
                  ...collectionPreferencesProps.contentDisplayPreference!,
                  enableColumnFiltering,
                }}
                preferences={preferences}
                onConfirm={({ detail }) => setPreferences(detail)}
              />
            }
            empty={
              <EmptyState
                title="No instances"
                subtitle="No instances to display."
                action={<Button>Launch instance</Button>}
              />
            }
          />
        </div>
      </SpaceBetween>
      <SpaceBetween size={'xxl'}>lol</SpaceBetween>
    </SimplePage>
  );
}
