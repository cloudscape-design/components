// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface StickyColumnsProps {
  visibleColumns: readonly PropertyKey[];
  stickyColumnsFirst: number;
  stickyColumnsLast: number;
}

export interface StickyColumnsState {
  hasStickyColumns: boolean;
  cellState: Record<PropertyKey, null | StickyColumnsCellState>;
  wrapperState: StickyColumnsWrapperState;
}

// Cell state is used to apply respective styles and offsets to sticky cells.
export interface StickyColumnsCellState {
  padLeft: boolean;
  lastLeft: boolean;
  lastRight: boolean;
  offset: { left?: number; right?: number };
}

// Scroll padding is applied to table's wrapper so that the table scrolls when focus goes behind sticky column.
export interface StickyColumnsWrapperState {
  scrollPaddingLeft: number;
  scrollPaddingRight: number;
}

export interface CellOffsets {
  offsets: Map<PropertyKey, { first: number; last: number }>;
  stickyWidthLeft: number;
  stickyWidthRight: number;
}
