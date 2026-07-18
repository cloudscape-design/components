// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Button from '~components/button';
import VirtualTable, { VirtualTableProps } from '~components/virtual-table';
import { colorTextBodySecondary } from '~design-tokens';

import ScreenshotArea from '../utils/screenshot-area';

// CloudWatch Logs Insights STANDARD view on the F2-A1 config-driven, logs-specialized
// VirtualTable (view="standard"). Exercises the opinionated built-ins the console gets
// for free — live tail and the two-mode filter are component-owned mechanics; the
// console supplies only policy (follow state, filter predicate) through the
// override-seam. R-EXPAND shape A (~300px log-record detail) is arbitrary non-tabular
// content via getExpandedContent + the log-record preset. Density 23/300 preserved;
// the raw surface (CW-15) lives in cloudwatch-raw.page.tsx.

interface LogRecord {
  id: string;
  timestamp: string;
  level: 'ERROR' | 'WARN' | 'INFO';
  message: string;
  fields: Record<string, string>;
}

const LEVELS: Array<LogRecord['level']> = ['INFO', 'INFO', 'INFO', 'WARN', 'ERROR'];

function makeRecord(index: number): LogRecord {
  const level = LEVELS[index % LEVELS.length];
  return {
    id: `log-${index}`,
    timestamp: new Date(Date.UTC(2026, 6, 18, 5, 0, 0) + index * 1000).toISOString(),
    level,
    message: `${level} request ${index} completed handler=/api/v${(index % 3) + 1}/resource`,
    fields: {
      '@requestId': `req-${1000 + index}`,
      durationMs: String(20 + (index % 200)),
      accountId: `1234567890${index % 10}`,
      region: index % 2 === 0 ? 'us-east-1' : 'eu-west-1',
    },
  };
}

const INITIAL_ITEMS: LogRecord[] = Array.from({ length: 2000 }, (_, index) => makeRecord(index));

// CW-8 dynamic columns + a single stretch-last @message column. Standard view has NO
// per-column sort (sort is a patterns-view capability, CW-9), so no sortingField.
const columnDefinitions: Array<VirtualTableProps.ColumnDefinition<LogRecord>> = [
  {
    id: '@timestamp',
    header: '@timestamp',
    width: 230,
    cell: item => <span style={{ fontFamily: 'monospace' }}>{item.timestamp}</span>,
  },
  { id: 'level', header: 'level', width: 90, cell: item => item.level },
  {
    id: '@requestId',
    header: '@requestId',
    width: 150,
    cell: item => <span style={{ fontFamily: 'monospace' }}>{item.fields['@requestId']}</span>,
  },
  { id: 'durationMs', header: 'duration (ms)', width: 130, cell: item => item.fields.durationMs },
  {
    id: '@message',
    header: '@message',
    isStretch: true,
    cell: item => <span style={{ fontFamily: 'monospace' }}>{item.message}</span>,
  },
];

// R-EXPAND shape A: arbitrary, non-tabular log-record detail — a key/value grid over
// ALL fields plus a collapsible raw JSON block. Deliberately NOT the column set.
function LogRecordDetail({ item }: { item: LogRecord }) {
  const entries: Array<[string, string]> = [
    ['@timestamp', item.timestamp],
    ['level', item.level],
    ['@message', item.message],
    ...Object.entries(item.fields),
  ];
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '2px 16px' }}>
        {entries.map(([key, value]) => (
          <React.Fragment key={key}>
            <span style={{ fontFamily: 'monospace', color: colorTextBodySecondary }}>{key}</span>
            <span style={{ fontFamily: 'monospace' }}>{value}</span>
          </React.Fragment>
        ))}
      </div>
      <details>
        <summary>Raw JSON</summary>
        <pre style={{ fontFamily: 'monospace', margin: 0 }}>
          {JSON.stringify(
            { id: item.id, timestamp: item.timestamp, level: item.level, message: item.message, ...item.fields },
            null,
            2
          )}
        </pre>
      </details>
    </div>
  );
}

