// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useRef } from 'react';
import AsyncStore from '../area-chart/model/async-store';
import { useStableEventHandler } from '../internal/hooks/use-stable-event-handler';
import tdCellStyles from './body-cell/styles.css.js';
import thCellStyles from './header-cell/styles.css.js';

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
    headerCells: React.Ref<HTMLTableCellElement[]>;
  };
}

export interface StickyState {
  cellStyles: StickyStateCellStyles[];
  scrollPaddingLeft: number;
  scrollPaddingRight: number;
}

interface StickyStateCellStyles {
  classNames: { td: string[]; th: string[] };
  style: React.CSSProperties;
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
      const left = wrapper.scrollLeft > tablePaddingLeft;
      const right = Math.ceil(wrapper.scrollLeft) < wrapper.scrollWidth - wrapper.clientWidth - tablePaddingRight;

      store.updateScroll(left, right);
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
  // cell offsets depend on tableWidth, hasSelection, cellElements
  useEffect(() => {
    store.updateCellOffsets(headerCellsRef.current);
  }, [store, tableWidth, hasSelection, visibleColumnsKey]);

  useEffect(() => {
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
  private cellOffsets = { first: new Array<number>(), last: new Array<number>() };
  private isStuckToTheLeft = false;
  private isStuckToTheRight = false;

  constructor() {
    super({ cellStyles: [], scrollPaddingLeft: 0, scrollPaddingRight: 0 });
  }

  updateScroll(isStuckToTheLeft: boolean, isStuckToTheRight: boolean) {
    this.isStuckToTheLeft = isStuckToTheLeft;
    this.isStuckToTheRight = isStuckToTheRight;
  }

  updateCellStyles(props: UpdateCellStylesProps) {
    const isEnabled = this.isEnabled(props);

    this.set(() => ({
      cellStyles: isEnabled ? this.generateCellStyles(props) : [],
      scrollPaddingLeft: this.getFirstStickyColumnsWidth(props),
      scrollPaddingRight: this.getLastStickyColumnsWidth(props),
    }));
  }

  private generateCellStyles = (props: UpdateCellStylesProps): StickyStateCellStyles[] => {
    const styles: StickyStateCellStyles[] = [];

    for (let index = 0; index < props.cellElements.length; index++) {
      let stickySide = 'non-sticky';
      if (index < props.stickyColumnsFirst + (props.hasSelection ? 1 : 0)) {
        stickySide = 'left';
      } else if (index > props.cellElements.length - props.stickyColumnsLast) {
        stickySide = 'right';
      }

      if (stickySide === 'non-sticky') {
        styles.push({ classNames: { td: [], th: [] }, style: {} });
        continue;
      }

      // Determine the offset of the sticky column using the `cellOffsets` state object
      const isFirstColumn = index === 0;
      const offsetKey = stickySide === 'right' ? 'last' : 'first';
      const stickyColumnOffset = this.cellOffsets[offsetKey]?.[index + (props.hasSelection ? 1 : 0)];
      const cellStyle: React.CSSProperties = {
        left: stickyColumnOffset !== undefined && stickySide === 'left' ? `${stickyColumnOffset}px` : undefined,
        right: stickyColumnOffset !== undefined && stickySide === 'right' ? `${stickyColumnOffset}px` : undefined,
        paddingLeft:
          isFirstColumn && !props.hasSelection && props.tablePaddingLeft !== 0 && this.isStuckToTheLeft
            ? `${props.tablePaddingLeft}px`
            : undefined,
      };

      const tdClassNames: string[] = [tdCellStyles['sticky-cell']];
      const thClassNames: string[] = [thCellStyles['sticky-cell']];

      const lastLeftStickyColumnIndex = props.stickyColumnsFirst - 1 + (props.hasSelection ? 1 : 0);
      if (this.isStuckToTheLeft && lastLeftStickyColumnIndex === index) {
        tdClassNames.push(tdCellStyles['sticky-cell-last-left']);
        thClassNames.push(thCellStyles['sticky-cell-last-left']);
      }

      const lastRightStickyColumnIndex = props.cellElements.length - props.stickyColumnsLast - 1;
      if (this.isStuckToTheRight && lastRightStickyColumnIndex === index) {
        tdClassNames.push(tdCellStyles['sticky-cell-last-right']);
        thClassNames.push(thCellStyles['sticky-cell-last-left']);
      }

      styles.push({ classNames: { td: tdClassNames, th: thClassNames }, style: cellStyle });
    }

    return styles;
  };

  updateCellOffsets = (cellElements: HTMLTableCellElement[]): void => {
    const firstColumnsOffsets: number[] = [];
    for (let i = 0; i < cellElements.length; i++) {
      const cellWidth = (cellElements[i].previousSibling as HTMLTableCellElement)?.getBoundingClientRect().width ?? 0;
      firstColumnsOffsets[i] = (firstColumnsOffsets[i - 1] ?? 0) + cellWidth;
    }

    const lastColumnsOffsets: number[] = [];
    console.log({ cellElements });
    for (let i = cellElements.length - 1; i >= 0; i--) {
      console.log({ lastColumnsOffsets });
      const cellWidth = (cellElements[i].nextSibling as HTMLTableCellElement)?.getBoundingClientRect().width ?? 0;
      lastColumnsOffsets[i] = (lastColumnsOffsets[i + 1] ?? 0) + cellWidth;
    }

    this.cellOffsets = { first: [...firstColumnsOffsets], last: [...lastColumnsOffsets] };
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
    console.log({ shouldDisable, totalStickySpace });
    console.log(this.cellOffsets);

    return !shouldDisable;
  };

  private getFirstStickyColumnsWidth = (props: UpdateCellStylesProps): number => {
    const lastLeftStickyColumnIndex = props.stickyColumnsFirst - 1 + (props.hasSelection ? 1 : 0);
    return this.cellOffsets.first[lastLeftStickyColumnIndex] ?? 0;
  };

  private getLastStickyColumnsWidth = (props: UpdateCellStylesProps): number => {
    const lastRightStickyColumnIndex = props.cellElements.length - props.stickyColumnsLast - 1;
    return this.cellOffsets.last[lastRightStickyColumnIndex] ?? 0;
  };
}
