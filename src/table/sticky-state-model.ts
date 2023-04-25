// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import AsyncStore, { useReaction } from '../area-chart/model/async-store';
import { useStableEventHandler } from '../internal/hooks/use-stable-event-handler';
import clsx from 'clsx';
import { useResizeObserver } from '../internal/hooks/container-queries';

export const selectionColumnId = Symbol('selection-column-id');

// We allow the table to have a minimum of 148px of available space besides the sum of the widths of the sticky columns
// This value is an UX recommendation and is approximately 1/3 of our smallest breakpoint (465px)
const MINIMUM_SCROLLABLE_SPACE = 148;

type ColumnId = string | symbol;

interface StickyStateProps {
  visibleColumns: readonly ColumnId[];
  stickyColumnsFirst: number;
  stickyColumnsLast: number;
}

export interface StickyStateModel {
  store: StickyColumnsStore;
  style: {
    wrapper?: React.CSSProperties;
  };
  refs: {
    table: React.RefCallback<HTMLElement>;
    wrapper: React.RefCallback<HTMLElement>;
    cell: (columnId: ColumnId, node: null | HTMLElement) => void;
  };
}

export interface StickyState {
  cellStyles: Record<ColumnId, null | StickyStateCellStyles>;
  scrollPadding: { left: number; right: number };
}

interface UpdateScrollProps {
  wrapper: HTMLElement;
  table: HTMLElement;
}

export interface StickyStateCellStyles {
  padLeft: boolean;
  lastLeft: boolean;
  lastRight: boolean;
  offset: { left?: number; right?: number };
}

interface UseStickyStylesProps {
  stickyState: StickyStateModel;
  columnId: ColumnId;
  getClassName: (styles: null | StickyStateCellStyles) => Record<string, boolean>;
}

interface StickyStyles {
  ref: React.RefCallback<HTMLElement>;
  className?: string;
  style?: React.CSSProperties;
}

export function useStickyStyles({ stickyState, columnId, getClassName }: UseStickyStylesProps): StickyStyles {
  const ref = useRef<HTMLElement>(null) as React.MutableRefObject<HTMLElement>;
  const setCell = stickyState.refs.cell;
  const refCallback = useCallback(
    node => {
      ref.current = node;
      setCell(columnId, node);
    },
    [columnId, setCell]
  );

  useReaction(
    stickyState.store,
    state => state.cellStyles[columnId],
    props => {
      const className = getClassName(props);

      const cellElement = ref.current;
      if (cellElement) {
        Object.keys(className).forEach(key => {
          if (className[key]) {
            cellElement.classList.add(key);
          } else {
            cellElement.classList.remove(key);
          }
        });
        cellElement.style.left = props?.offset?.left !== undefined ? `${props?.offset?.left}px` : '';
        cellElement.style.right = props?.offset?.right !== undefined ? `${props?.offset?.right}px` : '';
      }
    }
  );

  const cellStyles = stickyState.store.get().cellStyles[columnId];
  return {
    ref: refCallback,
    className: cellStyles ? clsx(getClassName(cellStyles)) : undefined,
    style: cellStyles?.offset ?? undefined,
  };
}

