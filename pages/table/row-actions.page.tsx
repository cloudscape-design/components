// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import ButtonDropdown from '~components/button-dropdown';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import Table, { TableProps } from '~components/table';

import ScreenshotArea from '../utils/screenshot-area';
import { generateItems, Instance } from './generate-data';
import { columnsConfig, selectionLabels } from './shared-configs';

const items = generateItems(8);

const simpleColumns = [columnsConfig[0], columnsConfig[1], columnsConfig[3]];

export default function TableRowActionsPage() {
  const [lastAction, setLastAction] = useState<string | null>(null);

  const rowActionsConfig: TableProps.RowActionsConfig<Instance> = {
    items: item => [
      { id: 'view', text: 'View details' },
      { id: 'connect', text: 'Connect', disabled: item.state !== 'RUNNING' },
      { id: 'stop', text: 'Stop', disabled: item.state !== 'RUNNING' },
      { id: 'terminate', text: 'Terminate', variant: 'warning' as any },
    ],
    onItemClick: (detail, item) => {
      setLastAction(`${detail.id} on ${item.id}`);
    },
    ariaLabel: item => `Actions for ${item.id}`,
  };

  const rowActionsWithDisable: TableProps.RowActionsConfig<Instance> = {
    items: () => [
      { id: 'start', text: 'Start' },
      { id: 'stop', text: 'Stop' },
    ],
    onItemClick: (detail, item) => {
      setLastAction(`${detail.id} on ${item.id}`);
    },
    disabled: item => item.state === 'TERMINATED',
    ariaLabel: item => `Actions for ${item.id}`,
  };

  return (
    <Box padding="m">
      <h1>Table with row-level actions menu (rowActions prop)</h1>

      {lastAction && (
        <Box margin={{ bottom: 'm' }}>
          <strong data-testid="last-action">Last action: {lastAction}</strong>
        </Box>
      )}

      <ScreenshotArea>
        <SpaceBetween size="xl">
          {/* Basic usage */}
          <Table
            data-testid="table-row-actions-basic"
            ariaLabels={selectionLabels}
            header={<Header>Table with row actions (basic)</Header>}
            columnDefinitions={simpleColumns}
            items={items}
            rowActions={rowActionsConfig}
          />

          {/* With selection */}
          <Table
            data-testid="table-row-actions-with-selection"
            ariaLabels={selectionLabels}
            header={
              <Header
                actions={
                  <ButtonDropdown items={[{ id: 'bulk-delete', text: 'Delete selected' }]}>Actions</ButtonDropdown>
                }
              >
                Table with row actions + selection
              </Header>
            }
            columnDefinitions={simpleColumns}
            items={items}
            selectionType="multi"
            rowActions={rowActionsConfig}
          />

          {/* With disabled trigger per row */}
          <Table
            data-testid="table-row-actions-disabled"
            ariaLabels={selectionLabels}
            header={<Header>Table with row actions (disabled for terminated instances)</Header>}
            columnDefinitions={simpleColumns}
            items={items}
            rowActions={rowActionsWithDisable}
          />

          {/* With sticky last column */}
          <Table
            data-testid="table-row-actions-sticky"
            ariaLabels={selectionLabels}
            header={<Header>Table with row actions (sticky last column)</Header>}
            columnDefinitions={[...columnsConfig]}
            items={items}
            rowActions={rowActionsConfig}
            stickyColumns={{ last: 1 }}
          />
        </SpaceBetween>
      </ScreenshotArea>
    </Box>
  );
}
