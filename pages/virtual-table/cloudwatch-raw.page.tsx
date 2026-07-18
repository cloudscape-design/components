// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import VirtualTable from '~components/virtual-table';

import ScreenshotArea from '../utils/screenshot-area';

// CloudWatch raw / file log-line view (CW-15) as the SAME F2-A1 API reduced to
// view="raw": a single monospaced line renderer, no columns and no expansion, at
// RAW_LINE_HEIGHT density (estimatedRowHeight 20, overscan 40 = FILE_VIEW_OVERSCAN).
// Long lines wrap and are measured (getRowHeight="auto" for wrapping candidates only,
// so short lines stay fixed at 20px and pay no observer cost); full-dataset
// aria-rowcount/aria-rowindex hold under windowing. Proves all three surfaces reach
// from one config-driven API with no specialized raw mode.

interface RawLine {
  id: string;
  text: string;
}

const rawItems: RawLine[] = Array.from({ length: 5000 }, (_, index) => {
  const stamp = `2026-07-18T05:${String(Math.floor(index / 60) % 60).padStart(2, '0')}:${String(index % 60).padStart(2, '0')}Z`;
  const wraps = index % 7 === 0;
  return {
    id: `line-${index}`,
    text: wraps
      ? `${stamp} [ERROR] request ${index} failed ` + 'at handler /api/resource -> service -> repository '.repeat(4)
      : `${stamp} [INFO] request ${index} completed in ${20 + (index % 200)}ms`,
  };
});

export default function VirtualTableCloudWatchRawPage() {
  return (
    <>
      <h1>VirtualTable — CloudWatch raw log view (F2-A1)</h1>
      <p>
        The raw/file surface on <code>view=&quot;raw&quot;</code>: one monospaced line renderer, no columns, no
        expansion. Long lines wrap and are measured; short lines stay fixed at the 20&nbsp;px raw-line density.
      </p>
      <ScreenshotArea>
        <div style={{ blockSize: 480 }}>
          <VirtualTable
            items={rawItems}
            trackBy={item => item.id}
            estimatedRowHeight={20}
            overscan={40}
            getRowHeight={item => (item.text.length > 120 ? 'auto' : 20)}
            viewConfig={{
              type: 'raw',
              renderLine: item => (
                <span style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {item.text}
                </span>
              ),
            }}
            ariaLabels={{ gridLabel: 'Raw log events' }}
          />
        </div>
      </ScreenshotArea>
    </>
  );
}
