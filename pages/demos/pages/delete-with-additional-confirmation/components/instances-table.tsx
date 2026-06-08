// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';
import Button from '@cloudscape-design/components/button';
import Link from '@cloudscape-design/components/link';
import Pagination from '@cloudscape-design/components/pagination';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Table, { TableProps } from '@cloudscape-design/components/table';
import TextFilter from '@cloudscape-design/components/text-filter';

import { getHeaderCounterText, getTextFilterCounterText, renderAriaLive } from '../../../i18n-strings';
import { EC2Instance } from '../../../resources/types';
import { FullPageHeader } from '../../commons';
import { TableEmptyState, TableNoMatchState } from '../../commons/common-components';
import ItemState from '../../delete-with-simple-confirmation/components/item-state';

const COLUMN_DEFINITIONS: TableProps.ColumnDefinition<EC2Instance>[] = [
  {
    id: 'id',
    header: 'Instance ID',
    cell: item => <Link href={`#${item.id}`}>{item.id}</Link>,
    isRowHeader: true,
  },
  {
    id: 'state',
    header: 'Instance state',
    cell: item => <ItemState state={item.state} />,
  },
  {
    id: 'type',
    header: 'Instance type',
    cell: item => item.type,
  },
  {
    id: 'publicDns',
    header: 'Public DNS',
    cell: item => item.publicDns,
  },
  {
    id: 'monitoring',
    header: 'Monitoring',
    cell: item => item.monitoring,
  },
];

interface InstancesTableProps {
  instances: EC2Instance[];
  selectedItems: EC2Instance[];
  onSelectionChange: (event: {
    detail: {
      selectedItems: EC2Instance[];
    };
  }) => void;
  onDelete: () => void;
}
export default function InstancesTable({ instances, selectedItems, onSelectionChange, onDelete }: InstancesTableProps) {
  const { items, actions, filteredItemsCount, collectionProps, filterProps, paginationProps } =
    useCollection<EC2Instance>(instances, {
      filtering: {
        empty: <TableEmptyState resourceName="Instance" />,
        noMatch: <TableNoMatchState onClearFilter={() => actions.setFiltering('')} />,
      },
      pagination: { pageSize: 50 },
      selection: {},
    });

  const deletingItemsSelected = selectedItems.filter(it => it.state === 'deleting').length > 0;

  return (
    <Table
      {...collectionProps}
      enableKeyboardNavigation={true}
      selectedItems={selectedItems}
      onSelectionChange={e => onSelectionChange(e)}
      columnDefinitions={COLUMN_DEFINITIONS}
      items={items}
      selectionType="multi"
      ariaLabels={{
        itemSelectionLabel: (_data, row) => `select ${row.id}`,
        allItemsSelectionLabel: () => 'select all',
        selectionGroupLabel: 'Instance selection',
      }}
      renderAriaLive={renderAriaLive}
      variant="full-page"
      stickyHeader={true}
      header={
        <FullPageHeader
          title="Instances"
          counter={getHeaderCounterText(instances, selectedItems)}
          actions={
            <SpaceBetween size="xs" direction="horizontal">
              <Button disabled={selectedItems.length !== 1}>View details</Button>
              <Button disabled={selectedItems.length !== 1}>Edit</Button>
              <Button disabled={selectedItems.length === 0 || deletingItemsSelected} onClick={onDelete}>
                Delete
              </Button>
              <Button variant="primary">Create instance</Button>
            </SpaceBetween>
          }
        />
      }
      filter={
        <TextFilter
          {...filterProps}
          filteringAriaLabel="Filter instances"
          filteringPlaceholder="Find instances"
          filteringClearAriaLabel="Clear"
          countText={getTextFilterCounterText(filteredItemsCount)}
        />
      }
      pagination={<Pagination {...paginationProps} />}
    />
  );
}
