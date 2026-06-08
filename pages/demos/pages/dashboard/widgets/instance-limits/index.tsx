// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Header from '@cloudscape-design/components/header';
import Link from '@cloudscape-design/components/link';
import StatusIndicator, { StatusIndicatorProps } from '@cloudscape-design/components/status-indicator';
import Table, { TableProps } from '@cloudscape-design/components/table';

import { isVisualRefresh } from '../../../../common/apply-mode';
import { WidgetConfig } from '../interfaces';

const WidgetContext = createContext<[string | null, Dispatch<SetStateAction<string | null>>]>([
  null,
  () => {
    // do nothing
  },
]);

function InstanceLimitsProvider({ children }: { children: React.ReactNode }) {
  const state = useState<string | null>(null);
  return <WidgetContext.Provider value={state}>{children}</WidgetContext.Provider>;
}

function InstanceLimitsHeader() {
  const [selectedId] = useContext(WidgetContext);
  return (
    <Header
      variant="h2"
      actions={
        <Button
          variant="normal"
          href="#"
          iconName="external"
          iconAlign="right"
          disabled={!selectedId}
          data-testid="instance-limits-increase-button"
        >
          Request limit increase
        </Button>
      }
    >
      On-demand instance limits
    </Header>
  );
}

function InstanceLimitsFooter() {
  return (
    <Box textAlign="center">
      <Link href="#" variant="primary">
        View all instance limits
      </Link>
    </Box>
  );
}

const instanceLimitsItems = [
  { name: 'Running on-demand all G instances', statusText: '900 used/920 limit', status: 'warning' },
  { name: 'Running on-demand all P instances', statusText: '692 used/692 limit', status: 'warning' },
  { name: 'Running on-demand all Standard instances', statusText: '50 used/10304 limit', status: 'success' },
  { name: 'Running on-demand all F instances', statusText: '0 used/176 limit', status: 'success' },
];
const instanceLimitsDefinition: Array<TableProps.ColumnDefinition<(typeof instanceLimitsItems)[0]>> = [
  {
    id: 'name',
    header: 'Name',
    cell: item => item.name,
    width: 320,
    isRowHeader: true,
  },
  {
    id: 'status',
    header: 'Status (usage/limit)',
    cell: ({ statusText, status }) => (
      <StatusIndicator type={status as StatusIndicatorProps.Type}>{statusText}</StatusIndicator>
    ),
  },
];

export default function InstanceLimitsContent() {
  const [selectedId, setSelectedId] = useContext(WidgetContext);

  return (
    <Table
      enableKeyboardNavigation={true}
      data-testid="instance-limits-table"
      variant="borderless"
      resizableColumns={true}
      items={instanceLimitsItems}
      columnDefinitions={instanceLimitsDefinition}
      selectionType="single"
      trackBy="name"
      selectedItems={selectedId ? ([{ name: selectedId }] as typeof instanceLimitsItems) : []}
      onSelectionChange={event => setSelectedId(event.detail.selectedItems[0].name)}
      ariaLabels={{
        itemSelectionLabel: (data, row) => `select ${row.name}`,
        allItemsSelectionLabel: () => 'select all',
        selectionGroupLabel: 'On-demand instance limit selection',
      }}
    />
  );
}

export const instanceLimits: WidgetConfig = {
  definition: { defaultRowSpan: 3, defaultColumnSpan: 2 },
  data: {
    icon: 'table',
    title: 'Instance limits',
    description: 'Current utilization of instance types',
    disableContentPaddings: !isVisualRefresh,
    provider: InstanceLimitsProvider,
    header: InstanceLimitsHeader,
    content: InstanceLimitsContent,
    footer: InstanceLimitsFooter,
  },
};
