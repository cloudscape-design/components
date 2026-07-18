// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import '../../__a11y__/to-validate-a11y';
import createWrapper from '../../../lib/components/test-utils/dom';
import VirtualTable, { VirtualTableProps } from '../../../lib/components/virtual-table';

// A11y tests for the logs-specialized, config-driven VirtualTable (impl-F2-A1-tests-a11y).
// Placement mirrors the F1-A1/F1-A2 tests-a11y decision: the `__a11y__` directory is the
// node/puppeteer integ runner (`.ts`-only, tsconfig.integ), so axe + RTL keyboard/SR `.tsx`
// tests belong under `__tests__/` where the unit runner collects them — its testRegex
// `(/__tests__/.*(\.|/)test)\.[jt]sx?$` matches `virtual-table-a11y.test.tsx` and ts-jest
// transforms the `.tsx` via `tsconfig.unit.json`, so `-pr` runs it as part of `npm test`.
//
// Coverage (mapped to the unit desc): axe/HTML validity across all three views + the
// filtered + expanded + follow states; the two-mode filter's NON-VISUAL match conveyance
// (WCAG 1.4.1: text/ARIA on the indicator, not colour alone) + keyboard next/previous-match
// + indicator-column aria-colindex coherence when the mark-in-place column materialises;
// the rate-limited polite live-append announcement; row-granular keyboard nav via
// aria-activedescendant (incl. ArrowLeft/Right inert); per-column sort-trigger a11y
// (patterns view); disclosure activation + Tab-in / Escape-out of the expanded region;
// focus-under-recycling; full-dataset aria-rowcount [filtered in subset]/rowindex +
// aria-colcount/colindex + expanded role=region labeling.
//
// ariaLabels/i18nStrings are supplied as REQUIRED accessible names (grid, disclosure,
// follow toggle, expanded region, filter-match, match-navigation group + prev/next) — the
// component owns the mechanism, the console owns the names; omitting them would fail axe
// button-name / region-name, which the axe cases below exercise.

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

// Stable module-level labels so useLiveAnnouncement's coalescing is exercised by dataset
// growth, not perturbed by label identity churn.
const ariaLabels: VirtualTableProps.AriaLabels<Log> = {
  gridLabel: 'Log events',
  expandRowLabel: log => `Expand details for ${log.message}`,
  collapseRowLabel: log => `Collapse details for ${log.message}`,
  followToggleLabel: 'Follow new logs',
  filterMatchLabel: log => `Matches filter: ${log.message}`,
  matchNavigationLabel: 'Filter match navigation',
  previousMatchLabel: 'Previous match',
  nextMatchLabel: 'Next match',
};

const i18nStrings: VirtualTableProps.I18nStrings = {
  loadingText: 'Loading log events',
  filterCountText: (matched, total) => `${matched} of ${total} matches`,
  appendAnnouncementText: count => `${count} new log events`,
  expandedRegionLabel: 'Log record detail',
};

const standardColumns: ReadonlyArray<VirtualTableProps.ColumnDefinition<Log>> = [
  { id: 'timestamp', header: 'Timestamp', width: 200, cell: log => log.timestamp },
  { id: 'level', header: 'Level', width: 90, cell: log => log.level },
  { id: 'message', header: 'Message', isStretch: true, cell: log => log.message },
];
const standardConfig: VirtualTableProps.StandardViewConfig<Log> = {
  type: 'standard',
  columnDefinitions: standardColumns,
};
// Data columns for the standard view (timestamp + level + message); the disclosure and/or
// match-indicator columns, when present, are counted on top.
const DATA_COLUMNS = standardColumns.length;

const patternsColumns: ReadonlyArray<VirtualTableProps.ColumnDefinition<Log>> = [
  { id: 'severity', header: 'Severity', width: 90, cell: log => log.level },
  { id: 'count', header: 'Count', width: 120, sortingField: 'count', cell: log => log.message },
  { id: 'pattern', header: 'Pattern', isStretch: true, cell: log => log.message },
];
const patternsConfig: VirtualTableProps.PatternsViewConfig<Log> = {
  type: 'patterns',
  columnDefinitions: patternsColumns,
  histogramPeak: 100,
};

const rawConfig: VirtualTableProps.RawViewConfig<Log> = { type: 'raw', renderLine: log => log.message };

