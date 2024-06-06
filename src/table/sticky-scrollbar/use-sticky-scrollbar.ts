// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ResizeObserver } from '@juggle/resize-observer';
import { RefObject, useEffect, useState } from 'react';
import styles from './styles.css.js';
import { getContainingBlock } from '../../internal/utils/dom';
import { getOverflowParents } from '../../internal/utils/scrollable-containers';
import { browserScrollbarSize } from '../../internal/utils/browser-scrollbar-size';
import globalVars from '../../internal/styles/global-vars';
import { getLogicalBoundingClientRect } from '@cloudscape-design/component-toolkit/internal';

export const updatePosition = (
  tableEl: HTMLElement | null,
  wrapperEl: HTMLElement | null,
  scrollbarEl: HTMLElement | null,
  scrollbarContentEl: HTMLElement | null,
  inScrollableContainer: boolean
) => {
  if (!tableEl || !scrollbarEl || !wrapperEl) {
    return;
  }

  const { inlineSize: tableInlineSize } = getLogicalBoundingClientRect(tableEl);
  const { inlineSize: wrapperInlineSize } = getLogicalBoundingClientRect(wrapperEl);

  // using 15 px as a height of transparent scrollbar on mac
  const scrollbarHeight = browserScrollbarSize().height;
  const areaIsScrollable = tableInlineSize > wrapperInlineSize;

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
    const wrapperElRect = getLogicalBoundingClientRect(wrapperEl);
    const tableElRect = getLogicalBoundingClientRect(tableEl);
    scrollbarEl.style.inlineSize = `${wrapperElRect.inlineSize}px`;
    scrollbarContentEl.style.inlineSize = `${tableElRect.inlineSize}px`;

    // when using sticky scrollbars in containers
    // we agreed to ignore dynamic bottom calculations for footer overlap
    scrollbarEl.style.insetBlockEnd = inScrollableContainer
      ? '0px'
      : `var(${globalVars.stickyVerticalBottomOffset}, 0px)`;
  }
};

export function useStickyScrollbar(
  scrollbarRef: RefObject<HTMLDivElement>,
  scrollbarContentRef: RefObject<HTMLDivElement>,
  tableRef: RefObject<HTMLTableElement>,
  wrapperRef: RefObject<HTMLDivElement>,
  offsetScrollbar: boolean
) {
  const [inScrollableContainer, setInScrollableContainer] = useState(false);

  const wrapperEl = wrapperRef.current;
  useEffect(() => {
    if (wrapperEl) {
      setInScrollableContainer(!!getContainingBlock(wrapperEl) || !!getOverflowParents(wrapperEl)[0]);
    }
  }, [wrapperEl]);

  // Update scrollbar position wrapper or table size change.
  useEffect(() => {
    if (wrapperRef.current && tableRef.current) {
      const observer = new ResizeObserver(() => {
        if (scrollbarContentRef.current) {
          updatePosition(
            tableRef.current,
            wrapperRef.current,
            scrollbarRef.current,
            scrollbarContentRef.current,
            inScrollableContainer
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
  }, [scrollbarContentRef, scrollbarRef, tableRef, wrapperRef, inScrollableContainer, offsetScrollbar]);

  // Update scrollbar position when window resizes (vertically).
  useEffect(() => {
    const resizeHandler = () => {
      updatePosition(
        tableRef.current,
        wrapperRef.current,
        scrollbarRef.current,
        scrollbarContentRef.current,
        inScrollableContainer
      );
    };
    resizeHandler();
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [tableRef, wrapperRef, scrollbarRef, scrollbarContentRef, inScrollableContainer]);
}
