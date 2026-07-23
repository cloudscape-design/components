// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { getScrollableParents } from '../internal/utils/scrollable-containers';

const AUTO_SKELETON_VIEWPORT_BUFFER = 16;
const SKELETON_ROW_SELECTOR = 'tr[aria-hidden="true"]';

interface AutoSkeletonRowsCalculation {
  maxRows?: number;
  rowHeight: number;
  skeletonRowBottom: number;
  skeletonRowTop: number;
  tableBottom: number;
  viewportBottom: number;
}

interface AutoSkeletonRowReductionCalculation {
  currentRows: number;
  overflowHeight: number;
  rowHeight: number;
}

interface UseAutoSkeletonRowsProps {
  enabled: boolean;
  maxRows?: number;
  tableBodyRef: React.RefObject<HTMLTableSectionElement>;
  tableRootRef: React.RefObject<HTMLElement>;
  tableWrapperRef: React.RefObject<HTMLElement>;
}

function getDocumentViewportBottom() {
  return document.documentElement.clientHeight || window.innerHeight;
}

function getViewportBottom(element: HTMLElement) {
  return getScrollableParents(element).reduce(
    (viewportBottom, scrollContainer) => Math.min(viewportBottom, scrollContainer.getBoundingClientRect().bottom),
    getDocumentViewportBottom()
  );
}

function getOverflowHeight(element: HTMLElement) {
  const scrollContainer = getScrollableParents(element)[0];
  if (scrollContainer) {
    return Math.max(0, scrollContainer.scrollHeight - scrollContainer.clientHeight);
  }

  return Math.max(
    0,
    Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - getDocumentViewportBottom()
  );
}

function calculateAutoSkeletonRows({
  maxRows,
  rowHeight,
  skeletonRowBottom,
  skeletonRowTop,
  tableBottom,
  viewportBottom,
}: AutoSkeletonRowsCalculation) {
  const staticHeightBelowSkeletonRow = Math.max(0, tableBottom - skeletonRowBottom);
  const availableHeight = Math.max(
    0,
    viewportBottom - skeletonRowTop - staticHeightBelowSkeletonRow - AUTO_SKELETON_VIEWPORT_BUFFER
  );
  const rows = Math.floor(availableHeight / rowHeight);
  return Math.max(1, Math.min(maxRows ?? Number.POSITIVE_INFINITY, rows));
}

function calculateAutoSkeletonRowReduction({
  currentRows,
  overflowHeight,
  rowHeight,
}: AutoSkeletonRowReductionCalculation) {
  return Math.min(
    currentRows - 1,
    Math.max(1, Math.ceil((overflowHeight + AUTO_SKELETON_VIEWPORT_BUFFER) / rowHeight))
  );
}

export function useAutoSkeletonRows({
  enabled,
  maxRows,
  tableBodyRef,
  tableRootRef,
  tableWrapperRef,
}: UseAutoSkeletonRowsProps) {
  const [rows, setRows] = useState(1);
  const rowHeightRef = useRef<number>();

  const updateRows = useCallback(() => {
    if (!enabled) {
      return;
    }

    const tableRoot = tableRootRef.current;
    const tableWrapper = tableWrapperRef.current;
    const skeletonRows = tableBodyRef.current?.querySelectorAll<HTMLElement>(SKELETON_ROW_SELECTOR);
    const firstSkeletonRowRect = skeletonRows?.[0]?.getBoundingClientRect();
    const lastSkeletonRowRect = skeletonRows?.[skeletonRows.length - 1]?.getBoundingClientRect();
    const rowHeight = lastSkeletonRowRect?.height ?? rowHeightRef.current;

    if (!tableRoot || !tableWrapper || !firstSkeletonRowRect || !lastSkeletonRowRect || !rowHeight) {
      return;
    }

    rowHeightRef.current = rowHeight;
    const nextRows = calculateAutoSkeletonRows({
      maxRows,
      rowHeight,
      skeletonRowBottom: lastSkeletonRowRect.bottom,
      skeletonRowTop: firstSkeletonRowRect.top,
      tableBottom: tableRoot.getBoundingClientRect().bottom,
      viewportBottom: getViewportBottom(tableWrapper),
    });
    setRows(currentRows => (currentRows === nextRows ? currentRows : nextRows));
  }, [enabled, maxRows, tableBodyRef, tableRootRef, tableWrapperRef]);

  useLayoutEffect(updateRows, [updateRows]);

  useLayoutEffect(() => {
    const tableWrapper = tableWrapperRef.current;
    const rowHeight = rowHeightRef.current;
    if (!enabled || rows === 1 || !tableWrapper || !rowHeight) {
      return;
    }

    const overflowHeight = getOverflowHeight(tableWrapper);
    if (overflowHeight === 0) {
      return;
    }

    const rowsToRemove = calculateAutoSkeletonRowReduction({ currentRows: rows, overflowHeight, rowHeight });
    setRows(currentRows => currentRows - rowsToRemove);
  }, [enabled, rows, tableWrapperRef]);

  useLayoutEffect(() => {
    if (!enabled || typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const tableRoot = tableRootRef.current;
    const tableWrapper = tableWrapperRef.current;
    if (!tableRoot || !tableWrapper) {
      return undefined;
    }

    const resizeObserver = new ResizeObserver(updateRows);
    resizeObserver.observe(tableRoot);
    resizeObserver.observe(tableWrapper);
    getScrollableParents(tableWrapper).forEach(scrollContainer => resizeObserver.observe(scrollContainer));
    window.addEventListener('resize', updateRows);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateRows);
    };
  }, [enabled, tableRootRef, tableWrapperRef, updateRows]);

  return rows;
}
