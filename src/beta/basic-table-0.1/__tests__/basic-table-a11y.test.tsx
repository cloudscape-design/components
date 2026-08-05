// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';
import createWrapper from '../../../../lib/components/beta/basic-table-0.1/test-utils/dom';
import BasicTable, {
  BasicTableHeader,
  BasicTableHeaderCell,
  BasicTableBody,
  BasicTableRow,
  BasicTableCell,
  BasicTableExpandedContent,
  BasicTableProps,
} from '../../../../lib/components/beta/basic-table-0.1';

import './setup';

// Accessibility tests for the compound BasicTable. The sub-components spread the useBasicTable hook's
// role/ARIA getters onto native <table>/<thead>/<tr>/<th>/<tbody>/<td>, so the whole compound
// collapses to one role="grid" tree: grid -> rowgroup -> row -> columnheader/gridcell, with
// full-dataset aria-rowcount/rowindex and aria-colcount/colindex coherence and roving-tabindex
// cell-by-cell keyboard navigation via the shared GridNavigationProvider.
//
// Columns are a positional width list; the header is declared with Header/HeaderCell children.
//
// Expansion is nested: there is no auto disclosure column; the consumer renders its own toggle
// button (id `${rowId}-toggle`) inside a Cell and an ExpandedContent region nested in the same Row.
// The region owns its a11y (role="region" + label, colspan, Escape returns focus to the toggle) and
// is marked data-awsui-table-suppress-navigation so the grid navigation leaves its content's arrow
// keys alone.

interface Item {
  id: string;
  name: string;
  status: string;
}

const makeItems = (n: number): Item[] =>
  Array.from({ length: n }, (_, i) => ({ id: `row-${i}`, name: `Resource ${i}`, status: i % 2 === 0 ? 'Up' : 'Down' }));

const i18nStrings: BasicTableProps.I18nStrings = {
  tableLabel: 'Log events',
};

interface TreeOptions {
  expandable?: boolean;
  singleColumn?: boolean;
  expandedItems?: ReadonlyArray<string>;
  loading?: boolean;
  loadingText?: string;
  empty?: React.ReactNode;
}

const DATA_COLUMNS = 2;

function detail(item: Item) {
  return (
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
}

// Stateful harness: expansion state lives in the consumer. The toggle and region are
// consumer-rendered; BasicTable only spreads the hook's getters and the row's expansion context.
function LogTable({ items, options }: { items: Item[]; options: TreeOptions }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(options.expandedItems ?? []));
  const toggle = (id: string) =>
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const columns: BasicTableProps.ColumnDefinition[] = options.singleColumn ? [{}] : [{}, {}];

  return (
    <BasicTable
      columns={columns}
      totalRowCount={items.length}
      loading={options.loading}
      loadingText={options.loadingText}
      empty={options.empty}
      i18nStrings={i18nStrings}
    >
      <BasicTableHeader>
        <BasicTableHeaderCell>Name</BasicTableHeaderCell>
        {!options.singleColumn && <BasicTableHeaderCell>Status</BasicTableHeaderCell>}
      </BasicTableHeader>
      <BasicTableBody>
        {items.map((item, index) => {
          const isExpanded = expanded.has(item.id);
          return (
            <BasicTableRow
              key={item.id}
              index={index}
              id={item.id}
              expanded={isExpanded}
              onToggleExpand={() => toggle(item.id)}
            >
              <BasicTableCell>
                {options.expandable && (
                  <button
                    type="button"
                    id={`${item.id}-toggle`}
                    aria-label={`${isExpanded ? 'Collapse' : 'Expand'} details for ${item.name}`}
                    aria-expanded={isExpanded}
                    aria-controls={isExpanded ? `${item.id}-region` : undefined}
                    onClick={() => toggle(item.id)}
                  >
                    T
                  </button>
                )}
                {item.name}
              </BasicTableCell>
              {!options.singleColumn && <BasicTableCell>{item.status}</BasicTableCell>}
              {options.expandable && (
                <BasicTableExpandedContent label={`Details for ${item.name}`}>
                  {detail(item)}
                </BasicTableExpandedContent>
              )}
            </BasicTableRow>
          );
        })}
      </BasicTableBody>
    </BasicTable>
  );
}

