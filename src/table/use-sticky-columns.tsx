// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useState, createRef, useEffect } from 'react';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { TableProps } from './interfaces';
interface CellWidths {
  start: number[];
  end: number[];
}
interface StickyStyles {
  left?: string;
  right?: string;
  paddingLeft?: string;
  paddingRight?: string;
}

interface StickyColumnParams {
  visibleColumnsLength: number;
  hasSelection: boolean;
  stickyColumns?: TableProps.StickyColumns;
  containerWidth: number | null;
  tableRefObject: React.RefObject<HTMLTableElement>;
  wrapperRefObject: React.RefObject<HTMLDivElement>;
  isWrapperScrollable: boolean;
}

export interface GetStickyColumn {
  isStickyLeft: boolean;
  isStickyRight: boolean;
  isLastStickyLeft: boolean;
  isLastStickyRight: boolean;
  stickyStyles: StickyStyles;
}

export const useStickyColumns = ({
  visibleColumnsLength,
  hasSelection,
  stickyColumns,
  containerWidth,
  tableRefObject,
  wrapperRefObject,
  isWrapperScrollable,
}: StickyColumnParams) => {
  // Sentinels used for triggering IntersectionObserver and set "stuck" state
  const leftSentinelRef = React.useRef(null);
  const rightSentinelRef = React.useRef(null);
  const [isStuckToTheLeft, setIsStuckToTheLeft] = useState(false);
  const [isStuckToTheRight, setIsStuckToTheRight] = useState(false);

  // Compute table paddings
  const table = tableRefObject.current;
  const tableLeftPadding = table ? Number(getComputedStyle(table).paddingLeft.slice(0, -2)) : 0;
  const tableRightPadding = table ? Number(getComputedStyle(table).paddingRight.slice(0, -2)) : 0;

  const [tableCellRefs, setTableCellRefs] = useState<Array<React.RefObject<HTMLTableCellElement>>>([]);
  const [cellWidths, setCellWidths] = useState<CellWidths>({ start: [], end: [] });

  const [shouldDisable, setShouldDisable] = useState<boolean>(false);

  const isVisualRefresh = useVisualRefresh();

  // Calculate the sum of all sticky columns' widths
  const { start = 0, end = 0 } = stickyColumns || {};
  const lastLeftStickyColumnIndex = start + (hasSelection ? 1 : 0);
  const lasRightStickyColumnIndex = visibleColumnsLength - 1 - end + (hasSelection ? 1 : 0);
  const startStickyColumnsWidth = cellWidths?.start[lastLeftStickyColumnIndex] ?? 0;
  const endStickyColumnsWidth = cellWidths?.end[lasRightStickyColumnIndex] ?? 0;
  const totalStickySpace = startStickyColumnsWidth + endStickyColumnsWidth;
  // We allow the table to have a minimum of 148px of available space besides the sum of the widths of the sticky columns
  const MINIMUM_SCROLLABLE_SPACE = 148;

  useLayoutEffect(() => {
    // Effect to adjust position of the right sentinel, to trigger the IntersectionObserver on the right columns
    if (!rightSentinelRef.current || !tableRefObject.current) {
      return;
    }
    const rightSentinel = rightSentinelRef.current as HTMLDivElement;
    const tableWidth = Number(getComputedStyle(tableRefObject.current).width.slice(0, -2));
    const newSentinelPosition = tableWidth - 2;
    rightSentinel.style.left = `${newSentinelPosition}px`;
  }, [tableRefObject, cellWidths]);

  useEffect(() => {
    const wrapper = wrapperRefObject?.current;
    if (!wrapper) {
      return;
    }
    const right = wrapper.scrollLeft < wrapper.scrollWidth - wrapper.clientWidth - tableRightPadding;
    const left = wrapper.scrollLeft > tableLeftPadding;
    setIsStuckToTheLeft(left);
    setIsStuckToTheRight(right);
  }, [cellWidths, setIsStuckToTheLeft, setIsStuckToTheRight, wrapperRefObject, tableLeftPadding, tableRightPadding]);

  useLayoutEffect(() => {
    if (!rightSentinelRef.current || !tableRefObject.current) {
      return;
    }
    const rightSentinel = rightSentinelRef.current as HTMLDivElement;
    rightSentinel.style.left = getComputedStyle(tableRefObject.current).width;
  }, [tableRefObject, cellWidths]);

  useEffect(() => {
    const wrapper = wrapperRefObject?.current;
    const leftSentinel = leftSentinelRef?.current;
    const rightSentinel = rightSentinelRef?.current;
    const table = tableRefObject?.current;
    if (!wrapper || !table || !stickyColumns || !leftSentinel || !rightSentinel || shouldDisable) {
      return;
    }

    // Check the scrolling position of the table wrapper to set the initial "stuck" state
    const right = wrapper.scrollLeft < wrapper.scrollWidth - wrapper.clientWidth - tableRightPadding;
    const left = wrapper.scrollLeft > tableLeftPadding;
    setIsStuckToTheLeft(left);
    setIsStuckToTheRight(right);

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (!entry.isIntersecting) {
        entry.target === leftSentinel ? setIsStuckToTheLeft(true) : setIsStuckToTheRight(true);
      } else {
        entry.target === leftSentinel ? setIsStuckToTheLeft(false) : setIsStuckToTheRight(false);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, { threshold: [0, 1] });
    // Observe left and right sentinels to set "stuck" state
    observer.observe(leftSentinel);
    observer.observe(rightSentinel);
    return () => {
      observer.disconnect();
    };
  }, [
    stickyColumns,
    tableCellRefs,
    tableRefObject,
    wrapperRefObject,
    tableLeftPadding,
    tableRightPadding,
    shouldDisable,
  ]);

  // useEffect(() => {
  //   setIsStuckToTheLeft(isStuckToTheLeft => (shouldDisable ? false : isStuckToTheLeft));
  //   setIsStuckToTheRight(isStuckToTheRight => (shouldDisable ? false : isStuckToTheRight));
  // }, [shouldDisable]);

  useEffect(() => {
    // Effect to check the conditions to set the "shouldDisable" sticky columns state
    const hasNotEnoughSpace =
      totalStickySpace + MINIMUM_SCROLLABLE_SPACE + tableLeftPadding > (containerWidth ?? Number.MAX_SAFE_INTEGER);
    const shouldDisable = !stickyColumns || !isWrapperScrollable || hasNotEnoughSpace;
    setShouldDisable(shouldDisable);
    console.log({ shouldDisable });
  }, [containerWidth, stickyColumns, totalStickySpace, visibleColumnsLength, tableLeftPadding, isWrapperScrollable]);

  useEffect(() => {
    // Add and remove table cell refs
    setTableCellRefs(tableCellRefs =>
      [...new Array(visibleColumnsLength + (hasSelection ? 1 : 0))].map(
        (_: any, i: number) => tableCellRefs[i] || createRef<HTMLTableCellElement>()
      )
    );
  }, [visibleColumnsLength, hasSelection]);

  const updateCellWidths = React.useCallback(() => {
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

  // useLayoutEffect(() => {
  //   updateCellWidths();
  // }, [updateCellWidths]);

  const getStickyColumn = (colIndex: number): GetStickyColumn => {
    // if (shouldDisable) {
    //   return {
    //     isStickyLeft: false,
    //     isStickyRight: false,
    //     isLastStickyLeft: false,
    //     isLastStickyRight: false,
    //     stickyStyles: {},
    //   };
    // }

    const isStickyLeft = colIndex + 1 <= (stickyColumns?.start ?? 0);
    const isStickyRight = colIndex + 1 > visibleColumnsLength - (stickyColumns?.end ?? 0);
    const isLastStickyLeft = colIndex + 1 === stickyColumns?.start;
    const isLastStickyRight = colIndex === visibleColumnsLength - (stickyColumns?.end ?? 0);

    // Sticky styles
    let paddingStyle = {};
    const stickySide = isStickyLeft ? 'left' : isStickyRight ? 'right' : '';
    const isLastSticky = isLastStickyLeft || isLastStickyRight;
    if (isLastSticky && isVisualRefresh && !hasSelection) {
      if (stickySide === 'right' && isStuckToTheRight && tableRightPadding) {
        paddingStyle = { paddingRight: `${tableRightPadding}px` };
      }

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

    return {
      isStickyLeft,
      isStickyRight,
      isLastStickyLeft,
      isLastStickyRight,
      stickyStyles,
    };
  };

  return {
    tableCellRefs,
    cellWidths,
    setCellWidths,
    getStickyColumn,
    shouldDisableStickyColumns: shouldDisable,
    startStickyColumnsWidth,
    endStickyColumnsWidth,
    isStuckToTheLeft: shouldDisable ? false : isStuckToTheLeft,
    isStuckToTheRight: shouldDisable ? false : isStuckToTheLeft,
    leftSentinelRef,
    rightSentinelRef,
    updateCellWidths,
  };
};
