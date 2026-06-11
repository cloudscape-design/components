// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import { useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';
import Button from '@cloudscape-design/components/button';
import Header from '@cloudscape-design/components/header';
import Pagination from '@cloudscape-design/components/pagination';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Table, { TableProps } from '@cloudscape-design/components/table';
import TextFilter from '@cloudscape-design/components/text-filter';

import { getHeaderCounterText, getTextFilterCounterText, renderAriaLive } from '../../../i18n-strings';
import { LogResource } from '../../../resources/types';
import { TableEmptyState, TableNoMatchState } from '../../commons/common-components';
import DataProvider from '../../commons/data-provider';
import { useAsyncData } from '../../commons/use-async-data';
import { LOGS_COLUMN_DEFINITIONS } from '../../details/details-config';
import { logsTableAriaLabels } from '../../details-hub/commons';

export function LogsTable() {
  const [logs, logsLoading] = useAsyncData(() => new DataProvider().getData<LogResource>('logs'));
  const [selectedItems, setSelectedItems] = useState<NonNullable<TableProps['selectedItems']>>([]);
  const isOnlyOneSelected = selectedItems.length === 1;
  const atLeastOneSelected = selectedItems.length > 0;
  const { items, actions, filteredItemsCount, collectionProps, filterProps, paginationProps } =
    useCollection<LogResource>(logs, {
      filtering: {
        empty: <TableEmptyState resourceName="Log" />,
        noMatch: <TableNoMatchState onClearFilter={() => actions.setFiltering('')} />,
      },
      pagination: { pageSize: 10 },
    });

  return (
    <Table
      enableKeyboardNavigation={true}
      className="logs-table"
      {...collectionProps}
      loading={logsLoading}
      loadingText="Loading logs"
      columnDefinitions={LOGS_COLUMN_DEFINITIONS}
      items={items}
      ariaLabels={logsTableAriaLabels}
      renderAriaLive={renderAriaLive}
      selectionType="multi"
      selectedItems={selectedItems}
      onSelectionChange={evt => setSelectedItems(evt.detail.selectedItems)}
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
      filter={
        <TextFilter
          {...filterProps}
          filteringAriaLabel="Find logs"
          filteringPlaceholder="Find logs"
          filteringClearAriaLabel="Clear"
          countText={getTextFilterCounterText(filteredItemsCount!)}
        />
      }
      pagination={<Pagination {...paginationProps} />}
    />
  );
}
