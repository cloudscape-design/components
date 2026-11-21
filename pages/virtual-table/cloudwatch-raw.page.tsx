// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo, useState } from 'react';

import VirtualTable, { VirtualTableProps } from '~components/virtual-table';

import ScreenshotArea from '../utils/screenshot-area';

// CloudWatch file / raw view — the third required surface (CW-15).
// This is the SAME F1-A1 API reduced to its simplest shape:
//  - a single column rendering the raw log line,
//  - no getExpandedContent (expansion off, so no disclosure column),
//  - estimatedRowHeight = 20 (RAW_LINE_HEIGHT), overscan = 40 (FILE_VIEW_OVERSCAN),
//  - getRowHeight returns 'auto' only for wrapping candidates (long lines span
//    more than one 20 px line box); short lines keep the fixed 20 px baseline so
//    the observer is not attached to every windowed line (NB5).
// Demonstrates that all three CloudWatch surfaces are reachable from one API
// without a specialized "raw" mode in the component.

interface RawLine {
  id: string;
  text: string;
}

const RAW_LINE_HEIGHT = 20;
const FILE_VIEW_OVERSCAN = 40;
const LINE_COUNT = 5000;

function makeLine(index: number): RawLine {
  // Every ~7th line is long enough to wrap, exercising measured variable heights.
  const long = index % 7 === 0;
  const base = `2024-06-01T12:00:${String(index % 60).padStart(2, '0')}.123Z [INFO] request ${index} completed`;
  return {
    id: `line-${index}`,
    text: long
      ? `${base} — payload=${'x'.repeat(220)} (truncation off, wraps across multiple ${RAW_LINE_HEIGHT}px line boxes)`
      : base,
  };
}

export default function CloudWatchRawPage() {
  const [items] = useState<RawLine[]>(() => Array.from({ length: LINE_COUNT }, (_, index) => makeLine(index)));

  const columnDefinitions = useMemo<ReadonlyArray<VirtualTableProps.ColumnDefinition<RawLine>>>(
    () => [
      {
        id: 'line',
        header: 'Log events',
        cell: item => (
          <span style={{ fontFamily: 'monospace', fontSize: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {item.text}
          </span>
        ),
        isStretch: true,
      },
    ],
    []
  );

  return (
    <>
      <h1>VirtualTable — CloudWatch file / raw view</h1>
      <p>{items.length.toLocaleString()} raw log lines · wrapping, expansion off</p>
      <ScreenshotArea>
        <div>
          <VirtualTable<RawLine>
            items={items}
            trackBy={item => item.id}
            columnDefinitions={columnDefinitions}
            estimatedRowHeight={RAW_LINE_HEIGHT}
            height={480}
            getRowHeight={item => (item.text.length > 120 ? 'auto' : RAW_LINE_HEIGHT)}
            overscan={FILE_VIEW_OVERSCAN}
            stickyHeader={true}
            ariaLabels={{ tableLabel: 'Raw log events' }}
          />
        </div>
      </ScreenshotArea>
    </>
  );
}
