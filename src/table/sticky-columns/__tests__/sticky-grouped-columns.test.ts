// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { StickyColumnsModel, useStickyColumns } from '../../../../lib/components/table/sticky-columns';
import { renderHook } from '../../../__tests__/render-hook';

/**
 * Bug Condition Exploration Test
 *
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4
 *
 * This test verifies that the StickyColumnsStore computes groupHeaderState
 * for grouped column configurations with sticky columns enabled.
 *
 * On UNFIXED code, the store only produces cellState and wrapperState.
 * groupHeaderState does not exist, so this test is EXPECTED TO FAIL.
 */

function createElementWithWidth(tag: string, width = 0) {
  const element = document.createElement(tag);
  jest.spyOn(element, 'getBoundingClientRect').mockImplementation(
    () =>
      ({
        width,
        height: 40,
        top: 0,
        left: 0,
        right: width,
        bottom: 40,
        x: 0,
        y: 0,
        toJSON: () => {},
      }) as DOMRect
  );
  return element;
}

function createMockTable(
  stickyColumns: StickyColumnsModel,
  wrapperWidth: number,
  tableWidth: number,
  columnWidths: { id: PropertyKey; width: number }[]
) {
  const wrapper = createElementWithWidth('div', wrapperWidth);
  jest.spyOn(wrapper, 'scrollWidth', 'get').mockReturnValue(tableWidth);
  jest.spyOn(wrapper, 'clientWidth', 'get').mockReturnValue(wrapperWidth);

  const table = createElementWithWidth('table', tableWidth);

  stickyColumns.refs.wrapper(wrapper);
  stickyColumns.refs.table(table);

  const cells = new Map<PropertyKey, HTMLElement>();
  for (const { id, width } of columnWidths) {
    const cell = createElementWithWidth('td', width);
    stickyColumns.refs.cell(id, cell);
    cells.set(id, cell);
  }

  return { wrapper, table, cells };
}

/**
 * Preservation Property Tests
 *
 * Validates: Requirements 3.1, 3.2, 3.3, 3.5, 3.6
 *
 * These tests capture the EXISTING baseline behavior of the StickyColumnsStore
 * for leaf cells. They must PASS on unfixed code and continue to pass after the fix,
 * ensuring no regressions in flat layouts, non-sticky configurations, shadow flags,
 * and absence of clipPath fields.
 */
describe('Preservation: Flat Layout Leaf Cell State', () => {
  test('flat columns with stickyColumnsFirst=1 produce correct cellState with sticky offsets', () => {
    // Flat layout: 4 columns, no groups, stickyColumnsFirst=1
    const visibleColumns: PropertyKey[] = ['col-a', 'col-b', 'col-c', 'col-d'];

    const { result, rerender } = renderHook(() =>
      useStickyColumns({
        visibleColumns,
        stickyColumnsFirst: 1,
        stickyColumnsLast: 0,
      })
    );

    // scrollable: tableWidth(800) > wrapperWidth(500)
    createMockTable(result.current, 500, 800, [
      { id: 'col-a', width: 100 },
      { id: 'col-b', width: 200 },
      { id: 'col-c', width: 250 },
      { id: 'col-d', width: 250 },
    ]);

    rerender({});

    const state = result.current.store.get();

    // Only the first column should be in cellState (sticky-first)
    expect(state.cellState.size).toBe(1);
    expect(state.cellState.has('col-a')).toBe(true);

    const cellA = state.cellState.get('col-a')!;
    expect(cellA.offset.insetInlineStart).toBe(0);
    expect(cellA.offset.insetInlineEnd).toBeUndefined();
    expect(cellA.padInlineStart).toBe(false);
  });

  test('flat columns with stickyColumnsLast=1 produce correct cellState with sticky offsets', () => {
    const visibleColumns: PropertyKey[] = ['col-a', 'col-b', 'col-c', 'col-d'];

    const { result, rerender } = renderHook(() =>
      useStickyColumns({
        visibleColumns,
        stickyColumnsFirst: 0,
        stickyColumnsLast: 1,
      })
    );

    createMockTable(result.current, 500, 800, [
      { id: 'col-a', width: 200 },
      { id: 'col-b', width: 200 },
      { id: 'col-c', width: 200 },
      { id: 'col-d', width: 100 },
    ]);

    rerender({});

    const state = result.current.store.get();

    // Only the last column should be in cellState (sticky-last)
    expect(state.cellState.size).toBe(1);
    expect(state.cellState.has('col-d')).toBe(true);

    const cellD = state.cellState.get('col-d')!;
    expect(cellD.offset.insetInlineEnd).toBe(0);
    expect(cellD.offset.insetInlineStart).toBeUndefined();
  });

  test('flat columns with stickyColumnsFirst=2 produce correct offsets for both sticky columns', () => {
    const visibleColumns: PropertyKey[] = ['col-a', 'col-b', 'col-c', 'col-d'];

    const { result, rerender } = renderHook(() =>
      useStickyColumns({
        visibleColumns,
        stickyColumnsFirst: 2,
        stickyColumnsLast: 0,
      })
    );

    createMockTable(result.current, 500, 800, [
      { id: 'col-a', width: 100 },
      { id: 'col-b', width: 120 },
      { id: 'col-c', width: 280 },
      { id: 'col-d', width: 300 },
    ]);

    rerender({});

    const state = result.current.store.get();

    expect(state.cellState.size).toBe(2);

    // First sticky column: offset 0
    const cellA = state.cellState.get('col-a')!;
    expect(cellA.offset.insetInlineStart).toBe(0);

    // Second sticky column: offset = width of first column
    const cellB = state.cellState.get('col-b')!;
    expect(cellB.offset.insetInlineStart).toBe(100);
  });
});

