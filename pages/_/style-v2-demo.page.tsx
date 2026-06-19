// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';

import { Box, CollectionPreferencesProps, Header } from '~components';
import { StatusIndicatorProps } from '~components/status-indicator';
import { TableProps } from '~components/table';

import { SimplePage } from '../app/templates';
import { ariaLabels, getHeaderCounterText, Instance, InstanceState } from '../table/expandable-rows/common';
import { allInstances } from '../table/expandable-rows/expandable-rows-data';
import { CheckboxFilter } from './styled/checkbox-filter';
import { CollectionPreferences } from './styled/collection-preferences';
import { Flashbar, FlashbarItem } from './styled/flashbar';
import { Link } from './styled/link';
import { Pagination } from './styled/pagination';
import { StatusIndicator } from './styled/status-indicator';
import { Table } from './styled/table';

// Expandable-rows wiring: the data is a flat list where each item points at its parent by name.
const expandableRows = {
  getId: (item: Instance) => item.name,
  getParentId: (item: Instance) => item.parentName,
};

const defaultPreferences: CollectionPreferencesProps.Preferences = {
  pageSize: 20,
  wrapLines: false,
  stickyColumns: { first: 1, last: 0 },
  contentDisplay: [
    { id: 'name', visible: true },
    { id: 'role', visible: true },
    { id: 'state', visible: true },
    { id: 'engine', visible: true },
    { id: 'region', visible: true },
    { id: 'size', visible: true },
    { id: 'selectsPerSecond', visible: false },
  ],
};

const stateToStatusIndicator: Record<InstanceState, StatusIndicatorProps> = {
  RUNNING: { type: 'success', children: 'Running' },
  STOPPED: { type: 'stopped', children: 'Stopped' },
  TERMINATED: { type: 'error', children: 'Terminated' },
};

// The page owns the column definitions (data). They use the styled Link + StatusIndicator proxies so
// the styling lives with the styled components, not in the table.
const columnDefinitions: TableProps.ColumnDefinition<Instance>[] = [
  {
    id: 'name',
    header: 'Name',
    cell: item => <Link href={`#${item.name}`}>{item.name}</Link>,
    sortingField: 'name',
    isRowHeader: true,
    minWidth: 200,
  },
  { id: 'role', header: 'Role', cell: item => item.role, sortingField: 'role' },
  {
    id: 'state',
    header: 'State',
    cell: item => <StatusIndicator {...stateToStatusIndicator[item.state]} />,
    sortingField: 'state',
  },
  { id: 'engine', header: 'Engine', cell: item => item.engine, sortingField: 'engine' },
  { id: 'region', header: 'Region', cell: item => item.region ?? item.regionGrouped, sortingField: 'region' },
  { id: 'size', header: 'Size', cell: item => item.size ?? item.sizeGrouped, sortingField: 'size' },
  {
    id: 'selectsPerSecond',
    header: 'Selects / sec',
    cell: item => item.selectsPerSecond ?? '-',
    sortingField: 'selectsPerSecond',
  },
];

export default function StyleV2DemoPage() {
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>(defaultPreferences);
  const [hideAll, setHideAll] = useState(false);

  // Notifications data: a regular error flash + a gen-ai message (the StyledFlashbar renders its
  // checkbox + styling). The page owns only the message data.
  const [visibleNotifications, setVisibleNotifications] = useState<ReadonlyArray<string>>(['error', 'genai']);
  const dismiss = (id: string) => setVisibleNotifications(prev => prev.filter(n => n !== id));

  const notifications = [
    {
      id: 'error',
      type: 'error',
      header: 'Failed to load 2 instances',
      content: 'Some instances could not be retrieved. Retry to load them again.',
      dismissible: true,
      onDismiss: () => dismiss('error'),
    } as FlashbarItem,
    {
      type: 'gen-ai',
      id: 'genai',
      header: 'Amazon Q can help',
      content: 'Ask Amazon Q to summarize, filter, or explain the instances in this table.',
      onDismiss: () => dismiss('genai'),
    } as FlashbarItem,
  ].filter(item => visibleNotifications.includes(item.id!));

  const { items, collectionProps, paginationProps } = useCollection(allInstances, {
    sorting: {},
    pagination: { pageSize: preferences.pageSize },
    selection: { trackBy: 'name' },
    expandableRows,
  });

  return (
    <SimplePage title="Style API v2 demo" screenshotArea={{}} i18n={{}}>
      <Table
        {...collectionProps}
        selectionType="multi"
        stickyHeader={true}
        resizableColumns={true}
        columnDefinitions={columnDefinitions}
        items={hideAll ? [] : items}
        ariaLabels={ariaLabels}
        wrapLines={preferences.wrapLines}
        stickyColumns={preferences.stickyColumns}
        columnDisplay={preferences.contentDisplay}
        pagination={<Pagination {...paginationProps} />}
        preferences={
          <CollectionPreferences preferences={preferences} onConfirm={({ detail }) => setPreferences(detail)} />
        }
        filter={
          <CheckboxFilter checked={hideAll} onChange={({ detail }) => setHideAll(detail.checked)}>
            Show human-generated data
          </CheckboxFilter>
        }
        header={<Header counter={getHeaderCounterText(allInstances, collectionProps.selectedItems)}>Instances</Header>}
        notifications={<Flashbar items={notifications} stackItems={true} />}
        empty={
          <Box textAlign="center" color="inherit">
            No instances to display
          </Box>
        }
      />
    </SimplePage>
  );
}
