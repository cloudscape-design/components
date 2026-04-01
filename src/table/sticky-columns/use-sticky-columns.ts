// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import clsx from 'clsx';

import { useResizeObserver, useStableCallback } from '@cloudscape-design/component-toolkit/internal';
import { getLogicalBoundingClientRect, getScrollInlineStart } from '@cloudscape-design/component-toolkit/internal';

import AsyncStore, { ReadonlyAsyncStore } from '../../area-chart/async-store';
import {
  CellOffsets,
  GroupHierarchyInfo,
  StickyColumnsCellState,
  StickyColumnsGroupHeaderState,
  StickyColumnsProps,
  StickyColumnsState,
  StickyColumnsWrapperState,
} from './interfaces';
import { isCellStatesEqual, isGroupHeaderStatesEqual, isWrapperStatesEqual, updateCellOffsets } from './utils';

// We allow the table to have a minimum of 148px of available space besides the sum of the widths of the sticky columns
// This value is an UX recommendation and is approximately 1/3 of our smallest breakpoint (465px)
const MINIMUM_SCROLLABLE_SPACE = 148;

export interface StickyColumnsModel {
  store: ReadonlyAsyncStore<StickyColumnsState>;
  style: {
    wrapper?: React.CSSProperties;
  };
  refs: {
    table: React.RefCallback<HTMLElement>;
    wrapper: React.RefCallback<HTMLElement>;
    cell: (columnId: PropertyKey, node: null | HTMLElement) => void;
  };
}

