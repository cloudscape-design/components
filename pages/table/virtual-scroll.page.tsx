// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo, useState } from 'react';

import Box from '~components/box';
import Checkbox from '~components/checkbox';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import Table from '~components/table';

import ScreenshotArea from '../utils/screenshot-area';

interface Item {
  id: string;
  name: string;
  region: string;
  state: string;
}

function generateItems(count: number): Item[] {
  const states = ['RUNNING', 'STOPPED', 'PENDING', 'TERMINATED'];
  const regions = ['us-east-1', 'us-west-2', 'eu-central-1', 'ap-south-1'];
  return Array.from({ length: count }, (_, i) => ({
    id: `id-${i + 1}`,
    name: `Instance ${i + 1}`,
    region: regions[i % regions.length],
    state: states[i % states.length],
  }));
}

const columnDefinitions = [
  { id: 'id', header: 'ID', cell: (item: Item) => item.id, sortingField: 'id' },
  { id: 'name', header: 'Name', cell: (item: Item) => item.name },
  { id: 'region', header: 'Region', cell: (item: Item) => item.region },
  { id: 'state', header: 'State', cell: (item: Item) => item.state },
];

// Dev page for the experimental opt-in windowed (virtual) scrolling mode.
// The table is placed inside a fixed-height scroll container so windowing takes effect.
export default function TableVirtualScrollPage() {
  const [enabled, setEnabled] = useState(true);
  const items = useMemo(() => generateItems(10000), []);

  return (
    <Box padding="l">
      <SpaceBetween size="m">
        <Header variant="h1" description="Renders only the rows near the viewport for very large datasets.">
          Table virtual scrolling (v0, experimental)
        </Header>

        <Checkbox checked={enabled} onChange={({ detail }) => setEnabled(detail.checked)}>
          Enable virtualScroll
        </Checkbox>

        <ScreenshotArea>
          <div style={{ blockSize: 400, overflow: 'auto' }} data-testid="virtual-scroll-container">
            <Table
              items={items}
              columnDefinitions={columnDefinitions}
              trackBy="id"
              variant="embedded"
              virtualScroll={enabled ? { rowHeight: 40, overscan: 5 } : undefined}
              ariaLabels={{ tableLabel: 'Virtual scroll table' }}
            />
          </div>
        </ScreenshotArea>

        <Box variant="small">Total items: {items.length}</Box>
      </SpaceBetween>
    </Box>
  );
}
