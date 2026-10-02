// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import Button from '~components/button';
import VirtualTable, { VirtualTableProps } from '~components/virtual-table';
import { colorTextBodySecondary } from '~design-tokens';

import ScreenshotArea from '../utils/screenshot-area';

// CloudWatch Logs Insights STANDARD view on the F1-A2 COMPOUND API.
// Same CloudWatch surface as the F1-A1 config-driven demo, expressed through the
// compound tree (Root / Header / HeaderCell / Body row-template / Cell /
// ExpandedContent). See research/cloudwatch-requirements.md:
//  - CW-8  dynamic columns from arbitrary fields (rendered as HeaderCells + Cells)
//          + the leading disclosure column materialised by Root; fixed layout with
//          @message as the single stretch-last column.
//  - CW-12 accurate visible-range reporting under variable heights.
//  - CW-13 scroll-to-and-reveal a specific row (expand + scroll) via the ref.
//  - CW-7  consumer-composed live tail (pin to newest, release on manual scroll)
//          built on the imperative ref — the component owns no follow policy.
//  - R-EXPAND shape A: <VirtualTable.ExpandedContent> renders the full log record as
//          arbitrary, non-tabular key/value detail (NOT the column set), measured (~300 px).
// Density is preserved: 23 px collapsed rows, ~300 px expanded estimate, overscan 20.

const LOG_LEVELS = ['INFO', 'WARN', 'ERROR', 'DEBUG'] as const;
type LogLevel = (typeof LOG_LEVELS)[number];

interface LogRecord {
  id: string;
  timestamp: number;
  level: LogLevel;
  message: string;
  // Arbitrary discovered fields — the standard view surfaces a subset as columns
  // and the full record in the expanded detail.
  fields: Record<string, string>;
}

const REQUEST_IDS = ['a1b2c3d4', 'e5f6a7b8', 'c9d0e1f2', '3a4b5c6d'];

function makeRecord(index: number): LogRecord {
  const level = LOG_LEVELS[index % LOG_LEVELS.length];
  const requestId = REQUEST_IDS[index % REQUEST_IDS.length];
  return {
    id: `log-${index}`,
    timestamp: 1_700_000_000_000 + index * 137,
    level,
    message:
      level === 'ERROR'
        ? `Handler failed: DynamoDB throttled after 3 retries (requestId=${requestId})`
        : `Processed event ${index} for requestId=${requestId} in ${8 + (index % 40)}ms`,
    fields: {
      '@timestamp': new Date(1_700_000_000_000 + index * 137).toISOString(),
      '@logStream': `2024/06/01/[$LATEST]${requestId}`,
      '@requestId': requestId,
      level,
      durationMs: String(8 + (index % 40)),
      billedMs: String(10 + (index % 40)),
      memoryUsedMB: String(64 + (index % 128)),
    },
  };
}

const INITIAL_COUNT = 2000;

// CW-8: the standard view surfaces a consumer-chosen subset of discovered fields
// as columns; the set is dynamic (mapped to HeaderCells + Cells below), not a fixed
// three. @message is the single stretch-last column.
const DISPLAYED_FIELDS = ['@timestamp', 'level', '@requestId', 'durationMs'];

// Arbitrary, non-tabular expanded content (R-EXPAND shape A): a key/value detail
// list plus the raw JSON record. Deliberately not the column layout.
function LogRecordDetail({ record }: { record: LogRecord }) {
  const entries = Object.entries(record.fields);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '4px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', columnGap: 16, rowGap: 2 }}>
        {entries.map(([key, value]) => (
          <React.Fragment key={key}>
            <span style={{ fontFamily: 'monospace', color: colorTextBodySecondary }}>{key}</span>
            <span style={{ fontFamily: 'monospace' }}>{value}</span>
          </React.Fragment>
        ))}
      </div>
      <details>
        <summary style={{ cursor: 'pointer' }}>Raw record (JSON)</summary>
        <pre style={{ margin: '4px 0 0', fontSize: 12, whiteSpace: 'pre-wrap' }}>
          {JSON.stringify({ id: record.id, message: record.message, ...record.fields }, null, 2)}
        </pre>
      </details>
    </div>
  );
}

