// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Header from '~components/header';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import Table, { TableProps } from '~components/table';

import ScreenshotArea from '../utils/screenshot-area';
import { generateItems, Instance } from './generate-data';

const allItems = generateItems(10);

const columnDefinitions: TableProps.ColumnDefinition<Instance>[] = [
  {
    id: 'id',
    header: 'ID',
    cell: item => <Link href={`#${item.id}`}>{item.id}</Link>,
    sortingField: 'id',
    tooltip: 'The unique identifier for this instance.',
  },
  {
    id: 'type',
    header: 'Instance type',
    cell: item => item.type,
    sortingField: 'type',
    tooltip: (
      <SpaceBetween size="xs">
        <Box variant="p">The hardware configuration of the instance.</Box>
        <Link href="#" external={true}>
          Learn more about instance types
        </Link>
      </SpaceBetween>
    ),
  },
  {
    id: 'dnsName',
    header: 'DNS name',
    cell: item => item.dnsName || '-',
    sortingField: 'dnsName',
    // No tooltip on this column — verifies optional behavior
  },
  {
    id: 'imageId',
    header: 'Image ID',
    cell: item => item.imageId,
    sortingField: 'imageId',
    tooltip: 'The Amazon Machine Image (AMI) used to launch this instance.',
  },
  {
    id: 'state',
    header: 'State',
    cell: item => (
      <StatusIndicator type={item.state === 'RUNNING' ? 'success' : 'stopped'}>{item.state}</StatusIndicator>
    ),
    sortingField: 'state',
    tooltip: 'Current operational state of the instance.',
  },
];

export default function App() {
  const [sortingColumn, setSortingColumn] = useState<TableProps.SortingColumn<Instance>>(columnDefinitions[0]);
  const [sortingDescending, setSortingDescending] = useState(false);

  return (
    <ScreenshotArea>
      <SpaceBetween size="l">
        <Table
          header={<Header headingTagOverride="h1">Table with column header tooltips</Header>}
          columnDefinitions={columnDefinitions}
          items={allItems}
          sortingColumn={sortingColumn}
          sortingDescending={sortingDescending}
          onSortingChange={({ detail }) => {
            setSortingColumn(detail.sortingColumn);
            setSortingDescending(!!detail.isDescending);
          }}
          ariaLabels={{ tableLabel: 'Instances' }}
        />

        <Table
          header={<Header headingTagOverride="h2">Resizable columns with tooltips</Header>}
          columnDefinitions={columnDefinitions}
          items={allItems}
          resizableColumns={true}
          ariaLabels={{
            tableLabel: 'Instances resizable',
            resizerRoleDescription: 'resize button',
          }}
        />
      </SpaceBetween>
    </ScreenshotArea>
  );
}
