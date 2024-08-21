// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RefObject, useCallback, useLayoutEffect } from 'react';

import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

import { useMobile } from '../internal/hooks/use-mobile';
import stickyScrolling, { calculateScrollingOffset, scrollUpBy } from './sticky-scrolling';

export const useStickyHeader = (
  tableRef: RefObject<HTMLElement>,
  theadRef: RefObject<HTMLElement>,
  secondaryTheadRef: RefObject<HTMLElement>,
  secondaryTableRef: RefObject<HTMLElement>,
  tableWrapperRef: RefObject<HTMLElement>
) => {
  const isMobile = useMobile();
  // Sync the sizes of the column header copies in the sticky header with the originals
  const syncColumnHeaderWidths = useCallback(() => {
    if (
      tableRef.current &&
      theadRef.current &&
      secondaryTheadRef.current &&
      secondaryTableRef.current &&
      tableWrapperRef.current
    ) {
      // Using the tableRef getBoundingClientRect().width instead of the theadRef because in VR
      // the tableRef adds extra padding to the table and by default the theadRef will have a width
      // without the padding and will make the sticky header width incorrect.
      secondaryTableRef.current.style.inlineSize = `${tableRef.current.getBoundingClientRect().width}px`;

      tableWrapperRef.current.style.marginBlockStart = `-${theadRef.current.getBoundingClientRect().height}px`;
    }
  }, [theadRef, secondaryTheadRef, secondaryTableRef, tableWrapperRef, tableRef]);
  useLayoutEffect(() => {
    syncColumnHeaderWidths();
  });
  useResizeObserver(theadRef, syncColumnHeaderWidths);
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
};
