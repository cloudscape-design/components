// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useState, createRef, useEffect, useCallback, useMemo } from 'react';
import { TableProps } from './interfaces';
import { CellOffsets } from './internal';
interface CellOffsets {
  start: number[];
  end: number[];
}
interface StickyStyles {
  left?: string;
  right?: string;
  paddingLeft?: string;
}

interface StickyColumnParams {
  containerWidth: number | null;
  hasSelection: boolean;
  isWrapperScrollable: boolean;
  stickyColumns?: TableProps.StickyColumns;
  visibleColumnsLength: number;
  tableRefObject: React.RefObject<HTMLTableElement>;
  wrapperRefObject: React.RefObject<HTMLDivElement>;
}

export interface GetStickyColumnProperties {
  isStickyLeft: boolean;
  isStickyRight: boolean;
  isLastStickyLeft: boolean;
  isLastStickyRight: boolean;
  stickyStyles: StickyStyles;
}

// We allow the table to have a minimum of 148px of available space besides the sum of the widths of the sticky columns
const MINIMUM_SCROLLABLE_SPACE = 148;

export const useCellOffsets = (tableCellRefs: Array<React.RefObject<HTMLTableCellElement>>) => {
  // This hook calculates the cumulative offsets of the cells in each column of the table, based on the widths of their siblings

  const [cellOffsets, setCellOffsets] = useState<CellOffsets>({ start: [], end: [] });
  const updateCellOffsets = useCallback(() => {
    // Calculate widths of all previous siblings of each table cell in the `tableCellRefs` array
    let startWidthsArray = tableCellRefs
      .map(ref => (ref?.current?.previousSibling as HTMLTableCellElement)?.offsetWidth)
      .filter(x => x);
    // Calculate cumulative widths of previous siblings to get the total offset of each of the cells
    startWidthsArray = startWidthsArray.map((elem, index) =>
      startWidthsArray.slice(0, index + 1).reduce((a, b) => a + b)
    );

    // Calculate widths of all next siblings of each table cell in the `tableCellRefs` array
    let endWidthsArray = tableCellRefs.map(ref => (ref?.current?.nextSibling as HTMLTableCellElement)?.offsetWidth);
    endWidthsArray = endWidthsArray.filter(x => x).reverse();
    // Calculate cumulative widths of next siblings to get the the total offset of each of the cells
    endWidthsArray = endWidthsArray
      .map((elem, index) => endWidthsArray.slice(0, index + 1).reduce((a, b) => a + b))
      .reverse();

    setCellOffsets({ start: [0, ...startWidthsArray], end: [...endWidthsArray, 0] });
  }, [tableCellRefs]);

  useLayoutEffect(() => {
    updateCellOffsets();
  }, [updateCellOffsets]);

  return { cellOffsets, updateCellOffsets };
};

