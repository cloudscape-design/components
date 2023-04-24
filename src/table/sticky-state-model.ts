// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import AsyncStore, { useReaction } from '../internal/utils/async-store';
import { useStableEventHandler } from '../internal/hooks/use-stable-event-handler';
import tdCellStyles from './body-cell/styles.css.js';
import thCellStyles from './header-cell/styles.css.js';
import clsx from 'clsx';

export const selectionColumnId = Symbol('selection-column-id');

// We allow the table to have a minimum of 148px of available space besides the sum of the widths of the sticky columns
// This value is an UX recommendation and is approximately 1/3 of our smallest breakpoint (465px)
const MINIMUM_SCROLLABLE_SPACE = 148;

type ColumnId = string | symbol;

interface StickyStateProps {
  containerWidth: number;
  tableWidth: number;
  visibleColumns: readonly ColumnId[];
  stickyColumnsFirst: number;
  stickyColumnsLast: number;
  tablePaddingLeft: number;
  tablePaddingRight: number;
  wrapperRef: React.RefObject<HTMLDivElement>;
}

export interface StickyStateModel {
  store: StickyColumnsStore;
  handlers: {
    onWrapperScroll(): void;
  };
  refs: {
    headerCells: React.MutableRefObject<Record<ColumnId, HTMLElement>>;
  };
}

export interface StickyState {
  cellStyles: Record<ColumnId, StickyStateCellStyles>;
  scrollPadding: { left: number; right: number };
}

interface UpdateScrollProps {
  wrapper: HTMLDivElement;
  tablePaddingLeft: number;
  tablePaddingRight: number;
}

interface StickyStateCellStyles {
  classNames: { td: Record<string, boolean>; th: Record<string, boolean> };
  offset: { left?: number; right?: number };
}

const DEFAULT_STYLES: StickyStateCellStyles = {
  classNames: {
    td: {
      [tdCellStyles['sticky-cell']]: false,
      [tdCellStyles['sticky-cell-first-column']]: false,
      [tdCellStyles['sticky-cell-last-left']]: false,
      [tdCellStyles['sticky-cell-last-right']]: false,
    },
    th: {
      [thCellStyles['sticky-cell']]: false,
      [thCellStyles['sticky-cell-first-column']]: false,
      [thCellStyles['sticky-cell-last-left']]: false,
      [thCellStyles['sticky-cell-last-right']]: false,
    },
  },
  offset: {
    left: undefined,
    right: undefined,
  },
};
interface UseStickyStylesProps {
  stickyState: StickyStateModel;
  columnId: ColumnId;
  cellType: 'td' | 'th'; // TODO: resolve this in CSS instead
}

interface StickyStyles {
  ref: React.RefCallback<HTMLElement>;
  className: string;
  style: React.CSSProperties;
}

export function useStickyStyles({ stickyState, columnId, cellType }: UseStickyStylesProps): StickyStyles {
  const ref = useRef<HTMLElement>(null) as React.MutableRefObject<HTMLElement>;
  const refCallback = useCallback(node => {
    ref.current = node;
  }, []);

  useReaction(
    stickyState.store,
    state => state.cellStyles[columnId],
    props => {
      if (!props) {
        return;
      }

      const { classNames, offset } = props;

      const cellElement = ref.current;
      if (cellElement) {
        Object.keys(classNames[cellType]).forEach(key => {
          if (classNames[cellType][key]) {
            cellElement.classList.add(key);
          } else {
            cellElement.classList.remove(key);
          }
        });
        cellElement.style.left = offset.left !== undefined ? `${offset.left}px` : '';
        cellElement.style.right = offset.right !== undefined ? `${offset.right}px` : '';
      }
    }
  );

  return {
    ref: refCallback,
    className: clsx(stickyState.store.get().cellStyles[columnId]?.classNames[cellType]),
    style: stickyState.store.get().cellStyles[columnId]?.offset,
  };
}

export function useStickyState({
  containerWidth,
  tableWidth,
  visibleColumns,
  stickyColumnsFirst,
  stickyColumnsLast,
  tablePaddingLeft,
  tablePaddingRight,
  wrapperRef,
}: StickyStateProps): StickyStateModel {
  const store = useMemo(() => new StickyColumnsStore(), []);

  const headerCellsRef = useRef<Record<ColumnId, HTMLElement>>({});

  const onWrapperScroll = useStableEventHandler(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }

    store.updateScroll({ wrapper, tablePaddingLeft, tablePaddingRight });
    store.updateCellStyles({
      containerWidth,
      tableWidth,
      visibleColumns,
      stickyColumnsFirst,
      stickyColumnsLast,
      tablePaddingLeft,
      tablePaddingRight,
      cellElements: headerCellsRef.current,
    });
  });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }

    store.updateScroll({ wrapper, tablePaddingLeft, tablePaddingRight });
    store.updateCellStyles({
      containerWidth,
      tableWidth,
      visibleColumns,
      stickyColumnsFirst,
      stickyColumnsLast,
      tablePaddingLeft,
      tablePaddingRight,
      cellElements: headerCellsRef.current,
    });
  }, [
    store,
    containerWidth,
    tableWidth,
    stickyColumnsFirst,
    stickyColumnsLast,
    tablePaddingLeft,
    tablePaddingRight,
    visibleColumns,
    wrapperRef,
  ]);

  return { store, handlers: { onWrapperScroll }, refs: { headerCells: headerCellsRef } };
}

