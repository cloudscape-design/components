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

interface StickyStateProps {
  hasSelection: boolean;
  containerWidth: number;
  tableWidth: number;
  visibleColumnsKey: string;
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
    headerCells: React.MutableRefObject<HTMLElement[]>;
  };
}

export interface StickyState {
  cellStyles: StickyStateCellStyles[];
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
  colIndex: number;
  cellType: 'td' | 'th';
}

export function useStickySyles({ stickyState, ref, colIndex, cellType }: UseStickyStylesProps) {
  useReaction(
    stickyState.store,
    state => state.cellStyles[colIndex],
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
  const className = clsx(stickyState.store.get().cellStyles[colIndex]?.classNames[cellType]);
  const style: React.CSSProperties = stickyState.store.get().cellStyles[colIndex]?.offset;

  return { className, style };
}

export function useStickyState({
  containerWidth,
  tableWidth,
  hasSelection,
  visibleColumnsKey,
  stickyColumnsFirst,
  stickyColumnsLast,
  tablePaddingLeft,
  tablePaddingRight,
  wrapperRef,
}: StickyStateProps): StickyStateModel {
  const store = useMemo(() => new StickyColumnsStore(), []);

  const headerCellsRef = useRef<HTMLTableCellElement[]>([]);

  const onWrapperScroll = useStableEventHandler(() => {
    const wrapper = wrapperRef.current;
    if (wrapper) {
      store.updateScroll({ wrapper, tablePaddingLeft, tablePaddingRight });
      store.updateCellStyles({
        containerWidth,
        tableWidth,
        hasSelection,
        stickyColumnsFirst,
        stickyColumnsLast,
        tablePaddingLeft,
        tablePaddingRight,
        cellElements: headerCellsRef.current,
      });
    }
  });

  useEffect(() => {
    console.log({ visibleColumnsKey });
    const wrapper = wrapperRef.current;
    if (wrapper) {
      store.updateScroll({ wrapper, tablePaddingLeft, tablePaddingRight });
    }
    store.updateCellStyles({
      containerWidth,
      tableWidth,
      hasSelection,
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
    hasSelection,
    stickyColumnsFirst,
    stickyColumnsLast,
    tablePaddingLeft,
    tablePaddingRight,
    visibleColumnsKey,
    wrapperRef,
  ]);

  return { store, handlers: { onWrapperScroll }, refs: { headerCells: headerCellsRef } };
}

interface UpdateCellStylesProps {
  tableWidth: number;
  containerWidth: number;
  hasSelection: boolean;
  stickyColumnsFirst: number;
  stickyColumnsLast: number;
  tablePaddingLeft: number;
  tablePaddingRight: number;
  cellElements: HTMLTableCellElement[];
}
// cell offsets depend on tableWidth, hasSelection, cellElements
export default class StickyColumnsStore extends AsyncStore<StickyState> {
  private cellWidths = { first: new Array<number>(), last: new Array<number>() };
  private isStuckToTheLeft = false;
  private isStuckToTheRight = false;

  constructor() {
    super({ cellStyles: [], scrollPaddingLeft: 0, scrollPaddingRight: 0 });
  }

  updateScroll(props: UpdateScrollProps) {
    const { wrapper, tablePaddingLeft, tablePaddingRight } = props;
    const left = wrapper.scrollLeft > tablePaddingLeft;
    const right = Math.ceil(wrapper.scrollLeft) < wrapper.scrollWidth - wrapper.clientWidth - tablePaddingRight;
    this.isStuckToTheLeft = left;
    this.isStuckToTheRight = right;
  }

  updateCellStyles(props: UpdateCellStylesProps) {
    this.updateCellOffsets(props.cellElements);

    const isEnabled = this.isEnabled(props);

    this.set(() => ({
      // Get prevstate here
      // TODO: if not enabled, still need to generateCellStyles (remove them)
      cellStyles: isEnabled ? this.generateCellStyles(props) : props.cellElements.map(() => DEFAULT_STYLES),
      scrollPaddingLeft: this.getFirstStickyColumnsWidth(props),
      scrollPaddingRight: this.getLastStickyColumnsWidth(props),
    }));
  }

  private generateCellStyles = (props: UpdateCellStylesProps): StickyStateCellStyles[] => {
    return props.cellElements.map((el, index) => {
      let stickySide = 'non-sticky';
      if (index < props.stickyColumnsFirst + (props.hasSelection ? 1 : 0)) {
        stickySide = 'left';
      } else if (index >= props.cellElements.length - props.stickyColumnsLast) {
        stickySide = 'right';
      }

      if (stickySide === 'non-sticky') {
        return DEFAULT_STYLES;
      }

      // Determine the offset of the sticky column using the `cellOffsets` state object
      const isFirstColumn = index === 0;
      const stickyColumnOffsetRight = this.cellWidths.last[props.cellElements.length - index - 2] ?? 0;
      const stickyColumnOffsetLeft = this.cellWidths.first[index - 1] ?? 0;
      const cellStyle = {
        left: stickyColumnOffsetLeft !== undefined && stickySide === 'left' ? stickyColumnOffsetLeft : undefined,
        right: stickyColumnOffsetRight !== undefined && stickySide === 'right' ? stickyColumnOffsetRight : undefined,
      };
      const lastLeftStickyColumnIndex = props.stickyColumnsFirst - 1 + (props.hasSelection ? 1 : 0);
      const stickyCellFirstColumn =
        isFirstColumn && !props.hasSelection && props.tablePaddingLeft !== 0 && this.isStuckToTheLeft;
      const stickyCellLastLeft = this.isStuckToTheLeft && lastLeftStickyColumnIndex === index;

      const lastRightStickyColumnIndex = props.cellElements.length - props.stickyColumnsLast;
      const stickyCellLastRight = this.isStuckToTheRight && lastRightStickyColumnIndex === index;
      console.log([lastRightStickyColumnIndex, index, this.isStuckToTheRight]);
      // if same push prev state

      return {
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
    });
  };

  updateCellOffsets = (cellElements: HTMLTableCellElement[]): void => {
    const firstColumnWidths: number[] = [];

    for (let i = 0; i < cellElements.length; i++) {
      const cellWidth = cellElements[i].getBoundingClientRect().width ?? 0;
      firstColumnWidths[i] = (firstColumnWidths[i - 1] ?? 0) + cellWidth;
    }

    const lastColumnsWidths: number[] = [];
    for (let i = cellElements.length - 1; i >= 0; i--) {
      const cellWidth = cellElements[i].getBoundingClientRect().width ?? 0;
      lastColumnsWidths[i] = (lastColumnsWidths[i + 1] ?? 0) + cellWidth;
    }

    this.cellWidths = { first: firstColumnWidths, last: lastColumnsWidths.reverse() };
  };

  // Memoize this?
  private isEnabled = (props: UpdateCellStylesProps): boolean => {
    const totalStickySpace = this.getFirstStickyColumnsWidth(props) + this.getLastStickyColumnsWidth(props);
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

  private getFirstStickyColumnsWidth = (props: UpdateCellStylesProps): number => {
    const lastLeftStickyColumnIndex = props.stickyColumnsFirst + (props.hasSelection ? 1 : 0) - 1;
    return this.cellWidths.first[lastLeftStickyColumnIndex] ?? 0;
  };

  private getLastStickyColumnsWidth = (props: UpdateCellStylesProps): number => {
    const lastRightStickyColumnIndex = props.stickyColumnsLast - 1;
    return this.cellWidths.last[lastRightStickyColumnIndex] ?? 0;
  };
}
