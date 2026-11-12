// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';

import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import TableBody from '~components/table-body';
import TableBodyCell from '~components/table-body-cell';
import TableHead from '~components/table-head';
import TableHeaderCell from '~components/table-header-cell';
import TableRoot from '~components/table-root';
import TableRow from '~components/table-row';
import TableSortButton from '~components/table-sort-button';

import { useAppContext } from '../app/app-context';
import { SimplePage } from '../app/templates';
import { Item, makeItems } from './common';

type SortKey = 'name' | 'type' | 'size' | 'status';

// Status can't be sorted, to show the disabled state.
const COLUMNS: ReadonlyArray<{ key: SortKey; label: string; disabled?: boolean }> = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'size', label: 'Size' },
  { key: 'status', label: 'Status', disabled: true },
];

function compare(key: SortKey, a: Item, b: Item): number {
  if (key === 'size') {
    return parseInt(a.size, 10) - parseInt(b.size, 10);
  }
  return a[key].localeCompare(b[key]);
}

export default function TableSortingPage() {
  const { urlParams, setUrlParams } = useAppContext<'sortKey' | 'sortDescending'>();
  const sortKey = (urlParams.sortKey as SortKey | undefined) ?? 'name';
  const descending = !!urlParams.sortDescending;

  const items = useMemo(() => makeItems(12), []);
  const rows = useMemo(() => {
    const sorted = [...items].sort((a, b) => compare(sortKey, a, b));
    return descending ? sorted.reverse() : sorted;
  }, [items, sortKey, descending]);

  return (
    <SimplePage title="Table atomics — sorting (auto layout)" screenshotArea={{}}>
      <SpaceBetween size="s">
        <Header counter={`(${rows.length})`}>Resources</Header>
        <TableRoot ariaLabel="Resources">
          <TableHead>
            <TableRow>
              {COLUMNS.map(({ key, label, disabled }) => (
                <TableHeaderCell key={key}>
                  <TableSortButton
                    sortingState={key !== sortKey ? 'sortable' : descending ? 'descending' : 'ascending'}
                    disabled={disabled}
                    onSortingChange={({ detail }) =>
                      setUrlParams({ sortKey: key, sortDescending: detail.sortingState === 'descending' })
                    }
                  >
                    {label}
                  </TableSortButton>
                </TableHeaderCell>
              ))}
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
