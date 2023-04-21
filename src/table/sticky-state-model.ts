// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useMemo, useRef } from 'react';
import AsyncStore, { useReaction } from '../area-chart/model/async-store';
import { useStableEventHandler } from '../internal/hooks/use-stable-event-handler';
import tdCellStyles from './body-cell/styles.css.js';
import thCellStyles from './header-cell/styles.css.js';
import clsx from 'clsx';
// We allow the table to have a minimum of 148px of available space besides the sum of the widths of the sticky columns
// This value is an UX recommendation and is approximately 1/3 of our smallest breakpoint (465px)
const MINIMUM_SCROLLABLE_SPACE = 148;

type ColumnId = string;

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
  scrollPaddingLeft: number;
  scrollPaddingRight: number;
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
  ref: React.RefObject<HTMLElement>;
  columnId: string;
  cellType: 'td' | 'th';
}

export function useStickyStyles({ stickyState, ref, columnId, cellType }: UseStickyStylesProps) {
  useReaction(
    stickyState.store,
    state => state.cellStyles[columnId],
    props => {
      if (!props) {
        return;
      }

      const { classNames, offset } = props;

      const element = ref.current;
      if (element) {
        Object.keys(classNames[cellType]).forEach(key => {
          if (classNames[cellType][key]) {
            element.classList.add(key);
          } else {
            element.classList.remove(key);
          }
        });
        element.style.left = offset.left !== undefined ? `${offset.left}px` : '';
        element.style.right = offset.right !== undefined ? `${offset.right}px` : '';
      }
    }
  );
  const className = clsx(stickyState.store.get().cellStyles[columnId]?.classNames[cellType]);
  const style: React.CSSProperties = stickyState.store.get().cellStyles[columnId]?.offset;

  return { className, style };
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
    if (wrapper) {
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
    }
  });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (wrapper) {
      store.updateScroll({ wrapper, tablePaddingLeft, tablePaddingRight });
    }
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
// cell offsets depend on tableWidth, hasSelection, cellElements
export default class StickyColumnsStore extends AsyncStore<StickyState> {
  private cellOffsets = new Map<ColumnId, { first: number; last: number }>();
  private stickyWidthLeft = 0;
  private stickyWidthRight = 0;
  private isStuckToTheLeft = false;
  private isStuckToTheRight = false;

  constructor() {
    super({ cellStyles: {}, scrollPaddingLeft: 0, scrollPaddingRight: 0 });
  }

  updateScroll(props: UpdateScrollProps) {
    const { wrapper, tablePaddingLeft, tablePaddingRight } = props;
    const left = wrapper.scrollLeft > tablePaddingLeft;
    const right = Math.ceil(wrapper.scrollLeft) < wrapper.scrollWidth - wrapper.clientWidth - tablePaddingRight;
    this.isStuckToTheLeft = left;
    this.isStuckToTheRight = right;
  }

  updateCellStyles(props: UpdateCellStylesProps) {
    this.updateCellOffsets(props);

    const isEnabled = this.isEnabled(props);

    this.set(() => {
      const newState = {
        // Get prevstate here
        // TODO: if not enabled, still need to generateCellStyles (remove them)
        cellStyles: isEnabled
          ? this.generateCellStyles(props)
          : props.visibleColumns.reduce((acc, col) => ({ ...acc, [col]: DEFAULT_STYLES }), {}),
        scrollPaddingLeft: this.stickyWidthLeft,
        scrollPaddingRight: this.stickyWidthRight,
      };

      return newState;
    });
  }

  private generateCellStyles = (props: UpdateCellStylesProps): Record<ColumnId, StickyStateCellStyles> => {
    // TODO: remove this
    // instead, the sticky-cell-first-column style can be altered for selection columns in CSS
    const hasSelection = props.visibleColumns[0] === 'awsui-selection-column';

    return props.visibleColumns.reduce((acc, columnId, index) => {
      let stickySide = 'non-sticky';
      if (index < props.stickyColumnsFirst) {
        stickySide = 'left';
      } else if (index >= props.visibleColumns.length - props.stickyColumnsLast) {
        stickySide = 'right';
      }

      if (stickySide === 'non-sticky') {
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
      // if same push prev state

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
    this.stickyWidthLeft = firstColumnWidths[props.stickyColumnsFirst - 1];

    const lastColumnsWidths: number[] = [];
    for (let i = props.visibleColumns.length - 1; i >= 0; i--) {
      const element = props.cellElements[props.visibleColumns[i]];
      const cellWidth = element.getBoundingClientRect().width ?? 0;
      lastColumnsWidths[i] = (lastColumnsWidths[i + 1] ?? 0) + cellWidth;
    }
    lastColumnsWidths.reverse();
    this.stickyWidthRight = firstColumnWidths[props.stickyColumnsLast - 1];

    this.cellOffsets = props.visibleColumns.reduce(
      (map, columnId, columnIndex) =>
        map.set(columnId, {
          left: firstColumnWidths[columnIndex - 1] ?? 0,
          right: lastColumnsWidths[props.visibleColumns.length - 1 - columnIndex - 1] ?? 0,
        }),
      new Map()
    );
  };

  // Memoize this?
  private isEnabled = (props: UpdateCellStylesProps): boolean => {
    const totalStickySpace = this.stickyWidthLeft + this.stickyWidthRight;
    const noStickyColumns = props.stickyColumnsFirst + props.stickyColumnsLast === 0;

    const isWrapperScrollable = props.tableWidth > props.containerWidth;

    // Check if there is enough scrollable space for sticky columns to be enabled
    const hasEnoughScrollableSpace =
      totalStickySpace + MINIMUM_SCROLLABLE_SPACE + props.tablePaddingLeft + props.tablePaddingRight <
      (props.containerWidth ?? 0);

    // Determine if sticky columns should be disabled based on the conditions
    const shouldDisable = noStickyColumns || !isWrapperScrollable || !hasEnoughScrollableSpace;
    return !shouldDisable;
  };
}
