// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { act, renderHook } from '../../__tests__/render-hook';
import { VirtualGridColumn } from '../interfaces';
import { useVirtualGrid } from '../use-virtual-grid';

// The distinctive F3-A2 layer: a headless data-grid CORE (`useVirtualGrid`) that returns plain
// props objects for a consumer (the compound skin, a future styled-default skin, or a bare-core
// consumer) to spread onto its own DOM. This suite pins the core SEAM contract directly at the
// hook boundary — the aria-colindex accounting incl. the materialised disclosure column, the
// full-dataset aria-rowcount/aria-rowindex, the header sort wiring (reflect-not-sort), the
// controlled/uncontrolled expansion + the valid grid-child expanded model, and the windowed row
// set + full-dataset getRowContext. jsdom has no layout and the hook test never spreads
// `gridProps` onto a real element, so the core's scroll container stays null and the windowing
// engine falls back to a 600px viewport (matching use-virtual-model.test). Axe / keyboard / SR
// behaviour is covered in impl-F3-A2-tests-a11y.

interface Row {
  id: string;
  name: string;
}
const trackBy = (r: Row) => r.id;
const makeItems = (n: number): Row[] => Array.from({ length: n }, (_, i) => ({ id: `row-${i}`, name: `R${i}` }));
const columns: ReadonlyArray<VirtualGridColumn> = [{ columnId: 'name', sortable: true }, { columnId: 'status' }];