interface UpdateCellStylesProps {
  tableWidth: number;
  containerWidth: number;
  visibleColumns: readonly ColumnId[];
  stickyColumnsFirst: number;
  stickyColumnsLast: number;
  tablePaddingLeft: number;
  tablePaddingRight: number;
  cellElements: Record<ColumnId, HTMLElement>;
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
    const { wrapper, tablePaddingLeft, tablePaddingRight } = props;
    this.isStuckToTheLeft = wrapper.scrollLeft > tablePaddingLeft;
    this.isStuckToTheRight =
      Math.ceil(wrapper.scrollLeft) < wrapper.scrollWidth - wrapper.clientWidth - tablePaddingRight;
  }

  updateCellStyles(props: UpdateCellStylesProps) {
    this.updateCellOffsets(props);
    this.set(() => ({
      cellStyles: this.generateCellStyles(props),
      scrollPadding: { left: this.stickyWidthLeft, right: this.stickyWidthRight },
    }));
  }

  private generateCellStyles = (props: UpdateCellStylesProps): Record<ColumnId, StickyStateCellStyles> => {
    const isEnabled = this.isEnabled(props);

    // TODO: remove this
    // instead, the sticky-cell-first-column style can be altered for selection columns in CSS
    const hasSelection = props.visibleColumns[0] === selectionColumnId;

    return props.visibleColumns.reduce((acc, columnId, index) => {
      let stickySide = 'non-sticky';
      if (index < props.stickyColumnsFirst) {
        stickySide = 'left';
      } else if (index >= props.visibleColumns.length - props.stickyColumnsLast) {
        stickySide = 'right';
      }

      if (!isEnabled || stickySide === 'non-sticky') {
        acc[columnId] = DEFAULT_STYLES;
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
      const stickyCellFirstColumn =
        isFirstColumn && !hasSelection && props.tablePaddingLeft !== 0 && this.isStuckToTheLeft;
      const stickyCellLastLeft = this.isStuckToTheLeft && lastLeftStickyColumnIndex === index;

      const lastRightStickyColumnIndex = props.visibleColumns.length - props.stickyColumnsLast;
      const stickyCellLastRight = this.isStuckToTheRight && lastRightStickyColumnIndex === index;

      acc[columnId] = {
        classNames: {
          td: {
            [tdCellStyles['sticky-cell']]: true,
            [tdCellStyles['sticky-cell-first-column']]: stickyCellFirstColumn,
            [tdCellStyles['sticky-cell-last-left']]: stickyCellLastLeft,
            [tdCellStyles['sticky-cell-last-right']]: stickyCellLastRight,
          },
          th: {
            [thCellStyles['sticky-cell']]: true,
            [thCellStyles['sticky-cell-first-column']]: stickyCellFirstColumn,
            [thCellStyles['sticky-cell-last-left']]: stickyCellLastLeft,
            [thCellStyles['sticky-cell-last-right']]: stickyCellLastRight,
          },
        },
        offset: cellStyle,
      };

      return acc;
    }, {} as Record<ColumnId, StickyStateCellStyles>);
  };

  updateCellOffsets = (props: UpdateCellStylesProps): void => {
    const firstColumnWidths: number[] = [];
    for (let i = 0; i < props.visibleColumns.length; i++) {
      const element = props.cellElements[props.visibleColumns[i]];
      const cellWidth = element.getBoundingClientRect().width ?? 0;
      firstColumnWidths[i] = (firstColumnWidths[i - 1] ?? 0) + cellWidth;
    }

    const lastColumnsWidths: number[] = [];
    for (let i = props.visibleColumns.length - 1; i >= 0; i--) {
      const element = props.cellElements[props.visibleColumns[i]];
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

    const isWrapperScrollable = props.tableWidth > props.containerWidth;
    if (!isWrapperScrollable) {
      return false;
    }

    const totalStickySpace = this.stickyWidthLeft + this.stickyWidthRight;
    const hasEnoughScrollableSpace =
      totalStickySpace + MINIMUM_SCROLLABLE_SPACE + props.tablePaddingLeft + props.tablePaddingRight <
      (props.containerWidth ?? 0);

    if (!hasEnoughScrollableSpace) {
      return false;
    }

    return true;
  };
}
