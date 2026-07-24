// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import VirtualTable, { VirtualTableProps } from '../../../lib/components/virtual-table';

import styles from '../../../lib/components/virtual-table/styles.css.js';

// impl-F2-A1-tests-unit: exercises the logs-specialized config-driven VirtualTable through
// the built library + test-utils wrapper. Scope is the RESOLVED public API + engine
// behaviour (windowing, view/viewConfig switching, the two-mode filter's materialised
// indicator column and coherent colindex recompute, R-EXPAND lazy mount, per-column sort
// activation, the live-tail seam, imperative ref); axe/keyboard/SR audits are
// impl-F2-A1-tests-a11y scope and intentionally not duplicated here. Component tests import
// the built lib, so they compile/run after the -pr build (as with the F1 threads).

interface Log {
  id: string;
  timestamp: string;
  level: string;
  message: string;
}

const makeLogs = (n: number): Log[] =>
  Array.from({ length: n }, (_, i) => ({
    id: String(i),
    timestamp: `t${i}`,
    level: i % 2 === 1 ? 'ERROR' : 'INFO',
    message: `message ${i}`,
  }));

const standardColumns: ReadonlyArray<VirtualTableProps.ColumnDefinition<Log>> = [
  { id: 'timestamp', header: 'Timestamp', width: 200, cell: (log: Log) => log.timestamp },
  { id: 'message', header: 'Message', isStretch: true, cell: (log: Log) => log.message },
];
const standardConfig: VirtualTableProps.StandardViewConfig<Log> = {
  type: 'standard',
  columnDefinitions: standardColumns,
};

function renderTable(props: Partial<VirtualTableProps<Log>> = {}, itemCount = 3) {
  const { container } = render(
    <VirtualTable
      items={makeLogs(itemCount)}
      trackBy={(log: Log) => log.id}
      viewConfig={standardConfig}
      ariaLabels={{ gridLabel: 'Log events' }}
      {...props}
    />
  );
  const wrapper = createWrapper(container).findVirtualTable()!;
  const grid = () => wrapper.findByClassName(styles['scroll-container'])!.getElement();
  return { container, wrapper, grid };
}

