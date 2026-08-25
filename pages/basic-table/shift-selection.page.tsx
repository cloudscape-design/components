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

import { makeItems } from './common';

// Dedicated shift-range selection page. BasicTable holds no selection state — shift-range is pure
// consumer logic: an anchor index is remembered from the last plain click, and a shift+click selects
// the whole [anchor..index] range. The modifier is captured on pointer/keydown capture because
// Cloudscape Checkbox's onChange does not expose modifier keys. Proves the BYO shift-range pattern
// composes with `variant="selection"` cells + `RowProps.selected`.
const ITEM_COUNT = 12;

export default function BasicTableShiftSelectionPage() {
  const items = makeItems(ITEM_COUNT);
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(new Set());
  const anchorIndex = useRef<number | null>(null);
  const shiftPressed = useRef(false);

  const selectRow = (index: number, id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (shiftPressed.current && anchorIndex.current !== null) {
        const [lo, hi] = [anchorIndex.current, index].sort((a, b) => a - b);
        for (let i = lo; i <= hi; i++) {
          next.add(items[i].id);
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
        <Box variant="h1">BasicTable — shift-range selection</Box>
        <Box>Click a row to anchor, then Shift+click another to select the whole range.</Box>
        <Header counter={`(${selectedIds.size}/${items.length})`}>Resources</Header>
        <BasicTable columns={[{ width: 40 }, { width: 220 }, { minWidth: 140 }, {}]} totalRowCount={items.length} i18nStrings={{ tableLabel: 'Resources' }}>
          <BasicTableHeader>
            <BasicTableHeaderCell variant="selection">
              <span />
            </BasicTableHeaderCell>
            <BasicTableHeaderCell>Name</BasicTableHeaderCell>
            <BasicTableHeaderCell>Type</BasicTableHeaderCell>
            <BasicTableHeaderCell>Status</BasicTableHeaderCell>
          </BasicTableHeader>
          <BasicTableBody>
            {items.map((item, index) => (
              <BasicTableRow key={item.id} index={index} id={item.id} selected={selectedIds.has(item.id)}>
                <BasicTableCell variant="selection">
                  <span
                    onMouseDownCapture={event => (shiftPressed.current = event.shiftKey)}
                    onKeyDownCapture={event => (shiftPressed.current = event.shiftKey)}
                  >
                    <Checkbox
                      checked={selectedIds.has(item.id)}
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