export default function CloudWatchStandardCompoundPage() {
  const [items, setItems] = useState<LogRecord[]>(() =>
    Array.from({ length: INITIAL_COUNT }, (_, index) => makeRecord(index))
  );
  const [expandedItems, setExpandedItems] = useState<ReadonlyArray<string>>([]);
  const [following, setFollowing] = useState(true);
  const [visibleRange, setVisibleRange] = useState({ firstIndex: 0, lastIndex: 0 });

  const ref = useRef<VirtualTableProps.Ref>(null);
  const nextIndexRef = useRef(INITIAL_COUNT);
  // Pinned state is captured BEFORE each append so the follow decision does not
  // depend on the core's "at bottom edge" tolerance after the runway grows
  // (F1-A1 cw-standard B1 learning carried forward).
  const wasPinnedRef = useRef(true);

  // Live tail (CW-7): the component exposes only mechanism (scrollToEnd /
  // isPinnedToEnd); the follow *policy* lives here.
  useEffect(() => {
    if (!following) {
      return;
    }
    // On (re)start, establish the pinned state so following=true actually tails from
    // the current position: at mount the viewport sits at the top over the initial
    // dataset, so isPinnedToEnd() is false and nothing would tail until the user
    // scrolled down once. Seeding pinned + snapping to the newest row makes live tail
    // engage immediately on load and on resume (B1 fix; folds NB2 snap-on-resume).
    wasPinnedRef.current = true;
    ref.current?.scrollToEnd();
    const timer = setInterval(() => {
      // Capture pinned state BEFORE the append grows the runway (tolerance-independent),
      // and generate the batch + ids OUTSIDE the state updater so the updater stays pure
      // under React 18 StrictMode double-invoke (F1-A1 cw-standard B1/B2 learnings).
      wasPinnedRef.current = ref.current?.isPinnedToEnd() !== false;
      const base = nextIndexRef.current;
      nextIndexRef.current = base + 3;
      const added = [makeRecord(base), makeRecord(base + 1), makeRecord(base + 2)];
      setItems(prev => [...prev, ...added]);
    }, 1000);
    return () => clearInterval(timer);
  }, [following]);

  // Re-pin to the newest row after the appended rows have laid out, but only if the
  // viewport was pinned at capture time. A manual scroll away makes the next tick
  // capture wasPinnedRef=false, naturally releasing follow.
  useLayoutEffect(() => {
    if (following && wasPinnedRef.current) {
      ref.current?.scrollToEnd();
    }
  }, [items, following]);

  const handleExpandChange = useCallback(
    (detail: VirtualTableProps.ExpandChangeDetail<LogRecord>) => setExpandedItems(detail.expandedItems),
    []
  );

  // CW-13: reveal (expand + scroll) an arbitrary row by id.
  const revealFirstError = useCallback(() => {
    const target = items.find(item => item.level === 'ERROR');
    if (target) {
      ref.current?.scrollToItem(target.id, { reveal: true });
    }
  }, [items]);

  return (
    <>
      <h1>VirtualTable — CloudWatch Logs Insights (standard view, compound)</h1>
      <p>
        {items.length.toLocaleString()} log records · showing rows {visibleRange.firstIndex}–{visibleRange.lastIndex} ·
        live tail {following ? 'on' : 'paused'}
      </p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <Button onClick={() => setFollowing(value => !value)}>
          {following ? 'Pause live tail' : 'Resume live tail'}
        </Button>
        <Button onClick={revealFirstError}>Reveal first error</Button>
      </div>
      <ScreenshotArea>
        <div>
          <VirtualTable.Root
            items={items}
            trackBy={item => item.id}
            estimatedRowHeight={23}
            height={480}
            overscan={20}
            resizableColumns={true}
            expandedItems={expandedItems}
            onExpandChange={({ detail }) => handleExpandChange(detail)}
            onVisibleRangeChange={({ detail }) => setVisibleRange(detail)}
            imperativeRef={ref}
            ariaLabels={{
              tableLabel: 'CloudWatch log records',
              expandButtonLabel: (item, expanded) =>
                `${expanded ? 'Collapse' : 'Expand'} record ${item.fields['@requestId']}`,
              expandedRegionLabel: item => `Log record detail for ${item.fields['@requestId']}`,
              appendAnnouncement: ({ addedCount, totalCount }) => `${addedCount} new log records, ${totalCount} total`,
            }}
          >
            {/* CW-8: dynamic columns declared as HeaderCells; @message is the single
                stretch-last column. No sortingField — per-column sort is a patterns-view
                capability (CW-9); the standard view has no per-column sort. */}
            <VirtualTable.Header sticky={true}>
              {DISPLAYED_FIELDS.map(field => (
                <VirtualTable.HeaderCell key={field} columnId={field} width={field === '@timestamp' ? 210 : 120}>
                  {field}
                </VirtualTable.HeaderCell>
              ))}
              <VirtualTable.HeaderCell columnId="@message" stretch={true}>
                @message
              </VirtualTable.HeaderCell>
            </VirtualTable.Header>
            <VirtualTable.Body>
              {(item: LogRecord, api) => (
                <VirtualTable.Row item={item} api={api}>
                  {DISPLAYED_FIELDS.map(field => (
                    <VirtualTable.Cell key={field} columnId={field}>
                      <span style={{ fontFamily: 'monospace' }}>{item.fields[field]}</span>
                    </VirtualTable.Cell>
                  ))}
                  <VirtualTable.Cell columnId="@message">
                    <span style={{ fontFamily: 'monospace' }}>{item.message}</span>
                  </VirtualTable.Cell>
                  {/* R-EXPAND shape A: declared unconditionally (Root mounts it only for
                      expanded rows), arbitrary non-tabular detail, measured (~300 px). */}
                  <VirtualTable.ExpandedContent estimatedHeight={300}>
                    <LogRecordDetail record={item} />
                  </VirtualTable.ExpandedContent>
                </VirtualTable.Row>
              )}
            </VirtualTable.Body>
          </VirtualTable.Root>
        </div>
      </ScreenshotArea>
    </>
  );
}