function renderTable(items: Item[], options: TreeOptions = {}) {
  const { container, rerender } = render(<LogTable items={items} options={options} />);
  const wrapper = createWrapper(container).findBasicTable()!;
  const update = (nextItems: Item[], nextOptions: TreeOptions = options) =>
    rerender(<LogTable items={nextItems} options={nextOptions} />);
  return { container, wrapper, update };
}

function getGrid(container: HTMLElement): HTMLElement {
  return container.querySelector('[role="grid"]') as HTMLElement;
}
// Helpers: the toggle and region are consumer DOM addressed by their stable ids.
const findToggle = (container: HTMLElement, id: string) => container.querySelector(`#${id}-toggle`) as HTMLElement | null;
const findRegion = (container: HTMLElement, id: string) => container.querySelector(`#${id}-region`) as HTMLElement | null;

describe('BasicTable (compound components) a11y', () => {
  describe('axe / HTML validity', () => {
    test('validates a plain compound grid', async () => {
      const { container } = renderTable(makeItems(20));
      await expect(container).toValidateA11y();
    });

    test('validates a grid with collapsed expandable rows (consumer toggles)', async () => {
      const { container } = renderTable(makeItems(20), { expandable: true });
      await expect(container).toValidateA11y();
    });

    test('validates a grid with expanded, labeled nested regions', async () => {
      const { container } = renderTable(makeItems(20), { expandable: true, expandedItems: ['row-0', 'row-3'] });
      await expect(container).toValidateA11y();
    });

    test('validates the reduced single-column shape', async () => {
      const { container } = renderTable(makeItems(30), { singleColumn: true });
      await expect(container).toValidateA11y();
    });

    test('validates the empty and loading states', async () => {
      const empty = renderTable([], { empty: <span>No log events</span> });
      await expect(empty.container).toValidateA11y();

      const loading = renderTable([], { loading: true, loadingText: 'Loading log events' });
      await expect(loading.container).toValidateA11y();
    });
  });

  describe('compound structure produces a single grid accessibility tree', () => {
    test('the compound sub-components collapse to one grid -> rowgroup -> row tree', () => {
      const { container } = renderTable(makeItems(20), { expandable: true, expandedItems: ['row-0'] });
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

    test('the loading state renders as a valid full-width row inside the grid', () => {
      const { wrapper, container } = renderTable([], { loading: true, loadingText: 'Loading' });
      const status = wrapper.findLoadingText()!.getElement();
      const cell = status.closest('[role="gridcell"]');
      expect(cell).not.toBeNull();
      expect(cell!.closest('[role="row"]')).not.toBeNull();
      expect(cell!.closest('[role="rowgroup"]')).not.toBeNull();
      expect(getGrid(container)).not.toBeNull();
    });
  });

  describe('keyboard navigation (shared roving-tabindex grid model)', () => {
    test('the grid container is programmatically focusable but NOT a tab stop, and has no active descendant', () => {
      const { container } = renderTable(makeItems(20));
      const grid = getGrid(container);
      expect(grid.getAttribute('role')).toBe('grid');
      expect(grid.getAttribute('tabindex')).toBe('-1');
      expect(grid.getAttribute('aria-activedescendant')).toBeNull();
    });

    test('cells are native <th>/<td> carrying role + aria-colindex', () => {
      const { wrapper } = renderTable(makeItems(20));
      expect(wrapper.findColumnHeaders()[0].getElement().tagName).toBe('TH');
      const row0 = wrapper.findRowByIndex(0)!.getElement();
      const cells = Array.from(row0.querySelectorAll('[role="gridcell"]'));
      expect(cells[0].tagName).toBe('TD');
      expect(cells[0].getAttribute('aria-colindex')).toBe('1');
      expect(cells[1].getAttribute('aria-colindex')).toBe('2');
    });

    test('exactly one cell is the roving tab stop (tabindex 0) after mount', async () => {
      const { container } = renderTable(makeItems(20));
      const grid = getGrid(container);
      await waitFor(() => expect(grid.querySelectorAll('[tabindex="0"]')).toHaveLength(1));
      const target = grid.querySelector('[tabindex="0"]')!;
      expect(['TD', 'TH']).toContain(target.tagName);
      expect(target.getAttribute('role')).toMatch(/columnheader|gridcell/);
    });

    test('Arrow keys move focus cell-by-cell (Left/Right within a row, Up/Down across rows); Home/End to row ends', async () => {
      const { container, wrapper } = renderTable(makeItems(20));
      const grid = getGrid(container);

      await waitFor(() => expect(grid.querySelector('[tabindex="0"]')).not.toBeNull());
      const firstTarget = grid.querySelector('[tabindex="0"]') as HTMLElement;
      firstTarget.focus();
      expect(document.activeElement).toBe(firstTarget);
      const colOf = () => document.activeElement?.getAttribute('aria-colindex');
      const rowOf = () => document.activeElement?.closest('[role="row"]')?.getAttribute('aria-rowindex');
      expect(colOf()).toBe('1');
      expect(rowOf()).toBe('1'); // header row

      fireEvent.keyDown(grid, { keyCode: KeyCode.right });
      expect(colOf()).toBe('2');
      fireEvent.keyDown(grid, { keyCode: KeyCode.left });
      expect(colOf()).toBe('1');

      fireEvent.keyDown(grid, { keyCode: KeyCode.down });
      expect(rowOf()).toBe('2'); // data row 0 (header is 1)
      expect(colOf()).toBe('1');
      expect(document.activeElement).toBe(wrapper.findRowByIndex(0)!.getElement().querySelectorAll('[role="gridcell"]')[0]);

      fireEvent.keyDown(grid, { keyCode: KeyCode.end });
      expect(colOf()).toBe('2');
      fireEvent.keyDown(grid, { keyCode: KeyCode.home });
      expect(colOf()).toBe('1');

      fireEvent.keyDown(grid, { keyCode: KeyCode.up });
      expect(rowOf()).toBe('1');
      expect(colOf()).toBe('1');
    });

    test('does not hijack arrow keys originating inside the expanded region', () => {
      const { container } = renderTable(makeItems(20), { expandable: true, expandedItems: ['row-0'] });
      const grid = getGrid(container);

      const innerButton = findRegion(container, 'row-0')!.querySelector('button')!;
      innerButton.focus();
      expect(document.activeElement).toBe(innerButton);

      fireEvent.keyDown(grid, { keyCode: KeyCode.down });
      expect(document.activeElement).toBe(innerButton);
    });
  });

  describe('decision-2 nested expansion wiring', () => {
    test('the consumer disclosure control reflects aria-expanded / aria-controls across a toggle', () => {
      const { container } = renderTable(makeItems(10), { expandable: true });
      const toggle = findToggle(container, 'row-0')!;

      expect(toggle.tagName).toBe('BUTTON');
      expect(toggle.getAttribute('aria-label')).toBe('Expand details for Resource 0');
      expect(toggle.getAttribute('aria-expanded')).toBe('false');
      expect(toggle.getAttribute('aria-controls')).toBeNull();
      expect(findRegion(container, 'row-0')).toBeNull();

      fireEvent.click(toggle);

      expect(toggle.getAttribute('aria-expanded')).toBe('true');
      const region = findRegion(container, 'row-0')!;
      expect(region).not.toBeNull();
      expect(toggle.getAttribute('aria-controls')).toBe(region.id);
      expect(region.getAttribute('role')).toBe('region');
    });

    test('the expanded region carries the consumer-supplied accessible name', () => {
      const { container } = renderTable(makeItems(10), { expandable: true, expandedItems: ['row-2'] });
      const region = findRegion(container, 'row-2')!;
      expect(region.getAttribute('aria-label')).toBe('Details for Resource 2');
    });

    test('Escape inside the expanded region returns focus to its disclosure toggle (source-wired)', () => {
      const { container } = renderTable(makeItems(10), { expandable: true, expandedItems: ['row-0'] });
      const toggle = findToggle(container, 'row-0')!;
      const innerButton = findRegion(container, 'row-0')!.querySelector('button')!;

      innerButton.focus();
      expect(document.activeElement).toBe(innerButton);

      fireEvent.keyDown(innerButton, { key: 'Escape' });
      expect(document.activeElement).toBe(toggle);
    });

    test('the expanded region content is reachable (not aria-hidden / inert / disabled)', () => {
      const { container } = renderTable(makeItems(10), { expandable: true, expandedItems: ['row-0'] });
      const innerButton = findRegion(container, 'row-0')!.querySelector('button') as HTMLButtonElement;
      expect(innerButton.closest('[aria-hidden="true"]')).toBeNull();
      expect(innerButton.closest('[inert]')).toBeNull();
      expect(innerButton.hasAttribute('disabled')).toBe(false);
      innerButton.focus();
      expect(document.activeElement).toBe(innerButton);
    });
  });

  describe('full-dataset ARIA coherence', () => {
    test('aria-rowcount counts the header once; aria-colcount is the configured column count (no disclosure column)', () => {
      const { container } = renderTable(makeItems(500), { expandable: true });
      const grid = getGrid(container);
      expect(grid.getAttribute('aria-rowcount')).toBe('501');
      expect(grid.getAttribute('aria-colcount')).toBe(String(DATA_COLUMNS));
    });

    test('the header row is aria-rowindex 1 with the first data column at aria-colindex 1', () => {
      const { wrapper } = renderTable(makeItems(500), { expandable: true });
      const header = wrapper.findHeaderRow()!.getElement();
      expect(header.getAttribute('aria-rowindex')).toBe('1');
      const headers = header.querySelectorAll('[role="columnheader"]');
      expect(headers[0].getAttribute('aria-colindex')).toBe('1');
      expect(headers[1].getAttribute('aria-colindex')).toBe('2');
    });

    test('data rows carry a full-dataset aria-rowindex and 1-based cell colindex', () => {
      const { wrapper } = renderTable(makeItems(500));
      const row0 = wrapper.findRowByIndex(0)!.getElement();
      expect(row0.getAttribute('aria-rowindex')).toBe('2');
      const cells = row0.querySelectorAll('[role="gridcell"]');
      expect(cells[0].getAttribute('aria-colindex')).toBe('1');
      expect(cells[1].getAttribute('aria-colindex')).toBe('2');
    });

    test('the nested expanded region shares its data row index and spans all columns without changing aria-rowcount', () => {
      const { container, wrapper } = renderTable(makeItems(500), { expandable: true, expandedItems: ['row-0'] });
      // Expanding a row does not add to the row count (nested expansion is one taller row).
      expect(getGrid(container).getAttribute('aria-rowcount')).toBe('501');

      const region = findRegion(container, 'row-0')!;
      const expandedRow = region.closest('[role="row"]')!;
      expect(expandedRow.getAttribute('aria-rowindex')).toBe('2'); // shares its data row's index
      expect(expandedRow).toBe(wrapper.findRowByIndex(0)!.getElement());

      const expandedCell = region.closest('[role="gridcell"]')!;
      expect(expandedCell.getAttribute('aria-colindex')).toBe('1');
      expect(expandedCell.getAttribute('aria-colspan')).toBe(String(DATA_COLUMNS));
    });
  });
});
