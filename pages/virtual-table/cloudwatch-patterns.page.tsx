// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useMemo, useState } from 'react';

import Button from '~components/button';
import VirtualTable, { VirtualTableProps } from '~components/virtual-table';
import { colorBackgroundControlDisabled, colorChartsPaletteCategorical1, colorTextBodySecondary } from '~design-tokens';

import ScreenshotArea from '../utils/screenshot-area';

// CloudWatch Logs Insights "Show patterns" view on the F2-A1 config-driven,
// logs-specialized VirtualTable (view="patterns"). Demonstrates (see
// research/cloudwatch-requirements.md):
//  - CW-6  R-EXPAND shape B: an expanded row renders a pattern detail (histogram +
//          token enumeration + pattern actions) — arbitrary, non-tabular, NOT the
//          column set — measured at the patterns density (~150 px estimate).
//  - CW-9  per-column sort (a patterns-view capability; the standard view has none):
//          the component renders keyboard-operable sort triggers and emits intent;
//          the console applies the sort (reflect-not-sort).
//  - CW-11 compare/diff mode as an alternate patterns column set: `viewConfig.diffMode`
//          signals the component while the console swaps the column definitions.
//  - Shared cross-row histogram scale computed ONCE over the FULL dataset and supplied
//          on `PatternsViewConfig.histogramPeak`. Unlike the generic F1 cells (which
//          keep the peak consumer-side and close over it), F2 OWNS the patterns view,
//          so it surfaces the resolved full-dataset peak to the patterns cell through
//          `CellContext.histogramPeak` — the cell reads `ctx.histogramPeak` rather
//          than recomputing over the windowed slice, so the y-scale is stable across
//          scroll (design decision B3).
// Density is preserved: 23 px collapsed rows, ~150 px expanded estimate, overscan 20.

type Severity = 'high' | 'medium' | 'low' | 'info';
type FindingType = 'new' | 'change-in-count' | 'missing';

interface LogPattern {
  id: string;
  severity: Severity;
  pattern: string;
  matchingLogs: number;
  sharePercent: number;
  // Per-bucket frequency over the query window; normalised to a shared peak.
  histogram: ReadonlyArray<number>;
  previousHistogram: ReadonlyArray<number>;
  lastSeen: number;
  tokens: ReadonlyArray<string>;
  // Compare/diff-mode fields (CW-11).
  diffCount: number;
  findingType: FindingType;
}

const SEVERITIES: ReadonlyArray<Severity> = ['high', 'medium', 'low', 'info'];
const FINDING_TYPES: ReadonlyArray<FindingType> = ['new', 'change-in-count', 'missing'];
const PATTERN_TEMPLATES = [
  'Handler failed: DynamoDB throttled after <*> retries (requestId=<*>)',
  'Processed event <*> for requestId=<*> in <*>ms',
  'START RequestId: <*> Version: <*>',
  'REPORT RequestId: <*> Duration: <*> ms Billed Duration: <*> ms',
  'Timed out after <*>ms waiting for downstream <*>',
  'Cold start: initialising runtime for <*>',
];

const BUCKET_COUNT = 24;

function makePattern(index: number): LogPattern {
  const severity = SEVERITIES[index % SEVERITIES.length];
  const template = PATTERN_TEMPLATES[index % PATTERN_TEMPLATES.length];
  const histogram = Array.from({ length: BUCKET_COUNT }, (_, bucket) =>
    Math.round(20 + 80 * Math.abs(Math.sin(index * 0.7 + bucket * 0.4)) * (1 + (index % 5)))
  );
  const previousHistogram = histogram.map(value => Math.max(0, Math.round(value * (0.6 + (index % 3) * 0.2))));
  const matchingLogs = histogram.reduce((sum, value) => sum + value, 0);
  const previousTotal = previousHistogram.reduce((sum, value) => sum + value, 0);
  return {
    id: `pattern-${index}`,
    severity,
    pattern: `${template} #${index}`,
    matchingLogs,
    sharePercent: Number(((matchingLogs % 1000) / 10).toFixed(1)),
    histogram,
    previousHistogram,
    lastSeen: 1_700_000_000_000 - index * 60_000,
    tokens: [`requestId`, `durationMs`, `retryCount#${index % 7}`, `region-${index % 4}`],
    diffCount: matchingLogs - previousTotal,
    findingType: FINDING_TYPES[index % FINDING_TYPES.length],
  };
}