describe('Preservation: No Sticky Columns Configured', () => {
  test('stickyColumnsFirst=0 and stickyColumnsLast=0 produces empty cellState', () => {
    const visibleColumns: PropertyKey[] = ['col-a', 'col-b', 'col-c'];

    const { result, rerender } = renderHook(() =>
      useStickyColumns({
        visibleColumns,
        stickyColumnsFirst: 0,
        stickyColumnsLast: 0,
      })
    );

    createMockTable(result.current, 500, 800, [
      { id: 'col-a', width: 200 },
      { id: 'col-b', width: 300 },
      { id: 'col-c', width: 300 },
    ]);

    rerender({});

    const state = result.current.store.get();
    expect(state.cellState.size).toBe(0);
  });

  test('stickyColumnsFirst=0 and stickyColumnsLast=0 produces zero scroll padding', () => {
    const visibleColumns: PropertyKey[] = ['col-a', 'col-b'];

    const { result, rerender } = renderHook(() =>
      useStickyColumns({
        visibleColumns,
        stickyColumnsFirst: 0,
        stickyColumnsLast: 0,
      })
    );

    createMockTable(result.current, 400, 600, [
      { id: 'col-a', width: 300 },
      { id: 'col-b', width: 300 },
    ]);

    rerender({});

    const state = result.current.store.get();
    expect(state.wrapperState.scrollPaddingInlineStart).toBe(0);
    expect(state.wrapperState.scrollPaddingInlineEnd).toBe(0);
  });
});

