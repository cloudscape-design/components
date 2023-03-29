// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useState, createRef, useEffect } from 'react';
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
}

export interface GetStickyColumn {
  isSticky: boolean;
  isLastStart: boolean;
  isLastEnd: boolean;
  stickyStyles: StickyStyles;
}

export const getStickyStyles = ({
  colIndex,
  stickyColumns,
  visibleColumnsLength,
  hasSelection,
  cellWidths,
  startPaddingOffset,
  endPaddingOffset,
  tableLeftPadding,
  tableRightPadding,
}: {
  colIndex: number;
  stickyColumns?: TableProps.StickyColumns;
  visibleColumnsLength: number;
  hasSelection: boolean;
  cellWidths?: CellWidths;
  startPaddingOffset?: boolean;
  endPaddingOffset?: boolean;
  tableLeftPadding: number;
  tableRightPadding: number;
}): StickyStyles => {
  if (!cellWidths?.start && !cellWidths?.end) {
    return {};
  }
  const isStickyStart = colIndex + 1 <= (stickyColumns?.start ?? 0);
  const isStickyEnd = colIndex + 1 > visibleColumnsLength - (stickyColumns?.end ?? 0);
  const isFirstOrLastStickyColumn =
    colIndex + 1 === (stickyColumns?.start ?? 0) || colIndex === visibleColumnsLength - (stickyColumns?.end ?? 0);
  const stickySide = isStickyStart ? 'left' : isStickyEnd ? 'right' : '';

  let paddingStyle = {};
  if (isFirstOrLastStickyColumn && !hasSelection) {
    if (stickySide === 'right' && endPaddingOffset) {
      paddingStyle = { paddingRight: `${tableRightPadding}px` };
    }

    if (stickySide === 'left' && startPaddingOffset) {
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
};

export const updateCellWidths = ({
  tableCellRefs,
  setCellWidths,
}: {
  tableCellRefs: React.RefObject<HTMLTableCellElement>[];
  setCellWidths: (cellWidths: CellWidths) => void;
}) => {
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
};

export const useStickyColumns = ({
  visibleColumnsLength,
  hasSelection,
  stickyColumns,
  containerWidth,
  tableRefObject,
  wrapperRefObject,
}: StickyColumnParams) => {
  const tableLeftPadding = tableRefObject.current
    ? Number(window.getComputedStyle(tableRefObject.current).paddingLeft.slice(0, -2))
    : 0;

  const tableRightPadding = tableRefObject.current
    ? Number(window.getComputedStyle(tableRefObject.current).paddingRight.slice(0, -2))
    : 0;
  const [tableCellRefs, setTableCellRefs] = useState<Array<React.RefObject<HTMLTableCellElement>>>([]);
  const [cellWidths, setCellWidths] = useState<CellWidths>({ start: [], end: [] });
  const [shouldDisable, setShouldDisable] = useState<boolean>(false);

  const [startPaddingOffset, setStartPaddingOffset] = useState(false);
  const [endPaddingOffset, setEndPaddingOffset] = useState(false);

  const { start = 0, end = 0 } = stickyColumns || {};
  const lastStartStickyColumnIndex = start + (hasSelection ? 1 : 0);
  const lastEndStickyColumnIndex = visibleColumnsLength - 1 - end + (hasSelection ? 1 : 0);
  const startStickyColumnsWidth = cellWidths?.start[lastStartStickyColumnIndex] ?? 0;
  const endStickyColumnsWidth = cellWidths?.end[lastEndStickyColumnIndex] ?? 0;
  const totalStickySpace = startStickyColumnsWidth + endStickyColumnsWidth;

  useEffect(() => {
    let animationFrameId: number;
    const wrapper = wrapperRefObject?.current;
    if (!wrapper) {
      return;
    }
    const handleScroll = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      animationFrameId = requestAnimationFrame(() => {
        const isStuckToTheRight = wrapper.scrollLeft <= wrapper.scrollWidth - wrapper.clientWidth - tableRightPadding;
        const isStuckToTheLeft = wrapper.scrollLeft >= tableLeftPadding;
        setStartPaddingOffset(isStuckToTheLeft);
        setEndPaddingOffset(isStuckToTheRight);
      });
    };
    wrapper.addEventListener('scroll', handleScroll);
    return () => {
      wrapper.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [tableRefObject, wrapperRefObject, tableLeftPadding, tableRightPadding]);

  // We allow the table to have a minimum of 150px of available space besides the sum of the widths of the sticky columns
  const MINIMUM_SPACE_BESIDES_STICKY_COLUMNS = 150;

  const getStickyColumn = (colIndex: number): GetStickyColumn => {
    return {
      isSticky:
        colIndex + 1 <= (stickyColumns?.start ?? 0) || colIndex + 1 > visibleColumnsLength - (stickyColumns?.end ?? 0),
      isLastStart: colIndex + 1 === stickyColumns?.start,
      isLastEnd: colIndex === visibleColumnsLength - (stickyColumns?.end ?? 0),
      stickyStyles: getStickyStyles(colIndex),
    };
  };

  const getStickyStyles = (colIndex: number) => {
    if (!cellWidths?.start && !cellWidths?.end) {
      return {};
    }
    const isStickyStart = colIndex + 1 <= (stickyColumns?.start ?? 0);
    const isStickyEnd = colIndex + 1 > visibleColumnsLength - (stickyColumns?.end ?? 0);
    const isFirstOrLastStickyColumn = colIndex === 0 || colIndex === visibleColumnsLength - 1;
    const stickySide = isStickyStart ? 'left' : isStickyEnd ? 'right' : '';

    let paddingStyle = {};
    if (isFirstOrLastStickyColumn) {
      if (stickySide === 'right' && endPaddingOffset) {
        paddingStyle = { paddingRight: `${tableRightPadding}px` };
      }

      if (stickySide === 'left' && startPaddingOffset) {
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
  };

  useEffect(() => {
    // Add and remove refs
    setTableCellRefs(tableCellRefs =>
      [...new Array(visibleColumnsLength + (hasSelection ? 1 : 0))].map(
        (_: any, i: number) => tableCellRefs[i] || createRef<HTMLTableCellElement>()
      )
    );
  }, [visibleColumnsLength, hasSelection]);

  useEffect(() => {
    const shouldDisable =
      !stickyColumns ||
      totalStickySpace + MINIMUM_SPACE_BESIDES_STICKY_COLUMNS > (containerWidth ?? Number.MAX_SAFE_INTEGER);
    setShouldDisable(shouldDisable);
  }, [containerWidth, stickyColumns, totalStickySpace, visibleColumnsLength]);

  useLayoutEffect(() => {
    // First checks whether there are any sticky columns to calculate the widths for.
    // If there are none, the effect returns and does nothing.
    if (!(Boolean(stickyColumns?.start) || Boolean(stickyColumns?.end))) {
      return;
    }
    updateCellWidths({ tableCellRefs, setCellWidths });
  }, [tableCellRefs, stickyColumns]);

  return {
    tableCellRefs,
    cellWidths,
    setCellWidths,
    getStickyColumn,
    shouldDisableStickyColumns: shouldDisable,
    startStickyColumnsWidth,
    endStickyColumnsWidth,
  };
};
