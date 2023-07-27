// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import AsyncStore from '../../area-chart/async-store';
import { useStableEventHandler } from '../../internal/hooks/use-stable-event-handler';
import { useResizeObserver } from '../../internal/hooks/container-queries';
import clsx from 'clsx';

// We allow the table to have a minimum of 148px of available space besides the sum of the widths of the sticky columns
// This value is an UX recommendation and is approximately 1/3 of our smallest breakpoint (465px)
const MINIMUM_SCROLLABLE_SPACE = 148;

interface StickyColumnsProps {
  visibleColumns: readonly PropertyKey[];
  stickyColumnsFirst: number;
  stickyColumnsLast: number;
}

export interface StickyColumnsModel {
  isEnabled: boolean;
  store: StickyColumnsStore;
  style: {
    wrapper?: React.CSSProperties;
  };
  refs: {
    table: React.RefCallback<HTMLElement>;
    wrapper: React.RefCallback<HTMLElement>;
    cell: (columnId: PropertyKey, node: null | HTMLElement) => void;
  };
}

export interface StickyColumnsState {
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

export function useStickyColumns({
  visibleColumns,
  stickyColumnsFirst,
  stickyColumnsLast,
}: StickyColumnsProps): StickyColumnsModel {
  const store = useMemo(() => new StickyColumnsStore(), []);
  const wrapperRef = useRef<HTMLElement>(null) as React.MutableRefObject<null | HTMLElement>;
  const tableRef = useRef<HTMLElement>(null) as React.MutableRefObject<null | HTMLElement>;
  const cellsRef = useRef<Record<PropertyKey, HTMLElement>>({});

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

  // Update wrapper styles imperatively to avoid unnecessary re-renders.
  useEffect(() => {
    if (!hasStickyColumns) {
      return;
    }

    const selector = (state: StickyColumnsState) => state.wrapperState;

    const updateWrapperStyles = (state: StickyColumnsWrapperState, prev: StickyColumnsWrapperState) => {
      if (isWrapperStatesEqual(state, prev)) {
        return;
      }

      if (wrapperRef.current) {
        wrapperRef.current.style.scrollPaddingLeft = state.scrollPaddingLeft + 'px';
        wrapperRef.current.style.scrollPaddingRight = state.scrollPaddingRight + 'px';
      }
    };

    const unsubscribe = store.subscribe(selector, (newState, prevState) =>
      updateWrapperStyles(selector(newState), selector(prevState))
    );
    return unsubscribe;
  }, [store, hasStickyColumns]);

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

  const setCell = useCallback((columnId: PropertyKey, node: null | HTMLElement) => {
    if (node) {
      cellsRef.current[columnId] = node;
    } else {
      delete cellsRef.current[columnId];
    }
  }, []);

  return {
    isEnabled: hasStickyColumns,
    store,
    style: {
      // Provide wrapper styles as props so that a re-render won't cause invalidation.
      wrapper: hasStickyColumns ? { ...store.get().wrapperState } : undefined,
    },
    refs: { wrapper: setWrapper, table: setTable, cell: setCell },
  };
}

interface UseStickyCellStylesProps {
  stickyColumns: StickyColumnsModel;
  columnId: PropertyKey;
  getClassName: (styles: null | StickyColumnsCellState) => Record<string, boolean>;
}

interface StickyCellStyles {
  ref: React.RefCallback<HTMLElement>;
  className?: string;
  style?: React.CSSProperties;
}

export function useStickyCellStyles({
  stickyColumns,
  columnId,
  getClassName,
}: UseStickyCellStylesProps): StickyCellStyles {
  const cellRef = useRef<HTMLElement>(null) as React.MutableRefObject<HTMLElement>;
  const setCell = stickyColumns.refs.cell;

  // unsubscribeRef to hold the function to unsubscribe from the store's updates
  const unsubscribeRef = useRef<null | (() => void)>(null);

  // refCallback updates the cell ref and sets up the store subscription
  const refCallback = useCallback(
    node => {
      if (unsubscribeRef.current) {
        // Unsubscribe before we do any updates to avoid leaving any subscriptions hanging
        unsubscribeRef.current();
      }

      // Update cellRef and the store's state to point to the new DOM node
      cellRef.current = node;
      setCell(columnId, node);

      // Update cell styles imperatively to avoid unnecessary re-renders.
      const selector = (state: StickyColumnsState) => state.cellState[columnId];

      const updateCellStyles = (state: null | StickyColumnsCellState, prev: null | StickyColumnsCellState) => {
        if (isCellStatesEqual(state, prev)) {
          return;
        }

        const className = getClassName(state);
        const cellElement = cellRef.current;
        if (cellElement) {
          Object.keys(className).forEach(key => {
            if (className[key]) {
              cellElement.classList.add(key);
            } else {
              cellElement.classList.remove(key);
            }
          });
          cellElement.style.left = state?.offset.left !== undefined ? `${state.offset.left}px` : '';
          cellElement.style.right = state?.offset.right !== undefined ? `${state.offset.right}px` : '';
        }
      };

      // If the node is not null (i.e., the table cell is being mounted or updated, not unmounted),
      // set up a new subscription to the store's updates
      if (node) {
        unsubscribeRef.current = stickyColumns.store.subscribe(selector, (newState, prevState) => {
          updateCellStyles(selector(newState), selector(prevState));
        });
      }
    },

    // getClassName is expected to be pure
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnId, setCell, stickyColumns.store]
  );

  // Provide cell styles as props so that a re-render won't cause invalidation.
  const cellStyles = stickyColumns.store.get().cellState[columnId];
  return {
    ref: refCallback,
    className: cellStyles ? clsx(getClassName(cellStyles)) : undefined,
    style: cellStyles?.offset ?? undefined,
  };
}

