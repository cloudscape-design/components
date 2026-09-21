// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo, useState } from 'react';

import Header from '~components/header';
import Icon from '~components/icon';
import SpaceBetween from '~components/space-between';
import TableBody from '~components/table-body';
import TableBodyCell from '~components/table-body-cell';
import TableHead from '~components/table-head';
import TableHeaderCell from '~components/table-header-cell';
import TableRoot from '~components/table-root';
import TableRow from '~components/table-row';

import { SimplePage } from '../app/templates';
import { Item, makeItems } from './common';

import styles from './styles.scss';

// Sorting (auto layout). Sorting is fully composed by the consumer — the atomic components contribute
// only `ariaSort` on each header cell. Clicking a column sorts by it, toggling direction when it is
// already the active column. Caret icons match the existing Table: `caret-down` (sortable, inactive),
// `caret-up-filled` (ascending), `caret-down-filled` (descending).

type SortKey = 'name' | 'type' | 'size' | 'status';
type SortDirection = 'ascending' | 'descending';

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
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [direction, setDirection] = useState<SortDirection>('ascending');

  const rows = useMemo(() => {
    const sorted = [...items].sort((a, b) => compare(sortKey, a, b));
    return direction === 'ascending' ? sorted : sorted.reverse();
  }, [items, sortKey, direction]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setDirection(prev => (prev === 'ascending' ? 'descending' : 'ascending'));
    } else {
      setSortKey(key);
      setDirection('ascending');
    }
  };

  return (
    <SimplePage title="Table atomics — sorting (auto layout)" screenshotArea={{}}>
      <SpaceBetween size="s">
        <Header counter={`(${rows.length})`}>Resources</Header>
        <TableRoot ariaLabel="Resources">
          <TableHead>
            <TableRow>
              {COLUMNS.map(({ key, label }) => {
                const active = key === sortKey;
                return (
                  <TableHeaderCell key={key} ariaSort={active ? direction : 'none'}>
                    <button type="button" className={styles['sort-button']} onClick={() => handleSort(key)}>
                      <span>{label}</span>
                      <span className={styles['sort-indicator']}>
                        <Icon
                          name={
                            active
                              ? direction === 'ascending'
                                ? 'caret-up-filled'
                                : 'caret-down-filled'
                              : 'caret-down'
                          }
                        />
                      </span>
                    </button>
                  </TableHeaderCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(item => (
              <TableRow key={item.id}>
                <TableBodyCell>{item.name}</TableBodyCell>
                <TableBodyCell>{item.type}</TableBodyCell>
                <TableBodyCell>{item.size}</TableBodyCell>
                <TableBodyCell>{item.status}</TableBodyCell>
              </TableRow>
            ))}
          </TableBody>
        </TableRoot>
      </SpaceBetween>
    </SimplePage>
  );
}