// Arbitrary, non-tabular expanded content (goal 6): NOT the column set.
const detail = (log: Log) => (
  <div>
    <h3>Log record {log.id}</h3>
    <dl>
      <dt>Level</dt>
      <dd>{log.level}</dd>
      <dt>Message</dt>
      <dd>{log.message}</dd>
    </dl>
    <button type="button">View matching logs</button>
  </div>
);

type Overrides = Partial<VirtualTableProps<Log>> & { expandable?: boolean };

function buildTree(items: Log[], overrides: Overrides = {}) {
  const { expandable, ...props } = overrides;
  return (
    <VirtualTable
      items={items}
      trackBy={log => log.id}
      viewConfig={standardConfig}
      estimatedRowHeight={23}
      getExpandedContent={expandable ? detail : undefined}
      getExpandedRowHeight={expandable ? () => 300 : undefined}
      ariaLabels={ariaLabels}
      i18nStrings={i18nStrings}
      {...props}
    />
  );
}

function renderTable(items: Log[], overrides: Overrides = {}) {
  const { container, rerender } = render(buildTree(items, overrides));
  const wrapper = createWrapper(container).findVirtualTable()!;
  const update = (nextItems: Log[], nextOverrides: Overrides = overrides) =>
    rerender(buildTree(nextItems, nextOverrides));
  return { container, wrapper, update };
}

function getGrid(container: HTMLElement): HTMLElement {
  return container.querySelector('[role="grid"]') as HTMLElement;
}