export const useStickyColumns = ({
  containerWidth,
  hasSelection,
  isWrapperScrollable,
  stickyColumns,
  tableRefObject,
  visibleColumnsLength,
}: StickyColumnParams) => {
  // Check if there are any sticky columns
  const noStickyColumns = !stickyColumns || (stickyColumns.start === 0 && stickyColumns.end === 0);

  const [shouldDisable, setShouldDisable] = useState<boolean>(noStickyColumns);
  const [tableCellRefs, setTableCellRefs] = useState<Array<React.RefObject<HTMLTableCellElement>>>([]);
  const { cellOffsets, updateCellOffsets } = useCellOffsets(tableCellRefs);

  // Compute left table padding
  const table = tableRefObject.current;
  const tableLeftPadding = table ? Number(getComputedStyle(table).paddingLeft.slice(0, -2)) : 0;

  const { start = 0, end = 0 } = stickyColumns || {};
  // Calculate the indexex of the last left and right sticky columns, taking into account the selection column
  const lastLeftStickyColumnIndex = start + (hasSelection ? 1 : 0);
  const lasRightStickyColumnIndex = visibleColumnsLength - 1 - end + (hasSelection ? 1 : 0);

  // Get the width of the start and end sticky columns using the `cellOffsets` state, or use 0 if it's not available
  const startStickyColumnsWidth = cellOffsets?.start[lastLeftStickyColumnIndex] ?? 0;
  const endStickyColumnsWidth = cellOffsets?.end[lasRightStickyColumnIndex] ?? 0;

  // Calculate the sum of all sticky columns' widths
  const totalStickySpace = startStickyColumnsWidth + endStickyColumnsWidth;

  useEffect(() => {
    // Check if there is enough scrollable space for sticky columns to be enabled
    const hasEnoughScrollableSpace =
      totalStickySpace + MINIMUM_SCROLLABLE_SPACE + tableLeftPadding < (containerWidth ?? 0);

    // Determine if sticky columns should be disabled based on the conditions
    const shouldDisable = noStickyColumns || !isWrapperScrollable || !hasEnoughScrollableSpace;
    setShouldDisable(shouldDisable);
  }, [
    containerWidth,
    noStickyColumns,
    stickyColumns,
    totalStickySpace,
    visibleColumnsLength,
    tableLeftPadding,
    isWrapperScrollable,
  ]);

  useEffect(() => {
    // Create new refs for the visible columns and selection column, if present
    setTableCellRefs(tableCellRefs =>
      [...new Array(visibleColumnsLength + (hasSelection ? 1 : 0))].map(
        (_: any, i: number) => tableCellRefs[i] || createRef<HTMLTableCellElement>()
      )
    );
  }, [visibleColumnsLength, hasSelection]);

  const getStickyStyles = useCallback(
    (colIndex: number, isStickyLeft: boolean, isStickyRight: boolean) => {
      // Determine which side to apply sticky styles to
      const stickySide = isStickyLeft ? 'left' : isStickyRight ? 'right' : '';

      if (!stickySide) {
        return {};
      }

      // Determine the offset of the sticky column using the `cellOffsets` state object
      const stickyColumnOffset =
        stickySide === 'right'
          ? cellOffsets?.end[colIndex + (hasSelection ? 1 : 0)]
          : cellOffsets?.start[colIndex + (hasSelection ? 1 : 0)];

      return {
        [stickySide]: `${stickyColumnOffset}px`,
      };
    },
    [cellOffsets, hasSelection]
  );
  const getStickyColumnProperties = React.useCallback(
    (colIndex: number): GetStickyColumnProperties => {
      const disabledStickyColumn = {
        isStickyLeft: false,
        isStickyRight: false,
        isLastStickyLeft: false,
        isLastStickyRight: false,
        stickyStyles: {},
      };

      if (shouldDisable) {
        return disabledStickyColumn;
      }

      // Determine if the column is sticky on the left or right side
      const isStickyLeft = colIndex + 1 <= (stickyColumns?.start ?? 0);
      const isStickyRight = colIndex + 1 > visibleColumnsLength - (stickyColumns?.end ?? 0);

      // Determine if the column is the last left or right sticky column
      const isLastStickyLeft = colIndex + 1 === stickyColumns?.start;
      const isLastStickyRight = colIndex === visibleColumnsLength - (stickyColumns?.end ?? 0);

      // Get the sticky styles
      const stickyStyles = getStickyStyles(colIndex, isStickyLeft, isStickyRight);

      return {
        isStickyLeft,
        isStickyRight,
        isLastStickyLeft,
        isLastStickyRight,
        stickyStyles,
      };
    },
    [getStickyStyles, shouldDisable, stickyColumns?.end, stickyColumns?.start, visibleColumnsLength]
  );

  const wrapperScrollPadding = useMemo(() => {
    return { left: startStickyColumnsWidth, right: endStickyColumnsWidth };
  }, [startStickyColumnsWidth, endStickyColumnsWidth]);

  return {
    tableCellRefs,
    getStickyColumnProperties,
    shouldDisableStickyColumns: shouldDisable,
    wrapperScrollPadding,
    updateCellOffsets,
    cellOffsets,
  };
};
