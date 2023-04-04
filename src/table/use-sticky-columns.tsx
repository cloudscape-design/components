// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useState, createRef, useEffect, useCallback } from 'react';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { useIntersectionObserver } from '../internal/hooks/use-intersection-observer';
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

export const useStickyState = ({
  tableRefObject,
  wrapperRefObject,
}: {
  tableRefObject: React.RefObject<HTMLTableElement>;
  wrapperRefObject: React.RefObject<HTMLDivElement>;
}) => {
  const [isStuckToTheLeft, setIsStuckToTheLeft] = useState(false);
  const [isStuckToTheRight, setIsStuckToTheRight] = useState(false);

  const intersectionObserverOptions = { threshold: [0, 1], rootMargin: '-2px' };
  const { ref: leftSentinelRef, isIntersecting: leftSentinelIntersecting } =
    useIntersectionObserver(intersectionObserverOptions);
  const { ref: rightSentinelRef, isIntersecting: rightSentinelIntersecting } =
    useIntersectionObserver(intersectionObserverOptions);

  useEffect(() => {
    setIsStuckToTheLeft(!leftSentinelIntersecting);
    setIsStuckToTheRight(!rightSentinelIntersecting);
  }, [leftSentinelIntersecting, rightSentinelIntersecting]);

  useEffect(() => {
    const wrapper = wrapperRefObject.current;
    const table = tableRefObject.current;
    if (!wrapper) {
      return;
    }
    // Check the scrolling position of the table wrapper to set the initial "stuck" state
    const right = wrapper.scrollLeft < wrapper.scrollWidth - wrapper.clientWidth - getPadding(table, 'Right');
    const left = wrapper.scrollLeft > getPadding(table, 'Left');
    setIsStuckToTheLeft(left);
    setIsStuckToTheRight(right);
  }, [wrapperRefObject, tableRefObject]);

  return { isStuckToTheLeft, isStuckToTheRight, leftSentinelRef, rightSentinelRef };
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
  wrapperRefObject,
}: StickyColumnParams) => {
  const noStickyColumns = !stickyColumns || (stickyColumns.start === 0 && stickyColumns.end === 0);
  const [shouldDisable, setShouldDisable] = useState<boolean>(noStickyColumns);

  // Compute table paddings
  const table = tableRefObject.current;
  const tableLeftPadding = getPadding(table, 'Left');

  const [tableCellRefs, setTableCellRefs] = useState<Array<React.RefObject<HTMLTableCellElement>>>([]);

  const isVisualRefresh = useVisualRefresh();

  const { isStuckToTheLeft, isStuckToTheRight, leftSentinelRef, rightSentinelRef } = useStickyState({
    wrapperRefObject,
    tableRefObject,
  });
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
    const hasNotEnoughSpace =
      totalStickySpace + MINIMUM_SCROLLABLE_SPACE + tableLeftPadding > (containerWidth ?? Number.MAX_SAFE_INTEGER);

    const shouldDisable = noStickyColumns || !isWrapperScrollable || hasNotEnoughSpace;
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

  const getStickyColumn = useCallback(
    (colIndex: number): GetStickyColumn => {
      if (shouldDisable) {
        return {
          isStickyLeft: false,
          isStickyRight: false,
          isLastStickyLeft: false,
          isLastStickyRight: false,
          stickyStyles: {},
        };
      }

      const isStickyLeft = colIndex + 1 <= (stickyColumns?.start ?? 0);
      const isStickyRight = colIndex + 1 > visibleColumnsLength - (stickyColumns?.end ?? 0);
      const isLastStickyLeft = colIndex + 1 === stickyColumns?.start;
      const isLastStickyRight = colIndex === visibleColumnsLength - (stickyColumns?.end ?? 0);

      // Sticky styles
      let paddingStyle = {};
      const stickySide = isStickyLeft ? 'left' : isStickyRight ? 'right' : '';
      const isFirstColumn = colIndex === 0;
      if (isFirstColumn && isVisualRefresh && !hasSelection) {
        if (stickySide === 'left' && isStuckToTheLeft && tableLeftPadding) {
          paddingStyle = { paddingLeft: `${tableLeftPadding}px` };
        }
      }
      const stickyStyles = {
        [stickySide]: `${
          stickySide === 'right'
            ? cellWidths?.end[colIndex + (hasSelection ? 1 : 0)]
            : cellWidths?.start[colIndex + (hasSelection ? 1 : 0)]
        }px`,
        ...paddingStyle,
      };
      console.log({ cellWidths });
      return {
        isStickyLeft,
        isStickyRight,
        isLastStickyLeft,
        isLastStickyRight,
        stickyStyles,
      };
    },
    [
      cellWidths,
      hasSelection,
      isStuckToTheLeft,
      isVisualRefresh,
      shouldDisable,
      stickyColumns?.end,
      stickyColumns?.start,
      tableLeftPadding,
      visibleColumnsLength,
    ]
  );

  const stickyState = { isStuckToTheLeft, isStuckToTheRight, leftSentinelRef, rightSentinelRef };
  const wrapperScrollPadding = { left: startStickyColumnsWidth, right: endStickyColumnsWidth };
  return {
    tableCellRefs,
    getStickyColumn,
    stickyState,
    shouldDisableStickyColumns: shouldDisable,
    wrapperScrollPadding,
    updateCellWidths,
    cellWidths,
  };
};
