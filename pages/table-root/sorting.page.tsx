// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo, useState } from 'react';

import Button from '~components/button';
import Header from '~components/header';
import Icon from '~components/icon';
import SpaceBetween from '~components/space-between';
import TableBody from '~components/table-body';
import TableBodyCell from '~components/table-body-cell';
import TableHead from '~components/table-head';
import TableHeaderCell from '~components/table-header-cell';
import TableRoot from '~components/table-root';
import TableRow from '~components/table-row';

import { useAppContext } from '../app/app-context';
import { SimplePage } from '../app/templates';
import { Item, makeItems } from './common';

type SortKey = 'name' | 'type' | 'size' | 'status';
type SortDirection = 'ascending' | 'descending';

interface SortEntry {
  key: SortKey;
  descending: boolean;
}

// Status can't be sorted, to show the disabled state.
const COLUMNS: ReadonlyArray<{ key: SortKey; label: string; disabled?: boolean }> = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'size', label: 'Size' },
  { key: 'status', label: 'Status', disabled: true },
];

export default function TableSortingPage() {
  const { urlParams, setUrlParams } = useAppContext<'sortKey' | 'sortDescending'>();
  const sortKey = (urlParams.sortKey as SortKey | undefined) ?? 'name';
  const descending = !!urlParams.sortDescending;

  const items = useMemo(() => makeItems(12), []);
  const rows = useMemo(() => sortItems(items, [{ key: sortKey, descending }]), [items, sortKey, descending]);

  return (
    <SimplePage title="Table atomics — sorting (auto layout)" screenshotArea={{}}>
      <SpaceBetween size="s">
        <Header counter={`(${rows.length})`}>Resources</Header>
        <TableRoot ariaLabel="Resources">
          <TableHead>
            <TableRow>
              {COLUMNS.map(({ key, label, disabled }) => {
                const direction = key === sortKey ? toDirection(descending) : undefined;
                return (
                  <TableHeaderCell key={key} disablePaddings="headerButton" ariaSort={direction}>
                    <Button
                      variant="table-header"
                      formAction="none"
                      wrapText={false}
                      disabled={disabled}
                      iconEnd={sortIcon(direction, disabled)}
                      onClick={() => setUrlParams({ sortKey: key, sortDescending: direction === 'ascending' })}
                    >
                      {label}
                    </Button>
                  </TableHeaderCell>
                );
              })}
            </TableRow>
          </TableHead>
          <ResourceRows rows={rows} />
        </TableRoot>
        <Header description="Shift+click or Shift+Enter adds a column to the sort.">Multi-column sort</Header>
        <MultiSortTable items={items} />
      </SpaceBetween>
    </SimplePage>
  );
}

function MultiSortTable({ items }: { items: Item[] }) {
  const [sorting, setSorting] = useState<SortEntry[]>([
    { key: 'type', descending: false },
    { key: 'size', descending: true },
  ]);
  const rows = useMemo(() => sortItems(items, sorting), [items, sorting]);

  return (
    <TableRoot ariaLabel="Resources, sorted by multiple columns">
      <TableHead>
        <TableRow>
          {COLUMNS.map(({ key, label, disabled }) => {
            const index = sorting.findIndex(entry => entry.key === key);
            const entry = sorting[index];
            const direction = entry ? toDirection(entry.descending) : undefined;
            const priority = sorting.length > 1 && entry ? index + 1 : undefined;
            // Only the first sorted column is the sort order, so only it has aria-sort. The others say their direction
            // in their name, through the icon's aria label, and their priority is the visible number.
            const isPrimary = index === 0;
            return (
              <TableHeaderCell key={key} disablePaddings="headerButton" ariaSort={isPrimary ? direction : undefined}>
                <Button
                  variant="table-header"
                  formAction="none"
                  wrapText={false}
                  disabled={disabled}
                  iconEnd={
                    priority ? (
                      <SpaceBetween direction="horizontal" size="xxs" alignItems="center">
                        <span>{priority}</span>
                        {sortIcon(direction, disabled, !isPrimary)}
                      </SpaceBetween>
                    ) : (
                      sortIcon(direction, disabled)
                    )
                  }
                  onClick={({ detail }) => {
                    const next = { key, descending: direction === 'ascending' };
                    setSorting(current =>
                      !detail.shiftKey
                        ? [next]
                        : entry
                          ? current.map(e => (e.key === key ? next : e))
                          : [...current, next]
                    );
                  }}
                >
                  {label}
                </Button>
              </TableHeaderCell>
            );
          })}
        </TableRow>
      </TableHead>
      <ResourceRows rows={rows} />
    </TableRoot>
  );
}

// A disabled column that isn't sorted has nothing to indicate, as in the existing Table.
function sortIcon(direction: SortDirection | undefined, disabled = false, announceDirection = false) {
  if (!direction) {
    return disabled ? null : <Icon name="caret-down" />;
  }
  return (
    <Icon
      name={direction === 'ascending' ? 'caret-up-filled' : 'caret-down-filled'}
      ariaLabel={announceDirection ? direction : undefined}
    />
  );
}

function ResourceRows({ rows }: { rows: Item[] }) {
  return (
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
  );
}

function toDirection(descending: boolean): SortDirection {
  return descending ? 'descending' : 'ascending';
}

function sortItems(items: Item[], sorting: SortEntry[]): Item[] {
  return [...items].sort((a, b) => {
    for (const { key, descending } of sorting) {
      const result = compare(key, a, b);
      if (result !== 0) {
        return descending ? -result : result;
      }
    }
    return 0;
  });
}

function compare(key: SortKey, a: Item, b: Item): number {
  if (key === 'size') {
    return parseInt(a.size, 10) - parseInt(b.size, 10);
  }
  return a[key].localeCompare(b[key]);
}
