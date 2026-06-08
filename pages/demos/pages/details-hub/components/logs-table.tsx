// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Header from '@cloudscape-design/components/header';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Table, { TableProps } from '@cloudscape-design/components/table';

import { getHeaderCounterText } from '../../../i18n-strings';
import { LogResource } from '../../../resources/types';
import DataProvider from '../../commons/data-provider';
import { useAsyncData } from '../../commons/use-async-data';
import { LOGS_COLUMN_DEFINITIONS } from '../../details/details-config';
import { logsTableAriaLabels } from '../commons';

export function LogsTable() {
  const [logs, logsLoading] = useAsyncData<LogResource>(() => new DataProvider().getData('logs'));
  const [selectedItems, setSelectedItems] = useState<NonNullable<TableProps['selectedItems']>>([]);
  const isOnlyOneSelected = selectedItems.length === 1;
  const atLeastOneSelected = selectedItems.length > 0;

  return (
    <Table
      enableKeyboardNavigation={true}
      className="logs-table"
      loading={logsLoading}
      loadingText="Loading logs"
      columnDefinitions={LOGS_COLUMN_DEFINITIONS}
      items={logs.slice(0, 5)}
      ariaLabels={logsTableAriaLabels}
      selectionType="multi"
      selectedItems={selectedItems}
      onSelectionChange={event => setSelectedItems(event.detail.selectedItems)}
      header={
        <Header
          counter={!logsLoading ? getHeaderCounterText(logs, selectedItems) : undefined}
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button disabled={!isOnlyOneSelected}>View</Button>
              <Button disabled={!atLeastOneSelected}>Watch</Button>
              <Button disabled={!atLeastOneSelected}>Download</Button>
            </SpaceBetween>
          }
        >
          Logs
        </Header>
      }
      footer={
        <Box textAlign="center">
          <Link href="#">View all logs</Link>
        </Box>
      }
    />
  );
}