export function useStickyColumns({
  visibleColumns,
  stickyColumnsFirst,
  stickyColumnsLast,
  groupHierarchy,
}: StickyColumnsProps): StickyColumnsModel {
  const store = useMemo(() => new StickyColumnsStore(), []);
  const wrapperRef = useRef<HTMLElement>(null) as React.MutableRefObject<null | HTMLElement>;
  const tableRef = useRef<HTMLElement>(null) as React.MutableRefObject<null | HTMLElement>;
  const cellsRef = useRef(new Map<PropertyKey, HTMLElement>());

  const hasStickyColumns = stickyColumnsFirst + stickyColumnsLast > 0;

  const updateStickyStyles = useStableCallback(() => {
    if (wrapperRef.current && tableRef.current) {
      store.updateCellStyles({
        wrapper: wrapperRef.current,
        table: tableRef.current,
        cells: cellsRef.current,
        visibleColumns,
        stickyColumnsFirst,
        stickyColumnsLast,
        groupHierarchy,
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
        groupHierarchy,
      });
    }
  }, [store, stickyColumnsFirst, stickyColumnsLast, visibleColumns, groupHierarchy]);

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
        wrapperRef.current.style.scrollPaddingInlineStart = state.scrollPaddingInlineStart + 'px';
        wrapperRef.current.style.scrollPaddingInlineEnd = state.scrollPaddingInlineEnd + 'px';
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
      cellsRef.current.set(columnId, node);
    } else {
      cellsRef.current.delete(columnId);
    }
  }, []);

  return {
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
  const setCell = stickyColumns.refs.cell;

  // unsubscribeRef to hold the function to unsubscribe from the store's updates
  const unsubscribeRef = useRef<null | (() => void)>(null);

  // refCallback updates the cell ref and sets up the store subscription
  const refCallback = useCallback(
    (cellElement: null | HTMLElement) => {
      if (unsubscribeRef.current) {
        // Unsubscribe before we do any updates to avoid leaving any subscriptions hanging
        unsubscribeRef.current();
      }

      // Update cellRef and the store's state to point to the new DOM node
      setCell(columnId, cellElement);

      // Update cell styles imperatively to avoid unnecessary re-renders.
      const selector = (state: StickyColumnsState) => state.cellState.get(columnId) ?? null;

      const updateCellStyles = (state: null | StickyColumnsCellState, prev: null | StickyColumnsCellState) => {
        if (isCellStatesEqual(state, prev)) {
          return;
        }

        const className = getClassName(state);
        if (cellElement) {
          Object.keys(className).forEach(key => {
            if (className[key]) {
              cellElement.classList.add(key);
            } else {
              cellElement.classList.remove(key);
            }
          });
          cellElement.style.insetInlineStart =
            state?.offset.insetInlineStart !== undefined ? `${state.offset.insetInlineStart}px` : '';
          cellElement.style.insetInlineEnd =
            state?.offset.insetInlineEnd !== undefined ? `${state.offset.insetInlineEnd}px` : '';
        }
      };

      // If the node is not null (i.e., the table cell is being mounted or updated, not unmounted),
      // set up a new subscription to the store's updates
      if (cellElement) {
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
  const cellStyles = stickyColumns.store.get().cellState.get(columnId);
  return {
    ref: refCallback,
    className: cellStyles ? clsx(getClassName(cellStyles)) : undefined,
    style: cellStyles?.offset ?? undefined,
  };
}

interface UseStickyGroupHeaderStylesProps {
  stickyColumns: StickyColumnsModel;
  groupId: string;
  getClassName: (styles: null | StickyColumnsGroupHeaderState) => Record<string, boolean>;
}

interface StickyGroupHeaderStyles {
  ref: React.RefCallback<HTMLElement>;
  innerRef: React.RefCallback<HTMLElement>;
  className?: string;
  style?: React.CSSProperties;
}

export function useStickyGroupHeaderStyles({
  stickyColumns,
  groupId,
  getClassName,
}: UseStickyGroupHeaderStylesProps): StickyGroupHeaderStyles {
  const unsubscribeRef = useRef<null | (() => void)>(null);
  const innerElementRef = useRef<null | HTMLElement>(null);

  const refCallback = useCallback(
    (thElement: null | HTMLElement) => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }

      const selector = (state: StickyColumnsState) => state.groupHeaderState.get(groupId) ?? null;

      const updateStyles = (
        state: null | StickyColumnsGroupHeaderState,
        prev: null | StickyColumnsGroupHeaderState
      ) => {
        if (isGroupHeaderStatesEqual(state, prev)) {
          return;
        }

        const className = getClassName(state);
        if (thElement) {
          Object.keys(className).forEach(key => {
            if (className[key]) {
              thElement.classList.add(key);
            } else {
              thElement.classList.remove(key);
            }
          });
          thElement.style.position = state?.position ?? '';
          thElement.style.zIndex = state?.zIndex !== undefined && state?.zIndex !== '' ? `${state.zIndex}` : '';
          thElement.style.insetInlineStart =
            state?.offset.insetInlineStart !== undefined ? `${state.offset.insetInlineStart}px` : '';
          thElement.style.insetInlineEnd =
            state?.offset.insetInlineEnd !== undefined ? `${state.offset.insetInlineEnd}px` : '';
          thElement.style.clipPath = state?.clipPath ?? '';
        }

        const innerEl = innerElementRef.current;
        if (innerEl) {
          innerEl.style.maxWidth = state?.maxWidth !== undefined && state?.maxWidth !== '' ? `${state.maxWidth}px` : '';
          innerEl.style.insetInlineStart = state?.innerInsetInlineStart ?? '';
          innerEl.style.insetInlineEnd = state?.innerInsetInlineEnd ?? '';
        }
      };

      if (thElement) {
        unsubscribeRef.current = stickyColumns.store.subscribe(selector, (newState, prevState) => {
          updateStyles(selector(newState), selector(prevState));
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groupId, stickyColumns.store]
  );

  const innerRefCallback = useCallback((node: null | HTMLElement) => {
    innerElementRef.current = node;
  }, []);

  const groupStyles = stickyColumns.store.get().groupHeaderState.get(groupId);
  return {
    ref: refCallback,
    innerRef: innerRefCallback,
    className: groupStyles ? clsx(getClassName(groupStyles)) : undefined,
    style: groupStyles?.offset ?? undefined,
  };
}

interface UpdateCellStylesProps {
  wrapper: HTMLElement;
  table: HTMLElement;
  cells: Map<PropertyKey, HTMLElement>;
  visibleColumns: readonly PropertyKey[];
  stickyColumnsFirst: number;
  stickyColumnsLast: number;
  groupHierarchy?: GroupHierarchyInfo[];
}

class StickyColumnsStore extends AsyncStore<StickyColumnsState> {
  private cellOffsets: CellOffsets = {
    offsets: new Map(),
    stickyWidthInlineStart: 0,
    stickyWidthInlineEnd: 0,
  };
  private isStuckToTheInlineStart = false;
  private isStuckToTheInlineEnd = false;
  private padInlineStart = false;

  constructor() {
    super({
      cellState: new Map(),
      wrapperState: { scrollPaddingInlineStart: 0, scrollPaddingInlineEnd: 0 },
      groupHeaderState: new Map(),
    });
  }

  public updateCellStyles(props: UpdateCellStylesProps) {
    const hasStickyColumns = props.stickyColumnsFirst + props.stickyColumnsLast > 0;
    const hadStickyColumns = this.cellOffsets.offsets.size > 0;

    if (hasStickyColumns || hadStickyColumns) {
      this.updateScroll(props);
      this.updateCellOffsets(props);
      const cellState = this.generateCellStyles(props);
      const groupHeaderState = this.generateGroupHeaderStyles(props, cellState);
      this.set(() => ({
        cellState,
        wrapperState: {
          scrollPaddingInlineStart: this.cellOffsets.stickyWidthInlineStart,
          scrollPaddingInlineEnd: this.cellOffsets.stickyWidthInlineEnd,
        },
        groupHeaderState,
      }));
    }
  }

  private updateScroll(props: UpdateCellStylesProps) {
    const wrapperScrollInlineStart = getScrollInlineStart(props.wrapper);
    const wrapperScrollWidth = props.wrapper.scrollWidth;
    const wrapperClientWidth = props.wrapper.clientWidth;
    const tablePaddingInlineStart = parseFloat(getComputedStyle(props.table).paddingInlineStart) || 0;
    const tablePaddingInlineEnd = parseFloat(getComputedStyle(props.table).paddingInlineEnd) || 0;

    this.isStuckToTheInlineStart = wrapperScrollInlineStart > tablePaddingInlineStart;

    // Math.ceil() is used here to address an edge-case in certain browsers, where they return non-integer wrapperScrollInlineStart values
    // which are lower than expected (sub-pixel difference), resulting in the table always being in the "stuck to the right" state
    this.isStuckToTheInlineEnd =
      Math.ceil(wrapperScrollInlineStart) < wrapperScrollWidth - wrapperClientWidth - tablePaddingInlineEnd;

    this.padInlineStart = tablePaddingInlineStart !== 0 && this.isStuckToTheInlineStart;
  }

  private generateCellStyles = (props: UpdateCellStylesProps): Map<PropertyKey, StickyColumnsCellState> => {
    const isEnabled = this.isEnabled(props);
    const lastLeftStickyColumnIndex = props.stickyColumnsFirst - 1;
    const lastRightStickyColumnIndex = props.visibleColumns.length - props.stickyColumnsLast;

    return props.visibleColumns.reduce((acc, columnId, index) => {
      let stickySide = 'non-sticky';
      if (index < props.stickyColumnsFirst) {
        stickySide = 'inline-start';
      } else if (index >= props.visibleColumns.length - props.stickyColumnsLast) {
        stickySide = 'inline-end';
      }

      if (!isEnabled || stickySide === 'non-sticky') {
        return acc;
      }

      // Determine the offset of the sticky column using the `cellOffsets` state object
      const isFirstColumn = index === 0;
      const stickyColumnOffsetLeft = this.cellOffsets.offsets.get(columnId)?.first ?? 0;
      const stickyColumnOffsetRight = this.cellOffsets.offsets.get(columnId)?.last ?? 0;

      acc.set(columnId, {
        padInlineStart: isFirstColumn && this.padInlineStart,
        lastInsetInlineStart: this.isStuckToTheInlineStart && lastLeftStickyColumnIndex === index,
        lastInsetInlineEnd: this.isStuckToTheInlineEnd && lastRightStickyColumnIndex === index,
        offset: {
          insetInlineStart: stickySide === 'inline-start' ? stickyColumnOffsetLeft : undefined,
          insetInlineEnd: stickySide === 'inline-end' ? stickyColumnOffsetRight : undefined,
        },
      });
      return acc;
    }, new Map<PropertyKey, StickyColumnsCellState>());
  };

  // Computes group header sticky state using live bounding rects from the wrapper
  // and group <th> elements. This is the hybrid approach: the store has the correct
  // wrapper ref (fixing the dual-thead bug) and runs synchronously (fixing frame lag),
  // while using live DOM measurements for dynamic maxWidth (matching the visual behavior
  // of the original per-cell computeVisibleWidth).
  private generateGroupHeaderStyles = (
    props: UpdateCellStylesProps,
    cellState: Map<PropertyKey, StickyColumnsCellState>
  ): Map<string, StickyColumnsGroupHeaderState> => {
    const groupHeaderState = new Map<string, StickyColumnsGroupHeaderState>();
    if (!props.groupHierarchy || !this.isEnabled(props)) {
      return groupHeaderState;
    }

    const wrapperRect = props.wrapper.getBoundingClientRect();
    const lastLeftStickyColumnIndex = props.stickyColumnsFirst - 1;
    const firstRightStickyColumnIndex = props.visibleColumns.length - props.stickyColumnsLast;

    for (const group of props.groupHierarchy) {
      const firstChildState = cellState.get(group.firstChildColumnId);
      const lastChildState = cellState.get(group.lastChildColumnId);

      const isStickyFirst = firstChildState?.offset.insetInlineStart !== undefined;
      const isStickyLast = lastChildState?.offset.insetInlineEnd !== undefined;
      const hasStickyLastChildren = group.childColumnIds.some(
        id => cellState.get(id)?.offset.insetInlineEnd !== undefined
      );

      if (!isStickyFirst && !isStickyLast) {
        continue;
      }

      const thEl = props.cells.get(group.groupId);
      if (!thEl) {
        continue;
      }
      const thRect = thEl.getBoundingClientRect();

      const stickyLeft = firstChildState?.offset.insetInlineStart ?? 0;

      // Compute offset
      const offset: { insetInlineStart?: number; insetInlineEnd?: number } = {};
      if (isStickyFirst) {
        offset.insetInlineStart = stickyLeft;
      }
      if (isStickyLast) {
        offset.insetInlineEnd = lastChildState!.offset.insetInlineEnd;
      }

      // Dynamic maxWidth using live bounding rects — ported from computeVisibleWidth
      let maxWidth: number;
      if (hasStickyLastChildren) {
        // For sticky-last: visible portion from the right, clamped to visible part of <th>
        const visibleFromRight = Math.max(
          0,
          Math.min(thRect.right, wrapperRect.right) - Math.max(thRect.left, wrapperRect.left)
        );
        // Floor: must always cover stuck children
        let leftmostStuckLastLeft = Infinity;
        for (const id of group.childColumnIds) {
          const cs = cellState.get(id);
          if (cs?.offset.insetInlineEnd !== undefined) {
            const childEl = props.cells.get(id);
            if (childEl) {
              leftmostStuckLastLeft = Math.min(leftmostStuckLastLeft, childEl.getBoundingClientRect().left);
            }
          }
        }
        const stuckChildrenWidth =
          leftmostStuckLastLeft !== Infinity ? Math.max(0, thRect.right - leftmostStuckLastLeft) : 0;
        maxWidth = Math.max(stuckChildrenWidth, visibleFromRight);
      } else {
        // For sticky-first: compute floor from stuck children and ceiling from visible area
        const paddingStart = parseFloat(getComputedStyle(thEl).paddingInlineStart) || 0;
        const screenLeft = Math.max(thRect.left, wrapperRect.left + stickyLeft) + paddingStart;

        let floor = 0;
        for (const id of group.childColumnIds) {
          const cs = cellState.get(id);
          if (cs?.offset.insetInlineStart !== undefined) {
            const childEl = props.cells.get(id);
            if (childEl) {
              floor = Math.max(floor, childEl.getBoundingClientRect().right - screenLeft);
            }
          }
        }

        // Find last child element for ceiling
        const lastChildEl = props.cells.get(group.lastChildColumnId);
        const ceilingRight = Math.min(
          thRect.right,
          lastChildEl ? lastChildEl.getBoundingClientRect().right : thRect.right,
          wrapperRect.right
        );
        maxWidth = Math.max(floor, Math.max(0, ceilingRight - screenLeft));
      }

      // Determine isStuck for clip-path (position is always sticky when group has sticky children)
      const isStuckFirst = isStickyFirst && stickyLeft > 0 && this.isStuckToTheInlineStart;
      const isStuckLast = hasStickyLastChildren;

      // Clip-path to prevent the <th> from covering adjacent columns
      let clipPath = '';
      if (isStuckFirst) {
        const paddingStart = parseFloat(getComputedStyle(thEl).paddingInlineStart) || 0;
        const screenLeft = Math.max(thRect.left, wrapperRect.left + stickyLeft) + paddingStart;
        const visibleRight = screenLeft + maxWidth;
        const trimRight = Math.max(0, thRect.right - visibleRight);
        clipPath = trimRight > 0 ? `inset(0 ${trimRight}px 0 -24px)` : '';
      } else if (isStuckLast) {
        const visibleLeft = thRect.right - maxWidth;
        const trimLeft = Math.max(0, visibleLeft - thRect.left);
        clipPath = trimLeft > 0 ? `inset(0 -24px 0 ${trimLeft}px)` : '';
      }

      // Boundary flags
      const lastChildIndex = props.visibleColumns.indexOf(group.lastChildColumnId);
      const firstChildIndex = props.visibleColumns.indexOf(group.firstChildColumnId);
      const lastInsetInlineStart =
        isStickyFirst && this.isStuckToTheInlineStart && lastChildIndex === lastLeftStickyColumnIndex;
      const lastInsetInlineEnd =
        isStickyLast && this.isStuckToTheInlineEnd && firstChildIndex === firstRightStickyColumnIndex;

      // Inner wrapper positioning
      const innerInsetInlineStart = hasStickyLastChildren ? 'auto' : stickyLeft > 0 ? `${stickyLeft}px` : '';
      const innerInsetInlineEnd = hasStickyLastChildren ? '0' : '';

      groupHeaderState.set(group.groupId, {
        offset,
        position: 'sticky',
        zIndex: 800,
        maxWidth: maxWidth >= thEl.offsetWidth ? '' : maxWidth,
        clipPath,
        innerInsetInlineStart,
        innerInsetInlineEnd,
        lastInsetInlineStart,
        lastInsetInlineEnd,
      });
    }

    return groupHeaderState;
  };

  private updateCellOffsets = (props: UpdateCellStylesProps): void => {
    this.cellOffsets = updateCellOffsets(props.cells, props);
  };

  private isEnabled = (props: UpdateCellStylesProps): boolean => {
    const noStickyColumns = props.stickyColumnsFirst + props.stickyColumnsLast === 0;
    if (noStickyColumns) {
      return false;
    }

    const wrapperWidth = getLogicalBoundingClientRect(props.wrapper).inlineSize;
    const tableWidth = getLogicalBoundingClientRect(props.table).inlineSize;
    const isWrapperScrollable = tableWidth > wrapperWidth;
    if (!isWrapperScrollable) {
      return false;
    }

    const totalStickySpace = this.cellOffsets.stickyWidthInlineStart + this.cellOffsets.stickyWidthInlineEnd;
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
