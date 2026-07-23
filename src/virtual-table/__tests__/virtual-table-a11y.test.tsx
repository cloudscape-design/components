// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import '../../__a11y__/to-validate-a11y';
import createWrapper from '../../../lib/components/test-utils/dom';
import VirtualTable, { VirtualTableProps } from '../../../lib/components/virtual-table';

// A11y tests for the config-driven VirtualTable (impl-F1-A1-tests-a11y). They run in
// jsdom under the unit config (the `__a11y__` directory is the node/puppeteer integ
// runner, `.ts`-only, so axe + RTL keyboard/SR tests belong here, matching the repo's
// existing `*-a11y.test.tsx` convention). The unit runner collects this file: its
// testRegex `(/__tests__/.*(\.|/)test)\.[jt]sx?$` matches `virtual-table-a11y.test.tsx`
// and ts-jest transforms the `.tsx` via `tsconfig.unit.json` — so `-pr` runs it as part
// of `npm test`. Coverage: axe/HTML validity, row-granular keyboard nav via
// aria-activedescendant (incl. ArrowLeft/Right inert), disclosure activation, Tab-in /
// Escape-out of the expanded region, live-append debounce, focus-under-recycling, and
// full-dataset aria-rowcount/rowindex + aria-colcount/colindex coherence (incl. the
// materialised disclosure column) under windowing.

interface Item {
  id: string;
  name: string;
}

const makeItems = (n: number): Item[] => Array.from({ length: n }, (_, i) => ({ id: String(i), name: `row ${i}` }));

const columnDefinitions: VirtualTableProps<Item>['columnDefinitions'] = [
  { id: 'name', header: 'Name', cell: item => item.name },
  { id: 'index', header: 'Index', cell: (item, context) => String(context.rowIndex) },
];

// Stable identity so useLiveAnnouncement's effect does not re-run on unrelated rerenders.
const appendAnnouncement = ({ addedCount, totalCount }: { addedCount: number; totalCount: number }) =>
  `${addedCount} new log events, ${totalCount} total`;

const ariaLabels: VirtualTableProps.AriaLabels<Item> = {
  tableLabel: 'Log events',
  expandButtonLabel: (item, expanded) => `${expanded ? 'Collapse' : 'Expand'} details for ${item.name}`,
  expandedRegionLabel: item => `Details for ${item.name}`,
  appendAnnouncement,
};

const expandedContent = (item: Item) => (
  <div>
    <h3>Log record {item.id}</h3>
    <dl>
      <dt>Level</dt>
      <dd>INFO</dd>
    </dl>
    <button type="button">View matching logs</button>
  </div>
);

function renderTable(props: Partial<VirtualTableProps<Item>> & { items: Item[] }) {
  const { container, rerender } = render(
    <VirtualTable trackBy={item => item.id} columnDefinitions={columnDefinitions} ariaLabels={ariaLabels} {...props} />
  );
  const wrapper = createWrapper(container).findVirtualTable()!;
  return { container, rerender, wrapper };
}

function getGrid(container: HTMLElement): HTMLElement {
  return container.querySelector('[role="grid"]') as HTMLElement;
}

