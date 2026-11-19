// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';

import Header from '~components/header';
import SegmentedControl from '~components/segmented-control';
import SpaceBetween from '~components/space-between';
import TableBody from '~components/table-body';
import TableBodyCell from '~components/table-body-cell';
import TableHead from '~components/table-head';
import TableHeaderCell from '~components/table-header-cell';
import TableRoot, { TableRootProps } from '~components/table-root';
import TableRow from '~components/table-row';

import { useAppContext } from '../app/app-context';
import { SimplePage } from '../app/templates';

import styles from './styles.scss';

// Wide enough to scroll sideways, and long enough to scroll the page, so the pinned header can be checked
// against both. The Name header's sort button exercises pointer interaction with the pinned copy.

const GRID_COLUMNS: ReadonlyArray<TableRootProps.ColumnDefinition> = [
  { size: 260 },
  { size: 260 },
  { size: 260 },
  { size: 260 },
  { size: 260 },
];
const ROW_COUNT = 60;

interface Row {
  id: string;
  name: string;
  type: string;
  size: string;
  status: string;
  region: string;
}

const makeRows = (n: number): Row[] =>
  Array.from({ length: n }, (_, index) => ({
    id: `row-${index}`,
    name: `Resource ${String(index).padStart(3, '0')}`,
    type: index % 3 === 0 ? 'Compute' : index % 3 === 1 ? 'Storage' : 'Network',
    size: `${(index % 8) + 1} GiB`,
    status: index % 2 === 0 ? 'Available' : 'Pending',
    region: index % 2 === 0 ? 'us-east-1' : 'eu-west-1',
  }));

export default function TableStickyHeaderPage() {
  const { urlParams, setUrlParams } = useAppContext<'layout' | 'sortDescending'>();
  const layout = urlParams.layout === 'auto' ? 'auto' : 'grid';
  const descending = urlParams.sortDescending === true || urlParams.sortDescending === 'true';

  const rows = useMemo(() => {
    const direction = descending ? -1 : 1;
    return makeRows(ROW_COUNT).sort((a, b) => direction * a.name.localeCompare(b.name));
  }, [descending]);

  const columnLayout: TableRootProps.ColumnLayout =
    layout === 'grid' ? { type: 'grid', columns: GRID_COLUMNS } : { type: 'auto' };

  return (
    <SimplePage
      title="Table atomics — sticky header"
      settings={
        <SegmentedControl
          label="Column layout"
          selectedId={layout}
          onChange={({ detail }) => setUrlParams({ layout: detail.selectedId })}
          options={[
            { id: 'grid', text: 'Grid' },
            { id: 'auto', text: 'Auto' },
          ]}
        />
      }
      screenshotArea={{}}
    >
      <SpaceBetween size="s">
        <Header counter={`(${rows.length})`}>Resources</Header>
        <TableRoot
          columnLayout={columnLayout}
          ariaLabel="Resources"
          stickyHeader={
            <TableHead>
              <TableRow>
                <TableHeaderCell ariaSort={descending ? 'descending' : 'ascending'}>
                  <button
                    type="button"
                    className={styles['sort-button']}
                    onClick={() => setUrlParams({ sortDescending: !descending })}
                  >
                    Name {descending ? '▼' : '▲'}
                  </button>
                </TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Size</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Region</TableHeaderCell>
              </TableRow>
            </TableHead>
          }
        >
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableBodyCell>{row.name}</TableBodyCell>
                <TableBodyCell>{row.type}</TableBodyCell>
                <TableBodyCell>{row.size}</TableBodyCell>
                <TableBodyCell>{row.status}</TableBodyCell>
                <TableBodyCell>{row.region}</TableBodyCell>
              </TableRow>
            ))}
          </TableBody>
        </TableRoot>
      </SpaceBetween>
    </SimplePage>
  );
}
