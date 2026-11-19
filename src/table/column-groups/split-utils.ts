// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ColumnGroupsLayout, HeaderRowColumn } from './utils';

/**
 * Describes how a group header is split by a single sticky column boundary.
 * `stickyColspan` is the number of columns on the sticky side.
 * `staticColspan` is the number of columns on the scrollable side.
 * When both are 0, the group is not affected by this boundary.
 */
export interface StickyGroupSplit {
  stickyColspan: number;
  staticColspan: number;
}

/** Returns all column IDs that are descendants of the given group (including nested subgroups). */
export function getGroupColumnIds(columnGroupsLayout: ColumnGroupsLayout<any>, groupId: string): string[] {
  const columnsRow = columnGroupsLayout.rows[columnGroupsLayout.rows.length - 1];
  const childIds: string[] = [];
  for (const col of columnsRow.columns) {
    if (!col.isGroup && col.parentGroupIds.includes(groupId)) {
      childIds.push(col.id);
    }
  }
  return childIds;
}

/**
 * Computes how a group header cell is split by a sticky boundary.
 * Call once for sticky-first and once for sticky-last.
 *
 * @param stickyCount - number of sticky columns from that side (first or last)
 * @param side - which boundary to check
 */
export function getGroupSplit({
  col,
  stickyCount,
  side,
  totalColumns,
}: {
  col: HeaderRowColumn<any>;
  stickyCount: number;
  side: 'first' | 'last';
  totalColumns: number;
}): StickyGroupSplit {
  if (!col.isGroup || stickyCount === 0) {
    return { stickyColspan: 0, staticColspan: 0 };
  }

  const groupStart = col.colIndex;
  const groupEnd = col.colIndex + col.colSpan - 1;

  if (side === 'first') {
    const lastStickyFirst = stickyCount - 1;
    if (groupStart <= lastStickyFirst && groupEnd > lastStickyFirst) {
      const stickyColspan = lastStickyFirst - groupStart + 1;
      return { stickyColspan, staticColspan: col.colSpan - stickyColspan };
    }
  } else {
    const firstStickyLast = totalColumns - stickyCount;
    if (groupStart < firstStickyLast && groupEnd >= firstStickyLast) {
      const staticColspan = firstStickyLast - groupStart;
      return { stickyColspan: col.colSpan - staticColspan, staticColspan };
    }
  }

  return { stickyColspan: 0, staticColspan: 0 };
}
