// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { findTable, makeItems, renderResourcesTable, ResourcesTable } from './table-fixtures';

// Role semantics for the atomic table. In `auto` layout the parts are native
// <table>/<thead>/<tr>/<th>/<tbody>/<td>, so the browser supplies the table semantics and no explicit
// ARIA roles are emitted. In `grid` layout the parts are laid out with display:grid, which strips the
// native table semantics, so the hook restores role=table -> rowgroup -> row -> columnheader/cell.

describe('Table role semantics', () => {
  describe('auto layout uses native table semantics (no explicit roles)', () => {
    test('the table, rows, and cells carry no ARIA role attributes', () => {
      const { wrapper } = renderResourcesTable({ items: makeItems(20) });
      const table = findTable(wrapper);
      expect(table.hasAttribute('role')).toBe(false);
      expect(table.querySelectorAll('[role]')).toHaveLength(0);
    });
  });

  describe('grid layout restores a coherent table accessibility tree', () => {
    test('collapses to one role=table -> rowgroup -> row -> columnheader/cell tree', () => {
      const { wrapper } = renderResourcesTable({ items: makeItems(20), grid: true });
      const table = findTable(wrapper);
      expect(table.getAttribute('role')).toBe('table');

      expect(wrapper.findTableHead()!.getElement().getAttribute('role')).toBe('rowgroup');
      expect(wrapper.findTableBody()!.getElement().getAttribute('role')).toBe('rowgroup');

      table.querySelectorAll('[role="row"]').forEach(row => {
        expect(row.closest('[role="rowgroup"]')).not.toBeNull();
      });
      table.querySelectorAll('[role="columnheader"], [role="cell"]').forEach(cell => {
        expect(cell.closest('[role="row"]')).not.toBeNull();
      });
    });

    test('column headers are <th role="columnheader" scope="col">', () => {
      const { wrapper } = renderResourcesTable({ items: makeItems(20), grid: true });
      const th = wrapper.findAllTableHeaderCells()[0].getElement();
      expect(th.tagName).toBe('TH');
      expect(th.getAttribute('role')).toBe('columnheader');
      expect(th.getAttribute('scope')).toBe('col');
    });
  });
});

describe('horizontal-overflow scroll region', () => {
  const setScrollerGeometry = (scroller: Element, scrollWidth: number, clientWidth: number) => {
    Object.defineProperty(scroller, 'scrollWidth', { configurable: true, value: scrollWidth });
    Object.defineProperty(scroller, 'clientWidth', { configurable: true, value: clientWidth });
  };

  test('exposes a focusable labeled region only while the content overflows', () => {
    const { wrapper, rerender } = renderResourcesTable({ grid: true, columns: [{ size: 200 }], items: makeItems(1) });
    const scroller = findTable(wrapper).parentElement!; // body-scroller

    expect(scroller.hasAttribute('role')).toBe(false);
    expect(scroller.hasAttribute('tabindex')).toBe(false);

    // A grid-template change flips overflow while the table's box stays 100% wide, so no ResizeObserver
    // fires — the re-measure effect is the only trigger. jsdom has no layout, so simulate the geometry.
    setScrollerGeometry(scroller, 1200, 400);
    rerender(<ResourcesTable grid={true} columns={[{ size: 1200 }]} items={makeItems(1)} />);
    expect(scroller.getAttribute('role')).toBe('region');
    expect(scroller.getAttribute('tabindex')).toBe('0');
    expect(scroller.getAttribute('aria-label')).toBe('Resources');

    setScrollerGeometry(scroller, 400, 400);
    rerender(<ResourcesTable grid={true} columns={[{ size: 200 }]} items={makeItems(1)} />);
    expect(scroller.hasAttribute('role')).toBe(false);
    expect(scroller.hasAttribute('tabindex')).toBe(false);
  });
});
