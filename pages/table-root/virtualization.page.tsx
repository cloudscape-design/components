// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import Box from '~components/box';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import TableBody from '~components/table-body';
import TableCell from '~components/table-cell';
import TableHead from '~components/table-head';
import TableHeaderCell from '~components/table-header-cell';
import TableHeaderRow from '~components/table-header-row';
import TableRoot, { TableRootProps } from '~components/table-root';
import TableRow from '~components/table-row';

// Bring-your-own fixed-height virtualization (grid layout). A tiny hand-rolled
// windowing calc (no external dependency) stands in for a library like @tanstack/react-virtual: the
// consumer owns the scroll container and computes which rows are in view, then positions them via the
// narrowed `style` props — `height`/`position` on TableBody (reserve the total scroll height) and
// `transform`/`position`/`height` on each TableRow (place it at its offset). `ariaRowcount` +
// `ariaRowindex` keep assistive technologies aware of the full dataset while only a window renders.
const ROW_HEIGHT = 40;
const VIEWPORT_HEIGHT = 400;
const OVERSCAN = 4;
const TOTAL = 10000;
const COLUMNS: ReadonlyArray<TableRootProps.ColumnDefinition> = [{ size: 120 }, {}];

interface LogLine {
  id: string;
  timestamp: string;
  message: string;
}

const makeLine = (index: number): LogLine => ({
  id: `line-${index}`,
  timestamp: new Date(1_700_000_000_000 + index * 1000).toISOString().slice(11, 19),
  message: `Log message ${index} — event processed`,
});

export default function TableVirtualizationPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const first = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
  const visibleCount = Math.ceil(VIEWPORT_HEIGHT / ROW_HEIGHT) + OVERSCAN * 2;
  const last = Math.min(TOTAL, first + visibleCount);
  const indexes: number[] = [];
  for (let i = first; i < last; i++) {
    indexes.push(i);
  }

  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Box variant="h1">Table atomics — bring-your-own virtualization (grid layout)</Box>

        <SpaceBetween size="s">
          <Header counter={`(${TOTAL.toLocaleString()})`}>Log lines</Header>
          <div
            ref={scrollRef}
            onScroll={event => setScrollTop(event.currentTarget.scrollTop)}
            style={{ overflowY: 'auto', height: VIEWPORT_HEIGHT }}
          >
            <TableRoot columnLayout={{ type: 'grid', columns: COLUMNS }} ariaRowcount={TOTAL} ariaLabel="Log lines">
              <TableHead>
                <TableHeaderRow>
                  <TableHeaderCell>Time</TableHeaderCell>
                  <TableHeaderCell>Message</TableHeaderCell>
                </TableHeaderRow>
              </TableHead>
              <TableBody style={{ position: 'relative', height: TOTAL * ROW_HEIGHT }}>
                {indexes.map(index => {
                  const line = makeLine(index);
                  return (
                    <TableRow
                      key={line.id}
                      ariaRowindex={index + 2}
                      style={{ position: 'absolute', transform: `translateY(${index * ROW_HEIGHT}px)`, height: ROW_HEIGHT }}
                    >
                      <TableCell>{line.timestamp}</TableCell>
                      <TableCell>{line.message}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </TableRoot>
          </div>
        </SpaceBetween>
      </SpaceBetween>
    </Box>
  );
}
