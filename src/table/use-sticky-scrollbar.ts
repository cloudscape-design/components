// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ResizeObserver } from '@juggle/resize-observer';
import { RefObject, useEffect, useState } from 'react';
import styles from './styles.css.js';

import { getOverflowParentDimensions, getOverflowParents } from '../internal/utils/scrollable-containers';
import { browserScrollbarSize } from '../internal/utils/browser-scrollbar-size';
import { supportsStickyPosition, getContainingBlock } from '../internal/utils/dom';

const updatePosition = (
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

  // parent is either some container or document itself
  const parent = getOverflowParentDimensions(wrapperEl)[0];
  const parentBottom = parent.top + parent.height;

  // table bottom is visible when
  // 1. table bottom reached end of the window
  // 2. table bottom is not overlapped by footer
  const { top: tableTop, bottom: tableBottom, width: tableWidth } = tableEl.getBoundingClientRect();
  const { width: wrapperWidth } = wrapperEl.getBoundingClientRect();

  //scrollbar correction is needed for
  // #1 when scrollbars are constantly visible,
  // we want no visible break when switching between fake and real scrollbars
  // #2 when scrollbars are visible only on scrolling and half transparent (on mac)
  // we want to avoid any overlap between fake and real scrollbar
  // using 15 px as a height of transparent scrollbar on mac
  const scrollbarHeight = browserScrollbarSize().height;
  const scrollBarCorrection = scrollbarHeight > 0 ? scrollbarHeight : -15 / 2;
  const tableBottomIsVisible = parentBottom - consideredFooterHeight >= tableBottom + scrollBarCorrection;
  const tableTopIsHidden = tableTop >= parentBottom - consideredFooterHeight - scrollBarCorrection;
  const areaIsScrollable = tableWidth > wrapperWidth;

  if (tableBottomIsVisible || tableTopIsHidden || !areaIsScrollable) {
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
  }

  if (scrollbarHeight && scrollbarEl && scrollbarContentEl) {
    scrollbarEl.style.height = `${scrollbarHeight}px`;
    scrollbarContentEl.style.height = `${scrollbarHeight}px`;
  }

  if (tableEl && wrapperEl && scrollbarContentEl && scrollbarEl) {
    const parent = getOverflowParentDimensions(wrapperEl)[0];

    const wrapperElRect = wrapperEl.getBoundingClientRect();
    const tableElRect = tableEl.getBoundingClientRect();
    scrollbarEl.style.width = `${wrapperElRect.width}px`;
    scrollbarContentEl.style.width = `${tableElRect.width}px`;

    // when using sticky scrollbars in containers
    // we agreed to ignore dynamic bottom calculations for footer overlap
    scrollbarEl.style.left = hasContainingBlock ? '0px' : `${wrapperElRect.left}px`;
    scrollbarEl.style.top = hasContainingBlock
      ? '0px'
      : `${Math.min(parent.top + parent.height, window.innerHeight - consideredFooterHeight)}px`;
  }
};

export function useStickyScrollbar(
  scrollbarRef: RefObject<HTMLDivElement>,
  scrollbarContentRef: RefObject<HTMLDivElement>,
  tableRef: RefObject<HTMLTableElement>,
  wrapperRef: RefObject<HTMLDivElement>,
  footerHeight: number
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

  // Update scrollbar position on window scroll.
  useEffect(() => {
    if (supportsStickyPosition()) {
      const scrollHandler = () => {
        updatePosition(
          tableRef.current,
          wrapperRef.current,
          scrollbarRef.current,
          scrollbarContentRef.current,
          hasContainingBlock,
          consideredFooterHeight
        );
      };
      scrollHandler();
      window.addEventListener('scroll', scrollHandler, true);
      return () => {
        window.removeEventListener('scroll', scrollHandler, true);
      };
    }
  }, [scrollbarRef, tableRef, wrapperRef, consideredFooterHeight, scrollbarContentRef, hasContainingBlock]);

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
  }, [scrollbarContentRef, scrollbarRef, tableRef, wrapperRef, consideredFooterHeight, hasContainingBlock]);

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
      window.addEventListener('resize', resizeHandler);
      return () => {
        window.removeEventListener('resize', resizeHandler);
      };
    }
  }, [tableRef, wrapperRef, scrollbarRef, scrollbarContentRef, hasContainingBlock, consideredFooterHeight]);
}
