// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import Button from '@cloudscape-design/components/button';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Table, { TableProps } from '@cloudscape-design/components/table';

import { baseTableAriaLabels, getHeaderCounterText } from '../../../i18n-strings';
import { OriginResource } from '../../../resources/types';
import DataProvider from '../../commons/data-provider';
import { useAsyncData } from '../../commons/use-async-data';
import { ORIGINS_COLUMN_DEFINITIONS } from '../details-config';

const originsSelectionLabels = {
  ...baseTableAriaLabels,
  itemSelectionLabel: (_: unknown, row: { name: string }) => `select ${row.name}`,
  selectionGroupLabel: 'Origins selection',
};

export function OriginsTable() {
  const [origins, originsLoading] = useAsyncData<OriginResource>(() => new DataProvider().getData('origins'));
  const [selectedItems, setSelectedItems] = useState<NonNullable<TableProps['selectedItems']>>([]);
  const isOnlyOneSelected = selectedItems.length === 1;
  const atLeastOneSelected = selectedItems.length > 0;

  return (
    <Table
      enableKeyboardNavigation={true}
      className="origins-table"
      columnDefinitions={ORIGINS_COLUMN_DEFINITIONS}
      loading={originsLoading}
      loadingText="Loading origins"
      items={origins}
      ariaLabels={originsSelectionLabels}
      selectionType="single"
      selectedItems={selectedItems}
      onSelectionChange={event => setSelectedItems(event.detail.selectedItems)}
      header={
        <Header
          counter={!originsLoading ? getHeaderCounterText(origins, selectedItems) : undefined}
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button disabled={!isOnlyOneSelected}>Edit</Button>
              <Button disabled={!atLeastOneSelected}>Delete</Button>
              <Button>Create origin</Button>
            </SpaceBetween>
          }
        >
          Origins
        </Header>
      }
    />
  );
}
