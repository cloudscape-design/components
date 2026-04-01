// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import fc from 'fast-check';

import { useStickyColumns } from '../../../../lib/components/table/sticky-columns';
import { renderHook } from '../../../__tests__/render-hook';

/**
 * Preservation Property Tests (Property-Based)
 *
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6
 *
 * These property-based tests capture the EXISTING baseline behavior of the
 * StickyColumnsStore for flat (non-grouped) column layouts. They must PASS
 * on unfixed code and continue to pass after the fix, ensuring no regressions.
 *
 * Observation-first methodology:
 * - Flat layouts produce cellState entries only for sticky columns
 * - Non-sticky configs (first=0, last=0) produce empty cellState
 * - lastInsetInlineStart is set on the boundary column (index = stickyColumnsFirst - 1)
 * - The store state never contains clipPath-related fields
 * - groupHeaderState does not exist on unfixed code (only cellState + wrapperState)
 */

// Minimum scrollable space constant from the store implementation
const MINIMUM_SCROLLABLE_SPACE = 148;

function createElementWithWidth(tag: string, width: number) {
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

function setupStore(config: {
  visibleColumns: PropertyKey[];
  stickyColumnsFirst: number;
  stickyColumnsLast: number;
  columnWidths: number[];
  wrapperWidth: number;
  tableWidth: number;
  scrollLeft?: number;
}) {
  // Spread visibleColumns to create a new array reference on each render,
  // ensuring the useEffect in useStickyColumns fires after refs are set.
  const { result, rerender } = renderHook(() =>
    useStickyColumns({
      visibleColumns: [...config.visibleColumns],
      stickyColumnsFirst: config.stickyColumnsFirst,
      stickyColumnsLast: config.stickyColumnsLast,
    })
  );

  const wrapper = createElementWithWidth('div', config.wrapperWidth);
  jest.spyOn(wrapper, 'scrollWidth', 'get').mockReturnValue(config.tableWidth);
  jest.spyOn(wrapper, 'clientWidth', 'get').mockReturnValue(config.wrapperWidth);

  const table = createElementWithWidth('table', config.tableWidth);

  result.current.refs.wrapper(wrapper);
  result.current.refs.table(table);

  for (let i = 0; i < config.visibleColumns.length; i++) {
    const cell = createElementWithWidth('td', config.columnWidths[i]);
    result.current.refs.cell(config.visibleColumns[i], cell);
  }

  rerender({});

  if (config.scrollLeft !== undefined && config.scrollLeft > 0) {
    Object.defineProperty(wrapper, 'scrollLeft', { value: config.scrollLeft, writable: true });
    wrapper.dispatchEvent(new UIEvent('scroll'));
  }

  return result.current;
}

/**
 * Arbitrary: generates a flat column configuration (no groups) with
 * random column count, widths, and sticky column counts.
 * Ensures the table is scrollable and has enough space for sticky columns.
 */
function flatColumnConfigArb() {
  return fc
    .record({
      numColumns: fc.integer({ min: 2, max: 10 }),
      columnWidth: fc.integer({ min: 50, max: 200 }),
    })
    .chain(({ numColumns, columnWidth }) => {
      const totalTableWidth = numColumns * columnWidth;
      // Wrapper must be smaller than table for scrollability
      const maxWrapperWidth = totalTableWidth - 1;

      return fc.record({
        numColumns: fc.constant(numColumns),
        columnWidths: fc.array(fc.integer({ min: 30, max: 200 }), {
          minLength: numColumns,
          maxLength: numColumns,
        }),
        stickyColumnsFirst: fc.integer({ min: 0, max: Math.max(0, numColumns - 1) }),
        stickyColumnsLast: fc.integer({ min: 0, max: Math.max(0, numColumns - 1) }),
        wrapperWidth: fc.integer({
          min: MINIMUM_SCROLLABLE_SPACE + 100,
          max: Math.max(MINIMUM_SCROLLABLE_SPACE + 100, maxWrapperWidth),
        }),
      });
    })
    .filter(config => {
      // Ensure total sticky columns don't exceed total columns
      if (config.stickyColumnsFirst + config.stickyColumnsLast > config.numColumns) {
        return false;
      }
      const tableWidth = config.columnWidths.reduce((sum, w) => sum + w, 0);
      // Ensure table is scrollable
      if (tableWidth <= config.wrapperWidth) {
        return false;
      }
      // Ensure enough scrollable space
      const stickyFirstWidth = config.columnWidths.slice(0, config.stickyColumnsFirst).reduce((sum, w) => sum + w, 0);
      const stickyLastWidth = config.columnWidths
        .slice(config.numColumns - config.stickyColumnsLast)
        .reduce((sum, w) => sum + w, 0);
      const totalStickyWidth = stickyFirstWidth + stickyLastWidth;
      if (totalStickyWidth + MINIMUM_SCROLLABLE_SPACE >= config.wrapperWidth) {
        return false;
      }
      return true;
    });
}

/**
 * Property 2.1: Flat Layout Leaf Cell State - Sticky Column Count
 *
 * For all flat column configurations (no groupHierarchy), the store produces
 * cellState entries only for sticky columns. The number of entries equals
 * stickyColumnsFirst + stickyColumnsLast.
 *
 * **Validates: Requirements 3.1**
 */
describe('PBT Preservation: Flat Layout Leaf Cell State', () => {
  test('flat columns produce cellState with exactly stickyColumnsFirst + stickyColumnsLast entries', () => {
    fc.assert(
      fc.property(flatColumnConfigArb(), config => {
        const visibleColumns = Array.from({ length: config.numColumns }, (_, i) => `col-${i}`);
        const tableWidth = config.columnWidths.reduce((sum, w) => sum + w, 0);

        const store = setupStore({
          visibleColumns,
          stickyColumnsFirst: config.stickyColumnsFirst,
          stickyColumnsLast: config.stickyColumnsLast,
          columnWidths: config.columnWidths,
          wrapperWidth: config.wrapperWidth,
          tableWidth,
        });

        const state = store.store.get();
        const expectedStickyCount = config.stickyColumnsFirst + config.stickyColumnsLast;

        expect(state.cellState.size).toBe(expectedStickyCount);

        // Verify sticky-first columns are in cellState with insetInlineStart
        for (let i = 0; i < config.stickyColumnsFirst; i++) {
          const cellState = state.cellState.get(`col-${i}`);
          expect(cellState).toBeDefined();
          expect(cellState!.offset.insetInlineStart).toBeDefined();
          expect(cellState!.offset.insetInlineEnd).toBeUndefined();
        }

        // Verify sticky-last columns are in cellState with insetInlineEnd
        for (let i = 0; i < config.stickyColumnsLast; i++) {
          const colIndex = config.numColumns - 1 - i;
          const cellState = state.cellState.get(`col-${colIndex}`);
          expect(cellState).toBeDefined();
          expect(cellState!.offset.insetInlineEnd).toBeDefined();
          expect(cellState!.offset.insetInlineStart).toBeUndefined();
        }

        // Verify non-sticky columns are NOT in cellState
        for (let i = config.stickyColumnsFirst; i < config.numColumns - config.stickyColumnsLast; i++) {
          expect(state.cellState.has(`col-${i}`)).toBe(false);
        }
      }),
      { numRuns: 50 }
    );
  });

  /**
   * Property 2.2: Flat Layout - Sticky-First Offsets Are Cumulative
   *
   * For all flat column configurations, sticky-first column offsets are
   * cumulative sums of preceding column widths.
   *
   * **Validates: Requirements 3.1, 3.6**
   */
  test('sticky-first column offsets are cumulative sums of preceding column widths', () => {
    fc.assert(
      fc.property(
        flatColumnConfigArb().filter(c => c.stickyColumnsFirst >= 1),
        config => {
          const visibleColumns = Array.from({ length: config.numColumns }, (_, i) => `col-${i}`);
          const tableWidth = config.columnWidths.reduce((sum, w) => sum + w, 0);

          const store = setupStore({
            visibleColumns,
            stickyColumnsFirst: config.stickyColumnsFirst,
            stickyColumnsLast: config.stickyColumnsLast,
            columnWidths: config.columnWidths,
            wrapperWidth: config.wrapperWidth,
            tableWidth,
          });

          const state = store.store.get();

          // First sticky column always has offset 0
          const firstCell = state.cellState.get('col-0');
          expect(firstCell!.offset.insetInlineStart).toBe(0);

          // Subsequent sticky-first columns have cumulative offsets
          let cumulativeWidth = 0;
          for (let i = 0; i < config.stickyColumnsFirst; i++) {
            const cellState = state.cellState.get(`col-${i}`);
            expect(cellState!.offset.insetInlineStart).toBe(cumulativeWidth);
            cumulativeWidth += config.columnWidths[i];
          }
        }
      ),
      { numRuns: 50 }
    );
  });
});

/**
 * Property 2.3: No Sticky Columns - Empty cellState
 *
 * For all configurations with stickyColumnsFirst=0 AND stickyColumnsLast=0,
 * the cellState map is empty and groupHeaderState is absent (on unfixed code).
 *
 * **Validates: Requirements 3.2**
 */
describe('PBT Preservation: No Sticky Columns Configured', () => {
  test('stickyColumnsFirst=0 and stickyColumnsLast=0 always produces empty cellState', () => {
    fc.assert(
      fc.property(
        fc.record({
          numColumns: fc.integer({ min: 2, max: 8 }),
          columnWidth: fc.integer({ min: 50, max: 200 }),
        }),
        ({ numColumns, columnWidth }) => {
          const visibleColumns = Array.from({ length: numColumns }, (_, i) => `col-${i}`);
          const columnWidths = Array.from({ length: numColumns }, () => columnWidth);
          const tableWidth = columnWidths.reduce((sum, w) => sum + w, 0);
          const wrapperWidth = Math.max(MINIMUM_SCROLLABLE_SPACE + 100, tableWidth + 100);

          const store = setupStore({
            visibleColumns,
            stickyColumnsFirst: 0,
            stickyColumnsLast: 0,
            columnWidths,
            wrapperWidth,
            tableWidth,
          });

          const state = store.store.get();

          // cellState should be empty when no sticky columns
          expect(state.cellState.size).toBe(0);

          // groupHeaderState should not exist on unfixed code
          // After fix, it should be empty (Map with size 0) or absent
          const groupHeaderState = (state as any).groupHeaderState;
          if (groupHeaderState !== undefined) {
            // If it exists (after fix), it should be empty
            expect(groupHeaderState.size).toBe(0);
          }
        }
      ),
      { numRuns: 30 }
    );
  });

  test('stickyColumnsFirst=0 and stickyColumnsLast=0 always produces zero scroll padding', () => {
    fc.assert(
      fc.property(
        fc.record({
          numColumns: fc.integer({ min: 2, max: 8 }),
          columnWidth: fc.integer({ min: 50, max: 200 }),
        }),
        ({ numColumns, columnWidth }) => {
          const visibleColumns = Array.from({ length: numColumns }, (_, i) => `col-${i}`);
          const columnWidths = Array.from({ length: numColumns }, () => columnWidth);
          const tableWidth = columnWidths.reduce((sum, w) => sum + w, 0);
          const wrapperWidth = Math.max(MINIMUM_SCROLLABLE_SPACE + 100, tableWidth + 100);

          const store = setupStore({
            visibleColumns,
            stickyColumnsFirst: 0,
            stickyColumnsLast: 0,
            columnWidths,
            wrapperWidth,
            tableWidth,
          });

          const state = store.store.get();
          expect(state.wrapperState.scrollPaddingInlineStart).toBe(0);
          expect(state.wrapperState.scrollPaddingInlineEnd).toBe(0);
        }
      ),
      { numRuns: 30 }
    );
  });
});

/**
 * Property 2.4: lastInsetInlineStart Shadow Flag on Boundary Column
 *
 * For all configurations with stickyColumnsFirst > 0 and the table scrolled,
 * lastInsetInlineStart is true ONLY on the boundary column (index = stickyColumnsFirst - 1).
 *
 * **Validates: Requirements 3.3**
 */
describe('PBT Preservation: lastInsetInlineStart Shadow Flag', () => {
  test('lastInsetInlineStart is true only on the boundary column when scrolled', () => {
    fc.assert(
      fc.property(
        flatColumnConfigArb().filter(c => c.stickyColumnsFirst >= 1),
        config => {
          const visibleColumns = Array.from({ length: config.numColumns }, (_, i) => `col-${i}`);
          const tableWidth = config.columnWidths.reduce((sum, w) => sum + w, 0);

          const store = setupStore({
            visibleColumns,
            stickyColumnsFirst: config.stickyColumnsFirst,
            stickyColumnsLast: config.stickyColumnsLast,
            columnWidths: config.columnWidths,
            wrapperWidth: config.wrapperWidth,
            tableWidth,
            scrollLeft: 50, // Scroll to trigger isStuckToTheInlineStart
          });

          const state = store.store.get();
          const boundaryIndex = config.stickyColumnsFirst - 1;

          for (let i = 0; i < config.stickyColumnsFirst; i++) {
            const cellState = state.cellState.get(`col-${i}`);
            expect(cellState).toBeDefined();
            if (i === boundaryIndex) {
              // Boundary column should have lastInsetInlineStart = true
              expect(cellState!.lastInsetInlineStart).toBe(true);
            } else {
              // Non-boundary sticky columns should have lastInsetInlineStart = false
              expect(cellState!.lastInsetInlineStart).toBe(false);
            }
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  test('lastInsetInlineStart is false for all sticky columns when not scrolled', () => {
    fc.assert(
      fc.property(
        flatColumnConfigArb().filter(c => c.stickyColumnsFirst >= 1),
        config => {
          const visibleColumns = Array.from({ length: config.numColumns }, (_, i) => `col-${i}`);
          const tableWidth = config.columnWidths.reduce((sum, w) => sum + w, 0);

          const store = setupStore({
            visibleColumns,
            stickyColumnsFirst: config.stickyColumnsFirst,
            stickyColumnsLast: config.stickyColumnsLast,
            columnWidths: config.columnWidths,
            wrapperWidth: config.wrapperWidth,
            tableWidth,
            // No scrollLeft — not scrolled
          });

          const state = store.store.get();

          for (let i = 0; i < config.stickyColumnsFirst; i++) {
            const cellState = state.cellState.get(`col-${i}`);
            expect(cellState).toBeDefined();
            expect(cellState!.lastInsetInlineStart).toBe(false);
          }
        }
      ),
      { numRuns: 30 }
    );
  });
});

/**
 * Property 2.5: No clipPath-related Fields in Store State
 *
 * For all configurations, the store state never contains clipPath-related fields
 * in cellState, wrapperState, or at the top level. Also, groupHeaderState
 * (if present after fix) should never contain clipPath fields.
 *
 * **Validates: Requirements 3.1, 3.5**
 */
describe('PBT Preservation: No clipPath-related Fields', () => {
  test('store state never contains clipPath-related fields for any configuration', () => {
    fc.assert(
      fc.property(flatColumnConfigArb(), config => {
        const visibleColumns = Array.from({ length: config.numColumns }, (_, i) => `col-${i}`);
        const tableWidth = config.columnWidths.reduce((sum, w) => sum + w, 0);

        const store = setupStore({
          visibleColumns,
          stickyColumnsFirst: config.stickyColumnsFirst,
          stickyColumnsLast: config.stickyColumnsLast,
          columnWidths: config.columnWidths,
          wrapperWidth: config.wrapperWidth,
          tableWidth,
        });

        const state = store.store.get();

        // Check top-level state keys for clipPath
        const stateKeys = Object.keys(state);
        expect(stateKeys.every(key => !key.toLowerCase().includes('clip'))).toBe(true);

        // Check each cellState entry for clipPath
        for (const [, cellState] of state.cellState) {
          expect(cellState).not.toHaveProperty('clipPath');
          expect(cellState).not.toHaveProperty('clip-path');
          expect(cellState).not.toHaveProperty('clipPathInlineStart');
          expect(cellState).not.toHaveProperty('clipPathInlineEnd');
          expect(cellState.offset).not.toHaveProperty('clipPath');
        }

        // Check wrapperState for clipPath
        expect(state.wrapperState).not.toHaveProperty('clipPath');
        expect(state.wrapperState).not.toHaveProperty('clip-path');

        // If groupHeaderState exists (after fix), check it too
        const groupHeaderState = (state as any).groupHeaderState;
        if (groupHeaderState instanceof Map) {
          for (const [, groupState] of groupHeaderState) {
            expect(groupState).not.toHaveProperty('clipPath');
            expect(groupState).not.toHaveProperty('clip-path');
          }
        }
      }),
      { numRuns: 50 }
    );
  });
});