const PATTERN_COUNT = 800;

// Shared cross-row histogram scale. Computed over the FULL dataset so every row's
// sparkline is normalised to the same y-axis and the scale does not jump as the
// window changes on scroll (the console's computeGlobalHistogramPeak). Supplied to
// VirtualTable on `viewConfig.histogramPeak`; the component surfaces it to the
// patterns cell via `CellContext.histogramPeak`.
function computeGlobalHistogramPeak(patterns: ReadonlyArray<LogPattern>): number {
  let peak = 1;
  for (const pattern of patterns) {
    for (const value of pattern.histogram) {
      if (value > peak) {
        peak = value;
      }
    }
    for (const value of pattern.previousHistogram) {
      if (value > peak) {
        peak = value;
      }
    }
  }
  return peak;
}

// Visually-hidden text so screen-reader users get the histogram's meaning while the
// bars stay decorative. Standard clip pattern (a dev page has no util import).
const visuallyHidden: React.CSSProperties = {
  position: 'absolute',
  inlineSize: 1,
  blockSize: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

// Concise non-visual summary of a frequency histogram: total matches, interval
// count, and peak bucket. Carries the sparkline's meaning to assistive tech.
function describeHistogram(values: ReadonlyArray<number>): string {
  const total = values.reduce((sum, value) => sum + value, 0);
  const peak = values.reduce((max, value) => (value > max ? value : max), 0);
  return `${total.toLocaleString()} matches across ${values.length} intervals, peak ${peak.toLocaleString()} in one interval.`;
}

// Short trend statement comparing the current window to the previous one (diff mode).
function describeTrend(pattern: LogPattern): string {
  const current = pattern.histogram.reduce((sum, value) => sum + value, 0);
  const previous = pattern.previousHistogram.reduce((sum, value) => sum + value, 0);
  const delta = current - previous;
  if (delta === 0) {
    return `Frequency unchanged vs previous period (${current.toLocaleString()} matches).`;
  }
  const direction = delta > 0 ? 'up' : 'down';
  const magnitude =
    previous === 0
      ? `${Math.abs(delta).toLocaleString()} matches`
      : `${Math.abs(Math.round((delta / previous) * 100))}%`;
  return `Frequency ${direction} ${magnitude} vs previous period (${current.toLocaleString()} vs ${previous.toLocaleString()} matches).`;
}

// Fixed UTC HH:MM:SS so the demo/screenshot is reproducible across locales/timezones.
function formatTimeUtc(ms: number): string {
  return `${new Date(ms).toISOString().slice(11, 19)} UTC`;
}

// Human-readable labels for the diff-mode finding types.
const FINDING_LABELS: Record<FindingType, string> = {
  new: 'New',
  'change-in-count': 'Change in count',
  missing: 'Missing',
};

// A minimal sparkline normalised to a shared peak. The bars are decorative
// (aria-hidden); when `summary` is supplied it is exposed to screen readers as
// visually-hidden text, so the frequency column cell and the expanded detail are
// not silent (the header/cell content stays consistent for SR — CW-16, WCAG 1.1.1).
function Sparkline({
  values,
  peak,
  muted = false,
  summary,
}: {
  values: ReadonlyArray<number>;
  peak: number;
  muted?: boolean;
  summary?: string;
}) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      <span aria-hidden={true} style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 1, blockSize: 18 }}>
        {values.map((value, bucket) => (
          <span
            key={bucket}
            style={{
              display: 'inline-block',
              inlineSize: 2,
              blockSize: `${Math.max(1, Math.round((value / peak) * 18))}px`,
              background: muted ? colorBackgroundControlDisabled : colorChartsPaletteCategorical1,
            }}
          />
        ))}
      </span>
      {summary && <span style={visuallyHidden}>{summary}</span>}
    </span>
  );
}