export function useStickyState({
  visibleColumns,
  stickyColumnsFirst,
  stickyColumnsLast,
}: StickyStateProps): StickyStateModel {
  const store = useMemo(() => new StickyColumnsStore(), []);
  const wrapperRef = useRef<HTMLElement>(null) as React.MutableRefObject<null | HTMLElement>;
  const tableRef = useRef<HTMLElement>(null) as React.MutableRefObject<null | HTMLElement>;
  const cellsRef = useRef<Record<ColumnId, HTMLElement>>({});

  const hasStickyColumns = stickyColumnsFirst + stickyColumnsLast > 0;

  const updateStickyStyles = useStableEventHandler(() => {
    if (wrapperRef.current && tableRef.current) {
      store.updateCellStyles({
        wrapper: wrapperRef.current,
        table: tableRef.current,
        cells: cellsRef.current,
        visibleColumns,
        stickyColumnsFirst,
        stickyColumnsLast,
      });
    }
  });

  useResizeObserver(wrapperRef, updateStickyStyles);

  useResizeObserver(tableRef, updateStickyStyles);

  useEffect(() => {
    if (wrapperRef.current && tableRef.current) {
      store.updateCellStyles({
        wrapper: wrapperRef.current,
        table: tableRef.current,
        cells: cellsRef.current,
        visibleColumns,
        stickyColumnsFirst,
        stickyColumnsLast,
      });
    }
  }, [store, stickyColumnsFirst, stickyColumnsLast, visibleColumns]);

  useReaction(
    store,
    state => state.scrollPadding,
    props => {
      if (wrapperRef.current) {
        wrapperRef.current.style.scrollPaddingLeft = props.left + 'px';
        wrapperRef.current.style.scrollPaddingRight = props.right + 'px';
      }
    }
  );

  const setWrapper = useCallback(
    (node: null | HTMLElement) => {
      if (wrapperRef.current) {
        wrapperRef.current.removeEventListener('scroll', updateStickyStyles);
      }
      if (node && hasStickyColumns) {
        node.addEventListener('scroll', updateStickyStyles);
      }

      wrapperRef.current = node;
    },
    [hasStickyColumns, updateStickyStyles]
  );

  const setTable = useCallback((node: null | HTMLElement) => {
    tableRef.current = node;
  }, []);

  const setCell = useCallback((columnId: ColumnId, node: null | HTMLElement) => {
    if (node) {
      cellsRef.current[columnId] = node;
    } else {
      delete cellsRef.current[columnId];
    }
  }, []);

  return {
    store,
    style: {
      wrapper: hasStickyColumns
        ? {
            scrollPaddingLeft: store.get().scrollPadding.left + 'px',
            scrollPaddingRight: store.get().scrollPadding.right + 'px',
          }
        : undefined,
    },
    refs: { wrapper: setWrapper, table: setTable, cell: setCell },
  };
}

interface UpdateCellStylesProps {
  wrapper: HTMLElement;
  table: HTMLElement;
  cells: Record<ColumnId, HTMLElement>;
  visibleColumns: readonly ColumnId[];
  stickyColumnsFirst: number;
  stickyColumnsLast: number;
}

export default class StickyColumnsStore extends AsyncStore<StickyState> {
  private cellOffsets = new Map<ColumnId, { first: number; last: number }>();
  private stickyWidthLeft = 0;
  private stickyWidthRight = 0;
  private isStuckToTheLeft = false;
  private isStuckToTheRight = false;

  constructor() {
    super({ cellStyles: {}, scrollPadding: { left: 0, right: 0 } });
  }

  updateScroll(props: UpdateScrollProps) {
    const wrapperScrollLeft = props.wrapper.scrollLeft;
    const wrapperScrollWidth = props.wrapper.scrollWidth;
    const wrapperClientWidth = props.wrapper.clientWidth;
    const tablePaddingLeft = parseInt(getComputedStyle(props.table).paddingLeft) || 0;
    const tablePaddingRight = parseInt(getComputedStyle(props.table).paddingRight) || 0;

    this.isStuckToTheLeft = wrapperScrollLeft > tablePaddingLeft;
    this.isStuckToTheRight = Math.ceil(wrapperScrollLeft) < wrapperScrollWidth - wrapperClientWidth - tablePaddingRight;
  }

  updateCellStyles(props: UpdateCellStylesProps) {
    const hasStickyColumns = props.stickyColumnsFirst + props.stickyColumnsLast > 0;
    const hadStickyColumns = this.cellOffsets.size > 0;

    if (hasStickyColumns || hadStickyColumns) {
      this.updateScroll(props);
      this.updateCellOffsets(props);
      this.set(() => ({
        cellStyles: this.generateCellStyles(props),
        scrollPadding: { left: this.stickyWidthLeft, right: this.stickyWidthRight },
      }));
    }
  }

