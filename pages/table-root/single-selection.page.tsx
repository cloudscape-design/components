// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Header from '~components/header';
import RadioButton from '~components/radio-button';
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

// Single selection (grid layout). It composes exactly like multi selection, but the control is a
// radio and only one row is selected at a time — the consumer tracks a single selected id. The rows
// share a radio `name`, so the browser's native radio group gives up/down arrow-key navigation
// between rows for free (matching classic Table). Each radio's accessible name comes from a
// visually-hidden label (RadioButton has no `ariaLabel` prop). The control column matches classic
// Table via `disablePaddings` cells and a centered control; the header has no select-all control.
// Selection control column is a fixed 40px; the Name and Status columns share the remaining width
// with proportional flex weights (~53:47), reproducing classic Table's balanced auto-layout split at
// the demo viewport. (Flexing Name to fill and pinning Status to a fixed width would shove Status to
// the far right with a large gap, unlike classic.)
const COLUMNS: ReadonlyArray<TableRootProps.ColumnDefinition> = [
  { size: 40 },
  { size: { flex: 53 } },
  { size: { flex: 47 } },
];
const ITEM_COUNT = 10;

export default function TableSingleSelectionPage() {
  const items = makeItems(ITEM_COUNT);
  const [selectedId, setSelectedId] = useState<string>(items[1].id);

  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Box variant="h1">Table atomics — single selection (grid layout)</Box>

        <SpaceBetween size="s">
          <Header counter={`(1/${items.length})`}>Resources</Header>
          <TableRoot columnLayout={{ type: 'grid', columns: COLUMNS }} ariaLabel="Resources">
            <TableHead>
              <TableHeaderRow>
                <TableHeaderCell disablePaddings={true} />
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableHeaderRow>
            </TableHead>
            <TableBody>
              {items.map((item: Item) => (
                <TableRow key={item.id} variant={selectedId === item.id ? 'selected' : 'default'}>
                  <TableCell disablePaddings={true}>
                    <div className={styles['selection-cell']}>
                      {/* The accessible name is supplied by an associated `<label for>` rather than a
                          RadioButton label child: a child label makes the switch reserve label-gap space
                          and pushes the control ~4px off the column centre, whereas an empty control
                          centres exactly like classic's selection column. */}
                      <label htmlFor={`select-${item.id}`} className={styles['visually-hidden']}>
                        {`Select ${item.name}`}
                      </label>
                      <RadioButton
                        controlId={`select-${item.id}`}
                        name="resource-single-selection"
                        value={item.id}
                        checked={selectedId === item.id}
                        onSelect={() => setSelectedId(item.id)}
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
