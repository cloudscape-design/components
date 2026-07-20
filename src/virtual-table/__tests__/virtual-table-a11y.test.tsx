// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import '../../__a11y__/to-validate-a11y';
import createWrapper from '../../../lib/components/test-utils/dom';
import VirtualTable, { VirtualTableProps } from '../../../lib/components/virtual-table';

// A11y tests for the COMPOUND-OVER-CORE VirtualTable (impl-F3-A2-tests-a11y). Placement mirrors
// the F1-A1/F1-A2/F2-A1 tests-a11y decision: the `__a11y__` directory is the node/puppeteer
// integ runner (`.ts`-only, tsconfig.integ), so axe + RTL keyboard/SR `.tsx` tests belong under
// `__tests__/` where the unit runner collects them — its testRegex
// `(/__tests__/.*(\.|/)test)\.[jt]sx?$` matches `virtual-table-a11y.test.tsx` and ts-jest
// transforms the `.tsx` via `tsconfig.unit.json`, so `-pr` runs it as part of `npm test`.
//
// F3-A2 is a headless CORE (`useVirtualGrid`) plus a thin compound SKIN (Root/Header/HeaderCell/
// Body/Row/Cell/ExpandedContent) over it. The skin's public accessibility tree is IDENTICAL to
// the F1-A2 compound skin (same components, same AriaLabels shape, same test-utils), so these
// tests drive the core THROUGH the seam via the public skin without touching `useVirtualGrid`.
// The central F3-A2 a11y claim is the F3 thesis in action: the coherent-grid a11y contract lives
// in the CORE and the skin only SPREADS the core's role/ARIA props ("skin cannot silently regress
// core a11y"), so the seven sub-components collapse to the SAME accessibility tree as a single
// monolithic grid — one role="grid" that owns only rowgroups -> rows -> columnheader/gridcell,
// with the materialised disclosure column, full-dataset aria-rowcount/rowindex + aria-colcount/
// colindex coherence, a labeled expanded region, and non-row chrome (loading/live-region) OUTSIDE
// the grid. Coverage: axe/HTML validity, the compound-over-core-produces-one-grid contract,
// row-granular keyboard nav via aria-activedescendant (incl. ArrowLeft/Right inert), sort-trigger
// a11y (keyboard-operable + accessible name + aria-sort), disclosure activation, Tab-in /
// core-wired Escape-out of the expanded region, live-append debounce, and focus-under-recycling.

interface Item {
  id: string;
  name: string;
  status: string;
}

const makeItems = (n: number): Item[] =>
  Array.from({ length: n }, (_, i) => ({ id: `row-${i}`, name: `Resource ${i}`, status: i % 2 === 0 ? 'Up' : 'Down' }));

// Stable identity so the core's live-append hook does not re-run (and reset coalescing) on
// unrelated rerenders — Root threads this straight into the core's live-region wiring.
const appendAnnouncement = ({ addedCount, totalCount }: { addedCount: number; totalCount: number }) =>
  `${addedCount} new log events, ${totalCount} total`;

const ariaLabels: VirtualTableProps.AriaLabels<Item> = {
  tableLabel: 'Log events',
  expandButtonLabel: (item, expanded) => `${expanded ? 'Collapse' : 'Expand'} details for ${item.name}`,
  expandedRegionLabel: item => `Details for ${item.name}`,
  activateSortLabel: columnId => `Sort by ${columnId}`,
  appendAnnouncement,
};

interface TreeOptions {
  expandable?: boolean;
  sortable?: boolean;
  singleColumn?: boolean;
  estimatedRowHeight?: number;
  overscan?: number;
  getRowHeight?: (item: Item) => number | 'auto';
  expandedItems?: ReadonlyArray<string>;
  onExpandChange?: VirtualTableProps<Item>['onExpandChange'];
  sortingColumn?: { columnId: string };
  sortingDescending?: boolean;
  onSortingChange?: VirtualTableProps<Item>['onSortingChange'];
  imperativeRef?: React.Ref<VirtualTableProps.Ref>;
  loading?: boolean;
  loadingText?: string;
  empty?: React.ReactNode;
}

