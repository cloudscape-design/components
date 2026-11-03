// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RefObject, useEffect, useRef, useState } from 'react';

import { getLogicalBoundingClientRect } from '@cloudscape-design/component-toolkit/internal';

import globalVars from '../../styles/global-vars';
import { browserScrollbarSize } from '../../utils/browser-scrollbar-size';
import { getContainingBlock } from '../../utils/dom';
import { getOverflowParents } from '../../utils/scrollable-containers';

import styles from './styles.css.js';

type ContentInlineSizeGetter = (tableEl: HTMLElement, wrapperEl: HTMLElement) => number;

export const updatePosition = (
  tableEl: HTMLElement | null,
  wrapperEl: HTMLElement | null,
  scrollbarEl: HTMLElement | null,
  scrollbarContentEl: HTMLElement | null,
  inScrollableContainer: boolean,
  getContentInlineSize: ContentInlineSizeGetter = tableEl => getLogicalBoundingClientRect(tableEl).inlineSize
) => {
  if (!tableEl || !scrollbarEl || !wrapperEl) {
    return;
  }

  const tableInlineSize = getContentInlineSize(tableEl, wrapperEl);
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
    scrollbarEl.style.inlineSize = `${wrapperInlineSize}px`;
    scrollbarContentEl.style.inlineSize = `${tableInlineSize}px`;

    // when using sticky scrollbars in containers
    // we agreed to ignore dynamic bottom calculations for footer overlap
    scrollbarEl.style.insetBlockEnd = inScrollableContainer
      ? '0px'
      : `var(${globalVars.stickyVerticalBottomOffset}, 0px)`;
  }
};

export interface StickyScrollbarContentOptions {
  // Measures the scrollable content's width; defaults to the table's width.
  getContentInlineSize?: ContentInlineSizeGetter;
  // Re-measures when this changes, for content that changes width without resizing the table or wrapper.
  contentKey?: unknown;
}

export function useStickyScrollbar(
  scrollbarRef: RefObject<HTMLDivElement>,
  scrollbarContentRef: RefObject<HTMLDivElement>,
  tableRef: RefObject<HTMLTableElement>,
  wrapperRef: RefObject<HTMLDivElement>,
  offsetScrollbar: boolean,
  { getContentInlineSize, contentKey }: StickyScrollbarContentOptions
) {
  const [inScrollableContainer, setInScrollableContainer] = useState(false);
  const getContentInlineSizeRef = useRef(getContentInlineSize);
  getContentInlineSizeRef.current = getContentInlineSize;

  const wrapperEl = wrapperRef.current;
  useEffect(() => {
    if (wrapperEl) {
      setInScrollableContainer(!!getContainingBlock(wrapperEl) || !!getOverflowParents(wrapperEl)[0]);
    }
  }, [wrapperEl]);

  // Update scrollbar position wrapper or table size change.
  useEffect(() => {
    if (wrapperRef.current && tableRef.current && typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => {
        if (scrollbarContentRef.current) {
          updatePosition(
            tableRef.current,
            wrapperRef.current,
            scrollbarRef.current,
            scrollbarContentRef.current,
            inScrollableContainer,
            getContentInlineSizeRef.current
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

  // Update scrollbar position when window resizes (vertically), or when the content changes width without
  // resizing either observed element.
  useEffect(() => {
    const resizeHandler = () => {
      updatePosition(
        tableRef.current,
        wrapperRef.current,
        scrollbarRef.current,
        scrollbarContentRef.current,
        inScrollableContainer,
        getContentInlineSizeRef.current
      );
    };
    resizeHandler();
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [tableRef, wrapperRef, scrollbarRef, scrollbarContentRef, inScrollableContainer, contentKey]);
}
