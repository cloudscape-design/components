// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RefObject, useCallback, useLayoutEffect } from 'react';

import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

import stickyScrolling, { calculateScrollingOffset, scrollUpBy } from '../../../table/sticky-scrolling';
import { useMobile } from '../../hooks/use-mobile';

interface StickyHeaderSyncProps {
  // The real (in-flow) table, header, and their sticky copies. All must be mounted before the
  // tuck runs, matching the original guard so timing is preserved.
  realTableRef: RefObject<HTMLElement>;
  realHeaderRef: RefObject<HTMLElement>;
  copyHeaderRef: RefObject<HTMLElement>;
  copyTableRef: RefObject<HTMLElement>;
  // Element pulled up under the sticky copy via a negative margin-block-start, and scrolled
  // to compensate keyboard focus landing under the copy.
  tuckTargetRef: RefObject<HTMLElement>;
}

// Shared core of the shadow-copy sticky header: tuck the real header up under the opaque copy
// by its own height, and expose scroll-into-view compensation that accounts for the copy
// covering the top of the scroll area.
export function useStickyHeaderSync({
  realTableRef,
  realHeaderRef,
  copyHeaderRef,
  copyTableRef,
  tuckTargetRef,
}: StickyHeaderSyncProps) {
  const isMobile = useMobile();
  // Sync the sizes of the column header copies in the sticky header with the originals
  const syncColumnHeaderWidths = useCallback(() => {
    if (
      realTableRef.current &&
      realHeaderRef.current &&
      copyHeaderRef.current &&
      copyTableRef.current &&
      tuckTargetRef.current
    ) {
      // Use the full thead height to account for multi-row headers (grouped columns).
      const thead = realHeaderRef.current.closest('thead') ?? realHeaderRef.current;
      tuckTargetRef.current.style.marginBlockStart = `-${thead.getBoundingClientRect().height}px`;
    }
  }, [realHeaderRef, copyHeaderRef, copyTableRef, tuckTargetRef, realTableRef]);
  useLayoutEffect(() => {
    syncColumnHeaderWidths();
  });
  useResizeObserver(realHeaderRef, syncColumnHeaderWidths);
  const scrollToTop = () => {
    if (!isMobile && realHeaderRef.current && copyHeaderRef.current && tuckTargetRef.current) {
      const scrollDist = calculateScrollingOffset(realHeaderRef.current, copyHeaderRef.current);
      if (scrollDist > 0) {
        scrollUpBy(scrollDist, tuckTargetRef.current);
      }
    }
  };
  const { scrollToItem } = stickyScrolling(tuckTargetRef, copyHeaderRef);
  const scrollToRow = (itemNode: HTMLElement | null) => {
    if (!isMobile) {
      scrollToItem(itemNode);
    }
  };
  return { scrollToRow, scrollToTop };
}