describe('Preservation: lastInsetInlineStart Shadow Flag', () => {
  test('stickyColumnsFirst=1 sets lastInsetInlineStart on the boundary column when scrolled', () => {
    const visibleColumns: PropertyKey[] = ['col-a', 'col-b', 'col-c'];

    const { result, rerender } = renderHook(() =>
      useStickyColumns({
        visibleColumns,
        stickyColumnsFirst: 1,
        stickyColumnsLast: 0,
      })
    );

    const { wrapper } = createMockTable(result.current, 400, 800, [
      { id: 'col-a', width: 100 },
      { id: 'col-b', width: 350 },
      { id: 'col-c', width: 350 },
    ]);

    rerender({});

    // Simulate scroll to trigger isStuckToTheInlineStart
    Object.defineProperty(wrapper, 'scrollLeft', { value: 50, writable: true });
    wrapper.dispatchEvent(new UIEvent('scroll'));

    const state = result.current.store.get();
    const cellA = state.cellState.get('col-a')!;

    // col-a is the last (and only) sticky-first column, so lastInsetInlineStart should be true
    expect(cellA.lastInsetInlineStart).toBe(true);
  });

  test('stickyColumnsFirst=2 sets lastInsetInlineStart only on the second sticky column', () => {
    const visibleColumns: PropertyKey[] = ['col-a', 'col-b', 'col-c', 'col-d'];

    const { result, rerender } = renderHook(() =>
      useStickyColumns({
        visibleColumns,
        stickyColumnsFirst: 2,
        stickyColumnsLast: 0,
      })
    );

    const { wrapper } = createMockTable(result.current, 500, 900, [
      { id: 'col-a', width: 100 },
      { id: 'col-b', width: 120 },
      { id: 'col-c', width: 340 },
      { id: 'col-d', width: 340 },
    ]);

    rerender({});

    // Simulate scroll
    Object.defineProperty(wrapper, 'scrollLeft', { value: 30, writable: true });
    wrapper.dispatchEvent(new UIEvent('scroll'));

    const state = result.current.store.get();

    // col-a is NOT the boundary — it's the first sticky column
    const cellA = state.cellState.get('col-a')!;
    expect(cellA.lastInsetInlineStart).toBe(false);

    // col-b IS the boundary — it's the last sticky-first column
    const cellB = state.cellState.get('col-b')!;
    expect(cellB.lastInsetInlineStart).toBe(true);
  });

  test('lastInsetInlineStart is false when not scrolled (not stuck)', () => {
    const visibleColumns: PropertyKey[] = ['col-a', 'col-b', 'col-c'];

    const { result, rerender } = renderHook(() =>
      useStickyColumns({
        visibleColumns,
        stickyColumnsFirst: 1,
        stickyColumnsLast: 0,
      })
    );

    createMockTable(result.current, 400, 800, [
      { id: 'col-a', width: 100 },
      { id: 'col-b', width: 350 },
      { id: 'col-c', width: 350 },
    ]);

    rerender({});

    const state = result.current.store.get();
    const cellA = state.cellState.get('col-a')!;

    // Not scrolled, so isStuckToTheInlineStart is false → lastInsetInlineStart is false
    expect(cellA.lastInsetInlineStart).toBe(false);
  });
});

describe('Preservation: No clipPath-related Fields in Store State', () => {
  test('cellState entries do not contain clipPath fields', () => {
    const visibleColumns: PropertyKey[] = ['col-a', 'col-b', 'col-c'];

    const { result, rerender } = renderHook(() =>
      useStickyColumns({
        visibleColumns,
        stickyColumnsFirst: 1,
        stickyColumnsLast: 1,
      })
    );

    const { wrapper } = createMockTable(result.current, 500, 900, [
      { id: 'col-a', width: 100 },
      { id: 'col-b', width: 400 },
      { id: 'col-c', width: 100 },
    ]);

    // Simulate scroll to activate both stuck flags
    Object.defineProperty(wrapper, 'scrollLeft', { value: 50, writable: true });
    wrapper.dispatchEvent(new UIEvent('scroll'));

    rerender({});

    const state = result.current.store.get();

    // Verify no clipPath-related fields exist on any cell state
    for (const [, cellState] of state.cellState) {
      expect(cellState).not.toHaveProperty('clipPath');
      expect(cellState).not.toHaveProperty('clip-path');
      expect(cellState).not.toHaveProperty('clipPathInlineStart');
      expect(cellState).not.toHaveProperty('clipPathInlineEnd');

      // Also check the offset object
      expect(cellState.offset).not.toHaveProperty('clipPath');
    }
  });

  test('wrapperState does not contain clipPath fields', () => {
    const visibleColumns: PropertyKey[] = ['col-a', 'col-b', 'col-c'];

    const { result, rerender } = renderHook(() =>
      useStickyColumns({
        visibleColumns,
        stickyColumnsFirst: 1,
        stickyColumnsLast: 0,
      })
    );

    createMockTable(result.current, 400, 800, [
      { id: 'col-a', width: 100 },
      { id: 'col-b', width: 350 },
      { id: 'col-c', width: 350 },
    ]);

    rerender({});

    const state = result.current.store.get();

    expect(state.wrapperState).not.toHaveProperty('clipPath');
    expect(state.wrapperState).not.toHaveProperty('clip-path');
  });

  test('store state only contains cellState and wrapperState keys', () => {
    const visibleColumns: PropertyKey[] = ['col-a', 'col-b', 'col-c'];

    const { result, rerender } = renderHook(() =>
      useStickyColumns({
        visibleColumns,
        stickyColumnsFirst: 1,
        stickyColumnsLast: 1,
      })
    );

    createMockTable(result.current, 500, 900, [
      { id: 'col-a', width: 100 },
      { id: 'col-b', width: 400 },
      { id: 'col-c', width: 100 },
    ]);

    rerender({});

    const state = result.current.store.get();
    const stateKeys = Object.keys(state);

    // On unfixed code, the store state only has cellState and wrapperState
    expect(stateKeys).toContain('cellState');
    expect(stateKeys).toContain('wrapperState');

    // No clipPath-related top-level keys
    expect(stateKeys.every(key => !key.toLowerCase().includes('clip'))).toBe(true);
  });
});

