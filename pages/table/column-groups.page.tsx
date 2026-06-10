// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';

import {
  Box,
  CollectionPreferences,
  FormField,
  Header,
  Input,
  Link,
  Pagination,
  Select,
  SpaceBetween,
  Table,
  TableProps,
  TextFilter,
  Toggle,
} from '~components';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

// ============================================================================
// Data
// ============================================================================

interface Instance {
  id: string;
  name: string;
  type: string;
  az: string;
  state: string;
  cpu: number;
  memory: number;
  netIn: number;
  netOut: number;
  cost: number;
}

const TYPES = ['t3.medium', 't3.large', 'r5.xlarge', 'c5.large', 'p3.2xlarge'];
const AZS = ['us-east-1a', 'us-east-1b', 'us-east-1c', 'us-east-1d'];
const STATES = ['running', 'stopped', 'pending'];

const allInstances: Instance[] = Array.from({ length: 35 }, (_, i) => ({
  id: `i-${String(i + 1).padStart(3, '0')}`,
  name: `instance-${i + 1}`,
  type: TYPES[i % TYPES.length],
  az: AZS[i % AZS.length],
  state: STATES[i % STATES.length],
  cpu: +(Math.random() * 100).toFixed(1),
  memory: +(Math.random() * 100).toFixed(1),
  netIn: Math.round(Math.random() * 10000),
  netOut: Math.round(Math.random() * 10000),
  cost: +(Math.random() * 500).toFixed(2),
}));

// ============================================================================
// Column & group definitions
// ============================================================================

const columnDefinitions: TableProps.ColumnDefinition<Instance>[] = [
  {
    id: 'id',
    header: 'Instance ID',
    cell: item => <Link href="#">{item.id}</Link>,
    sortingField: 'id',
    isRowHeader: true,
  },
  { id: 'name', header: 'Name', cell: item => item.name, sortingField: 'name' },
  { id: 'type', header: 'Type', cell: item => item.type, sortingField: 'type' },
  { id: 'az', header: 'AZ', cell: item => item.az, sortingField: 'az' },
  { id: 'state', header: 'State', cell: item => item.state, sortingField: 'state' },
  { id: 'cpu', header: 'CPU (%)', cell: item => `${item.cpu}%`, sortingField: 'cpu' },
  { id: 'memory', header: 'Memory (%)', cell: item => `${item.memory}%`, sortingField: 'memory' },
  { id: 'netIn', header: 'Network in', cell: item => item.netIn.toLocaleString(), sortingField: 'netIn' },
  { id: 'netOut', header: 'Network out', cell: item => item.netOut.toLocaleString(), sortingField: 'netOut' },
  { id: 'cost', header: 'Cost ($)', cell: item => `$${item.cost}`, sortingField: 'cost' },
];

const groupDefinitions: TableProps.GroupDefinition[] = [
  { id: 'config', header: 'Configuration' },
  { id: 'performance', header: 'Performance' },
  { id: 'network', header: 'Network' },
  { id: 'metrics', header: 'Metrics' },
];

// ============================================================================
// Column display presets
// ============================================================================

type GroupingPreset = 'flat' | 'single-level' | 'nested' | 'single-child-groups';

const columnDisplayPresets: Record<GroupingPreset, TableProps.ColumnDisplayProperties[]> = {
  flat: [
    { id: 'id', visible: true },
    { id: 'name', visible: true },
    { id: 'type', visible: true },
    { id: 'az', visible: true },
    { id: 'state', visible: true },
    { id: 'cpu', visible: true },
    { id: 'memory', visible: true },
    { id: 'netIn', visible: true },
    { id: 'netOut', visible: true },
    { id: 'cost', visible: true },
  ],
  'single-level': [
    { id: 'id', visible: true },
    { id: 'name', visible: true },
    {
      type: 'group',
      id: 'config',
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
        { id: 'cpu', visible: true },
        { id: 'memory', visible: true },
      ],
    },
    {
      type: 'group',
      id: 'network',
      visible: true,
      children: [
        { id: 'netIn', visible: true },
        { id: 'netOut', visible: true },
      ],
    },
    { id: 'cost', visible: true },
  ],
  nested: [
    { id: 'id', visible: true },
    { id: 'name', visible: true },
    {
      type: 'group',
      id: 'config',
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
            { id: 'cpu', visible: true },
            { id: 'memory', visible: true },
          ],
        },
        {
          type: 'group',
          id: 'network',
          visible: true,
          children: [
            { id: 'netIn', visible: true },
            { id: 'netOut', visible: true },
          ],
        },
      ],
    },
    { id: 'cost', visible: true },
  ],
  'single-child-groups': [
    { id: 'id', visible: true },
    { id: 'name', visible: true },
    { type: 'group', id: 'config', visible: true, children: [{ id: 'type', visible: true }] },
    { id: 'az', visible: true },
    { id: 'state', visible: true },
    { type: 'group', id: 'performance', visible: true, children: [{ id: 'cpu', visible: true }] },
    { id: 'memory', visible: true },
    { id: 'netIn', visible: true },
    { id: 'netOut', visible: true },
    { id: 'cost', visible: true },
  ],
};