// A single tree builder used for both initial render and rerender so ariaLabels (and thus the
// core's live-region hook identity) stays stable across renders.
function buildTree(items: Item[], options: TreeOptions = {}) {
  const detail = (item: Item) => (
    <div>
      <h3>Log record {item.id}</h3>
      <dl>
        <dt>Level</dt>
        <dd>INFO</dd>
        <dt>Message</dt>
        <dd>{item.name}</dd>
      </dl>
      <button type="button">View matching logs</button>
    </div>
  );

  return (
    <VirtualTable.Root
      items={items}
      trackBy={item => item.id}
      estimatedRowHeight={options.estimatedRowHeight ?? 23}
      overscan={options.overscan}
      getRowHeight={options.getRowHeight}
      expandedItems={options.expandedItems}
      onExpandChange={options.onExpandChange}
      sortingColumn={options.sortingColumn}
      sortingDescending={options.sortingDescending}
      onSortingChange={options.onSortingChange}
      imperativeRef={options.imperativeRef}
      loading={options.loading}
      loadingText={options.loadingText}
      empty={options.empty}
      ariaLabels={ariaLabels}
    >
      <VirtualTable.Header>
        <VirtualTable.HeaderCell columnId="name" sortingField={options.sortable ? 'name' : undefined}>
          Name
        </VirtualTable.HeaderCell>
        {!options.singleColumn && (
          <VirtualTable.HeaderCell columnId="status" stretch={true}>
            Status
          </VirtualTable.HeaderCell>
        )}
      </VirtualTable.Header>
      <VirtualTable.Body>
        {(item: Item, api) => (
          <VirtualTable.Row item={item} api={api}>
            <VirtualTable.Cell columnId="name">{item.name}</VirtualTable.Cell>
            {!options.singleColumn && <VirtualTable.Cell columnId="status">{item.status}</VirtualTable.Cell>}
            {/* ExpandedContent is declared UNCONDITIONALLY (not gated on api.isExpanded) per the
                BodyProps contract; the core mounts the region only for expanded rows. */}
            {options.expandable && (
              <VirtualTable.ExpandedContent estimatedHeight={300}>{detail(item)}</VirtualTable.ExpandedContent>
            )}
          </VirtualTable.Row>
        )}
      </VirtualTable.Body>
    </VirtualTable.Root>
  );
}

function renderTable(items: Item[], options: TreeOptions = {}) {
  const { container, rerender } = render(buildTree(items, options));
  const wrapper = createWrapper(container).findVirtualTable()!;
  const update = (nextItems: Item[], nextOptions: TreeOptions = options) => rerender(buildTree(nextItems, nextOptions));
  return { container, wrapper, update };
}

function getGrid(container: HTMLElement): HTMLElement {
  return container.querySelector('[role="grid"]') as HTMLElement;
}

// Data columns (name + status); the disclosure column, when present, is counted on top.
const DATA_COLUMNS = 2;

