// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useRef } from 'react';

export function isScrollable(ele: HTMLElement) {
  const overflowXStyle = window.getComputedStyle(ele).overflowX;
  const isOverflowHidden = overflowXStyle.indexOf('hidden') !== -1;

  return ele.scrollWidth > ele.clientWidth && !isOverflowHidden;
}

export function getScrollableParent(ele: HTMLElement | null): HTMLElement {
  return !ele || ele === document.body
    ? document.body
    : isScrollable(ele)
    ? ele
    : getScrollableParent(ele.parentElement);
}

export interface UseStableScrollPositionResult {
  /** Stores the current scroll position of the nearest scrollable container. */
  storeScrollPosition: () => void;
  /** Restores the scroll position of the nearest scrollable container to the last stored position. */
  restoreScrollPosition: () => void;
}

/**
 * This hook stores the scroll position of the nearest scrollable parent of the
 * `activeElementRef` when `storeScrollPosition` is called, and restores it when
 * `restoreScrollPosition` is called.
 * @param activeElementRef Ref to an active element in the table. This is used to find the nearest scrollable parent.
 */
export function useStableScrollPosition<T extends HTMLElement>(
  activeElementRef: React.RefObject<T>
): UseStableScrollPositionResult {
  const scrollRef = useRef<Parameters<HTMLBodyElement['scroll']>>();

  const storeScrollPosition = useCallback(() => {
    const scrollableParent = getScrollableParent(activeElementRef.current ?? document.body);
    scrollRef.current = [scrollableParent.scrollLeft, scrollableParent.scrollTop];
  }, [activeElementRef]);

  const restoreScrollPosition = useCallback(() => {
    const scrollableParent = getScrollableParent(activeElementRef.current ?? document.body);
    if (scrollRef.current) {
      [scrollableParent.scrollLeft, scrollableParent.scrollTop] = scrollRef.current;
    }
  }, [activeElementRef]);

  return { storeScrollPosition, restoreScrollPosition };
}
