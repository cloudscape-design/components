// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ColumnInRow, HierarchicalStructure } from './utils';

export interface GroupSplit {
  stickyColspan: number;
  nonStickyColspan: number;
  side: 'first' | 'last';
}

export function getChildColumnIds(hierarchicalStructure: HierarchicalStructure<any>, groupId: string): string[] {
  const leafRow = hierarchicalStructure.rows[hierarchicalStructure.rows.length - 1];
  const childIds: string[] = [];
  for (const col of leafRow.columns) {
    if (!col.isGroup && col.parentGroupIds.includes(groupId)) {
      childIds.push(col.id);
    }
  }
  return childIds;
}

/**
 * Determines if a group header cell is split by a sticky column boundary.
 * Returns null if no split, or the split details if the group straddles a boundary.
 */
export function getGroupSplit(
  col: ColumnInRow<any>,
  stickyColumnsFirst: number,
  stickyColumnsLast: number,
  totalLeafColumns: number
): GroupSplit | null {
  if (!col.isGroup) {
    return null;
  }

  const groupStart = col.colIndex;
  const groupEnd = col.colIndex + col.colSpan - 1;

  if (stickyColumnsFirst > 0) {
    const lastStickyFirst = stickyColumnsFirst - 1;
    if (groupStart <= lastStickyFirst && groupEnd > lastStickyFirst) {
      const stickyColspan = lastStickyFirst - groupStart + 1;
      return { stickyColspan, nonStickyColspan: col.colSpan - stickyColspan, side: 'first' };
    }
  }

  if (stickyColumnsLast > 0) {
    const firstStickyLast = totalLeafColumns - stickyColumnsLast;
    if (groupStart < firstStickyLast && groupEnd >= firstStickyLast) {
      const nonStickyColspan = firstStickyLast - groupStart;
      return { stickyColspan: col.colSpan - nonStickyColspan, nonStickyColspan, side: 'last' };
    }
  }

  return null;
}