function isCellStatesEqual(s1: null | StickyColumnsCellState, s2: null | StickyColumnsCellState): boolean {
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

function isWrapperStatesEqual(s1: StickyColumnsWrapperState, s2: StickyColumnsWrapperState): boolean {
  return s1.scrollPaddingLeft === s2.scrollPaddingLeft && s1.scrollPaddingRight === s2.scrollPaddingRight;
}

interface UpdateCellStylesProps {
  wrapper: HTMLElement;
  table: HTMLElement;
  cells: Record<PropertyKey, HTMLElement>;
  visibleColumns: readonly PropertyKey[];
  stickyColumnsFirst: number;
  stickyColumnsLast: number;
}

class StickyColumnsStore extends AsyncStore<StickyColumnsState> {
  private cellOffsets = new Map<PropertyKey, { first: number; last: number }>();
  private stickyWidthLeft = 0;
  private stickyWidthRight = 0;
  private isStuckToTheLeft = false;
  private isStuckToTheRight = false;
  private padLeft = false;

  constructor() {
    super({ cellState: {}, wrapperState: { scrollPaddingLeft: 0, scrollPaddingRight: 0 } });
  }

  public updateCellStyles(props: UpdateCellStylesProps) {
    const hasStickyColumns = props.stickyColumnsFirst + props.stickyColumnsLast > 0;
    const hadStickyColumns = this.cellOffsets.size > 0;

    if (hasStickyColumns || hadStickyColumns) {
      this.updateScroll(props);
      this.updateCellOffsets(props);
      this.set(() => ({
        cellState: this.generateCellStyles(props),
        wrapperState: { scrollPaddingLeft: this.stickyWidthLeft, scrollPaddingRight: this.stickyWidthRight },
      }));
    }
  }

  private updateScroll(props: UpdateCellStylesProps) {
    const wrapperScrollLeft = props.wrapper.scrollLeft;
    const wrapperScrollWidth = props.wrapper.scrollWidth;
    const wrapperClientWidth = props.wrapper.clientWidth;
    const tablePaddingLeft = parseFloat(getComputedStyle(props.table).paddingLeft) || 0;
    const tablePaddingRight = parseFloat(getComputedStyle(props.table).paddingRight) || 0;

    this.isStuckToTheLeft = wrapperScrollLeft > tablePaddingLeft;

    // Math.ceil() is used here to address an edge-case in certain browsers, where they return non-integer wrapperScrollLeft values
    // which are lower than expected (sub-pixel difference), resulting in the table always being in the "stuck to the right" state
    this.isStuckToTheRight = Math.ceil(wrapperScrollLeft) < wrapperScrollWidth - wrapperClientWidth - tablePaddingRight;

    this.padLeft = tablePaddingLeft !== 0 && this.isStuckToTheLeft;
  }

  private generateCellStyles = (props: UpdateCellStylesProps): Record<PropertyKey, null | StickyColumnsCellState> => {
    const isEnabled = this.isEnabled(props);
    const lastLeftStickyColumnIndex = props.stickyColumnsFirst - 1;
    const lastRightStickyColumnIndex = props.visibleColumns.length - props.stickyColumnsLast;

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

      acc[columnId] = {
        padLeft: isFirstColumn && this.padLeft,
        lastLeft: this.isStuckToTheLeft && lastLeftStickyColumnIndex === index,
        lastRight: this.isStuckToTheRight && lastRightStickyColumnIndex === index,
        offset: {
          left: stickySide === 'left' ? stickyColumnOffsetLeft : undefined,
          right: stickySide === 'right' ? stickyColumnOffsetRight : undefined,
        },
      };
      return acc;
    }, {} as Record<PropertyKey, null | StickyColumnsCellState>);
  };

  private updateCellOffsets = (props: UpdateCellStylesProps): void => {
    const firstColumnsWidths: number[] = [];
    for (let i = 0; i < props.visibleColumns.length; i++) {
      const element = props.cells[props.visibleColumns[i]];
      const cellWidth = element.getBoundingClientRect().width ?? 0;
      firstColumnsWidths[i] = (firstColumnsWidths[i - 1] ?? 0) + cellWidth;
    }

    const lastColumnsWidths: number[] = [];
    for (let i = props.visibleColumns.length - 1; i >= 0; i--) {
      const element = props.cells[props.visibleColumns[i]];
      const cellWidth = element.getBoundingClientRect().width ?? 0;
      lastColumnsWidths[i] = (lastColumnsWidths[i + 1] ?? 0) + cellWidth;
    }
    lastColumnsWidths.reverse();

    this.stickyWidthLeft = firstColumnsWidths[props.stickyColumnsFirst - 1] ?? 0;
    this.stickyWidthRight = lastColumnsWidths[props.stickyColumnsLast - 1] ?? 0;
    this.cellOffsets = props.visibleColumns.reduce(
      (map, columnId, columnIndex) =>
        map.set(columnId, {
          first: firstColumnsWidths[columnIndex - 1] ?? 0,
          last: lastColumnsWidths[props.visibleColumns.length - 1 - columnIndex - 1] ?? 0,
        }),
      new Map()
    );
  };

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
    const tablePaddingLeft = parseFloat(getComputedStyle(props.table).paddingLeft) || 0;
    const tablePaddingRight = parseFloat(getComputedStyle(props.table).paddingRight) || 0;
    const hasEnoughScrollableSpace =
      totalStickySpace + MINIMUM_SCROLLABLE_SPACE + tablePaddingLeft + tablePaddingRight < wrapperWidth;
    if (!hasEnoughScrollableSpace) {
      return false;
    }

    return true;
  };
}