describe('VirtualTable (F2-A1)', () => {
  test('renders the root element, is discoverable, and renders the standard view columns', () => {
    const { container, wrapper } = renderTable();
    expect(container.firstChild).toHaveClass(styles.root);
    expect(wrapper).not.toBeNull();
    expect(wrapper.findColumnHeaders()).toHaveLength(standardColumns.length);
    expect(wrapper.findRows().length).toBeGreaterThan(0);
  });

  test('windows a large dataset and returns null for rows outside the window', () => {
    const { wrapper } = renderTable({}, 500);
    expect(wrapper.findRows().length).toBeLessThan(500);
    expect(wrapper.findRowByIndex(0)).not.toBeNull();
    // Deep row is outside the top window (viewport 600 / 23px + overscan 20), so the wrapper
    // returns null by design — windowing, not a missing row.
    expect(wrapper.findRowByIndex(499)).toBeNull();
  });

  test('does not re-fire onVisibleRangeChange in a loop when the consumer passes a fresh inline handler each render (F-LOOP regression)', () => {
    // The handler identity changes every render AND it stores a new object in state (mirrors the
    // standard dev page's `onVisibleRangeChange={e => setVisibleRange(e.detail)}`). Before the
    // stable-callback fix this looped: the visible-range effect listed the handler in its deps, so
    // fire -> setState -> re-render -> new handler identity -> effect re-runs -> fire..., throwing
    // "Maximum update depth exceeded". The fix bounds the fire count to genuine range changes.
    const fireCounts = { n: 0 };
    function Harness() {
      const [, setRange] = React.useState<{ firstIndex: number; lastIndex: number } | null>(null);
      return (
        <VirtualTable
          items={makeLogs(500)}
          trackBy={(log: Log) => log.id}
          viewConfig={standardConfig}
          ariaLabels={{ gridLabel: 'Log events' }}
          onVisibleRangeChange={event => {
            fireCounts.n += 1;
            setRange(event.detail);
          }}
        />
      );
    }
    render(<Harness />);
    // Fires for the initial window only (the window does not change without scrolling), not once
    // per render. A loop would blow past this bound long before the test could assert.
    expect(fireCounts.n).toBeGreaterThanOrEqual(1);
    expect(fireCounts.n).toBeLessThanOrEqual(3);
  });

  test('sets full-dataset aria-rowcount (header counted once) and aria-colcount', () => {
    const { grid } = renderTable({}, 500);
    expect(grid().getAttribute('aria-rowcount')).toBe('501');
    expect(grid().getAttribute('aria-colcount')).toBe('2');
  });

  test('materialises a counted leading disclosure column only when expansion is enabled', () => {
    const expandable = renderTable(
      {
        getExpandedContent: (log: Log) => <div>detail-{log.id}</div>,
        i18nStrings: { expandedRegionLabel: 'Log record detail' },
      },
      10
    );
    expect(expandable.grid().getAttribute('aria-colcount')).toBe('3');
    // Disclosure occupies aria-colindex 1, so data columns start at 2 in both header and body.
    expect(expandable.wrapper.findColumnHeaders()[0].getElement().getAttribute('aria-colindex')).toBe('2');
    expect(expandable.wrapper.findExpandToggle(0)).not.toBeNull();

    const plain = renderTable({}, 10);
    expect(plain.grid().getAttribute('aria-colcount')).toBe('2');
    expect(plain.wrapper.findColumnHeaders()[0].getElement().getAttribute('aria-colindex')).toBe('1');
    expect(plain.wrapper.findExpandToggle(0)).toBeNull();
  });

  test('subset filter makes aria-rowcount the filtered length', () => {
    // 100 logs, ERROR on odd indices -> 50 matches; subset renders only matches.
    const { grid, wrapper } = renderTable(
      {
        filter: { mode: 'subset', predicate: (log: Log) => log.level === 'ERROR' },
        i18nStrings: { filterCountText: (matched, total) => `${matched} of ${total}` },
      },
      100
    );
    expect(grid().getAttribute('aria-rowcount')).toBe('51');
    // The match-count region renders for a filtered table (folds NB2; exercises findMatchCount).
    const matchCount = wrapper.findMatchCount();
    expect(matchCount).not.toBeNull();
    expect(matchCount!.getElement()).toHaveTextContent('50 of 100');
  });

  test('mark-in-place filter materialises + counts the match-indicator column, shifting data colindex coherently', () => {
    const marked = renderTable(
      { filter: { mode: 'mark-in-place', predicate: (log: Log) => log.level === 'ERROR' } },
      10
    );
    // +1 indicator column over the plain 2-column standard view.
    expect(marked.grid().getAttribute('aria-colcount')).toBe('3');
    expect(marked.wrapper.findColumnHeaders()[0].getElement().getAttribute('aria-colindex')).toBe('2');

    // Disclosure + indicator both present: disclosure=1, indicator=2, data columns from 3.
    const both = renderTable(
      {
        getExpandedContent: (log: Log) => <div>detail-{log.id}</div>,
        filter: { mode: 'mark-in-place', predicate: (log: Log) => log.level === 'ERROR' },
      },
      10
    );
    expect(both.grid().getAttribute('aria-colcount')).toBe('4');
    expect(both.wrapper.findColumnHeaders()[0].getElement().getAttribute('aria-colindex')).toBe('3');
  });

  test('renders the expanded region only for expanded rows (lazy mount)', () => {
    const { wrapper, container } = renderTable(
      {
        getExpandedContent: (log: Log) => <div>detail-{log.id}</div>,
        expandedItems: ['5'],
        i18nStrings: { expandedRegionLabel: 'Log record detail' },
      },
      50
    );
    const region = wrapper.findExpandedRegion(5);
    expect(region).not.toBeNull();
    expect(region!.getElement().getAttribute('aria-label')).toBe('Log record detail');
    expect(container.textContent).toContain('detail-5');
    // A collapsed (but windowed) row does not build its expanded subtree.
    expect(wrapper.findExpandedRegion(0)).toBeNull();
    expect(container.textContent).not.toContain('detail-0');
  });

  test('uncontrolled disclosure toggle expands the row and fires onExpandChange', () => {
    const onExpandChange = jest.fn();
    const { wrapper } = renderTable(
      {
        getExpandedContent: (log: Log) => <div>detail-{log.id}</div>,
        onExpandChange,
        i18nStrings: { expandedRegionLabel: 'Detail' },
      },
      10
    );
    expect(wrapper.findExpandedRegion(0)).toBeNull();
    fireEvent.click(wrapper.findExpandToggle(0)!.getElement());
    expect(onExpandChange).toHaveBeenCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ expanded: true, expandedItems: ['0'] }) })
    );
    expect(wrapper.findExpandedRegion(0)).not.toBeNull();
  });

  describe('patterns view sorting (CW-9, patterns-only, reflect-not-sort)', () => {
    const patternsColumns: ReadonlyArray<VirtualTableProps.ColumnDefinition<Log>> = [
      { id: 'severity', header: 'Severity', cell: (log: Log) => log.level },
      { id: 'count', header: 'Count', sortingField: 'count', cell: (log: Log) => log.message },
    ];
    const patternsConfig: VirtualTableProps.PatternsViewConfig<Log> = {
      type: 'patterns',
      columnDefinitions: patternsColumns,
    };

    test('renders a keyboard-operable sort trigger only on sortable columns', () => {
      const onSortingChange = jest.fn();
      const { wrapper } = renderTable({ viewConfig: patternsConfig, onSortingChange }, 10);
      const headers = wrapper.findColumnHeaders();

      // Non-sortable column: no aria-sort, no trigger.
      expect(headers[0].getElement().getAttribute('aria-sort')).toBeNull();
      expect(headers[0].getElement().querySelector('button')).toBeNull();

      // Sortable column: aria-sort 'none' when inactive, activation fires onSortingChange.
      expect(headers[1].getElement().getAttribute('aria-sort')).toBe('none');
      const sortButton = headers[1].getElement().querySelector('button')!;
      expect(sortButton).not.toBeNull();
      fireEvent.click(sortButton);
      expect(onSortingChange).toHaveBeenCalledWith(
        expect.objectContaining({ detail: expect.objectContaining({ sortingDescending: false }) })
      );
    });

    test('reflects the active sort column and direction via aria-sort', () => {
      const { wrapper } = renderTable(
        { viewConfig: patternsConfig, sortingColumn: patternsColumns[1], sortingDescending: false },
        10
      );
      expect(wrapper.findColumnHeaders()[1].getElement().getAttribute('aria-sort')).toBe('ascending');
    });
  });

  test('renders the raw view as a single-column surface with no disclosure column', () => {
    const rawConfig: VirtualTableProps.RawViewConfig<Log> = { type: 'raw', renderLine: (log: Log) => log.message };
    const { wrapper, grid } = renderTable({ viewConfig: rawConfig }, 10);
    expect(wrapper.findExpandToggle(0)).toBeNull();
    expect(grid().getAttribute('aria-colcount')).toBe('1');
  });

  test('exposes the imperative streaming handle', () => {
    const ref = React.createRef<VirtualTableProps.Ref>();
    renderTable({ imperativeRef: ref }, 10);
    expect(typeof ref.current!.scrollToEnd).toBe('function');
    expect(typeof ref.current!.scrollToItem).toBe('function');
    expect(typeof ref.current!.revealItem).toBe('function');
    expect(typeof ref.current!.isPinnedToEnd()).toBe('boolean');
  });

  test('renders the follow toggle when the live-tail seam is wired and reflects follow state', () => {
    const onFollowChange = jest.fn();
    const { wrapper } = renderTable(
      { follow: true, onFollowChange, ariaLabels: { gridLabel: 'Log events', followToggleLabel: 'Follow' } },
      10
    );
    const toggle = wrapper.findFollowToggle();
    expect(toggle).not.toBeNull();
    expect(toggle!.getElement().getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(toggle!.getElement());
    expect(onFollowChange).toHaveBeenCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ follow: false, reason: 'control' }) })
    );
  });

  test('renders a polite append aria-live region', () => {
    const { wrapper } = renderTable({}, 3);
    const live = wrapper.findLiveRegion();
    expect(live).not.toBeNull();
    expect(live!.getElement().getAttribute('aria-live')).toBe('polite');
  });

  test('renders the empty slot when there are no items', () => {
    const { wrapper, container } = renderTable({ empty: <span>No log events</span> }, 0);
    expect(wrapper.findRows()).toHaveLength(0);
    expect(container.textContent).toContain('No log events');
  });

  test('renders a status role while loading', () => {
    const { container } = renderTable({ loading: true, loadingText: 'Loading log events' }, 0);
    expect(container.querySelector('[role="status"]')).not.toBeNull();
    expect(container.textContent).toContain('Loading log events');
  });
});
