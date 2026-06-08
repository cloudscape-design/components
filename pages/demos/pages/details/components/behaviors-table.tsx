// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import Button from '@cloudscape-design/components/button';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Table, { TableProps } from '@cloudscape-design/components/table';

import { baseTableAriaLabels, getHeaderCounterText } from '../../../i18n-strings';
import { BehaviorResource } from '../../../resources/types';
import DataProvider from '../../commons/data-provider';
import { useAsyncData } from '../../commons/use-async-data';
import { BEHAVIORS_COLUMN_DEFINITIONS } from '../details-config';

const behaviorsSelectionLabels = {
  ...baseTableAriaLabels,
  itemSelectionLabel: (
    _: unknown,
    row: {
      pathPattern: string;
      origin: string;
    }
  ) => `select path ${row.pathPattern} from origin ${row.origin}`,
  selectionGroupLabel: 'Behaviors selection',
};

export function BehaviorsTable() {
  const [behaviors, behaviorsLoading] = useAsyncData<BehaviorResource>(() =>
    new DataProvider().getData<BehaviorResource>('behaviors')
  );
  const [selectedItems, setSelectedItems] = useState<NonNullable<TableProps['selectedItems']>>([]);
  const isOnlyOneSelected = selectedItems.length === 1;
  const atLeastOneSelected = selectedItems.length > 0;

  return (
    <Table
      enableKeyboardNavigation={true}
      className="cache-table"
      columnDefinitions={BEHAVIORS_COLUMN_DEFINITIONS}
      items={behaviors}
      loading={behaviorsLoading}
      loadingText="Loading behaviors"
      ariaLabels={behaviorsSelectionLabels}
      selectionType="single"
      selectedItems={selectedItems}
      onSelectionChange={event => setSelectedItems(event.detail.selectedItems)}
      header={
        <Header
          counter={!behaviorsLoading ? getHeaderCounterText(behaviors, selectedItems) : undefined}
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button disabled={!isOnlyOneSelected}>Edit</Button>
              <Button disabled={!atLeastOneSelected}>Delete</Button>
              <Button>Create behavior</Button>
            </SpaceBetween>
          }
        >
          Cache behavior settings
        </Header>
      }
    />
  );
}