describe('VirtualTable a11y', () => {
  describe('axe / HTML validity', () => {
    test('validates a plain grid without expansion', async () => {
      const { container } = renderTable({ items: makeItems(20) });
      await expect(container).toValidateA11y();
    });

    test('validates a grid with a collapsed disclosure column', async () => {
      const { container } = renderTable({ items: makeItems(20), getExpandedContent: expandedContent });
      await expect(container).toValidateA11y();
    });

    test('validates a grid with an expanded, labeled region containing arbitrary content', async () => {
      const { container } = renderTable({
        items: makeItems(20),
        getExpandedContent: expandedContent,
        expandedItems: ['0', '3'],
      });
      await expect(container).toValidateA11y();
    });

    test('validates the reduced single-column (file/raw) shape', async () => {
      const { container } = renderTable({
        items: makeItems(50),
        columnDefinitions: [{ id: 'line', header: 'Log line', cell: item => item.name, isStretch: true }],
        estimatedRowHeight: 20,
        overscan: 40,
      });
      await expect(container).toValidateA11y();
    });

    test('validates the empty and loading states', async () => {
      const empty = renderTable({ items: [], empty: <span>No log events</span> });
      await expect(empty.container).toValidateA11y();

      const loading = renderTable({ items: [], loading: true, loadingText: 'Loading log events' });
      await expect(loading.container).toValidateA11y();
    });
  });

  describe('keyboard navigation (aria-activedescendant grid model)', () => {
    test('the grid is a single always-present tab stop and seeds an active descendant', () => {
      const { container, wrapper } = renderTable({ items: makeItems(20) });
      const grid = getGrid(container);
      expect(grid.getAttribute('tabindex')).toBe('0');
      // The active descendant is a keyboard-navigation concept, seeded only once the
      // grid actually holds focus; it then defaults to the first (rendered) row.
      fireEvent.focus(grid);
      const firstRow = wrapper.findRowByIndex(0)!.getElement();
      expect(grid.getAttribute('aria-activedescendant')).toBe(firstRow.id);
      expect(document.getElementById(firstRow.id)).not.toBeNull();
    });

    test('advertises no active descendant until the grid holds focus', () => {
      const { container, wrapper } = renderTable({ items: makeItems(20) });
      const grid = getGrid(container);
      // No active row is advertised on initial render (before any interaction).
      expect(grid.getAttribute('aria-activedescendant')).toBeNull();

      fireEvent.focus(grid);
      expect(grid.getAttribute('aria-activedescendant')).toBe(wrapper.findRowByIndex(0)!.getElement().id);

      // Blurring the container retracts the active descendant again.
      fireEvent.blur(grid);
      expect(grid.getAttribute('aria-activedescendant')).toBeNull();
    });

    test('focusing a descendant control does not advertise an active descendant on the grid', () => {
      const { container, wrapper } = renderTable({ items: makeItems(20), getExpandedContent: expandedContent });
      const grid = getGrid(container);
      // focusin bubbles from the disclosure button to the container; the guard must
      // ignore descendant focus so items[0] is not falsely activated (WCAG).
      wrapper.findExpandToggle(0)!.getElement().focus();
      expect(grid.getAttribute('aria-activedescendant')).toBeNull();
    });

    test('Arrow/Home/End move the active row when the grid holds focus', () => {
      const { container, wrapper } = renderTable({ items: makeItems(20) });
      const grid = getGrid(container);
      fireEvent.focus(grid);

      fireEvent.keyDown(grid, { key: 'ArrowDown' });
      expect(grid.getAttribute('aria-activedescendant')).toBe(wrapper.findRowByIndex(1)!.getElement().id);

      fireEvent.keyDown(grid, { key: 'End' });
      expect(grid.getAttribute('aria-activedescendant')).toBe(wrapper.findRowByIndex(19)!.getElement().id);

      fireEvent.keyDown(grid, { key: 'Home' });
      expect(grid.getAttribute('aria-activedescendant')).toBe(wrapper.findRowByIndex(0)!.getElement().id);
    });

    test('does not hijack arrow keys originating inside the expanded region', () => {
      const { container, wrapper } = renderTable({
        items: makeItems(20),
        getExpandedContent: expandedContent,
        expandedItems: ['0'],
      });
      const grid = getGrid(container);
      fireEvent.focus(grid);
      const before = grid.getAttribute('aria-activedescendant');

      const innerButton = wrapper.findExpandedRegion(0)!.getElement().querySelector('button')!;
      fireEvent.keyDown(innerButton, { key: 'ArrowDown' });

      // The grid only acts on keydown from the container itself, so content inside the
      // region keeps its own arrow-key behaviour and the active row is unchanged.
      expect(grid.getAttribute('aria-activedescendant')).toBe(before);
    });

    test('ArrowLeft / ArrowRight are inert (deliberate row-granular grid, not 2D cell nav)', () => {
      // F1-A1 deliberately ships a row-granular grid: aria-activedescendant references a
      // role="row" (never a gridcell), and onGridKeyDown handles only Up/Down/Home/End.
      // This is a legitimate APG row-as-widget variant of role="grid"; the horizontal
      // cell-navigation keys the 2D grid pattern would imply are intentionally inert.
      // Carried to impl-F1-A1-docs as an explicit a11y contract note (row-, not cell-,
      // granular navigation) so consumers are not surprised.
      const { container, wrapper } = renderTable({ items: makeItems(20) });
      const grid = getGrid(container);
      fireEvent.focus(grid);

      fireEvent.keyDown(grid, { key: 'ArrowDown' });
      const active = grid.getAttribute('aria-activedescendant');
      expect(active).toBe(wrapper.findRowByIndex(1)!.getElement().id);

      fireEvent.keyDown(grid, { key: 'ArrowRight' });
      expect(grid.getAttribute('aria-activedescendant')).toBe(active);

      fireEvent.keyDown(grid, { key: 'ArrowLeft' });
      expect(grid.getAttribute('aria-activedescendant')).toBe(active);
    });
  });

  describe('disclosure + expanded region wiring', () => {
    test('the disclosure control is a labeled button reflecting aria-expanded / aria-controls', () => {
      const { wrapper } = renderTable({ items: makeItems(10), getExpandedContent: expandedContent });
      const toggle = wrapper.findExpandToggle(0)!.getElement();

      expect(toggle.tagName).toBe('BUTTON');
      expect(toggle.getAttribute('aria-label')).toBe('Expand details for row 0');
      expect(toggle.getAttribute('aria-expanded')).toBe('false');
      expect(toggle.getAttribute('aria-controls')).toBeNull();

      fireEvent.click(toggle);

      expect(toggle.getAttribute('aria-expanded')).toBe('true');
      const region = wrapper.findExpandedRegion(0)!.getElement();
      expect(toggle.getAttribute('aria-controls')).toBe(region.id);
      expect(region.getAttribute('role')).toBe('region');
    });

    test('the expanded region carries the consumer-supplied accessible name', () => {
      const { wrapper } = renderTable({
        items: makeItems(10),
        getExpandedContent: expandedContent,
        expandedItems: ['2'],
      });
      const region = wrapper.findExpandedRegion(2)!.getElement();
      expect(region.getAttribute('aria-label')).toBe('Details for row 2');
    });

    test('Escape inside the expanded region returns focus to its disclosure trigger', () => {
      const { wrapper } = renderTable({
        items: makeItems(10),
        getExpandedContent: expandedContent,
        expandedItems: ['0'],
      });
      const toggle = wrapper.findExpandToggle(0)!.getElement();
      const innerButton = wrapper.findExpandedRegion(0)!.getElement().querySelector('button')!;

      innerButton.focus();
      expect(document.activeElement).toBe(innerButton);

      fireEvent.keyDown(innerButton, { key: 'Escape' });
      expect(document.activeElement).toBe(toggle);
    });

    test('the expanded region content is reachable (Tab-in half: not aria-hidden / inert / disabled)', () => {
      const { wrapper } = renderTable({
        items: makeItems(10),
        getExpandedContent: expandedContent,
        expandedItems: ['0'],
      });
      const region = wrapper.findExpandedRegion(0)!.getElement();
      const innerButton = region.querySelector('button') as HTMLButtonElement;

      // jsdom cannot perform real Tab traversal, but the Tab-in half of the contract is
      // that the region's interactive content is genuinely focusable — not disabled and
      // not inside an aria-hidden or inert ancestor that would remove it from the tab order.
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
      const { rerender, wrapper } = renderTable({ items: makeItems(10) });
      const live = wrapper.findLiveRegion()!.getElement();
      expect(live.getAttribute('aria-live')).toBe('polite');
      expect(live.textContent).toBe('');

      const props = {
        trackBy: (item: Item) => item.id,
        columnDefinitions,
        ariaLabels,
      };
      // Two appends within the debounce window collapse into a single announcement.
      rerender(<VirtualTable {...props} items={makeItems(13)} />);
      rerender(<VirtualTable {...props} items={makeItems(15)} />);
      expect(live.textContent).toBe('');

      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(live.textContent).toContain('5 new log events');
      expect(live.textContent).toContain('15 total');
    });

    test('does not announce when the dataset shrinks or is replaced', () => {
      const props = { trackBy: (item: Item) => item.id, columnDefinitions, ariaLabels };
      const { rerender, wrapper } = renderTable({ items: makeItems(10) });
      const live = wrapper.findLiveRegion()!.getElement();

      rerender(<VirtualTable {...props} items={makeItems(4)} />);
      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(live.textContent).toBe('');
    });
  });

  describe('focus under row recycling', () => {
    test('keeps focus on a control when rows are appended (trackBy-keyed identity)', () => {
      const props = { trackBy: (item: Item) => item.id, columnDefinitions, ariaLabels };
      const { rerender, wrapper } = renderTable({ items: makeItems(20), getExpandedContent: expandedContent });
      const toggle = wrapper.findExpandToggle(0)!.getElement();

      toggle.focus();
      expect(document.activeElement).toBe(toggle);

      // Appending rows must not remount the still-windowed row 0, so its focused
      // disclosure control retains focus (recycling is keyed by trackBy identity).
      rerender(<VirtualTable {...props} items={makeItems(30)} getExpandedContent={expandedContent} />);
      expect(document.activeElement).toBe(wrapper.findExpandToggle(0)!.getElement());
    });
  });

  describe('full-dataset ARIA coherence under windowing', () => {
    test('aria-rowcount counts the header once and aria-colcount counts the disclosure column', () => {
      const { container } = renderTable({ items: makeItems(500), getExpandedContent: expandedContent });
      const grid = getGrid(container);
      expect(grid.getAttribute('aria-rowcount')).toBe('501');
      expect(grid.getAttribute('aria-colcount')).toBe(String(columnDefinitions.length + 1));
    });

    test('the header row is aria-rowindex 1 with the disclosure columnheader at aria-colindex 1', () => {
      const { wrapper } = renderTable({ items: makeItems(500), getExpandedContent: expandedContent });
      const header = wrapper.findHeaderRow()!.getElement();
      expect(header.getAttribute('aria-rowindex')).toBe('1');

      const headers = header.querySelectorAll('[role="columnheader"]');
      expect(headers[0].getAttribute('aria-colindex')).toBe('1'); // materialised disclosure column
      expect(headers[1].getAttribute('aria-colindex')).toBe('2'); // first data column
    });

    test('data rows carry a full-dataset aria-rowindex and disclosure=1 / data-from-2 colindex', () => {
      const { wrapper } = renderTable({ items: makeItems(500), getExpandedContent: expandedContent });
      const row0 = wrapper.findRowByIndex(0)!.getElement();
      expect(row0.getAttribute('aria-rowindex')).toBe('2'); // header is 1, so data index 0 -> 2

      const cells = row0.querySelectorAll('[role="gridcell"]');
      expect(cells[0].getAttribute('aria-colindex')).toBe('1'); // disclosure cell
      expect(cells[1].getAttribute('aria-colindex')).toBe('2'); // first data cell
    });

    test('the expanded row shares its data row index and spans all columns without changing aria-rowcount', () => {
      const { container, wrapper } = renderTable({
        items: makeItems(500),
        getExpandedContent: expandedContent,
        expandedItems: ['0'],
      });
      // Expanding a row does not add to the row count (design B1).
      expect(getGrid(container).getAttribute('aria-rowcount')).toBe('501');

      const region = wrapper.findExpandedRegion(0)!.getElement();
      const expandedRow = region.closest('[role="row"]')!;
      expect(expandedRow.getAttribute('aria-rowindex')).toBe('2'); // shares its data row's index

      const expandedCell = expandedRow.querySelector('[role="gridcell"]')!;
      expect(expandedCell.getAttribute('aria-colindex')).toBe('1');
      expect(expandedCell.getAttribute('aria-colspan')).toBe(String(columnDefinitions.length + 1));
    });
  });
});
