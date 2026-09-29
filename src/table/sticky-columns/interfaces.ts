// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface StickyColumnsProps {
  visibleColumns: readonly PropertyKey[];
  stickyColumnsFirst: number;
  stickyColumnsLast: number;
}

export interface StickyColumnsState {
  cellState: Map<PropertyKey, StickyColumnsCellState>;
  wrapperState: StickyColumnsWrapperState;
}

// Cell state is used to apply respective styles and offsets to sticky cells.
export interface StickyColumnsCellState {
  padInlineStart: boolean;
  // Cell is the last sticky column on the respective side and the table is scrolled away from it,
  // so content is passing underneath. Used to render the separating shadow.
  lastInsetInlineStart: boolean;
  lastInsetInlineEnd: boolean;
  boundaryInlineStart: boolean;
  boundaryInlineEnd: boolean;
  offset: { insetInlineStart?: number; insetInlineEnd?: number };
}

// Scroll padding is applied to table's wrapper so that the table scrolls when focus goes behind sticky column.
export interface StickyColumnsWrapperState {
  scrollPaddingInlineStart: number;
  scrollPaddingInlineEnd: number;
}

export interface CellOffsets {
  offsets: Map<PropertyKey, { first: number; last: number }>;
  stickyWidthInlineStart: number;
  stickyWidthInlineEnd: number;
}
