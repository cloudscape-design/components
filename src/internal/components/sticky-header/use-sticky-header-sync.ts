// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RefObject, useCallback, useLayoutEffect } from 'react';

import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

import { useMobile } from '../../hooks/use-mobile';
import stickyScrolling, { calculateScrollingOffset, scrollUpBy } from './sticky-scrolling';

interface StickyHeaderSyncProps {
  realTableRef: RefObject<HTMLElement>;
  realHeaderRef: RefObject<HTMLElement>;
  copyHeaderRef: RefObject<HTMLElement>;
  copyTableRef: RefObject<HTMLElement>;
  tableWrapperRef: RefObject<HTMLElement>;
}

export function useStickyHeaderSync({
  realTableRef,
  realHeaderRef,
  copyHeaderRef,
  copyTableRef,
  tableWrapperRef,
}: StickyHeaderSyncProps) {
  const isMobile = useMobile();
  const hideRealHeaderUnderCopy = useCallback(() => {
    if (
      realTableRef.current &&
      realHeaderRef.current &&
      copyHeaderRef.current &&
      copyTableRef.current &&
      tableWrapperRef.current
    ) {
      // Use the full thead height to account for multi-row headers (grouped columns).
      const thead = realHeaderRef.current.closest('thead') ?? realHeaderRef.current;
      tableWrapperRef.current.style.marginBlockStart = `-${thead.getBoundingClientRect().height}px`;
    }
  }, [realHeaderRef, copyHeaderRef, copyTableRef, tableWrapperRef, realTableRef]);
  useLayoutEffect(() => {
    hideRealHeaderUnderCopy();
  });
  useResizeObserver(realHeaderRef, hideRealHeaderUnderCopy);
  const scrollToTop = () => {
    if (!isMobile && realHeaderRef.current && copyHeaderRef.current && tableWrapperRef.current) {
      const scrollDist = calculateScrollingOffset(realHeaderRef.current, copyHeaderRef.current);
      if (scrollDist > 0) {
        scrollUpBy(scrollDist, tableWrapperRef.current);
      }
    }
  };
  const { scrollToItem } = stickyScrolling(tableWrapperRef, copyHeaderRef);
  const scrollToRow = (itemNode: HTMLElement | null) => {
    if (!isMobile) {
      scrollToItem(itemNode);
    }
  };
  return { scrollToRow, scrollToTop };
}