describe('VirtualTable F2-A1 a11y', () => {
  describe('axe / HTML validity', () => {
    test('validates the plain standard view (no expansion, no filter)', async () => {
      const { container } = renderTable(makeLogs(20));
      await expect(container).toValidateA11y();
    });

    test('validates a standard view with a collapsed disclosure column', async () => {
      const { container } = renderTable(makeLogs(20), { expandable: true });
      await expect(container).toValidateA11y();
    });

    test('validates a standard view with an expanded, labeled region containing arbitrary content', async () => {
      // A single expanded row keeps the region name unique (i18nStrings.expandedRegionLabel is
      // a shared string; simultaneously-expanded rows would repeat a landmark name).
      const { container } = renderTable(makeLogs(20), { expandable: true, expandedItems: ['3'] });
      await expect(container).toValidateA11y();
    });

    test('validates the mark-in-place filter (indicator column + match navigation + follow toggle)', async () => {
      const { container } = renderTable(makeLogs(20), {
        filter: { mode: 'mark-in-place', predicate: log => log.level === 'ERROR', highlight: () => true },
        follow: true,
        onFollowChange: () => {},
      });
      await expect(container).toValidateA11y();
    });

    test('validates the subset filter view', async () => {
      const { container } = renderTable(makeLogs(20), {
        filter: { mode: 'subset', predicate: log => log.level === 'ERROR' },
      });
      await expect(container).toValidateA11y();
    });

    test('validates the patterns view with sortable headers (native sort triggers + aria-sort)', async () => {
      const { container } = renderTable(makeLogs(20), {
        viewConfig: patternsConfig,
        sortingColumn: patternsColumns[1],
      });
      await expect(container).toValidateA11y();
    });

    test('validates the raw view (single monospaced column)', async () => {
      const { container } = renderTable(makeLogs(50), {
        viewConfig: rawConfig,
        estimatedRowHeight: 20,
        overscan: 40,
        getRowHeight: log => (log.message.length > 120 ? 'auto' : 20),
      });
      await expect(container).toValidateA11y();
    });

    test('validates the empty and loading states', async () => {
      const empty = renderTable([], { empty: <span>No log events</span> });
      await expect(empty.container).toValidateA11y();

      const loading = renderTable([], { loading: true });
      await expect(loading.container).toValidateA11y();
    });
  });

  describe('grid accessibility tree', () => {
    test('exactly one role=grid that owns only rowgroups -> rows -> columnheader/gridcell', () => {
      const { container } = renderTable(makeLogs(20), { expandable: true, expandedItems: ['0'] });
      expect(container.querySelectorAll('[role="grid"]')).toHaveLength(1);
      const grid = getGrid(container);

      const directChildren = Array.from(grid.children);
      expect(directChildren.length).toBeGreaterThan(0);
      directChildren.forEach(child => expect(child.getAttribute('role')).toBe('rowgroup'));

      grid.querySelectorAll('[role="row"]').forEach(row => {
        expect(row.closest('[role="rowgroup"]')).not.toBeNull();
      });
      grid.querySelectorAll('[role="columnheader"], [role="gridcell"]').forEach(cell => {
        expect(cell.closest('[role="row"]')).not.toBeNull();
      });
    });

    test('non-row chrome (loading / live-region) is a sibling of the grid, never a grid child', () => {
      const { wrapper } = renderTable([], { loading: true });
      const status = wrapper.find('[role="status"]')!.getElement();
      expect(status.closest('[role="grid"]')).toBeNull();

      const live = renderTable(makeLogs(5)).wrapper.findLiveRegion()!.getElement();
      expect(live.closest('[role="grid"]')).toBeNull();
    });
  });

  describe('keyboard navigation (aria-activedescendant grid model)', () => {
    test('the grid is a single always-present tab stop and seeds an active descendant', () => {
      const { container, wrapper } = renderTable(makeLogs(20));
      const grid = getGrid(container);
      expect(grid.getAttribute('tabindex')).toBe('0');
      const firstRow = wrapper.findRowByIndex(0)!.getElement();
      expect(grid.getAttribute('aria-activedescendant')).toBe(firstRow.id);
      expect(document.getElementById(firstRow.id)).not.toBeNull();
    });

    test('Arrow/Home/End move the active row when the grid holds focus', () => {
      const { container, wrapper } = renderTable(makeLogs(20));
      const grid = getGrid(container);

      fireEvent.keyDown(grid, { key: 'ArrowDown' });
      expect(grid.getAttribute('aria-activedescendant')).toBe(wrapper.findRowByIndex(1)!.getElement().id);

      fireEvent.keyDown(grid, { key: 'End' });
      expect(grid.getAttribute('aria-activedescendant')).toBe(wrapper.findRowByIndex(19)!.getElement().id);

      fireEvent.keyDown(grid, { key: 'Home' });
      expect(grid.getAttribute('aria-activedescendant')).toBe(wrapper.findRowByIndex(0)!.getElement().id);
    });

    test('does not hijack arrow keys originating inside the expanded region', () => {
      const { container, wrapper } = renderTable(makeLogs(20), { expandable: true, expandedItems: ['0'] });
      const grid = getGrid(container);
      const before = grid.getAttribute('aria-activedescendant');

      const innerButton = wrapper.findExpandedRegion(0)!.getElement().querySelector('button')!;
      fireEvent.keyDown(innerButton, { key: 'ArrowDown' });

      // onGridKeyDown bails unless the grid container itself is the event target, so arbitrary
      // expanded content (goal 6) keeps its own arrow-key behaviour.
      expect(grid.getAttribute('aria-activedescendant')).toBe(before);
    });

    test('ArrowLeft / ArrowRight are inert (deliberate row-granular grid, not 2D cell nav)', () => {
      // Like the F1 threads, the grid is deliberately row-granular: aria-activedescendant
      // references a role="row" (never a gridcell) and onGridKeyDown handles only
      // Up/Down/Home/End — a legitimate APG row-as-widget variant of role="grid". The
      // horizontal cell-navigation keys are intentionally inert; carried to impl-F2-A1-docs
      // as an explicit a11y contract note.
      const { container, wrapper } = renderTable(makeLogs(20));
      const grid = getGrid(container);

      fireEvent.keyDown(grid, { key: 'ArrowDown' });
      const active = grid.getAttribute('aria-activedescendant');
      expect(active).toBe(wrapper.findRowByIndex(1)!.getElement().id);

      fireEvent.keyDown(grid, { key: 'ArrowRight' });
      expect(grid.getAttribute('aria-activedescendant')).toBe(active);
      fireEvent.keyDown(grid, { key: 'ArrowLeft' });
      expect(grid.getAttribute('aria-activedescendant')).toBe(active);
    });
  });

  describe('two-mode filter accessibility', () => {
    test('mark-in-place conveys a match non-visually (visually-hidden text + decorative marker), WCAG 1.4.1', () => {
      const { wrapper } = renderTable(makeLogs(20), {
        filter: { mode: 'mark-in-place', predicate: log => log.level === 'ERROR' },
      });
      // Row 1 is ERROR (odd index) => a match; row 0 is INFO => not a match. In mark-in-place
      // every row still renders (context preserved).
      const matchRow = wrapper.findRowByIndex(1)!.getElement();
      const matchIndicator = matchRow.querySelectorAll('[role="gridcell"]')[0];
      // The visible marker is decorative...
      expect(matchIndicator.querySelector('[aria-hidden="true"]')).not.toBeNull();
      // ...and the match is carried by text for assistive tech (not colour alone).
      expect(matchIndicator.textContent).toContain('Matches filter: message 1');

      const nonMatchRow = wrapper.findRowByIndex(0)!.getElement();
      const nonMatchIndicator = nonMatchRow.querySelectorAll('[role="gridcell"]')[0];
      expect(nonMatchIndicator.textContent).toBe('');
    });

    test('match navigation exposes a named group with keyboard-operable prev/next controls', () => {
      const { container, wrapper } = renderTable(makeLogs(20), {
        filter: { mode: 'mark-in-place', predicate: log => log.level === 'ERROR' },
      });
      const group = container.querySelector('[role="group"]')!;
      expect(group.getAttribute('aria-label')).toBe('Filter match navigation');

      const buttons = Array.from(group.querySelectorAll('button'));
      expect(buttons).toHaveLength(2);
      expect(buttons[0].tagName).toBe('BUTTON'); // native = implicitly keyboard-operable
      expect(buttons[0].getAttribute('aria-label')).toBe('Previous match');
      expect(buttons[1].getAttribute('aria-label')).toBe('Next match');
      // The visible chevron glyphs are decorative, so the accessible name is the aria-label only.
      expect(buttons[0].querySelector('[aria-hidden="true"]')).not.toBeNull();

      // Activating next-match moves the active row to a matching (odd-index) row.
      const grid = getGrid(container);
      fireEvent.click(buttons[1]);
      expect(grid.getAttribute('aria-activedescendant')).toBe(wrapper.findRowByIndex(3)!.getElement().id);
    });

    test('activating previous-match reveals a matching row, wrapping backward cyclically', () => {
      const { container, wrapper } = renderTable(makeLogs(20), {
        filter: { mode: 'mark-in-place', predicate: log => log.level === 'ERROR' },
      });
      const group = container.querySelector('[role="group"]')!;
      const prevButton = Array.from(group.querySelectorAll('button'))[0];
      const grid = getGrid(container);
      // ERROR rows are the odd indices 1,3,...,19 (ten matches). From the initial cursor,
      // previous-match steps backward and wraps to the last match => data row 19, exercising
      // the prev keyboard reveal end-to-end (symmetric to the next-match assertion above).
      fireEvent.click(prevButton);
      expect(grid.getAttribute('aria-activedescendant')).toBe(wrapper.findRowByIndex(19)!.getElement().id);
    });

    test('subset mode renders no indicator column and no match navigation, and reports the filtered count', () => {
      const { container, wrapper } = renderTable(makeLogs(20), {
        filter: { mode: 'subset', predicate: log => log.level === 'ERROR' },
      });
      // No mark-in-place indicator column => data columns start at aria-colindex 1.
      expect(getGrid(container).getAttribute('aria-colcount')).toBe(String(DATA_COLUMNS));
      expect(wrapper.findColumnHeaders()[0].getElement().getAttribute('aria-colindex')).toBe('1');
      // No match-navigation group in subset mode.
      expect(container.querySelector('[role="group"]')).toBeNull();
      // The count region reports the filtered length (10 ERROR of 20).
      expect(wrapper.findMatchCount()!.getElement()).toHaveTextContent('10 of 20 matches');
    });

    test('the indicator column materialises + shifts data colindex coherently when mark-in-place toggles on and off', () => {
      const { container, wrapper, update } = renderTable(makeLogs(20));
      // No filter: 3 data columns, first data column at colindex 1.
      expect(getGrid(container).getAttribute('aria-colcount')).toBe(String(DATA_COLUMNS));
      expect(wrapper.findColumnHeaders()[0].getElement().getAttribute('aria-colindex')).toBe('1');

      // Toggle on mark-in-place: the indicator column is counted (colindex 1) and every data
      // column shifts down by one, coherently.
      update(makeLogs(20), { filter: { mode: 'mark-in-place', predicate: log => log.level === 'ERROR' } });
      expect(getGrid(container).getAttribute('aria-colcount')).toBe(String(DATA_COLUMNS + 1));
      expect(wrapper.findColumnHeaders()[0].getElement().getAttribute('aria-colindex')).toBe('2');
      const indicatorHeader = getGrid(container).querySelectorAll('[role="columnheader"]')[0];
      expect(indicatorHeader.getAttribute('aria-colindex')).toBe('1');

      // Toggle back off: the indicator column disappears and the counts revert coherently.
      update(makeLogs(20), {});
      expect(getGrid(container).getAttribute('aria-colcount')).toBe(String(DATA_COLUMNS));
      expect(wrapper.findColumnHeaders()[0].getElement().getAttribute('aria-colindex')).toBe('1');
    });
  });

  describe('patterns view sort-trigger accessibility', () => {
    test('sortable headers expose a keyboard-operable trigger named by the header; non-sortable do not', () => {
      const { wrapper } = renderTable(makeLogs(10), { viewConfig: patternsConfig });
      const [severity, count] = wrapper.findColumnHeaders();

      // Sortable "count" column: a native (keyboard-operable) trigger whose accessible name is
      // the column header, plus aria-sort.
      const sortButton = count.getElement().querySelector('button')!;
      expect(sortButton).not.toBeNull();
      expect(sortButton.tagName).toBe('BUTTON');
      expect(sortButton.textContent).toBe('Count');
      expect(count.getElement().getAttribute('aria-sort')).toBe('none');

      // Non-sortable "severity" column: no trigger, no aria-sort attribute.
      expect(severity.getElement().querySelector('button')).toBeNull();
      expect(severity.getElement().getAttribute('aria-sort')).toBeNull();
    });

    test('aria-sort reflects the active column and direction', () => {
      const { wrapper } = renderTable(makeLogs(10), {
        viewConfig: patternsConfig,
        sortingColumn: patternsColumns[1],
        sortingDescending: true,
      });
      expect(wrapper.findColumnHeaders()[1].getElement().getAttribute('aria-sort')).toBe('descending');
    });
  });

  describe('disclosure + expanded region wiring', () => {
    test('the disclosure control is a labeled button reflecting aria-expanded / aria-controls', () => {
      const { wrapper } = renderTable(makeLogs(10), { expandable: true });
      const toggle = wrapper.findExpandToggle(0)!.getElement();

      expect(toggle.tagName).toBe('BUTTON');
      expect(toggle.getAttribute('aria-label')).toBe('Expand details for message 0');
      expect(toggle.getAttribute('aria-expanded')).toBe('false');
      expect(toggle.getAttribute('aria-controls')).toBeNull();

      fireEvent.click(toggle);

      expect(toggle.getAttribute('aria-expanded')).toBe('true');
      expect(toggle.getAttribute('aria-label')).toBe('Collapse details for message 0');
      const region = wrapper.findExpandedRegion(0)!.getElement();
      expect(toggle.getAttribute('aria-controls')).toBe(region.id);
      expect(region.getAttribute('role')).toBe('region');
    });

    test('the expanded region carries the consumer-supplied accessible name', () => {
      const { wrapper } = renderTable(makeLogs(10), { expandable: true, expandedItems: ['2'] });
      const region = wrapper.findExpandedRegion(2)!.getElement();
      expect(region.getAttribute('aria-label')).toBe('Log record detail');
    });

    test('Escape inside the expanded region returns focus to its disclosure trigger', () => {
      const { wrapper } = renderTable(makeLogs(10), { expandable: true, expandedItems: ['0'] });
      const toggle = wrapper.findExpandToggle(0)!.getElement();
      const innerButton = wrapper.findExpandedRegion(0)!.getElement().querySelector('button')!;

      innerButton.focus();
      expect(document.activeElement).toBe(innerButton);

      fireEvent.keyDown(innerButton, { key: 'Escape' });
      expect(document.activeElement).toBe(toggle);
    });

    test('the expanded region content is reachable (Tab-in half: not aria-hidden / inert / disabled)', () => {
      const { wrapper } = renderTable(makeLogs(10), { expandable: true, expandedItems: ['0'] });
      const region = wrapper.findExpandedRegion(0)!.getElement();
      const innerButton = region.querySelector('button') as HTMLButtonElement;

      // jsdom cannot perform real Tab traversal; the Tab-in half of the contract is that the
      // region's interactive content is genuinely focusable — not disabled and not inside an
      // aria-hidden or inert ancestor that would remove it from the tab order.
      expect(innerButton.closest('[aria-hidden="true"]')).toBeNull();
      expect(innerButton.closest('[inert]')).toBeNull();
      expect(innerButton.hasAttribute('disabled')).toBe(false);
      innerButton.focus();
      expect(document.activeElement).toBe(innerButton);
    });
  });

  describe('live-append announcement', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    test('coalesces a burst of appends into one debounced polite message (rate-limited)', () => {
      const { wrapper, update } = renderTable(makeLogs(10));
      const live = wrapper.findLiveRegion()!.getElement();
      // Polite (not assertive): the tail does not interrupt the SR on every batch — the
      // rate-limiting half of the reduced-interruption contract. The auto-scroll itself is an
      // instant scrollTop assignment in use-live-tail (reduced-motion-safe by construction);
      // jsdom cannot assert scroll smoothness, so the covered surface here is the announcement.
      expect(live.getAttribute('aria-live')).toBe('polite');
      expect(live.textContent).toBe('');

      // Two appends within the debounce window collapse into a single announcement.
      update(makeLogs(13));
      update(makeLogs(15));
      expect(live.textContent).toBe('');

      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(live.textContent).toContain('5 new log events');
    });

    test('does not announce when the dataset shrinks or is replaced', () => {
      const { wrapper, update } = renderTable(makeLogs(10));
      const live = wrapper.findLiveRegion()!.getElement();

      update(makeLogs(4));
      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(live.textContent).toBe('');
    });
  });

  describe('focus under row recycling', () => {
    test('keeps focus on a control when rows are appended (trackBy-keyed identity)', () => {
      const { wrapper, update } = renderTable(makeLogs(20), { expandable: true });
      const toggle = wrapper.findExpandToggle(0)!.getElement();

      toggle.focus();
      expect(document.activeElement).toBe(toggle);

      // Appending rows must not remount the still-windowed row 0, so its focused disclosure
      // control retains focus (recycling is keyed by trackBy identity).
      update(makeLogs(30), { expandable: true });
      expect(document.activeElement).toBe(wrapper.findExpandToggle(0)!.getElement());
    });
  });

  describe('full-dataset ARIA coherence under windowing', () => {
    test('aria-rowcount counts the header once and aria-colcount counts the disclosure column', () => {
      const { container } = renderTable(makeLogs(500), { expandable: true });
      const grid = getGrid(container);
      expect(grid.getAttribute('aria-rowcount')).toBe('501');
      expect(grid.getAttribute('aria-colcount')).toBe(String(DATA_COLUMNS + 1));
    });

    test('the header row is aria-rowindex 1 with the disclosure columnheader at aria-colindex 1', () => {
      const { wrapper } = renderTable(makeLogs(500), { expandable: true });
      const header = wrapper.findHeaderRow()!.getElement();
      expect(header.getAttribute('aria-rowindex')).toBe('1');

      const headers = header.querySelectorAll('[role="columnheader"]');
      expect(headers[0].getAttribute('aria-colindex')).toBe('1'); // materialised disclosure column
      expect(headers[1].getAttribute('aria-colindex')).toBe('2'); // first data column
    });

    test('data rows carry a full-dataset aria-rowindex and disclosure=1 / data-from-2 colindex', () => {
      const { wrapper } = renderTable(makeLogs(500), { expandable: true });
      const row0 = wrapper.findRowByIndex(0)!.getElement();
      expect(row0.getAttribute('aria-rowindex')).toBe('2'); // header is 1, so data index 0 -> 2

      const cells = row0.querySelectorAll('[role="gridcell"]');
      expect(cells[0].getAttribute('aria-colindex')).toBe('1'); // disclosure cell
      expect(cells[1].getAttribute('aria-colindex')).toBe('2'); // first data cell
    });

    test('subset filter makes aria-rowcount the filtered length', () => {
      const { container } = renderTable(makeLogs(100), {
        filter: { mode: 'subset', predicate: log => log.level === 'ERROR' },
      });
      // 50 ERROR of 100, + the header row.
      expect(getGrid(container).getAttribute('aria-rowcount')).toBe('51');
    });

    test('the expanded row shares its data row index and spans all columns without changing aria-rowcount', () => {
      const { container, wrapper } = renderTable(makeLogs(500), { expandable: true, expandedItems: ['0'] });
      // Expanding a row does not add to the row count (design B1).
      expect(getGrid(container).getAttribute('aria-rowcount')).toBe('501');

      const region = wrapper.findExpandedRegion(0)!.getElement();
      const expandedRow = region.closest('[role="row"]')!;
      expect(expandedRow.getAttribute('aria-rowindex')).toBe('2'); // shares its data row's index

      const expandedCell = expandedRow.querySelector('[role="gridcell"]')!;
      expect(expandedCell.getAttribute('aria-colindex')).toBe('1');
      expect(expandedCell.getAttribute('aria-colspan')).toBe(String(DATA_COLUMNS + 1));
    });
  });
});
