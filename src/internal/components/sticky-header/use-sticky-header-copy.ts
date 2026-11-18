// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RefObject, useCallback, useLayoutEffect } from 'react';

import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

import { useMobile } from '../../hooks/use-mobile';
import stickyScrolling, { calculateScrollingOffset, scrollUpBy } from './sticky-scrolling';

interface StickyHeaderCopyProps {
  tableRef: RefObject<HTMLElement>;
  theadRef: RefObject<HTMLElement>;
  secondaryTheadRef: RefObject<HTMLElement>;
  secondaryTableRef: RefObject<HTMLElement>;
  tableWrapperRef: RefObject<HTMLElement>;
}

export function useStickyHeaderCopy({
  tableRef,
  theadRef,
  secondaryTheadRef,
  secondaryTableRef,
  tableWrapperRef,
}: StickyHeaderCopyProps) {
  const isMobile = useMobile();
  const hideHeaderUnderCopy = useCallback(() => {
    if (
      tableRef.current &&
      theadRef.current &&
      secondaryTheadRef.current &&
      secondaryTableRef.current &&
      tableWrapperRef.current
    ) {
      // Use the full thead height to account for multi-row headers (grouped columns).
      const thead = theadRef.current.closest('thead') ?? theadRef.current;
      tableWrapperRef.current.style.marginBlockStart = `-${thead.getBoundingClientRect().height}px`;
    }
  }, [theadRef, secondaryTheadRef, secondaryTableRef, tableWrapperRef, tableRef]);
  useLayoutEffect(() => {
    hideHeaderUnderCopy();
  });
  useResizeObserver(theadRef, hideHeaderUnderCopy);
  const scrollToTop = () => {
    if (!isMobile && theadRef.current && secondaryTheadRef.current && tableWrapperRef.current) {
      const scrollDist = calculateScrollingOffset(theadRef.current, secondaryTheadRef.current);
      if (scrollDist > 0) {
        scrollUpBy(scrollDist, tableWrapperRef.current);
      }
    }
  };
  const { scrollToItem } = stickyScrolling(tableWrapperRef, secondaryTheadRef);
  const scrollToRow = (itemNode: HTMLElement | null) => {
    if (!isMobile) {
      scrollToItem(itemNode);
    }
  };
  return { scrollToRow, scrollToTop };
}
