// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import BasicTable, {
  BasicTableBody,
  BasicTableCell,
  BasicTableHeader,
  BasicTableHeaderCell,
  BasicTableRow,
} from '~components/beta/basic-table-0.1';
import Box from '~components/box';
import Checkbox from '~components/checkbox';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';

import { Item, makeItems } from './common';

// Faithful (non-sticky) port of table/selection. BasicTable is BYO-selection: a leading
// `variant="selection"` control column hosts the select-all / per-row checkboxes, selected rows use
// `RowProps.selected` (an overlay-border surface + aria-selected), and consecutive selected rows read
// as one rounded block with a single blue inner divider (SCSS `.row-selected + .row-selected`).
// Shift-range is consumer logic — Cloudscape Checkbox onChange exposes no modifier keys, so shift is
// captured on pointer/keydown and an anchor index is tracked. One row is disabled to mirror the
// reference's `isItemDisabled`.
const ITEM_COUNT = 10;
const DISABLED_INDEX = 5;

export default function BasicTableSelectionPage() {
  const items = makeItems(ITEM_COUNT);
  const isDisabled = (index: number) => index === DISABLED_INDEX;
  const selectableItems = items.filter((_, index) => !isDisabled(index));

  // Pre-select two ADJACENT enabled rows so the consecutive block-merge + blue inner divider is
  // visible on load.
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(new Set([items[1].id, items[2].id]));
  const anchorIndex = useRef<number | null>(null);
  const shiftPressed = useRef(false);

  const allSelected = selectableItems.every(item => selectedIds.has(item.id));
  const someSelected = selectableItems.some(item => selectedIds.has(item.id));
  const toggleAll = () =>
    setSelectedIds(allSelected ? new Set() : new Set(selectableItems.map(item => item.id)));

  const selectRow = (index: number, id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (shiftPressed.current && anchorIndex.current !== null) {
        const [lo, hi] = [anchorIndex.current, index].sort((a, b) => a - b);
        for (let i = lo; i <= hi; i++) {
          if (!isDisabled(i)) {
            next.add(items[i].id);
          }
        }
      } else if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    anchorIndex.current = index;
  };

  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Header counter={`(${selectedIds.size}/${selectableItems.length})`}>Selectable resources</Header>
        <BasicTable
          columns={[{ width: 40 }, { width: 220 }, { minWidth: 140 }, {}]}
          totalRowCount={items.length}
          i18nStrings={{ tableLabel: 'Resources' }}
        >
          <BasicTableHeader>
            <BasicTableHeaderCell variant="selection">
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected && !allSelected}
                onChange={toggleAll}
                ariaLabel="Select all resources"
              />
            </BasicTableHeaderCell>
            <BasicTableHeaderCell>Name</BasicTableHeaderCell>
            <BasicTableHeaderCell>Type</BasicTableHeaderCell>
            <BasicTableHeaderCell>Status</BasicTableHeaderCell>
          </BasicTableHeader>
          <BasicTableBody>
            {items.map((item: Item, index: number) => (
              <BasicTableRow key={item.id} index={index} id={item.id} selected={selectedIds.has(item.id)}>
                <BasicTableCell variant="selection">
                  <span
                    onMouseDownCapture={event => (shiftPressed.current = event.shiftKey)}
                    onKeyDownCapture={event => (shiftPressed.current = event.shiftKey)}
                  >
                    <Checkbox
                      checked={selectedIds.has(item.id)}
                      disabled={isDisabled(index)}
                      onChange={() => selectRow(index, item.id)}
                      ariaLabel={`Select ${item.name}`}
                    />
                  </span>
                </BasicTableCell>
                <BasicTableCell>{item.name}</BasicTableCell>
                <BasicTableCell>{item.type}</BasicTableCell>
                <BasicTableCell>{item.status}</BasicTableCell>
              </BasicTableRow>
            ))}
          </BasicTableBody>
        </BasicTable>
      </SpaceBetween>
    </Box>
  );
}
