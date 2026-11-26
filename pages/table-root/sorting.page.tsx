// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';

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

import { SimplePage } from '../app/templates';
import { compareItems, Item, makeItems, SortKey } from './common';

type SortDirection = 'ascending' | 'descending';

// Status can't be sorted, to show the disabled state.
const COLUMNS: ReadonlyArray<{ key: SortKey; label: string; disabled?: boolean }> = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'size', label: 'Size' },
  { key: 'status', label: 'Status', disabled: true },
];

const items = makeItems(12);

export default function TableSortingPage() {
  const {
    items: rows,
    collectionProps,
    actions,
  } = useCollection(items, {
    sorting: { defaultState: { sortingColumn: sortingColumn('name') } },
  });
  const sortedKey = collectionProps.sortingColumn?.sortingField;

  return (
    <SimplePage title="Table atomics — sorting (auto layout)" screenshotArea={{}}>
      <SpaceBetween size="s">
        <Header counter={`(${rows.length})`}>Resources</Header>
        <TableRoot ariaLabel="Resources">
          <TableHead>
            <TableRow>
              {COLUMNS.map(({ key, label, disabled }) => {
                const direction = key === sortedKey ? toDirection(!!collectionProps.sortingDescending) : undefined;
                return (
                  <TableHeaderCell key={key} disablePaddings={true} ariaSort={direction}>
                    <Button
                      variant="table-header-cell"
                      formAction="none"
                      wrapText={false}
                      disabled={disabled}
                      iconAlign="right"
                      customIcon={sortIcon(direction, disabled)}
                      onClick={() =>
                        actions.setSorting({
                          sortingColumn: sortingColumn(key),
                          isDescending: direction === 'ascending',
                        })
                      }
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
        <MultiSortTable />
      </SpaceBetween>
    </SimplePage>
  );
}

function MultiSortTable() {
  const {
    items: rows,
    collectionProps,
    actions,
  } = useCollection(items, {
    sorting: {
      multiColumn: true,
      defaultSortingColumns: [
        { sortingColumn: sortingColumn('type') },
        { sortingColumn: sortingColumn('size'), isDescending: true },
      ],
    },
  });
  const sorting = collectionProps.multiColumnSort!.sortingColumns;

  return (
    <TableRoot ariaLabel="Resources, sorted by multiple columns">
      <TableHead>
        <TableRow>
          {COLUMNS.map(({ key, label, disabled }) => {
            const index = sorting.findIndex(entry => entry.sortingColumn.sortingField === key);
            const entry = sorting[index];
            const direction = entry ? toDirection(!!entry.isDescending) : undefined;
            const priority = sorting.length > 1 && entry ? index + 1 : undefined;
            // Only the first sorted column is the sort order, so only it has aria-sort. The others say their direction
            // in their name, through the icon's aria label, and their priority is the visible number.
            const isPrimary = index === 0;
            return (
              <TableHeaderCell key={key} disablePaddings={true} ariaSort={isPrimary ? direction : undefined}>
                <Button
                  variant="table-header-cell"
                  formAction="none"
                  wrapText={false}
                  disabled={disabled}
                  iconAlign="right"
                  customIcon={
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
                    const next = { sortingColumn: sortingColumn(key), isDescending: direction === 'ascending' };
                    actions.setMultiSorting(
                      !detail.shiftKey
                        ? [next]
                        : entry
                          ? sorting.map(e => (e === entry ? next : e))
                          : [...sorting, next]
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

function sortingColumn(key: SortKey) {
  return { sortingField: key, sortingComparator: (a: Item, b: Item) => compareItems(key, a, b) };
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

function ResourceRows({ rows }: { rows: ReadonlyArray<Item> }) {
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
