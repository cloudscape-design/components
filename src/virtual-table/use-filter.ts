// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useMemo, useRef, useState } from 'react';

import { VirtualTableProps } from './interfaces';

// The two-mode logs filter (CW-10), owned by VirtualTable as a first-class feature — the
// console supplies only the predicate (override-seam), the component owns the mechanism:
// which rows render, the match set, the materialised match-indicator column, the
// total-vs-filtered counts, and keyboard next/previous-match navigation with a NON-VISUAL
// match conveyance (text/ARIA on the indicator, not colour alone; WCAG 1.4.1).
//
//  - "subset"        renders only matching rows (aria-rowcount reflects the filtered
//                    length, since the engine windows the returned `visibleItems`).
//  - "mark-in-place" renders all rows, marks matches in place + adds a match-indicator
//                    column so surrounding context is preserved.
export const INDICATOR_COL_WIDTH = 25;

interface UseFilterParams<T> {
  items: ReadonlyArray<T>;
  trackBy: (item: T) => string;
  filter?: VirtualTableProps.Filter<T>;
}

export interface FilterModel<T> {
  /** Items to window/render: the filtered subset, or all items in mark-in-place. */
  visibleItems: ReadonlyArray<T>;
  /** Whether the mark-in-place indicator column is materialised + counted. */
  hasIndicatorColumn: boolean;
  /** Whether a given row (by id) is a filter match (mark-in-place). */
  isMatch: (id: string) => boolean;
  /** Whether a specific cell should be highlighted (mark-in-place, consumer-supplied). */
  isCellHighlighted: (item: T, columnId: string) => boolean;
  matchedCount: number;
  totalCount: number;
  /** Index into visibleItems of the currently focused match (-1 when none). */
  currentMatchIndex: number;
  /** Move focus to the next/previous match; returns the visibleItems index to reveal, or -1. */
  goToNextMatch: () => number;
  goToPreviousMatch: () => number;
}

export function useFilter<T>({ items, trackBy, filter }: UseFilterParams<T>): FilterModel<T> {
  const [cursor, setCursor] = useState(0);
  const cursorRef = useRef(0);
  cursorRef.current = cursor;

  const { visibleItems, matchIds, matchIndices } = useMemo(() => {
    if (!filter) {
      return { visibleItems: items, matchIds: new Set<string>(), matchIndices: [] as number[] };
    }
    const predicate = filter.predicate;
    if (filter.mode === 'subset') {
      const visible = items.filter(predicate);
      // In subset mode every rendered row is a match; the indicator column is not needed.
      return { visibleItems: visible, matchIds: new Set<string>(), matchIndices: [] as number[] };
    }
    // mark-in-place: render everything, record which rows (and their visible index) match.
    const ids = new Set<string>();
    const indices: number[] = [];
    items.forEach((item, index) => {
      if (predicate(item)) {
        ids.add(trackBy(item));
        indices.push(index);
      }
    });
    return { visibleItems: items, matchIds: ids, matchIndices: indices };
  }, [items, trackBy, filter]);

  const hasIndicatorColumn = !!filter && filter.mode === 'mark-in-place';

  const isMatch = useCallback((id: string) => matchIds.has(id), [matchIds]);

  const highlight = filter?.highlight;
  const isCellHighlighted = useCallback(
    (item: T, columnId: string) => hasIndicatorColumn && !!highlight && highlight(item, columnId),
    [hasIndicatorColumn, highlight]
  );

  const step = useCallback(
    (delta: number) => {
      if (matchIndices.length === 0) {
        return -1;
      }
      const next = (cursorRef.current + delta + matchIndices.length) % matchIndices.length;
      setCursor(next);
      return matchIndices[next];
    },
    [matchIndices]
  );

  const goToNextMatch = useCallback(() => step(1), [step]);
  const goToPreviousMatch = useCallback(() => step(-1), [step]);

  return {
    visibleItems,
    hasIndicatorColumn,
    isMatch,
    isCellHighlighted,
    matchedCount: filter ? (filter.mode === 'subset' ? visibleItems.length : matchIds.size) : items.length,
    totalCount: items.length,
    currentMatchIndex: matchIndices.length ? matchIndices[cursor % matchIndices.length] : -1,
    goToNextMatch,
    goToPreviousMatch,
  };
}
