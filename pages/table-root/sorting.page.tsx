// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo, useState } from 'react';

import Box from '~components/box';
import Header from '~components/header';
import Icon from '~components/icon';
import SpaceBetween from '~components/space-between';
import TableBody from '~components/table-body';
import TableCell from '~components/table-cell';
import TableHead from '~components/table-head';
import TableHeaderCell from '~components/table-header-cell';
import TableHeaderRow from '~components/table-header-row';
import TableRoot from '~components/table-root';
import TableRow from '~components/table-row';

import { Item, makeItems } from './common';

import styles from './styles.scss';

// Sorting (auto layout). Sorting is fully composed by the consumer — the atomic components contribute
// only `ariaSort` on each header cell. This page shows three things: sortable columns that are not
// currently sorted (a non-filled caret + `ariaSort='none'`), several independently sortable columns,
// and multi-column sort opted into from the header (shift-click adds a column to the sort chain, with
// a priority number next to each caret). Caret icons match classic Table: `caret-down` (sortable),
// `caret-up-filled` (ascending), `caret-down-filled` (descending).

type SortKey = 'name' | 'type' | 'size' | 'status';
type SortDirection = 'ascending' | 'descending';
interface SortColumn {
  key: SortKey;
  direction: SortDirection;
}

const COLUMNS: ReadonlyArray<{ key: SortKey; label: string }> = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'size', label: 'Size' },
  { key: 'status', label: 'Status' },
];

function compare(key: SortKey, a: Item, b: Item): number {
  if (key === 'size') {
    return parseInt(a.size, 10) - parseInt(b.size, 10);
  }
  return a[key].localeCompare(b[key]);
}

export default function TableSortingPage() {
  const items = makeItems(12);
  const [sort, setSort] = useState<ReadonlyArray<SortColumn>>([{ key: 'name', direction: 'ascending' }]);

  const rows = useMemo(() => {
    return [...items].sort((a, b) => {
      for (const { key, direction } of sort) {
        const result = compare(key, a, b);
        if (result !== 0) {
          return direction === 'ascending' ? result : -result;
        }
      }
      return 0;
    });
  }, [items, sort]);

  // Plain click sorts by this column alone (toggling direction when it is already the sole sort).
  // Shift-click opts the column into a multi-column sort: it is appended to the chain, or its
  // direction toggled if already present.
  const handleSort = (key: SortKey, additive: boolean) => {
    setSort(prev => {
      const existing = prev.find(column => column.key === key);
      const toggled: SortDirection = existing?.direction === 'ascending' ? 'descending' : 'ascending';
      if (additive) {
        return existing
          ? prev.map(column => (column.key === key ? { key, direction: toggled } : column))
          : [...prev, { key, direction: 'ascending' }];
      }
      return [{ key, direction: prev.length === 1 && existing ? toggled : 'ascending' }];
    });
  };

  const multiColumn = sort.length > 1;

  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Box variant="h1">Table atomics — sorting (auto layout)</Box>
        <Box color="text-body-secondary">
          Click a column to sort by it. Shift-click a column to add it to a multi-column sort.
        </Box>

        <SpaceBetween size="s">
          <Header counter={`(${rows.length})`}>Resources</Header>
          <TableRoot ariaLabel="Resources">
            <TableHead>
              <TableHeaderRow>
                {COLUMNS.map(({ key, label }) => {
                  const index = sort.findIndex(column => column.key === key);
                  const active = index >= 0 ? sort[index] : undefined;
                  return (
                    <TableHeaderCell key={key} ariaSort={active ? active.direction : 'none'}>
                      <button
                        type="button"
                        className={styles['sort-button']}
                        onClick={event => handleSort(key, event.shiftKey)}
                      >
                        <span>{label}</span>
                        <span className={styles['sort-indicator']}>
                          {active ? (
                            <Icon name={active.direction === 'ascending' ? 'caret-up-filled' : 'caret-down-filled'} />
                          ) : (
                            <Icon name="caret-down" />
                          )}
                          {multiColumn && active && <span className={styles['sort-order']}>{index + 1}</span>}
                        </span>
                      </button>
                    </TableHeaderCell>
                  );
                })}
              </TableHeaderRow>
            </TableHead>
            <TableBody>
              {rows.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.size}</TableCell>
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
