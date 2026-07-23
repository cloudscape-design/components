// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import Box from '~components/box';
import ComparisonTable, { ComparisonTableProps } from '~components/comparison-table';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';

import ScreenshotArea from '../utils/screenshot-area';

const attributes: ComparisonTableProps['attributes'] = [
  { id: 'engine', label: 'Database engine' },
  { id: 'vcpu', label: 'vCPU' },
  { id: 'memory', label: 'Memory' },
  {
    id: 'multiAz',
    label: 'Multi-AZ',
    render: value => (
      <StatusIndicator type={value ? 'success' : 'stopped'}>{value ? 'Enabled' : 'Disabled'}</StatusIndicator>
    ),
  },
  { id: 'storage', label: 'Max storage' },
];

const entities: ComparisonTableProps['entities'] = [
  {
    id: 'db-r6g',
    title: 'db.r6g.large',
    data: { engine: 'MySQL', vcpu: 2, memory: '16 GiB', multiAz: true, storage: '64 TiB' },
  },
  {
    id: 'db-r6g-xl',
    title: 'db.r6g.xlarge',
    data: { engine: 'MySQL', vcpu: 4, memory: '32 GiB', multiAz: true, storage: '64 TiB' },
  },
  {
    id: 'db-r6g-2xl',
    title: 'db.r6g.2xlarge',
    data: { engine: 'MySQL', vcpu: 8, memory: '64 GiB', multiAz: false, storage: '64 TiB' },
  },
];

export default function ComparisonTablePage() {
  const [highlight, setHighlight] = React.useState(true);
  const [sticky, setSticky] = React.useState(true);

  return (
    <>
      <h1>Comparison table (WIP)</h1>
      <SpaceBetween size="l">
        <SpaceBetween direction="horizontal" size="m">
          <label>
            <input type="checkbox" checked={highlight} onChange={e => setHighlight(e.target.checked)} /> Highlight
            differences
          </label>
          <label>
            <input type="checkbox" checked={sticky} onChange={e => setSticky(e.target.checked)} /> Sticky attribute
            column
          </label>
        </SpaceBetween>

        <ScreenshotArea>
          <ComparisonTable
            ariaLabel="Instance type comparison"
            attributeColumnHeader="Attribute"
            attributes={attributes}
            entities={entities}
            highlightDifferences={highlight}
            stickyAttributeColumn={sticky}
          />
        </ScreenshotArea>

        <Box variant="h2">Empty state</Box>
        <ComparisonTable attributes={[]} entities={[]} ariaLabel="Empty comparison" />
      </SpaceBetween>
    </>
  );
}
