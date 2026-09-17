// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Checkbox from '~components/checkbox';
import Header from '~components/header';
import RadioButton from '~components/radio-button';
import SegmentedControl from '~components/segmented-control';
import SpaceBetween from '~components/space-between';
import TableBody from '~components/table-body';
import TableCell from '~components/table-cell';
import TableHead from '~components/table-head';
import TableHeaderCell from '~components/table-header-cell';
import TableHeaderRow from '~components/table-header-row';
import TableRoot, { TableRootProps } from '~components/table-root';
import TableRow from '~components/table-row';

import { useAppContext } from '../app/app-context';
import { SimplePage } from '../app/templates';
import { Item, makeItems } from './common';

import styles from './styles.scss';

// Selection (grid layout), multi and single, composed by the consumer — the atomic parts contribute
// only `variant='selected'` (the visual row surface; the checkbox/radio conveys selection to
// assistive technologies). The control column uses `disablePaddings` cells with a centred control to
// match the existing Table's selection column.
// Control column is fixed; Name and Status share the remaining width via flex weights (rather than
// flexing Name alone) so Status stays adjacent instead of being pushed to the far edge.
const COLUMNS: ReadonlyArray<TableRootProps.ColumnDefinition> = [
  { size: 40 },
  { size: { flex: 53 } },
  { size: { flex: 47 } },
];
const ITEM_COUNT = 10;

type SelectionMode = 'multi' | 'single';

export default function TableSelectionPage() {
  const items = makeItems(ITEM_COUNT);
  const { urlParams, setUrlParams } = useAppContext<'selectionMode'>();
  const mode: SelectionMode = urlParams.selectionMode === 'single' ? 'single' : 'multi';
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(new Set([items[1].id]));

  const allSelected = items.length > 0 && items.every(item => selectedIds.has(item.id));
  const someSelected = items.some(item => selectedIds.has(item.id));

  const toggleAll = () => setSelectedIds(allSelected ? new Set() : new Set(items.map(item => item.id)));
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
  const selectSingle = (id: string) => setSelectedIds(new Set([id]));

  const changeMode = (next: SelectionMode) => {
    setUrlParams({ selectionMode: next });
    // Single selection permits at most one row, so collapse the current selection when switching to it.
    setSelectedIds(prev => (next === 'single' ? new Set([...prev].slice(0, 1)) : prev));
  };

  return (
    <SimplePage
      title="Table atomics — selection (grid layout)"
      settings={
        <SegmentedControl
          label="Selection mode"
          selectedId={mode}
          onChange={({ detail }) => changeMode(detail.selectedId as SelectionMode)}
          options={[
            { id: 'multi', text: 'Multi-select' },
            { id: 'single', text: 'Single-select' },
          ]}
        />
      }
      screenshotArea={{}}
    >
      <SpaceBetween size="s">
        <Header counter={`(${selectedIds.size}/${items.length})`}>Resources</Header>
        <TableRoot columnLayout={{ type: 'grid', columns: COLUMNS }} ariaLabel="Resources">
          <TableHead>
            <TableHeaderRow>
              <TableHeaderCell disablePaddings={true}>
                {mode === 'multi' ? (
                  <div className={styles['selection-cell']}>
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected && !allSelected}
                      onChange={toggleAll}
                      ariaLabel="Select all resources"
                    />
                  </div>
                ) : null}
              </TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableHeaderRow>
          </TableHead>
          <TableBody>
            {items.map((item: Item) => (
              <TableRow key={item.id} variant={selectedIds.has(item.id) ? 'selected' : 'default'}>
                <TableCell disablePaddings={true}>
                  <div className={styles['selection-cell']}>
                    {mode === 'multi' ? (
                      <Checkbox
                        checked={selectedIds.has(item.id)}
                        onChange={() => toggleRow(item.id)}
                        ariaLabel={`Select ${item.name}`}
                      />
                    ) : (
                      <RadioButton
                        name="resource-single-selection"
                        value={item.id}
                        checked={selectedIds.has(item.id)}
                        onSelect={() => selectSingle(item.id)}
                        ariaLabel={`Select ${item.name}`}
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableRoot>
      </SpaceBetween>
    </SimplePage>
  );
}
