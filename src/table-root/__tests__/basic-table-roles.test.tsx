// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import TableBody from '../../../lib/components/table-body';
import TableCell from '../../../lib/components/table-cell';
import TableHead from '../../../lib/components/table-head';
import TableHeaderCell from '../../../lib/components/table-header-cell';
import TableHeaderRow from '../../../lib/components/table-header-row';
import TableRoot, { TableRootProps } from '../../../lib/components/table-root';
import TableRow from '../../../lib/components/table-row';
import createWrapper from '../../../lib/components/test-utils/dom';

// Role semantics for the atomic table. In `auto` layout the parts are native
// <table>/<thead>/<tr>/<th>/<tbody>/<td>, so the browser supplies the table semantics and no explicit
// ARIA roles are emitted. In `grid` layout the parts are laid out with display:grid, which strips the
// native table semantics, so the hook restores role=table -> rowgroup -> row -> columnheader/cell.
// Grid keyboard navigation is not part of the component (composed by the consumer), so there is no
// roving tabindex.

interface Item {
  id: string;
  name: string;
  status: string;
}

const makeItems = (n: number): Item[] =>
  Array.from({ length: n }, (_, i) => ({ id: `row-${i}`, name: `Resource ${i}`, status: i % 2 === 0 ? 'Up' : 'Down' }));

const GRID_COLUMNS: ReadonlyArray<TableRootProps.ColumnDefinition> = [{ size: 200 }, {}];

function LogTable({ items, grid }: { items: Item[]; grid?: boolean }) {
  const columnLayout: TableRootProps.ColumnLayout = grid ? { type: 'grid', columns: GRID_COLUMNS } : { type: 'auto' };
  return (
    <TableRoot columnLayout={columnLayout} ariaLabel="Log events">
      <TableHead>
        <TableHeaderRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
        </TableHeaderRow>
      </TableHead>
      <TableBody>
        {items.map(item => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </TableRoot>
  );
}

function renderTable(items: Item[], grid?: boolean) {
  const { container } = render(<LogTable items={items} grid={grid} />);
  const wrapper = createWrapper(container);
  return { container, wrapper, table: () => wrapper.find('table')!.getElement() };
}

describe('Table role semantics', () => {
  describe('auto layout uses native table semantics (no explicit roles)', () => {
    test('the table, rows, and cells carry no ARIA role attributes', () => {
      const { table } = renderTable(makeItems(20));
      expect(table().hasAttribute('role')).toBe(false);
      expect(table().querySelectorAll('[role]')).toHaveLength(0);
    });
  });

  describe('grid layout restores a coherent table accessibility tree', () => {
    test('collapses to one role=table -> rowgroup -> row -> columnheader/cell tree', () => {
      const { table } = renderTable(makeItems(20), true);
      const grid = table();
      expect(grid.getAttribute('role')).toBe('table');

      const rowGroups = Array.from(grid.children).filter(child => child.getAttribute('role') === 'rowgroup');
      expect(rowGroups.length).toBeGreaterThanOrEqual(2);

      grid.querySelectorAll('[role="row"]').forEach(row => {
        expect(row.closest('[role="rowgroup"]')).not.toBeNull();
      });
      grid.querySelectorAll('[role="columnheader"], [role="cell"]').forEach(cell => {
        expect(cell.closest('[role="row"]')).not.toBeNull();
      });
    });

    test('column headers are <th role="columnheader" scope="col">', () => {
      const { wrapper } = renderTable(makeItems(20), true);
      const th = wrapper.findAllTableHeaderCells()[0].getElement();
      expect(th.tagName).toBe('TH');
      expect(th.getAttribute('role')).toBe('columnheader');
      expect(th.getAttribute('scope')).toBe('col');
    });

    test('the container is not a tab stop and declares no roving active descendant', () => {
      const { table } = renderTable(makeItems(20), true);
      const grid = table();
      // No grid keyboard-navigation subsystem: the table is not focusable and manages no tabindex.
      expect(grid.hasAttribute('tabindex')).toBe(false);
      expect(grid.hasAttribute('aria-activedescendant')).toBe(false);
      expect(grid.querySelectorAll('[tabindex]')).toHaveLength(0);
    });
  });
});