export default function VirtualTableCloudWatchStandardPage() {
  const [items, setItems] = useState<LogRecord[]>(INITIAL_ITEMS);
  const [following, setFollowing] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [visibleRange, setVisibleRange] = useState<VirtualTableProps.VisibleRangeDetail>({
    firstIndex: 0,
    lastIndex: 0,
  });
  const [filterText, setFilterText] = useState('');
  const [filterMode, setFilterMode] = useState<'subset' | 'mark-in-place'>('mark-in-place');
  const ref = useRef<VirtualTableProps.Ref>(null);
  const nextIndexRef = useRef(INITIAL_ITEMS.length);

  // Built-in live tail: VirtualTable owns pin-to-newest + release-on-scroll-away; the
  // console owns only the follow policy. The append stream runs continuously (mounted
  // once, NOT gated on `following`) so releasing follow does not silence it — new rows
  // keep arriving below the viewport, which is exactly what release-on-scroll-away is
  // for: the viewport is held put while events pile up, and re-following snaps to
  // newest. `following` governs only auto-scroll, which the component owns. ids/records
  // are computed OUTSIDE the setState updater so React 18 StrictMode's double-invoke is
  // safe.
  useEffect(() => {
    const timer = setInterval(() => {
      const base = nextIndexRef.current;
      nextIndexRef.current = base + 3;
      const added = [makeRecord(base), makeRecord(base + 1), makeRecord(base + 2)];
      setItems(prev => [...prev, ...added]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleExpandChange = useCallback(
    (event: { detail: VirtualTableProps.ExpandChangeDetail<LogRecord> }) =>
      setExpandedItems([...event.detail.expandedItems]),
    []
  );

  // Two-mode filter (CW-10): the console supplies only the predicate + highlight; the
  // component owns the match-indicator column, non-visual conveyance, counts, and
  // keyboard next/prev-match. mark-in-place keeps surrounding context visible.
  const filter = useMemo<VirtualTableProps.Filter<LogRecord> | undefined>(() => {
    const query = filterText.trim().toLowerCase();
    if (!query) {
      return undefined;
    }
    return {
      mode: filterMode,
      predicate: item => item.message.toLowerCase().includes(query),
      highlight: (item, columnId) => columnId === '@message' && item.message.toLowerCase().includes(query),
    };
  }, [filterText, filterMode]);

  const revealFirstError = () => {
    const firstError = items.find(item => item.level === 'ERROR');
    if (firstError) {
      ref.current?.revealItem(firstError.id);
    }
  };

  return (
    <>
      <h1>VirtualTable — CloudWatch Logs Insights, standard view (F2-A1)</h1>
      <p>
        Logs-specialized VirtualTable with <code>view=&quot;standard&quot;</code>. Live tail and the mark-in-place
        filter are built-in mechanics; this page supplies only follow state and a predicate. Row expansion renders
        arbitrary non-tabular log-record detail (shape A, ~300&nbsp;px).
      </p>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBlockEnd: 8 }}>
        <label>
          Filter @message:{' '}
          <input
            aria-label="Filter log messages"
            value={filterText}
            onChange={event => setFilterText(event.target.value)}
            placeholder="e.g. ERROR"
          />
        </label>
        <Button onClick={revealFirstError}>Reveal first error</Button>
        <label>
          Filter mode:{' '}
          <select
            aria-label="Filter mode"
            value={filterMode}
            onChange={event => setFilterMode(event.target.value as 'subset' | 'mark-in-place')}
          >
            <option value="mark-in-place">mark in place</option>
            <option value="subset">subset</option>
          </select>
        </label>
        <span>
          Visible rows {visibleRange.firstIndex}–{visibleRange.lastIndex} · {following ? 'following' : 'paused'}
        </span>
      </div>
      <ScreenshotArea>
        <div style={{ blockSize: 480 }}>
          <VirtualTable
            items={items}
            trackBy={item => item.id}
            viewConfig={{ type: 'standard', columnDefinitions }}
            estimatedRowHeight={23}
            overscan={20}
            stickyHeader={true}
            resizableColumns={true}
            follow={following}
            onFollowChange={event => setFollowing(event.detail.follow)}
            expandedContentPreset="log-record"
            getExpandedContent={item => <LogRecordDetail item={item} />}
            getExpandedRowHeight={() => 300}
            expandedItems={expandedItems}
            onExpandChange={handleExpandChange}
            filter={filter}
            onVisibleRangeChange={event => setVisibleRange(event.detail)}
            imperativeRef={ref}
            ariaLabels={{
              gridLabel: 'CloudWatch Logs Insights results',
              expandRowLabel: item => `Show details for log ${item.fields['@requestId']}`,
              collapseRowLabel: item => `Hide details for log ${item.fields['@requestId']}`,
              followToggleLabel: 'Live tail',
              filterMatchLabel: () => 'Filter match',
              matchNavigationLabel: 'Filter match navigation',
              previousMatchLabel: 'Previous match',
              nextMatchLabel: 'Next match',
            }}
            i18nStrings={{
              filterCountText: (matched, total) => `${matched} of ${total} matches`,
              appendAnnouncementText: count => `${count} new log events`,
              expandedRegionLabel: 'Log record detail',
            }}
          />
        </div>
      </ScreenshotArea>
    </>
  );
}
