// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Box from '~components/box';
import { Checkbox, Header, SpaceBetween, Table } from '~components';

export default function ButtonsPerformanceMarkPage() {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(true);
  return (
    <Box padding="xxl">
      <h1>Latency metrics, loading state in Table</h1>
      <SpaceBetween size="l">
        <SpaceBetween size="xs">
          <Checkbox checked={mounted} onChange={e => setMounted(e.detail.checked)}>
            Mounted
          </Checkbox>
          <Checkbox checked={loading} onChange={e => setLoading(e.detail.checked)}>
            Loading
          </Checkbox>
        </SpaceBetween>

        {mounted && (
          <Table
            id="my-resource-table"
            items={items}
            loading={loading}
            columnDefinitions={columnDefinitions}
            header={<Header>This is my table</Header>}
          />
        )}
      </SpaceBetween>
    </Box>
  );
}

const items = [
  {
    name: 'Item 1',
    alt: 'First',
    description: 'This is the first item',
    type: '1A',
    size: 'Small',
  },
  {
    name: 'Item 2',
    alt: 'Second',
    description: 'This is the second item',
    type: '1B',
    size: 'Large',
  },
  {
    name: 'Item 3',
    alt: 'Third',
    description: '-',
    type: '1A',
    size: 'Large',
  },
];

const columnDefinitions = [
  {
    id: 'value',
    header: 'Text value',
    cell: (item: any) => item.alt,
    sortingField: 'alt',
  },
  {
    id: 'type',
    header: 'Type',
    cell: (item: any) => item.type,
  },
  {
    id: 'description',
    header: 'Description',
    cell: (item: any) => item.description,
  },
];
