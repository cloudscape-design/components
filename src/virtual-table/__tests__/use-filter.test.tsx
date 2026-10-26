// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { act, renderHook } from '../../__tests__/render-hook';
import { useFilter } from '../use-filter';

// The F2-A1 headline two-mode filter (CW-10). The console supplies only the predicate
// (override-seam); the hook owns which rows render, the match set, the materialised
// match-indicator column, the total-vs-filtered counts, and cyclic keyboard next/previous
// match navigation. These tests pin that contract against the shape the core wires
// (subset -> filtered visibleItems + no indicator column; mark-in-place -> all items +
// match set + indicator column + navigation).

interface Row {
  id: string;
}
const trackBy = (row: Row) => row.id;
const items: Row[] = Array.from({ length: 6 }, (_, i) => ({ id: String(i) }));
// Matches at dataset indices 1, 3, 5.
const predicate = (row: Row) => Number(row.id) % 2 === 1;

describe('VirtualTable (F2-A1) useFilter', () => {
  test('with no filter renders every row, no indicator column, no matches', () => {
    const { result } = renderHook(() => useFilter<Row>({ items, trackBy }));
    expect(result.current.visibleItems).toBe(items);
    expect(result.current.hasIndicatorColumn).toBe(false);
    expect(result.current.matchedCount).toBe(items.length);
    expect(result.current.totalCount).toBe(items.length);
    expect(result.current.currentMatchIndex).toBe(-1);
    expect(result.current.isMatch('1')).toBe(false);
    expect(result.current.isCellHighlighted(items[1], 'message')).toBe(false);
  });

  test('subset mode renders only matching rows and needs no indicator column', () => {
    const { result } = renderHook(() => useFilter<Row>({ items, trackBy, filter: { mode: 'subset', predicate } }));
    expect(result.current.visibleItems.map(row => row.id)).toEqual(['1', '3', '5']);
    expect(result.current.hasIndicatorColumn).toBe(false);
    // Every rendered subset row is a match, so the count is the filtered length; the match
    // set stays empty (no indicator/highlight needed) and there is no navigation cursor.
    expect(result.current.matchedCount).toBe(3);
    expect(result.current.totalCount).toBe(6);
    expect(result.current.isMatch('1')).toBe(false);
    expect(result.current.currentMatchIndex).toBe(-1);
  });

  test('mark-in-place mode keeps all rows, materialises the indicator column, and marks matches', () => {
    const highlight = (_row: Row, columnId: string) => columnId === 'message';
    const { result } = renderHook(() =>
      useFilter<Row>({ items, trackBy, filter: { mode: 'mark-in-place', predicate, highlight } })
    );
    expect(result.current.visibleItems).toBe(items);
    expect(result.current.hasIndicatorColumn).toBe(true);
    expect(result.current.matchedCount).toBe(3);
    expect(result.current.totalCount).toBe(6);
    expect(result.current.isMatch('3')).toBe(true);
    expect(result.current.isMatch('2')).toBe(false);
    // Consumer highlight applies only in mark-in-place and only to the named column.
    expect(result.current.isCellHighlighted(items[3], 'message')).toBe(true);
    expect(result.current.isCellHighlighted(items[3], 'level')).toBe(false);
    // The navigation cursor starts on the first match (dataset index 1).
    expect(result.current.currentMatchIndex).toBe(1);
  });

  test('match navigation cycles through matches in both directions', () => {
    const { result } = renderHook(() =>
      useFilter<Row>({ items, trackBy, filter: { mode: 'mark-in-place', predicate } })
    );

    // goToNextMatch advances the cursor and returns the visibleItems index to reveal.
    let idx = -1;
    act(() => {
      idx = result.current.goToNextMatch();
    });
    expect(idx).toBe(3);
    act(() => {
      idx = result.current.goToNextMatch();
    });
    expect(idx).toBe(5);
    // Wraps back to the first match.
    act(() => {
      idx = result.current.goToNextMatch();
    });
    expect(idx).toBe(1);
    // Previous wraps to the last match.
    act(() => {
      idx = result.current.goToPreviousMatch();
    });
    expect(idx).toBe(5);
  });

  test('match navigation is a no-op when there are no matches', () => {
    const { result } = renderHook(() =>
      useFilter<Row>({ items, trackBy, filter: { mode: 'mark-in-place', predicate: () => false } })
    );
    let idx = 0;
    act(() => {
      idx = result.current.goToNextMatch();
    });
    expect(idx).toBe(-1);
    expect(result.current.matchedCount).toBe(0);
    expect(result.current.currentMatchIndex).toBe(-1);
  });
});
