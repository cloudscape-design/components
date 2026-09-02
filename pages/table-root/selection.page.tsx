// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo, useState } from 'react';

import Box from '~components/box';
import Checkbox from '~components/checkbox';
import Header from '~components/header';
import Icon from '~components/icon';
import SpaceBetween from '~components/space-between';
import TableBody from '~components/table-body';
import TableCell from '~components/table-cell';
import TableHead from '~components/table-head';
import TableHeaderCell from '~components/table-header-cell';
import TableHeaderRow from '~components/table-header-row';
import TableRoot, { TableRootProps } from '~components/table-root';
import TableRow from '~components/table-row';

import { Item, makeItems } from './common';

import styles from './styles.scss';

// A selectable + sortable table (grid layout). Selection and sorting are composed
// by the consumer — the atomic parts contribute `variant='selected'` (row surface + aria-selected)
// and `ariaSort` (the header semantic). The control column uses `disablePaddings` cells and a
// centered checkbox to match the classic Table selection column; the name column flexes.
const COLUMNS: ReadonlyArray<TableRootProps.ColumnDefinition> = [{ size: 40 }, { minWidth: 160 }, { size: 140 }];
const ITEM_COUNT = 10;

type SortDirection = 'ascending' | 'descending';

export default function TableSelectionPage() {
  const allItems = makeItems(ITEM_COUNT);
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(new Set([allItems[1].id, allItems[2].id]));
  const [direction, setDirection] = useState<SortDirection>('ascending');

  const items = useMemo(() => {
    const sorted = [...allItems].sort((a, b) => a.name.localeCompare(b.name));
    return direction === 'ascending' ? sorted : sorted.reverse();
  }, [allItems, direction]);

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
  const toggleSort = () => setDirection(prev => (prev === 'ascending' ? 'descending' : 'ascending'));

  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Box variant="h1">Table atomics — selectable + sortable (grid layout)</Box>

        <SpaceBetween size="s">
          <Header counter={`(${selectedIds.size}/${items.length})`}>Resources</Header>
          <TableRoot columnLayout={{ type: 'grid', columns: COLUMNS }} ariaLabel="Resources">
            <TableHead>
              <TableHeaderRow>
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
                <TableHeaderCell ariaSort={direction}>
                  <button type="button" className={styles['sort-button']} onClick={toggleSort}>
                    Name
                    <Icon name={direction === 'ascending' ? 'caret-up-filled' : 'caret-down-filled'} />
                  </button>
                </TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableHeaderRow>
            </TableHead>
            <TableBody>
              {items.map((item: Item) => (
                <TableRow
                  key={item.id}
                  variant={selectedIds.has(item.id) ? 'selected' : 'default'}
                  ariaSelected={selectedIds.has(item.id)}
                >
                  <TableCell disablePaddings={true}>
                    <div className={styles['selection-cell']}>
                      <Checkbox
                        checked={selectedIds.has(item.id)}
                        onChange={() => toggleRow(item.id)}
                        ariaLabel={`Select ${item.name}`}
                      />
                    </div>
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableRoot>
        </SpaceBetween>
      </SpaceBetween>
    </Box>
  );
}
