// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CellOffsets, StickyColumnsCellState, StickyColumnsProps, StickyColumnsWrapperState } from './interfaces';

export function isCellStatesEqual(s1: null | StickyColumnsCellState, s2: null | StickyColumnsCellState): boolean {
  if (s1 && s2) {
    return (
      s1.padLeft === s2.padLeft &&
      s1.lastLeft === s2.lastLeft &&
      s1.lastRight === s2.lastRight &&
      s1.offset.left === s2.offset.left &&
      s1.offset.right === s2.offset.right
    );
  }
  return s1 === s2;
}

export function isWrapperStatesEqual(s1: StickyColumnsWrapperState, s2: StickyColumnsWrapperState): boolean {
  return s1.scrollPaddingLeft === s2.scrollPaddingLeft && s1.scrollPaddingRight === s2.scrollPaddingRight;
}

export function updateCellOffsets(cells: Record<PropertyKey, HTMLElement>, props: StickyColumnsProps): CellOffsets {
  const totalColumns = props.visibleColumns.length;

  const firstColumnsWidths: number[] = [];
  for (let i = 0; i < Math.min(totalColumns, props.stickyColumnsFirst); i++) {
    const element = cells[props.visibleColumns[i]];
    const cellWidth = element.getBoundingClientRect().width ?? 0;
    firstColumnsWidths[i] = (firstColumnsWidths[i - 1] ?? 0) + cellWidth;
  }

  const lastColumnsWidths: number[] = [];
  for (let i = 0; i < Math.min(totalColumns, props.stickyColumnsLast); i++) {
    const element = cells[props.visibleColumns[totalColumns - 1 - i]];
    const cellWidth = element.getBoundingClientRect().width ?? 0;
    lastColumnsWidths[i] = (lastColumnsWidths[i - 1] ?? 0) + cellWidth;
  }

  const stickyWidthLeft = firstColumnsWidths[props.stickyColumnsFirst - 1] ?? 0;
  const stickyWidthRight = lastColumnsWidths[props.stickyColumnsLast - 1] ?? 0;
  const offsets = props.visibleColumns.reduce(
    (map, columnId, columnIndex) =>
      map.set(columnId, {
        first: firstColumnsWidths[columnIndex - 1] ?? 0,
        last: lastColumnsWidths[totalColumns - 1 - columnIndex - 1] ?? 0,
      }),
    new Map()
  );

  return { offsets, stickyWidthLeft, stickyWidthRight };
}