describe('VirtualTable (F3-A2 headless core) useVirtualGrid', () => {
  test('gridProps carry full-dataset grid semantics and a callback ref', () => {
    const items = makeItems(10);
    const { result } = renderHook(() => useVirtualGrid<Row>({ items, trackBy, columns, ariaLabel: 'Resources' }));
    const g = result.current.gridProps;
    expect(g.role).toBe('grid');
    expect(g.tabIndex).toBe(0);
    // Header row counted once: aria-rowcount = items.length + 1.
    expect(g['aria-rowcount']).toBe(11);
    // No expandable rows -> no disclosure column -> two data columns.
    expect(g['aria-colcount']).toBe(2);
    expect(g['aria-label']).toBe('Resources');
    // A callback ref, spreadable onto any element a bare-core consumer picks.
    expect(typeof g.ref).toBe('function');
  });

  test('header props expose per-column aria-colindex and aria-sort only for sortable columns', () => {
    const items = makeItems(10);
    const { result } = renderHook(() => useVirtualGrid<Row>({ items, trackBy, columns }));
    const h = result.current.headerProps;
    expect(h.rowProps.role).toBe('row');
    expect(h.rowProps['aria-rowindex']).toBe(1);
    // No disclosure column -> data columns start at aria-colindex 1.
    expect(h.cellProps('name')['aria-colindex']).toBe(1);
    expect(h.cellProps('status')['aria-colindex']).toBe(2);
    expect(h.disclosureHeaderProps).toBeUndefined();
    // Sortable column reports aria-sort 'none' (inactive) + a keyboard-operable sort trigger;
    // a non-sortable column reports neither.
    expect(h.cellProps('name')['aria-sort']).toBe('none');
    expect(h.cellProps('status')['aria-sort']).toBeUndefined();
    expect(h.sortButtonProps('name')).not.toBeNull();
    expect(h.sortButtonProps('status')).toBeNull();
  });

  test('materialises a counted leading disclosure column when hasExpandableRows', () => {
    const items = makeItems(10);
    const { result } = renderHook(() => useVirtualGrid<Row>({ items, trackBy, columns, hasExpandableRows: true }));
    // Disclosure column is counted at aria-colindex 1, so data columns start at 2 in BOTH the
    // header and every body row (header<->body indexing never diverges).
    expect(result.current.gridProps['aria-colcount']).toBe(3);
    expect(result.current.headerProps.disclosureHeaderProps?.['aria-colindex']).toBe(1);
    expect(result.current.headerProps.cellProps('name')['aria-colindex']).toBe(2);
    const row0 = result.current.rows[0];
    expect(row0.disclosure).not.toBeNull();
    expect(row0.disclosure!.cellProps['aria-colindex']).toBe(1);
    expect(row0.disclosure!.buttonProps['aria-expanded']).toBe(false);
    expect(row0.cellProps('name')['aria-colindex']).toBe(2);
  });

  test('emits only the windowed rows with full-dataset aria-rowindex', () => {
    const items = makeItems(500);
    const { result } = renderHook(() =>
      useVirtualGrid<Row>({ items, trackBy, columns, estimatedRowHeight: 20, overscan: 5 })
    );
    expect(result.current.rows.length).toBeGreaterThan(0);
    expect(result.current.rows.length).toBeLessThan(500);
    const row0 = result.current.rows[0];
    expect(row0.key).toBe('row-0');
    expect(row0.rowProps.role).toBe('row');
    // Full dataset index (0) offset by the header row -> aria-rowindex 2.
    expect(row0.rowProps['aria-rowindex']).toBe(2);
    expect(row0.disclosure).toBeNull(); // no expandable rows
  });

  test('getRowContext returns full-dataset row-relative info, never the window slice', () => {
    const items = makeItems(500);
    const { result } = renderHook(() =>
      useVirtualGrid<Row>({ items, trackBy, columns, estimatedRowHeight: 20, overscan: 5 })
    );
    // row-100 is outside the window, yet its context reports the true dataset position/size.
    expect(result.current.getRowContext('row-100')).toEqual({
      rowIndex: 101,
      totalItemCount: 500,
      isExpanded: false,
    });
  });

  test('fires onVisibleRangeChange with the windowed range on mount', () => {
    const items = makeItems(500);
    const onVisibleRangeChange = jest.fn();
    renderHook(() =>
      useVirtualGrid<Row>({ items, trackBy, columns, estimatedRowHeight: 20, overscan: 5, onVisibleRangeChange })
    );
    expect(onVisibleRangeChange).toHaveBeenCalledWith({ firstIndex: 0, lastIndex: 35 });
  });

  test('uncontrolled disclosure toggle expands the row, fires onExpandChange, and builds the valid grid-child model', () => {
    const items = makeItems(10);
    const onExpandChange = jest.fn();
    const { result } = renderHook(() =>
      useVirtualGrid<Row>({ items, trackBy, columns, hasExpandableRows: true, onExpandChange })
    );
    expect(result.current.rows[0].disclosure!.isExpanded).toBe(false);
    expect(result.current.rows[0].expandedRowProps).toBeUndefined();

    act(() => result.current.rows[0].disclosure!.buttonProps.onClick!({} as never));

    // Core emits a plain (unwrapped) detail; the skin wraps it in a NonCancelable event.
    expect(onExpandChange).toHaveBeenCalledWith(expect.objectContaining({ expanded: true, expandedItems: ['row-0'] }));
    const row0 = result.current.rows[0];
    expect(row0.disclosure!.isExpanded).toBe(true);
    expect(result.current.getRowContext('row-0').isExpanded).toBe(true);
    // Valid grid child model: real role=row -> full-width role=gridcell (aria-colspan over all
    // columns incl. disclosure) -> labeled role=region.
    expect(row0.expandedRowProps?.role).toBe('row');
    expect(row0.expandedGridcellProps?.role).toBe('gridcell');
    expect(row0.expandedGridcellProps?.['aria-colspan']).toBe(3);
    expect(row0.expandedRegionProps?.role).toBe('region');
    // Disclosure trigger now points at the mounted region.
    expect(row0.disclosure!.buttonProps['aria-controls']).toBeDefined();
  });

  test('controlled expansion opens only the given row (collapsed rows carry no expanded model)', () => {
    const items = makeItems(20);
    const { result } = renderHook(() =>
      useVirtualGrid<Row>({ items, trackBy, columns, hasExpandableRows: true, expandedItems: ['row-2'] })
    );
    const expanded = result.current.rows.find(r => r.key === 'row-2')!;
    expect(expanded.disclosure!.isExpanded).toBe(true);
    expect(expanded.expandedRegionProps?.role).toBe('region');
    expect(expanded.disclosure!.buttonProps['aria-controls']).toBeDefined();

    const collapsed = result.current.rows.find(r => r.key === 'row-0')!;
    expect(collapsed.disclosure!.isExpanded).toBe(false);
    expect(collapsed.expandedRowProps).toBeUndefined();
    expect(collapsed.disclosure!.buttonProps['aria-controls']).toBeUndefined();
  });

  describe('sort reflection (reflect-not-sort)', () => {
    test('reflects the active column via aria-sort and toggles direction on activation', () => {
      const items = makeItems(5);
      const onSortingChange = jest.fn();
      const { result } = renderHook(() =>
        useVirtualGrid<Row>({
          items,
          trackBy,
          columns,
          sortingColumn: { columnId: 'name' },
          sortingDescending: false,
          onSortingChange,
          activateSortLabel: id => `Sort by ${id}`,
        })
      );
      expect(result.current.headerProps.cellProps('name')['aria-sort']).toBe('ascending');
      const button = result.current.headerProps.sortButtonProps('name')!;
      expect(button['aria-label']).toBe('Sort by name');

      act(() => button.onClick!({} as never));
      // Active + ascending -> activation toggles to descending; the core emits intent only.
      expect(onSortingChange).toHaveBeenCalledWith({ columnId: 'name', sortingDescending: true });
    });

    test('a sortable but inactive column reports aria-sort none and starts ascending on activation', () => {
      const items = makeItems(5);
      const onSortingChange = jest.fn();
      const { result } = renderHook(() =>
        useVirtualGrid<Row>({ items, trackBy, columns, onSortingChange, activateSortLabel: id => `Sort by ${id}` })
      );
      expect(result.current.headerProps.cellProps('name')['aria-sort']).toBe('none');
      act(() => result.current.headerProps.sortButtonProps('name')!.onClick!({} as never));
      expect(onSortingChange).toHaveBeenCalledWith({ columnId: 'name', sortingDescending: false });
    });
  });

  test('exposes the live-append surface (polite region + announce)', () => {
    const items = makeItems(10);
    const { result } = renderHook(() => useVirtualGrid<Row>({ items, trackBy, columns }));
    expect(result.current.liveRegionProps['aria-live']).toBe('polite');
    expect(typeof result.current.announceAppend).toBe('function');
  });
});
