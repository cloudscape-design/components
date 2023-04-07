// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useState, createRef, useEffect, useCallback, useMemo } from 'react';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { createIntersectionObserver } from '../internal/hooks/use-intersection-observer';
import { TableProps } from './interfaces';
interface CellWidths {
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

export interface GetStickyColumn {
  isStickyLeft: boolean;
  isStickyRight: boolean;
  isLastStickyLeft: boolean;
  isLastStickyRight: boolean;
  stickyStyles: StickyStyles;
}

const getPadding = (element: HTMLElement | null, side: 'Left' | 'Right') =>
  element ? Number(getComputedStyle(element)[`padding${side}`].slice(0, -2)) : 0;

// We allow the table to have a minimum of 148px of available space besides the sum of the widths of the sticky columns
const MINIMUM_SCROLLABLE_SPACE = 148;

const useLeftIntersectionObserver = createIntersectionObserver({
  threshold: 1,
  rootMargin: '10000px -2px 10000px 10000px', // -2px to ensure interesction in all table variants
});

const useRightIntersectionObserver = createIntersectionObserver({
  threshold: 1,
  rootMargin: '10000px 10000px 10000px -2px', // -2px to ensure interesction in all table variants
});

export const useStickyState = () => {
  const [stickyState, setStickyState] = useState({ left: false, right: false });
  const { ref: leftSentinelRef, isIntersecting: leftSentinelIntersecting } = useLeftIntersectionObserver();
  const { ref: rightSentinelRef, isIntersecting: rightSentinelIntersecting } = useRightIntersectionObserver();
  useEffect(() => {
    setStickyState({ left: !leftSentinelIntersecting, right: !rightSentinelIntersecting });
  }, [leftSentinelIntersecting, rightSentinelIntersecting]);
  return {
    stickyState,
    leftSentinelRef,
    rightSentinelRef,
  };
};

export const useCellWidths = (tableCellRefs: Array<React.RefObject<HTMLTableCellElement>>) => {
  const [cellWidths, setCellWidths] = useState<CellWidths>({ start: [], end: [] });

  const updateCellWidths = useCallback(() => {
    let startWidthsArray = tableCellRefs
      .map(ref => (ref?.current?.previousSibling as HTMLTableCellElement)?.offsetWidth)
      .filter(x => x);
    startWidthsArray = startWidthsArray.map((elem, index) =>
      startWidthsArray.slice(0, index + 1).reduce((a, b) => a + b)
    );
    let endWidthsArray = tableCellRefs.map(ref => (ref?.current?.nextSibling as HTMLTableCellElement)?.offsetWidth);
    endWidthsArray = endWidthsArray.filter(x => x).reverse();
    endWidthsArray = endWidthsArray
      .map((elem, index) => endWidthsArray.slice(0, index + 1).reduce((a, b) => a + b))
      .reverse();
    setCellWidths({ start: [0, ...startWidthsArray], end: [...endWidthsArray, 0] });
  }, [tableCellRefs]);

  useLayoutEffect(() => {
    updateCellWidths();
  }, [updateCellWidths]);

  return { cellWidths, updateCellWidths };
};

export const useStickyColumns = ({
  containerWidth,
  hasSelection,
  isWrapperScrollable,
  stickyColumns,
  tableRefObject,
  visibleColumnsLength,
}: StickyColumnParams) => {
  const noStickyColumns = !stickyColumns || (stickyColumns.start === 0 && stickyColumns.end === 0);
  const [shouldDisable, setShouldDisable] = useState<boolean>(noStickyColumns);
  // Compute table paddings
  const table = tableRefObject.current;
  const tableLeftPadding = getPadding(table, 'Left');

  const [tableCellRefs, setTableCellRefs] = useState<Array<React.RefObject<HTMLTableCellElement>>>([]);

  const isVisualRefresh = useVisualRefresh();

  const { stickyState, leftSentinelRef, rightSentinelRef } = useStickyState();
  const { left: isStuckToTheLeft, right: isStuckToTheRight } = stickyState;
  const { cellWidths, updateCellWidths } = useCellWidths(tableCellRefs);

  const { start = 0, end = 0 } = stickyColumns || {};
  const lastLeftStickyColumnIndex = start + (hasSelection ? 1 : 0);
  const lasRightStickyColumnIndex = visibleColumnsLength - 1 - end + (hasSelection ? 1 : 0);
  const startStickyColumnsWidth = cellWidths?.start[lastLeftStickyColumnIndex] ?? 0;
  const endStickyColumnsWidth = cellWidths?.end[lasRightStickyColumnIndex] ?? 0;

  // Calculate the sum of all sticky columns' widths
  const totalStickySpace = startStickyColumnsWidth + endStickyColumnsWidth;
  useEffect(() => {
    // Effect to check the conditions to set the "shouldDisable" sticky columns state
    const hasEnoughScrollableSpace =
      totalStickySpace + MINIMUM_SCROLLABLE_SPACE + tableLeftPadding < (containerWidth ?? 0);

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
    // Add and remove table cell refs
    setTableCellRefs(tableCellRefs =>
      [...new Array(visibleColumnsLength + (hasSelection ? 1 : 0))].map(
        (_: any, i: number) => tableCellRefs[i] || createRef<HTMLTableCellElement>()
      )
    );
  }, [visibleColumnsLength, hasSelection]);

  const getStickyStyles = useCallback(
    (colIndex: number, isStickyLeft: boolean, isStickyRight: boolean) => {
      let paddingStyle = {};
      const stickySide = isStickyLeft ? 'left' : isStickyRight ? 'right' : '';
      if (!stickySide) {
        return {};
      }

      const isFirstColumn = colIndex === 0;
      if (isFirstColumn && isVisualRefresh && !hasSelection) {
        if (stickySide === 'left' && isStuckToTheLeft && tableLeftPadding) {
          paddingStyle = { paddingLeft: `${tableLeftPadding}px` };
        }
      }

      return {
        [stickySide]: `${
          stickySide === 'right'
            ? cellWidths?.end[colIndex + (hasSelection ? 1 : 0)]
            : cellWidths?.start[colIndex + (hasSelection ? 1 : 0)]
        }px`,
        ...paddingStyle,
      };
    },
    [cellWidths, hasSelection, isStuckToTheLeft, isVisualRefresh, tableLeftPadding]
  );

  const getStickyColumn = React.useCallback(
    (colIndex: number): GetStickyColumn => {
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
      const isStickyLeft = colIndex + 1 <= (stickyColumns?.start ?? 0);
      const isStickyRight = colIndex + 1 > visibleColumnsLength - (stickyColumns?.end ?? 0);
      const isLastStickyLeft = colIndex + 1 === stickyColumns?.start;
      const isLastStickyRight = colIndex === visibleColumnsLength - (stickyColumns?.end ?? 0);

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
    getStickyColumn,
    stickyState: { isStuckToTheLeft, isStuckToTheRight, leftSentinelRef, rightSentinelRef },
    shouldDisableStickyColumns: shouldDisable,
    wrapperScrollPadding,
    updateCellWidths,
    cellWidths,
  };
};
