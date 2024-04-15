// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ResizeObserver } from '@juggle/resize-observer';
import { RefObject, useEffect, useState } from 'react';
import styles from './styles.css.js';
import { getContainingBlock, supportsStickyPosition } from '../../internal/utils/dom';
import { getOverflowParents } from '../../internal/utils/scrollable-containers';
import { browserScrollbarSize } from '../../internal/utils/browser-scrollbar-size';

export const updatePosition = (
  tableEl: HTMLElement | null,
  wrapperEl: HTMLElement | null,
  scrollbarEl: HTMLElement | null,
  scrollbarContentEl: HTMLElement | null,
  hasContainingBlock: boolean,
  consideredFooterHeight: number
) => {
  if (!tableEl || !scrollbarEl || !wrapperEl) {
    return;
  }

  const { width: tableWidth } = tableEl.getBoundingClientRect();
  const { width: wrapperWidth } = wrapperEl.getBoundingClientRect();

  // using 15 px as a height of transparent scrollbar on mac
  const scrollbarHeight = browserScrollbarSize().height;
  const areaIsScrollable = tableWidth > wrapperWidth;

  if (!areaIsScrollable) {
    scrollbarEl.classList.remove(styles['sticky-scrollbar-visible']);
  } else {
    // when scrollbar is not displayed scrollLeft property cannot be set by useScrollSync
    // that's why syncing it separately
    if (!scrollbarEl.classList.contains(styles['sticky-scrollbar-visible'])) {
      requestAnimationFrame(() => {
        scrollbarEl.scrollLeft = wrapperEl.scrollLeft;
      });
    }

    scrollbarEl.classList.add(styles['sticky-scrollbar-visible']);
    if (!scrollbarHeight) {
      /* istanbul ignore next: covered by screenshot tests */
      scrollbarEl.classList.add(styles['sticky-scrollbar-native-invisible']);
    }
  }

  if (scrollbarHeight && scrollbarEl && scrollbarContentEl) {
    scrollbarEl.style.blockSize = `${scrollbarHeight}px`;
    scrollbarContentEl.style.blockSize = `${scrollbarHeight}px`;
  }

  if (tableEl && wrapperEl && scrollbarContentEl && scrollbarEl) {
    const wrapperElRect = wrapperEl.getBoundingClientRect();
    const tableElRect = tableEl.getBoundingClientRect();
    scrollbarEl.style.inlineSize = `${wrapperElRect.width}px`;
    scrollbarContentEl.style.inlineSize = `${tableElRect.width}px`;

    // when using sticky scrollbars in containers
    // we agreed to ignore dynamic bottom calculations for footer overlap
    scrollbarEl.style.insetBlockEnd = hasContainingBlock ? '0px' : `${consideredFooterHeight}px`;
  }
};

export function useStickyScrollbar(
  scrollbarRef: RefObject<HTMLDivElement>,
  scrollbarContentRef: RefObject<HTMLDivElement>,
  tableRef: RefObject<HTMLTableElement>,
  wrapperRef: RefObject<HTMLDivElement>,
  footerHeight: number,
  offsetScrollbar: boolean
) {
  // We don't take into account containing-block calculations because that would
  // unnecessarily overcomplicate the position logic. For now, we assume that a
  // containing block, if present, is below the app layout and above the overflow
  // parent, which is a pretty safe assumption.
  const [hasContainingBlock, setHasContainingBlock] = useState(false);
  // We don't take into account footer height when the overflow parent is child of document body.
  // Because in this case, we think the footer is outside the overflow parent.
  const [hasOverflowParent, setHasOverflowParent] = useState(false);
  const consideredFooterHeight = hasContainingBlock || hasOverflowParent ? 0 : footerHeight;

  const wrapperEl = wrapperRef.current;
  useEffect(() => {
    if (wrapperEl && supportsStickyPosition()) {
      setHasContainingBlock(!!getContainingBlock(wrapperEl));
      setHasOverflowParent(!!getOverflowParents(wrapperEl)[0]);
    }
  }, [wrapperEl]);

  // Update scrollbar position wrapper or table size change.
  useEffect(() => {
    if (supportsStickyPosition() && wrapperRef.current && tableRef.current) {
      const observer = new ResizeObserver(() => {
        if (scrollbarContentRef.current) {
          updatePosition(
            tableRef.current,
            wrapperRef.current,
            scrollbarRef.current,
            scrollbarContentRef.current,
            hasContainingBlock,
            consideredFooterHeight
          );
        }
      });
      // Scrollbar width must be in sync with wrapper width.
      observer.observe(wrapperRef.current);
      // Scrollbar content width must be in sync with table width.
      observer.observe(tableRef.current);
      return () => {
        observer.disconnect();
      };
    }
  }, [
    scrollbarContentRef,
    scrollbarRef,
    tableRef,
    wrapperRef,
    consideredFooterHeight,
    hasContainingBlock,
    offsetScrollbar,
  ]);

  // Update scrollbar position when window resizes (vertically).
  useEffect(() => {
    if (supportsStickyPosition()) {
      const resizeHandler = () => {
        updatePosition(
          tableRef.current,
          wrapperRef.current,
          scrollbarRef.current,
          scrollbarContentRef.current,
          hasContainingBlock,
          consideredFooterHeight
        );
      };
      resizeHandler();
      window.addEventListener('resize', resizeHandler);
      return () => {
        window.removeEventListener('resize', resizeHandler);
      };
    }
  }, [tableRef, wrapperRef, scrollbarRef, scrollbarContentRef, hasContainingBlock, consideredFooterHeight]);
}