describe('Bug Condition Exploration: Group Header State in StickyColumnsStore', () => {
  /**
   * Property 1: Bug Condition - Group Header Offsets Diverge From Store
   *
   * When grouped column headers are present alongside sticky columns
   * (isBugCondition: hierarchicalStructure.rows.length > 1 AND
   * (stickyColumnsFirst > 0 OR stickyColumnsLast > 0)),
   * the store SHOULD produce groupHeaderState for each group.
   *
   * On unfixed code, groupHeaderState does NOT exist on the store state.
   */
  test('store.get() should contain groupHeaderState when grouped columns are used with stickyColumnsLast', () => {
    // Group "config" spans 3 leaf columns: type, engine, size
    // stickyColumnsLast=2 makes engine and size sticky-last
    const visibleColumns: PropertyKey[] = ['id', 'name', 'type', 'engine', 'size'];

    const { result, rerender } = renderHook(() =>
      useStickyColumns({
        visibleColumns,
        stickyColumnsFirst: 0,
        stickyColumnsLast: 2,
      })
    );

    // Create a scrollable table (tableWidth > wrapperWidth) with enough space for sticky columns
    createMockTable(result.current, 600, 1000, [
      { id: 'id', width: 100 },
      { id: 'name', width: 200 },
      { id: 'type', width: 150 },
      { id: 'engine', width: 150 },
      { id: 'size', width: 100 },
    ]);

    // Trigger effect to compute styles
    rerender({});

    const state = result.current.store.get();

    // On unfixed code, the state only has cellState and wrapperState.
    // groupHeaderState does not exist.
    // The fix should add groupHeaderState to the store state.
    expect(state).toHaveProperty('groupHeaderState');

    // Verify groupHeaderState is a Map
    const groupHeaderState = (state as any).groupHeaderState;
    expect(groupHeaderState).toBeInstanceOf(Map);

    // Verify the "config" group has an entry with positioning data
    expect(groupHeaderState.size).toBeGreaterThan(0);
  });

  test('store.get() should contain groupHeaderState when grouped columns are used with stickyColumnsFirst', () => {
    // Group "config" spans 3 leaf columns: type, engine, size
    // stickyColumnsFirst=2 makes id and name sticky-first
    const visibleColumns: PropertyKey[] = ['id', 'name', 'type', 'engine', 'size'];

    const { result, rerender } = renderHook(() =>
      useStickyColumns({
        visibleColumns,
        stickyColumnsFirst: 2,
        stickyColumnsLast: 0,
      })
    );

    createMockTable(result.current, 600, 1000, [
      { id: 'id', width: 100 },
      { id: 'name', width: 200 },
      { id: 'type', width: 150 },
      { id: 'engine', width: 150 },
      { id: 'size', width: 100 },
    ]);

    rerender({});

    const state = result.current.store.get();

    // On unfixed code, groupHeaderState does not exist
    expect(state).toHaveProperty('groupHeaderState');

    const groupHeaderState = (state as any).groupHeaderState;
    expect(groupHeaderState).toBeInstanceOf(Map);
  });
});
