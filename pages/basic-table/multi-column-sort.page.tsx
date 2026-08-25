// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo, useState } from 'react';

import BasicTable, {
  BasicTableBody,
  BasicTableCell,
  BasicTableHeader,
  BasicTableHeaderCell,
  BasicTableRow,
} from '~components/beta/basic-table-0.1';
import Box from '~components/box';
import Header from '~components/header';
import Icon from '~components/icon';
import SpaceBetween from '~components/space-between';

import { Item, makeItems } from './common';

// Multi-column sort is pure COMPOSITION — BasicTable adds no sort API. It only forwards `aria-sort`
// on a HeaderCell; the consumer renders its own sort control in the header children and owns the
// sort state + comparator. This page proves multi-column ergonomics end to end with BYO state:
// clicking a header cycles unsorted → ascending → descending → unsorted; each newly-sorted column is
// appended to an ordered priority list (badge shows its rank), and the rows are sorted by that list.
type Direction = 'ascending' | 'descending';
type SortKey = keyof Pick<Item, 'name' | 'type' | 'size' | 'status'>;
interface SortEntry {
  key: SortKey;
  direction: Direction;
}

const COLUMNS: Array<{ key: SortKey; label: string }> = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'size', label: 'Size' },
  { key: 'status', label: 'Status' },
];

// `size` is "N GiB"; compare its numeric part so ordering is by magnitude, not lexicographically.
const sizeValue = (raw: string) => parseInt(raw, 10);
function compareItems(a: Item, b: Item, key: SortKey): number {
  if (key === 'size') {
    return sizeValue(a.size) - sizeValue(b.size);
  }
  return a[key].localeCompare(b[key]);
}

export default function BasicTableMultiColumnSortPage() {
  const baseItems = useMemo(() => makeItems(12), []);
  const [sortOrder, setSortOrder] = useState<SortEntry[]>([]);

  // Click ergonomics: cycle the clicked column unsorted → ascending → descending → unsorted, keeping
  // any other columns' sort intact. A newly-sorted column joins the end of the priority list.
  const cycleColumn = (key: SortKey) => {
    setSortOrder(prev => {
      const existing = prev.find(entry => entry.key === key);
      if (!existing) {
        return [...prev, { key, direction: 'ascending' }];
      }
      if (existing.direction === 'ascending') {
        return prev.map(entry => (entry.key === key ? { ...entry, direction: 'descending' } : entry));
      }
      return prev.filter(entry => entry.key !== key);
    });
  };

  const sortedItems = useMemo(() => {
    if (sortOrder.length === 0) {
      return baseItems;
    }
    return [...baseItems].sort((a, b) => {
      for (const { key, direction } of sortOrder) {
        const diff = compareItems(a, b, key);
        if (diff !== 0) {
          return direction === 'ascending' ? diff : -diff;
        }
      }
      return 0;
    });
  }, [baseItems, sortOrder]);

  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Box variant="h1">BasicTable — multi-column sort (composed, BYO state)</Box>
        <Box variant="p">
          Sorted by:{' '}
          {sortOrder.length === 0
            ? 'nothing'
            : sortOrder.map((entry, i) => `${i + 1}. ${entry.key} (${entry.direction})`).join(', ')}
        </Box>

        <SpaceBetween size="s">
          <Header counter={`(${sortedItems.length})`}>Resources</Header>
          <BasicTable
            columns={[{ width: 220 }, { minWidth: 140 }, { minWidth: 120 }, {}]}
            totalRowCount={sortedItems.length}
            i18nStrings={{ tableLabel: 'Resources' }}
          >
            <BasicTableHeader>
              {COLUMNS.map(({ key, label }) => {
                const rank = sortOrder.findIndex(entry => entry.key === key);
                const entry = rank === -1 ? undefined : sortOrder[rank];
                return (
                  <BasicTableHeaderCell key={key} aria-sort={entry ? entry.direction : 'none'}>
                    <button
                      type="button"
                      onClick={() => cycleColumn(key)}
                      aria-label={`Sort by ${label}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        font: 'inherit',
                        color: 'inherit',
                        cursor: 'pointer',
                      }}
                    >
                      {label}
                      {entry && <Icon name={entry.direction === 'ascending' ? 'caret-up-filled' : 'caret-down-filled'} />}
                      {sortOrder.length > 1 && rank !== -1 && (
                        <Box variant="small" color="text-status-inactive" display="inline">
                          {rank + 1}
                        </Box>
                      )}
                    </button>
                  </BasicTableHeaderCell>
                );
              })}
            </BasicTableHeader>
            <BasicTableBody>
              {sortedItems.map((item, index) => (
                <BasicTableRow key={item.id} index={index} id={item.id}>
                  <BasicTableCell>{item.name}</BasicTableCell>
                  <BasicTableCell>{item.type}</BasicTableCell>
                  <BasicTableCell>{item.size}</BasicTableCell>
                  <BasicTableCell>{item.status}</BasicTableCell>
                </BasicTableRow>
              ))}
            </BasicTableBody>
          </BasicTable>
        </SpaceBetween>
      </SpaceBetween>
    </Box>
  );
}
