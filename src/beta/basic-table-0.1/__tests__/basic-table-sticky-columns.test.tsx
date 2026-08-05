// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import BasicTable, { BasicTableProps } from '../basic-table';

import styles from '../basic-table/styles.css.js';

// Tests for sticky (pinned) columns. Sticky styling comes from the shared sticky-columns primitive:
// useStickyColumns measures cumulative offsets and disables itself when the table is not scrollable
// or too narrow, and useStickyCellStyles toggles the sticky classes on each header/body cell.
//
// jsdom has no layout — getBoundingClientRect() returns 0 — so the primitive's isEnabled check is
// always false and no sticky class would apply. getBoundingClientRect is mocked per tag (a wide
// table, a narrower scroll-container div, fixed-width cells) to drive isEnabled=true so the base
// sticky-cell class lands on the pinned cells.
//
// The boundary-shadow classes (sticky-cell-last-inline-start / -last-inline-end) depend on scroll
// "stuck" state (wrapper.scrollWidth/clientWidth/scrollLeft, all 0 in jsdom and not mockable via
// getBoundingClientRect), so only the base sticky-cell class (position and which columns are pinned)
// is asserted, never the stuck-state shadow variants.

interface Item {
  id: string;
  a: string;
  b: string;
  c: string;
  d: string;
}

const makeItems = (n: number): Item[] =>
  Array.from({ length: n }, (_, i) => ({ id: `row-${i}`, a: `A${i}`, b: `B${i}`, c: `C${i}`, d: `D${i}` }));

const i18nStrings: BasicTableProps.I18nStrings = { tableLabel: 'Resources' };

const COLUMNS = ['a', 'b', 'c', 'd'] as const;

const WRAPPER_WIDTH = 800;
const TABLE_WIDTH = 2000;
const CELL_WIDTH = 100;

function rect(width: number): DOMRect {
  return { width, height: 20, top: 0, left: 0, right: width, bottom: 20, x: 0, y: 0, toJSON: () => ({}) } as DOMRect;
}

function mockLayout() {
  return vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    if (this.tagName === 'TABLE') {
      return rect(TABLE_WIDTH);
    }
    if (this.tagName === 'TD' || this.tagName === 'TH') {
      return rect(CELL_WIDTH);
    }
    return rect(WRAPPER_WIDTH);
  });
}

function renderTable(stickyColumns?: BasicTableProps.StickyColumns) {
  const columns: BasicTableProps.ColumnDefinition[] = COLUMNS.map(id => ({
    id,
    width: 150,
  }));
  const items = makeItems(20);
  const { container } = render(
    <BasicTable.Root
      columns={columns}
      totalRowCount={items.length}
      height={300}
      stickyColumns={stickyColumns}
      i18nStrings={i18nStrings}
    >
      <BasicTable.Header>
        {COLUMNS.map(id => (
          <BasicTable.HeaderCell key={id} columnId={id}>
            {id.toUpperCase()}
          </BasicTable.HeaderCell>
        ))}
      </BasicTable.Header>
      <BasicTable.Body>
        {items.map((item, index) => (
          <BasicTable.Row key={item.id} index={index} id={item.id}>
            {COLUMNS.map(id => (
              <BasicTable.Cell key={id} columnId={id}>
                {item[id]}
              </BasicTable.Cell>
            ))}
          </BasicTable.Row>
        ))}
      </BasicTable.Body>
    </BasicTable.Root>
  );
  const grid = container.querySelector('[role="grid"]') as HTMLElement;
  const headers = Array.from(grid.querySelectorAll('[role="columnheader"]')) as HTMLElement[];
  const firstRow = grid.querySelector('[role="row"][aria-rowindex="2"]') as HTMLElement;
  const bodyCells = Array.from(firstRow.querySelectorAll('[role="gridcell"]')) as HTMLElement[];
  return { container, grid, headers, bodyCells };
}

const STICKY = styles['sticky-cell'];

describe('BasicTable sticky columns (#6)', () => {
  let layoutSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    layoutSpy = mockLayout();
  });
  afterEach(() => {
    layoutSpy.mockRestore();
  });

  test('stickyColumns={{ first: 1 }} pins the first column header and body cell (not the others)', () => {
    const { headers, bodyCells } = renderTable({ first: 1 });
    expect(headers).toHaveLength(4);

    expect(headers[0]).toHaveClass(STICKY);
    expect(bodyCells[0]).toHaveClass(STICKY);

    expect(headers[1]).not.toHaveClass(STICKY);
    expect(bodyCells[1]).not.toHaveClass(STICKY);
    expect(headers[3]).not.toHaveClass(STICKY);
  });

  test('stickyColumns={{ last: 1 }} pins the last column header and body cell (not the first)', () => {
    const { headers, bodyCells } = renderTable({ last: 1 });

    const lastIndex = headers.length - 1;
    expect(headers[lastIndex]).toHaveClass(STICKY);
    expect(bodyCells[bodyCells.length - 1]).toHaveClass(STICKY);

    expect(headers[0]).not.toHaveClass(STICKY);
    expect(bodyCells[0]).not.toHaveClass(STICKY);
  });

  test('no stickyColumns prop: no header or body cell is sticky (feature inert)', () => {
    const { headers, bodyCells } = renderTable();
    for (const cell of [...headers, ...bodyCells]) {
      expect(cell).not.toHaveClass(STICKY);
    }
  });

  test('smoke: setting stickyColumns does not change the rendered column/row structure', () => {
    const withSticky = renderTable({ first: 1, last: 1 });
    const withoutSticky = renderTable();

    expect(withSticky.headers).toHaveLength(4);
    expect(withoutSticky.headers).toHaveLength(4);

    const rows = withSticky.grid.querySelectorAll('[role="row"]');
    expect(rows.length).toBeGreaterThan(1); // header row + data rows
    expect(withSticky.bodyCells).toHaveLength(4);
  });
});