// R-EXPAND shape B: arbitrary, non-tabular pattern detail — histogram (current, plus
// previous in diff mode), token enumeration, and pattern actions. Deliberately not
// the column layout; measured at ~150 px. Closes over the shared full-dataset peak
// (an arbitrary render slot; RowContext does not carry the peak — only the grid cell
// receives it via CellContext.histogramPeak).
function PatternDetail({ pattern, peak, diffMode }: { pattern: LogPattern; peak: number; diffMode: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '4px 0' }}>
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 12, color: colorTextBodySecondary }}>Current</div>
          <Sparkline
            values={pattern.histogram}
            peak={peak}
            summary={`Current period: ${describeHistogram(pattern.histogram)}`}
          />
        </div>
        {diffMode && (
          <div>
            <div style={{ fontSize: 12, color: colorTextBodySecondary }}>Previous</div>
            <Sparkline
              values={pattern.previousHistogram}
              peak={peak}
              muted={true}
              summary={`Previous period: ${describeHistogram(pattern.previousHistogram)}`}
            />
          </div>
        )}
      </div>
      {diffMode && <div style={{ fontSize: 12 }}>{describeTrend(pattern)}</div>}
      <div>
        <span style={{ fontSize: 12, color: colorTextBodySecondary }}>Tokens: </span>
        {pattern.tokens.map(token => (
          <code key={token} style={{ marginInlineEnd: 8 }}>
            {token}
          </code>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button>View matching logs</Button>
        <Button>Tail pattern</Button>
        <Button>Compare across time</Button>
      </div>
    </div>
  );
}

export default function VirtualTableCloudWatchPatternsPage() {
  const [diffMode, setDiffMode] = useState(false);
  const [expandedItems, setExpandedItems] = useState<ReadonlyArray<string>>([]);
  const [sortingColumn, setSortingColumn] = useState<VirtualTableProps.ColumnDefinition<LogPattern> | undefined>();
  const [sortingDescending, setSortingDescending] = useState(false);

  const basePatterns = useMemo<ReadonlyArray<LogPattern>>(
    () => Array.from({ length: PATTERN_COUNT }, (_, index) => makePattern(index)),
    []
  );

  // Shared histogram peak over the full dataset — stable across scroll, computed
  // once. Supplied to VirtualTable on viewConfig.histogramPeak; F2 surfaces it to the
  // patterns cell via CellContext.histogramPeak (the F2 divergence from F1, which
  // keeps it consumer-side). PatternDetail (an arbitrary render slot) closes over the
  // same value.
  const histogramPeak = useMemo(() => computeGlobalHistogramPeak(basePatterns), [basePatterns]);

  // VirtualTable reflects sort state and emits intent; it does not sort data. The
  // console applies the sort here (CW-9). Sorting keys differ per column set.
  const items = useMemo<ReadonlyArray<LogPattern>>(() => {
    const field = sortingColumn?.sortingField;
    if (!field) {
      return basePatterns;
    }
    const sorted = [...basePatterns].sort((a, b) => {
      const left = a[field as keyof LogPattern];
      const right = b[field as keyof LogPattern];
      if (typeof left === 'number' && typeof right === 'number') {
        return left - right;
      }
      return String(left).localeCompare(String(right));
    });
    return sortingDescending ? sorted.reverse() : sorted;
  }, [basePatterns, sortingColumn, sortingDescending]);

  const severityCell = useCallback(
    (item: LogPattern) => <span style={{ textTransform: 'capitalize' }}>{item.severity}</span>,
    []
  );

  // Normal-mode columns. The frequency cell reads the shared cross-row peak from
  // CellContext.histogramPeak (surfaced by the component), falling back to the
  // consumer value for type safety.
  const normalColumns = useMemo<ReadonlyArray<VirtualTableProps.ColumnDefinition<LogPattern>>>(
    () => [
      { id: 'severity', header: 'Severity', cell: severityCell, width: 110 },
      {
        id: 'matchingLogs',
        header: 'Matching logs',
        cell: item => item.matchingLogs.toLocaleString(),
        sortingField: 'matchingLogs',
        width: 130,
      },
      {
        id: 'sharePercent',
        header: 'Share',
        cell: item => `${item.sharePercent}%`,
        sortingField: 'sharePercent',
        width: 90,
      },
      {
        id: 'frequency',
        header: 'Frequency',
        // Reads the shared full-dataset peak from CellContext (F2 surfaces it here),
        // not from a consumer closure. The sparkline carries a visually-hidden summary
        // so the cell is not silent (WCAG 1.1.1).
        cell: (item, ctx) => (
          <Sparkline
            values={item.histogram}
            peak={ctx.histogramPeak ?? histogramPeak}
            summary={describeHistogram(item.histogram)}
          />
        ),
        width: 140,
      },
      {
        id: 'lastSeen',
        header: 'Last seen',
        cell: item => formatTimeUtc(item.lastSeen),
        sortingField: 'lastSeen',
        width: 110,
      },
      {
        id: 'pattern',
        header: 'Pattern',
        cell: item => <span style={{ fontFamily: 'monospace' }}>{item.pattern}</span>,
        isStretch: true,
      },
    ],
    [severityCell, histogramPeak]
  );

  // CW-11 compare/diff mode: a different column set with its own sort. The console
  // swaps the column definitions; `viewConfig.diffMode` signals the component.
  const diffColumns = useMemo<ReadonlyArray<VirtualTableProps.ColumnDefinition<LogPattern>>>(
    () => [
      { id: 'severity', header: 'Severity', cell: severityCell, width: 110 },
      {
        id: 'diffCount',
        header: '(Previous → Current) difference count',
        cell: item => (item.diffCount >= 0 ? `+${item.diffCount.toLocaleString()}` : item.diffCount.toLocaleString()),
        sortingField: 'diffCount',
        width: 260,
      },
      {
        id: 'findingType',
        header: 'Difference description',
        cell: item => FINDING_LABELS[item.findingType],
        sortingField: 'findingType',
        width: 180,
      },
      {
        id: 'pattern',
        header: 'Pattern',
        cell: item => <span style={{ fontFamily: 'monospace' }}>{item.pattern}</span>,
        isStretch: true,
      },
    ],
    [severityCell]
  );

  const columnDefinitions = diffMode ? diffColumns : normalColumns;

  const handleSortingChange = useCallback((detail: VirtualTableProps.SortingState<LogPattern>) => {
    setSortingColumn(detail.sortingColumn);
    setSortingDescending(detail.sortingDescending);
  }, []);

  const toggleDiffMode = useCallback(() => {
    // The two modes have disjoint sort fields; clear sort so a stale column from
    // the other set is not applied to the swapped-in column definitions.
    setSortingColumn(undefined);
    setSortingDescending(false);
    setDiffMode(value => !value);
  }, []);

  return (
    <>
      <h1>VirtualTable — CloudWatch Logs Insights, show patterns view (F2-A1)</h1>
      <p>
        Logs-specialized VirtualTable with <code>view=&quot;patterns&quot;</code>. {items.length.toLocaleString()}{' '}
        patterns · {diffMode ? 'compare / diff mode' : 'normal mode'}. Per-column sort is a patterns capability (the
        standard view has none); the shared histogram y-scale is computed over the full dataset and reaches each cell
        through <code>CellContext.histogramPeak</code>. Row expansion renders arbitrary non-tabular pattern detail
        (shape B, ~150&nbsp;px).
      </p>
      <div style={{ display: 'flex', gap: 8, marginBlockEnd: 8 }}>
        <Button onClick={toggleDiffMode}>{diffMode ? 'Exit compare mode' : 'Compare across time'}</Button>
      </div>
      <ScreenshotArea>
        <div style={{ blockSize: 480 }}>
          <VirtualTable<LogPattern>
            items={items}
            trackBy={item => item.id}
            viewConfig={{ type: 'patterns', columnDefinitions, histogramPeak, diffMode }}
            estimatedRowHeight={23}
            overscan={20}
            stickyHeader={true}
            resizableColumns={true}
            sortingColumn={sortingColumn}
            sortingDescending={sortingDescending}
            onSortingChange={event => handleSortingChange(event.detail)}
            expandedContentPreset="pattern-detail"
            getExpandedContent={item => <PatternDetail pattern={item} peak={histogramPeak} diffMode={diffMode} />}
            getExpandedRowHeight={() => 150}
            expandedItems={expandedItems}
            onExpandChange={event => setExpandedItems(event.detail.expandedItems)}
            ariaLabels={{
              gridLabel: 'CloudWatch log patterns',
              expandRowLabel: item => `Show detail for pattern ${item.pattern}`,
              collapseRowLabel: item => `Hide detail for pattern ${item.pattern}`,
            }}
            i18nStrings={{ expandedRegionLabel: 'Pattern detail' }}
          />
        </div>
      </ScreenshotArea>
    </>
  );
}
