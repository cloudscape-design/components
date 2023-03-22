// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useState, createRef, useEffect } from 'react';
import { warnOnce } from '../internal/logging';
import { TableProps } from './interfaces';
interface CellWidths {
  start: number[];
  end: number[];
}
interface StickyStyles {
  left?: string;
  right?: string;
  boxShadow?: string;
  clipPath?: string;
}

interface StickyColumnParams {
  visibleColumnsLength: number;
  hasSelection: boolean;
  stickyColumns?: TableProps.StickyColumns;
}

interface ShouldDisableStickyColumnsParams {
  visibleColumnsLength: number;
  stickyColumns?: {
    start?: number;
    end?: number;
  };
  cellWidths?: CellWidths;
  containerWidth: number | null;
  hasSelection: boolean;
}

export const getStickyStyles = ({
  colIndex,
  stickyColumns,
  visibleColumnsLength,
  hasSelection,
  cellWidths,
  isHeader,
}: {
  colIndex: number;
  stickyColumns?: TableProps.StickyColumns;
  visibleColumnsLength: number;
  hasSelection: boolean;
  cellWidths?: CellWidths;
  isHeader?: boolean;
}): StickyStyles => {
  const isStickyStart = colIndex + 1 <= (stickyColumns?.start ?? 0);
  const isStickyEnd = colIndex + 1 > visibleColumnsLength - (stickyColumns?.end ?? 0);
  const isLastLeftStickyColumn = colIndex + 1 === stickyColumns?.start;
  const isLastRightStickyColumn = colIndex === visibleColumnsLength - (stickyColumns?.end ?? 0);
  const stickySide = isStickyStart ? 'left' : isStickyEnd ? 'right' : '';

  const boxShadow = isLastLeftStickyColumn
    ? '4px 0px 20px 1px rgba(0, 7, 22, 0.1)'
    : isLastRightStickyColumn
    ? '-4px 0px 4px 1px rgba(0, 7, 22, 0.1)'
    : 'none';
  const clipPath = isLastLeftStickyColumn
    ? 'inset(0 -24px 0 0)'
    : isLastRightStickyColumn
    ? 'inset(0 0 0 -24px)'
    : 'none';

  return {
    [stickySide]: `${
      stickySide === 'right'
        ? cellWidths?.end[colIndex + (hasSelection ? 1 : 0)]
        : cellWidths?.start[colIndex + (hasSelection ? 1 : 0)]
    }px`,
    ...(!isHeader && { boxShadow }),
    ...(!isHeader && { clipPath }),
  };
};

export const isStickyColumn = ({
  colIndex,
  stickyColumns,
  visibleColumnsLength,
}: {
  colIndex: number;
  stickyColumns?: TableProps.StickyColumns;
  visibleColumnsLength: number;
}) => {
  return colIndex + 1 <= (stickyColumns?.start ?? 0) || colIndex + 1 > visibleColumnsLength - (stickyColumns?.end ?? 0);
};

export const updateCellWidths = ({
  tableCellRefs,
  setCellWidths,
}: {
  tableCellRefs: React.RefObject<HTMLTableCellElement>[];
  setCellWidths: (cellWidths: CellWidths) => void;
}): void => {
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

export const shouldDisableStickyColumns = ({
  visibleColumnsLength,
  stickyColumns,
  cellWidths,
  containerWidth,
  hasSelection,
}: ShouldDisableStickyColumnsParams) => {
  // We allow the table to have a minimum of 200px besides the sum of the widths of the sticky columns
  const MINIMUM_SPACE_BESIDES_STICKY_COLUMNS = 200;

  const lastStartStickyColumnIndex = stickyColumns?.start ? stickyColumns?.start + (hasSelection ? 1 : 0) : 0;
  const lastEndStickyColumnIndex = stickyColumns?.end
    ? visibleColumnsLength - 1 - stickyColumns?.end + (hasSelection ? 1 : 0)
    : 0;
  const totalStickySpace =
    (cellWidths?.start[lastStartStickyColumnIndex] ?? 0) + (cellWidths?.end[lastEndStickyColumnIndex] ?? 0);
  const shouldDisable = totalStickySpace + MINIMUM_SPACE_BESIDES_STICKY_COLUMNS > (containerWidth ?? 0);
  if (shouldDisable) {
    warnOnce(
      'Table',
      `The sum of all sticky columns widths must not be greater than the difference between the table container width and ${MINIMUM_SPACE_BESIDES_STICKY_COLUMNS}px.`
    );
  }
  return shouldDisable;
};

export const useStickyColumn = ({ visibleColumnsLength, hasSelection, stickyColumns }: StickyColumnParams) => {
  const [tableCellRefs, setTableCellRefs] = useState<Array<React.RefObject<HTMLTableCellElement>>>([]);
  const [cellWidths, setCellWidths] = useState<CellWidths>({ start: [], end: [] });

  useEffect(() => {
    // Add and remove refs
    setTableCellRefs(tableCellRefs =>
      [...new Array(visibleColumnsLength + (hasSelection ? 1 : 0))].map(
        (_: any, i: number) => tableCellRefs[i] || createRef<HTMLTableCellElement>()
      )
    );
  }, [visibleColumnsLength, hasSelection]);

  useLayoutEffect(() => {
    //  first checks whether there are any sticky columns to calculate the widths for.
    // If there are none, the effect returns and does nothing.
    if (!(Boolean(stickyColumns?.start) || Boolean(stickyColumns?.end))) {
      return;
    }
    updateCellWidths({ tableCellRefs, setCellWidths });
  }, [tableCellRefs, stickyColumns]);

  return { tableCellRefs, cellWidths, setCellWidths };
};
