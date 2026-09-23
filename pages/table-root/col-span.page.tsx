// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Checkbox from '~components/checkbox';
import Header from '~components/header';
import SegmentedControl from '~components/segmented-control';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import TableBody from '~components/table-body';
import TableBodyCell from '~components/table-body-cell';
import TableHead from '~components/table-head';
import TableHeaderCell from '~components/table-header-cell';
import TableRoot, { TableRootProps } from '~components/table-root';
import TableRow from '~components/table-row';
import Toggle from '~components/toggle';

import { useAppContext } from '../app/app-context';
import { SimplePage } from '../app/templates';
import { DATA_COLUMNS, Item, makeItems } from './common';

import styles from './styles.scss';

type Layout = 'grid' | 'auto';

const CONTROL_COLUMN: TableRootProps.ColumnDefinition = { size: 40 };
const DATA_COLUMN_COUNT = DATA_COLUMNS.length;
const ITEM_COUNT = 5;
const SPAN_ROW_IDS = ['span-leading', 'span-middle', 'span-trailing'];

export default function TableColSpanPage() {
  const items = makeItems(ITEM_COUNT);
  const { urlParams, setUrlParams } = useAppContext<'layout' | 'stripedRows' | 'selectable'>();
  const layout: Layout = urlParams.layout === 'auto' ? 'auto' : 'grid';
  const striped = urlParams.stripedRows === true || urlParams.stripedRows === 'true';
  const selectable = urlParams.selectable === true || urlParams.selectable === 'true';

  const selectableIds = [...items.map(item => item.id), ...SPAN_ROW_IDS];
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(new Set([items[1].id]));
  const allSelected = selectableIds.every(id => selectedIds.has(id));
  const someSelected = selectableIds.some(id => selectedIds.has(id));
  const toggleAll = () => setSelectedIds(allSelected ? new Set() : new Set(selectableIds));
  const toggleRow = (id: string) =>
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  const columns = selectable ? [CONTROL_COLUMN, ...DATA_COLUMNS] : DATA_COLUMNS;
  const totalColumns = columns.length;
  const columnLayout: TableRootProps.ColumnLayout = layout === 'grid' ? { type: 'grid', columns } : { type: 'auto' };

  const filler = (count: number, prefix: string) =>
    Array.from({ length: count }, (_, index) => <TableBodyCell key={`${prefix}-${index}`}>Cell</TableBodyCell>);

  const controlCell = (id: string, label: string) =>
    selectable ? (
      <TableBodyCell disablePaddings={true}>
        <div className={styles['selection-cell']}>
          <Checkbox checked={selectedIds.has(id)} onChange={() => toggleRow(id)} ariaLabel={`Select ${label}`} />
        </div>
      </TableBodyCell>
    ) : null;

  return (
    <SimplePage
      title="Table atomics — colSpan"
      settings={
        <SpaceBetween direction="horizontal" size="l">
          <SegmentedControl
            label="Column layout"
            selectedId={layout}
            onChange={({ detail }) => setUrlParams({ layout: detail.selectedId })}
            options={[
              { id: 'grid', text: 'Grid' },
              { id: 'auto', text: 'Auto' },
            ]}
          />
          <Toggle checked={striped} onChange={({ detail }) => setUrlParams({ stripedRows: detail.checked })}>
            Striped rows
          </Toggle>
          <Toggle checked={selectable} onChange={({ detail }) => setUrlParams({ selectable: detail.checked })}>
            Selection
          </Toggle>
        </SpaceBetween>
      }
      screenshotArea={{}}
    >
      <SpaceBetween size="s">
        <Header counter={selectable ? `(${selectedIds.size}/${selectableIds.length})` : `(${items.length})`}>
          Resources
        </Header>
        <TableRoot columnLayout={columnLayout} ariaLabel="Resources">
          <TableHead>
            <TableRow>
              {selectable && (
                <TableHeaderCell disablePaddings={true}>
                  <div className={styles['selection-cell']}>
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected && !allSelected}
                      onChange={toggleAll}
                      ariaLabel="Select all resources"
                    />
                  </div>
                </TableHeaderCell>
              )}
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Size</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item: Item, index) => (
              <TableRow
                key={item.id}
                shaded={striped && index % 2 === 1}
                selected={selectable && selectedIds.has(item.id)}
              >
                {controlCell(item.id, item.name)}
                <TableBodyCell isRowHeader={true}>{item.name}</TableBodyCell>
                <TableBodyCell>{item.type}</TableBodyCell>
                <TableBodyCell>{item.size}</TableBodyCell>
                <TableBodyCell>{item.status}</TableBodyCell>
              </TableRow>
            ))}

            <TableRow shaded={striped} selected={selectable && selectedIds.has('span-leading')}>
              {controlCell('span-leading', 'leading span row')}
              <TableBodyCell colSpan={2}>Leading colSpan = 2</TableBodyCell>
              {filler(DATA_COLUMN_COUNT - 2, 'leading')}
            </TableRow>

            <TableRow selected={selectable && selectedIds.has('span-middle')}>
              {controlCell('span-middle', 'middle span row')}
              {filler(1, 'middle-start')}
              <TableBodyCell colSpan={2}>Middle colSpan = 2</TableBodyCell>
              {filler(DATA_COLUMN_COUNT - 3, 'middle-end')}
            </TableRow>

            <TableRow shaded={striped} selected={selectable && selectedIds.has('span-trailing')}>
              {controlCell('span-trailing', 'trailing span row')}
              {filler(DATA_COLUMN_COUNT - 2, 'trailing')}
              <TableBodyCell colSpan={2}>Trailing colSpan = 2</TableBodyCell>
            </TableRow>

            <TableRow>
              <TableBodyCell colSpan={totalColumns} disablePaddings={true}>
                <Box padding="m" textAlign="center" color="inherit">
                  <StatusIndicator type="loading">Full-width status row (colSpan = {totalColumns})</StatusIndicator>
                </Box>
              </TableBodyCell>
            </TableRow>
          </TableBody>
        </TableRoot>
      </SpaceBetween>
    </SimplePage>
  );
}