const presetOptions = [
  { value: 'single-level', label: 'Single-level groups' },
  { value: 'nested', label: 'Nested groups (3 levels)' },
  { value: 'single-child-groups', label: 'Single-child groups' },
  { value: 'flat', label: 'Without grouping' },
];

// ============================================================================
// Page component
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
    contentDensity: 'comfortable' | 'compact' | undefined;
    enableKeyboardNavigation: boolean;
    loading: boolean;
    empty: boolean;
    cellVerticalAlign: string;
    sortingDisabled: boolean;
  }>
>;

export default function ColumnGroupsPage() {
  const {
    urlParams: {
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
    },
    setUrlParams,
  } = useContext(AppContext as DemoContext);

  const [columnDisplay, setColumnDisplay] = useState<TableProps.ColumnDisplayProperties[]>(
    columnDisplayPresets[groupingPreset]
  );

  const tableItems = empty ? [] : allInstances;

  const { items, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(tableItems, {
    filtering: {
      empty: <Box textAlign="center">No instances</Box>,
      noMatch: <Box textAlign="center">No matches</Box>,
    },
    pagination: { pageSize: 25 },
    sorting: {},
    selection: {},
  });

  return (
    <SimplePage
      title="Column Grouping - Feature Combinations"
      i18n={{}}
      screenshotArea={{}}
      settings={
        <SpaceBetween size="xs">
          <Header variant="h2" description="Toggle features to test every combination with column grouping">
            Feature controls
          </Header>

          <SpaceBetween size="m" direction="horizontal" alignItems="end">
            <FormField label="Grouping preset">
              <Select
                selectedOption={presetOptions.find(o => o.value === groupingPreset) ?? presetOptions[0]}
                options={presetOptions}
                onChange={({ detail }) => {
                  const preset = detail.selectedOption.value as GroupingPreset;
                  setUrlParams({ groupingPreset: preset });
                  setColumnDisplay(columnDisplayPresets[preset]);
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
          </SpaceBetween>
        </SpaceBetween>
      }
    >
      <Table
        {...collectionProps}
        columnDefinitions={columnDefinitions}
        groupDefinitions={groupingPreset === 'flat' ? undefined : groupDefinitions}
        columnDisplay={columnDisplay}
        items={items}
        trackBy="id"
        selectionType={selectionType === 'none' ? undefined : (selectionType as TableProps.SelectionType)}
        resizableColumns={resizable}
        stickyHeader={stickyHeader}
        stickyHeaderVerticalOffset={stickyHeaderOffset}
        stickyColumns={{ first: +firstSticky, last: +lastSticky }}
        variant={variant}
        enableKeyboardNavigation={enableKeyboardNavigation}
        wrapLines={wrapLines}
        stripedRows={stripedRows}
        contentDensity={contentDensity}
        cellVerticalAlign={cellVerticalAlign as 'middle' | 'top'}
        sortingDisabled={sortingDisabled}
        loading={loading}
        loadingText="Loading..."
        ariaLabels={{
          tableLabel: 'Instances',
          selectionGroupLabel: 'Selection',
          allItemsSelectionLabel: ({ selectedItems }) => `${selectedItems.length} items selected`,
          itemSelectionLabel: (_, item) => `Select ${item.name}`,
        }}
        header={<Header counter={`(${tableItems.length})`}>Instances</Header>}
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
            preferences={{ contentDisplay: columnDisplay, wrapLines, stripedRows, contentDensity }}
            onConfirm={({ detail }) => {
              if (detail.contentDisplay) {
                setColumnDisplay([...detail.contentDisplay]);
              }
              setUrlParams({
                wrapLines: detail.wrapLines ?? false,
                stripedRows: detail.stripedRows ?? false,
                contentDensity: detail.contentDensity ?? 'comfortable',
              });
            }}
            wrapLinesPreference={{}}
            stripedRowsPreference={{}}
            contentDensityPreference={{}}
            contentDisplayPreference={{
              options: [
                { id: 'id', label: 'Instance ID', alwaysVisible: true },
                { id: 'name', label: 'Name' },
                { id: 'type', label: 'Type' },
                { id: 'az', label: 'AZ' },
                { id: 'state', label: 'State' },
                { id: 'cpu', label: 'CPU (%)' },
                { id: 'memory', label: 'Memory (%)' },
                { id: 'netIn', label: 'Network in' },
                { id: 'netOut', label: 'Network out' },
                { id: 'cost', label: 'Cost ($)' },
              ],
              groups:
                groupingPreset === 'flat'
                  ? undefined
                  : [
                      { id: 'config', label: 'Configuration' },
                      { id: 'performance', label: 'Performance' },
                      { id: 'network', label: 'Network' },
                      { id: 'metrics', label: 'Metrics' },
                    ],
            }}
          />
        }
        empty={<Box textAlign="center">No instances</Box>}
      />
    </SimplePage>
  );
}