describe('VirtualTable F3-A2 a11y', () => {
  describe('axe / HTML validity', () => {
    test('validates a plain compound-over-core grid without expansion', async () => {
      const { container } = renderTable(makeItems(20));
      await expect(container).toValidateA11y();
    });

    test('validates a grid with a collapsed disclosure column', async () => {
      const { container } = renderTable(makeItems(20), { expandable: true });
      await expect(container).toValidateA11y();
    });

    test('validates a grid with an expanded, labeled region containing arbitrary content', async () => {
      const { container } = renderTable(makeItems(20), { expandable: true, expandedItems: ['row-0', 'row-3'] });
      await expect(container).toValidateA11y();
    });

    test('validates sortable headers (native sort triggers + aria-sort)', async () => {
      const { container } = renderTable(makeItems(20), { sortable: true, sortingColumn: { columnId: 'name' } });
      await expect(container).toValidateA11y();
    });

    test('validates the reduced single-column (file/raw) shape', async () => {
      const { container } = renderTable(makeItems(50), {
        singleColumn: true,
        estimatedRowHeight: 20,
        overscan: 40,
        getRowHeight: item => (item.name.length > 120 ? 'auto' : 20),
      });
      await expect(container).toValidateA11y();
    });

    test('validates the empty and loading states', async () => {
      const empty = renderTable([], { empty: <span>No log events</span> });
      await expect(empty.container).toValidateA11y();

      const loading = renderTable([], { loading: true, loadingText: 'Loading log events' });
      await expect(loading.container).toValidateA11y();
    });
  });

  describe('compound-over-core structure produces a single grid accessibility tree', () => {
    test('the seven compound sub-components collapse to one grid -> rowgroup -> row tree', () => {
      const { container } = renderTable(makeItems(20), { expandable: true, expandedItems: ['row-0'] });
      // Exactly one grid, regardless of how many compound elements were authored — the core
      // owns the grid semantics and the skin spreads them onto a single scroll container.
      expect(container.querySelectorAll('[role="grid"]')).toHaveLength(1);
      const grid = getGrid(container);

      // The grid owns ONLY rowgroups (grid -> rowgroup -> row -> columnheader/gridcell); a
      // compound Header/Body still yields a header rowgroup + a body rowgroup, same as a
      // monolithic grid.
      const directChildren = Array.from(grid.children);
      expect(directChildren.length).toBeGreaterThan(0);
      directChildren.forEach(child => expect(child.getAttribute('role')).toBe('rowgroup'));

      // Every row lives under a rowgroup, and every columnheader/gridcell under a row.
      grid.querySelectorAll('[role="row"]').forEach(row => {
        expect(row.closest('[role="rowgroup"]')).not.toBeNull();
      });
      grid.querySelectorAll('[role="columnheader"], [role="gridcell"]').forEach(cell => {
        expect(cell.closest('[role="row"]')).not.toBeNull();
      });
    });

    test('non-row chrome (loading / live-region) is a sibling of the grid, never a grid child', () => {
      const { wrapper } = renderTable([], { loading: true, loadingText: 'Loading' });
      const status = wrapper.find('[role="status"]')!.getElement();
      // A status node inside role=grid would be an invalid grid child; it must sit outside.
      expect(status.closest('[role="grid"]')).toBeNull();

      const live = renderTable(makeItems(5)).wrapper.findLiveRegion()!.getElement();
      expect(live.closest('[role="grid"]')).toBeNull();
    });
  });

  describe('keyboard navigation (aria-activedescendant grid model)', () => {
    test('the grid is a single always-present tab stop and seeds an active descendant', () => {
      const { container, wrapper } = renderTable(makeItems(20));
      const grid = getGrid(container);
      expect(grid.getAttribute('tabindex')).toBe('0');
      const firstRow = wrapper.findRowByIndex(0)!.getElement();
      expect(grid.getAttribute('aria-activedescendant')).toBe(firstRow.id);
      expect(document.getElementById(firstRow.id)).not.toBeNull();
    });

    test('Arrow/Home/End move the active row when the grid holds focus', () => {
      const { container, wrapper } = renderTable(makeItems(20));
      const grid = getGrid(container);

      fireEvent.keyDown(grid, { key: 'ArrowDown' });
      expect(grid.getAttribute('aria-activedescendant')).toBe(wrapper.findRowByIndex(1)!.getElement().id);

      fireEvent.keyDown(grid, { key: 'End' });
      expect(grid.getAttribute('aria-activedescendant')).toBe(wrapper.findRowByIndex(19)!.getElement().id);

      fireEvent.keyDown(grid, { key: 'Home' });
      expect(grid.getAttribute('aria-activedescendant')).toBe(wrapper.findRowByIndex(0)!.getElement().id);
    });

    test('does not hijack arrow keys originating inside the expanded region', () => {
      const { container, wrapper } = renderTable(makeItems(20), { expandable: true, expandedItems: ['row-0'] });
      const grid = getGrid(container);
      const before = grid.getAttribute('aria-activedescendant');

      const innerButton = wrapper.findExpandedRegion(0)!.getElement().querySelector('button')!;
      fireEvent.keyDown(innerButton, { key: 'ArrowDown' });

      // The core's onGridKeyDown bails unless the grid container itself is the event target, so
      // arbitrary expanded content (goal 6) keeps its own arrow-key behaviour.
      expect(grid.getAttribute('aria-activedescendant')).toBe(before);
    });

    test('ArrowLeft / ArrowRight are inert (deliberate row-granular grid, not 2D cell nav)', () => {
      // Like the other winner cells, the core-owned grid is deliberately row-granular:
      // aria-activedescendant references a role="row" (never a gridcell) and the core's
      // onGridKeyDown handles only Up/Down/Home/End. A legitimate APG row-as-widget variant of
      // role="grid"; the horizontal cell-navigation keys are intentionally inert. Carried to
      // impl-F3-A2-docs as an explicit a11y contract note.
      const { container, wrapper } = renderTable(makeItems(20));
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

  describe('sort trigger accessibility', () => {
    test('sortable headers expose a keyboard-operable trigger with an accessible name; non-sortable do not', () => {
      const { wrapper } = renderTable(makeItems(10), { sortable: true });
      const [nameHeader, statusHeader] = wrapper.findColumnHeaders();

      const sortButton = nameHeader.find('button')!.getElement();
      // A native <button> is implicitly keyboard-operable; its accessible name is the localized
      // activateSortLabel (not the raw columnId announced bare). The skin spreads the core's
      // sortButtonProps; it authors no sort ARIA of its own.
      expect(sortButton.tagName).toBe('BUTTON');
      expect(sortButton.getAttribute('aria-label')).toBe('Sort by name');

      // Non-sortable column: no trigger and no aria-sort attribute at all.
      expect(statusHeader.find('button')).toBeNull();
      expect(statusHeader.getElement().getAttribute('aria-sort')).toBeNull();
    });

    test('aria-sort reflects the active column and is "none" on a sortable-but-inactive column', () => {
      const { wrapper } = renderTable(makeItems(10), {
        sortable: true,
        sortingColumn: { columnId: 'name' },
        sortingDescending: true,
      });
      expect(wrapper.findColumnHeaders()[0].getElement().getAttribute('aria-sort')).toBe('descending');

      const inactive = renderTable(makeItems(10), { sortable: true }).wrapper.findColumnHeaders()[0];
      expect(inactive.getElement().getAttribute('aria-sort')).toBe('none');
    });
  });

  describe('disclosure + expanded region wiring', () => {
    test('the disclosure control is a labeled button reflecting aria-expanded / aria-controls', () => {
      const { wrapper } = renderTable(makeItems(10), { expandable: true });
      const toggle = wrapper.findExpandToggle(0)!.getElement();

      expect(toggle.tagName).toBe('BUTTON');
      expect(toggle.getAttribute('aria-label')).toBe('Expand details for Resource 0');
      expect(toggle.getAttribute('aria-expanded')).toBe('false');
      expect(toggle.getAttribute('aria-controls')).toBeNull();

      fireEvent.click(toggle);

      expect(toggle.getAttribute('aria-expanded')).toBe('true');
      const region = wrapper.findExpandedRegion(0)!.getElement();
      expect(toggle.getAttribute('aria-controls')).toBe(region.id);
      expect(region.getAttribute('role')).toBe('region');
    });

    test('the expanded region carries the consumer-supplied accessible name', () => {
      const { wrapper } = renderTable(makeItems(10), { expandable: true, expandedItems: ['row-2'] });
      const region = wrapper.findExpandedRegion(2)!.getElement();
      expect(region.getAttribute('aria-label')).toBe('Details for Resource 2');
    });

    test('Escape inside the expanded region returns focus to its disclosure trigger (core-wired)', () => {
      // The core wires onKeyDown on expandedRegionProps: Escape stops propagation and focuses
      // document.getElementById(toggleId(id)). The skin only spreads expandedRegionProps, so the
      // Escape-out contract is inherited correct-by-construction.
      const { wrapper } = renderTable(makeItems(10), { expandable: true, expandedItems: ['row-0'] });
      const toggle = wrapper.findExpandToggle(0)!.getElement();
      const innerButton = wrapper.findExpandedRegion(0)!.getElement().querySelector('button')!;

      innerButton.focus();
      expect(document.activeElement).toBe(innerButton);

      fireEvent.keyDown(innerButton, { key: 'Escape' });
      expect(document.activeElement).toBe(toggle);
    });

    test('the expanded region content is reachable (Tab-in half: not aria-hidden / inert / disabled)', () => {
      const { wrapper } = renderTable(makeItems(10), { expandable: true, expandedItems: ['row-0'] });
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

    test('coalesces a burst of appends into one debounced polite message', () => {
      const { wrapper, update } = renderTable(makeItems(10));
      const live = wrapper.findLiveRegion()!.getElement();
      expect(live.getAttribute('aria-live')).toBe('polite');
      expect(live.textContent).toBe('');

      // Two appends within the debounce window collapse into a single announcement.
      update(makeItems(13));
      update(makeItems(15));
      expect(live.textContent).toBe('');

      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(live.textContent).toContain('5 new log events');
      expect(live.textContent).toContain('15 total');
    });

    test('does not announce when the dataset shrinks or is replaced', () => {
      const { wrapper, update } = renderTable(makeItems(10));
      const live = wrapper.findLiveRegion()!.getElement();

      update(makeItems(4));
      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(live.textContent).toBe('');
    });
  });

  describe('focus under row recycling', () => {
    test('keeps focus on a control when rows are appended (trackBy-keyed identity)', () => {
      const { wrapper, update } = renderTable(makeItems(20), { expandable: true });
      const toggle = wrapper.findExpandToggle(0)!.getElement();

      toggle.focus();
      expect(document.activeElement).toBe(toggle);

      // Appending rows must not remount the still-windowed row 0, so its focused disclosure
      // control retains focus (recycling is keyed by trackBy identity).
      update(makeItems(30), { expandable: true });
      expect(document.activeElement).toBe(wrapper.findExpandToggle(0)!.getElement());
    });
  });

  describe('full-dataset ARIA coherence under windowing', () => {
    test('aria-rowcount counts the header once and aria-colcount counts the disclosure column', () => {
      const { container } = renderTable(makeItems(500), { expandable: true });
      const grid = getGrid(container);
      expect(grid.getAttribute('aria-rowcount')).toBe('501');
      expect(grid.getAttribute('aria-colcount')).toBe(String(DATA_COLUMNS + 1));
    });

    test('the header row is aria-rowindex 1 with the disclosure columnheader at aria-colindex 1', () => {
      const { wrapper } = renderTable(makeItems(500), { expandable: true });
      const header = wrapper.findHeaderRow()!.getElement();
      expect(header.getAttribute('aria-rowindex')).toBe('1');

      const headers = header.querySelectorAll('[role="columnheader"]');
      expect(headers[0].getAttribute('aria-colindex')).toBe('1'); // materialised disclosure column
      expect(headers[1].getAttribute('aria-colindex')).toBe('2'); // first data column
    });

    test('data rows carry a full-dataset aria-rowindex and disclosure=1 / data-from-2 colindex', () => {
      const { wrapper } = renderTable(makeItems(500), { expandable: true });
      const row0 = wrapper.findRowByIndex(0)!.getElement();
      expect(row0.getAttribute('aria-rowindex')).toBe('2'); // header is 1, so data index 0 -> 2

      const cells = row0.querySelectorAll('[role="gridcell"]');
      expect(cells[0].getAttribute('aria-colindex')).toBe('1'); // disclosure cell
      expect(cells[1].getAttribute('aria-colindex')).toBe('2'); // first data cell
    });

    test('the expanded row shares its data row index and spans all columns without changing aria-rowcount', () => {
      const { container, wrapper } = renderTable(makeItems(500), { expandable: true, expandedItems: ['row-0'] });
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
