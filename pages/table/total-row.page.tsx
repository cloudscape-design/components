// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Badge from '~components/badge';
import Box from '~components/box';
import Header from '~components/header';
import Table, { TableProps } from '~components/table';

import ScreenshotArea from '../utils/screenshot-area';

interface SalesItem {
  product: string;
  region: string;
  units: number;
  revenue: number;
  returns: number;
}

const items: SalesItem[] = [
  { product: 'Widget A', region: 'us-east-1', units: 120, revenue: 4800, returns: 5 },
  { product: 'Widget B', region: 'eu-west-1', units: 85, revenue: 3400, returns: 2 },
  { product: 'Gadget X', region: 'ap-southeast-1', units: 200, revenue: 12000, returns: 8 },
  { product: 'Gadget Y', region: 'us-west-2', units: 60, revenue: 3600, returns: 1 },
  { product: 'Doohickey', region: 'eu-central-1', units: 45, revenue: 2250, returns: 3 },
];

const totalUnits = items.reduce((sum, i) => sum + i.units, 0);
const totalRevenue = items.reduce((sum, i) => sum + i.revenue, 0);
const totalReturns = items.reduce((sum, i) => sum + i.returns, 0);

const columnDefinitions: TableProps.ColumnDefinition<SalesItem>[] = [
  {
    id: 'product',
    header: 'Product',
    cell: item => item.product,
    isRowHeader: true,
  },
  {
    id: 'region',
    header: 'Region',
    cell: item => <Badge>{item.region}</Badge>,
  },
  {
    id: 'units',
    header: 'Units sold',
    cell: item => item.units,
  },
  {
    id: 'revenue',
    header: 'Revenue ($)',
    cell: item => `$${item.revenue.toLocaleString()}`,
  },
  {
    id: 'returns',
    header: 'Returns',
    cell: item => item.returns,
  },
];

const totalRow: TableProps.TotalRow = {
  cells: [
    {
      columnId: 'product',
      content: <Box fontWeight="bold">Total</Box>,
    },
    {
      columnId: 'units',
      content: <Box fontWeight="bold">{totalUnits}</Box>,
    },
    {
      columnId: 'revenue',
      content: <Box fontWeight="bold">${totalRevenue.toLocaleString()}</Box>,
    },
    {
      columnId: 'returns',
      content: <Box fontWeight="bold">{totalReturns}</Box>,
    },
  ],
};

export default function App() {
  return (
    <ScreenshotArea>
      <Table<SalesItem>
        header={<Header headingTagOverride="h1">Sales summary — total row demo</Header>}
        columnDefinitions={columnDefinitions}
        items={items}
        totalRow={totalRow}
        ariaLabels={{ tableLabel: 'Sales summary table' }}
      />
    </ScreenshotArea>
  );
}