  private generateCellStyles = (props: UpdateCellStylesProps): Record<ColumnId, null | StickyStateCellStyles> => {
    const isEnabled = this.isEnabled(props);

    return props.visibleColumns.reduce((acc, columnId, index) => {
      let stickySide = 'non-sticky';
      if (index < props.stickyColumnsFirst) {
        stickySide = 'left';
      } else if (index >= props.visibleColumns.length - props.stickyColumnsLast) {
        stickySide = 'right';
      }

      if (!isEnabled || stickySide === 'non-sticky') {
        acc[columnId] = null;
        return acc;
      }

      // Determine the offset of the sticky column using the `cellOffsets` state object
      const isFirstColumn = index === 0;
      const stickyColumnOffsetLeft = this.cellOffsets.get(columnId)?.first ?? 0;
      const stickyColumnOffsetRight = this.cellOffsets.get(columnId)?.last ?? 0;
      const cellStyle = {
        left: stickyColumnOffsetLeft !== undefined && stickySide === 'left' ? stickyColumnOffsetLeft : undefined,
        right: stickyColumnOffsetRight !== undefined && stickySide === 'right' ? stickyColumnOffsetRight : undefined,
      };
      const lastLeftStickyColumnIndex = props.stickyColumnsFirst - 1;
      const lastRightStickyColumnIndex = props.visibleColumns.length - props.stickyColumnsLast;

      const tablePaddingLeft = parseInt(getComputedStyle(props.table).paddingLeft) || 0;

      acc[columnId] = {
        padLeft: isFirstColumn && tablePaddingLeft !== 0 && this.isStuckToTheLeft,
        lastLeft: this.isStuckToTheLeft && lastLeftStickyColumnIndex === index,
        lastRight: this.isStuckToTheRight && lastRightStickyColumnIndex === index,
        offset: cellStyle,
      };

      return acc;
    }, {} as Record<ColumnId, null | StickyStateCellStyles>);
  };

  updateCellOffsets = (props: UpdateCellStylesProps): void => {
    const firstColumnWidths: number[] = [];
    for (let i = 0; i < props.visibleColumns.length; i++) {
      const element = props.cells[props.visibleColumns[i]];
      const cellWidth = element.getBoundingClientRect().width ?? 0;
      firstColumnWidths[i] = (firstColumnWidths[i - 1] ?? 0) + cellWidth;
    }

    const lastColumnsWidths: number[] = [];
    for (let i = props.visibleColumns.length - 1; i >= 0; i--) {
      const element = props.cells[props.visibleColumns[i]];
      const cellWidth = element.getBoundingClientRect().width ?? 0;
      lastColumnsWidths[i] = (lastColumnsWidths[i + 1] ?? 0) + cellWidth;
    }
    lastColumnsWidths.reverse();

    this.stickyWidthLeft = firstColumnWidths[props.stickyColumnsFirst - 1] ?? 0;
    this.stickyWidthRight = lastColumnsWidths[props.stickyColumnsLast - 1] ?? 0;
    this.cellOffsets = props.visibleColumns.reduce(
      (map, columnId, columnIndex) =>
        map.set(columnId, {
          first: firstColumnWidths[columnIndex - 1] ?? 0,
          last: lastColumnsWidths[props.visibleColumns.length - 1 - columnIndex - 1] ?? 0,
        }),
      new Map()
    );
  };

  // TODO: Memoize this?
  private isEnabled = (props: UpdateCellStylesProps): boolean => {
    const noStickyColumns = props.stickyColumnsFirst + props.stickyColumnsLast === 0;
    if (noStickyColumns) {
      return false;
    }

    const wrapperWidth = props.wrapper.getBoundingClientRect().width;
    const tableWidth = props.table.getBoundingClientRect().width;
    const isWrapperScrollable = tableWidth > wrapperWidth;
    if (!isWrapperScrollable) {
      return false;
    }

    const totalStickySpace = this.stickyWidthLeft + this.stickyWidthRight;
    const tablePaddingLeft = parseInt(getComputedStyle(props.table).paddingLeft) || 0;
    const tablePaddingRight = parseInt(getComputedStyle(props.table).paddingRight) || 0;
    const hasEnoughScrollableSpace =
      totalStickySpace + MINIMUM_SCROLLABLE_SPACE + tablePaddingLeft + tablePaddingRight < wrapperWidth;
    if (!hasEnoughScrollableSpace) {
      return false;
    }

    return true;
  };
}
