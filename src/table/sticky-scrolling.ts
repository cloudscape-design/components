// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getOverflowParents } from '../internal/utils/scrollable-containers';
import { getLogicalBoundingClientRect } from '../internal/direction';

/**
 * @param containerRef ref to surrounding container with sticky element
 * @param stickyRef ref to sticky element scrolled inside of containerRef
 * @param containerOffset offset between header and container
 *                        originating borders or paddings
 */
export default function stickyScrolling(
  containerRef: React.MutableRefObject<HTMLElement | null>,
  stickyRef: React.MutableRefObject<HTMLElement | null>
) {
  const scrollToTop = () => {
    if (!containerRef.current || !stickyRef.current) {
      return;
    }
    const scrollingOffset = calculateScrollingOffset(containerRef.current, stickyRef.current);
    if (scrollingOffset > 0) {
      scrollUpBy(scrollingOffset, containerRef.current);
    }
  };
  const scrollToItem = (item: HTMLElement | null) => {
    if (!item || !containerRef.current || !stickyRef.current) {
      return;
    }
    const stickyBottom = getLogicalBoundingClientRect(stickyRef.current).insetBlockEnd;
    const scrollingOffset = stickyBottom - getLogicalBoundingClientRect(item).insetBlockStart;
    if (scrollingOffset > 0) {
      scrollUpBy(scrollingOffset, containerRef.current);
    }
  };
  return {
    scrollToTop,
    scrollToItem,
  };
}

/**
 * Calculates the scrolling offset between container and
 * sticky element with container offset caused by border
 * or padding
 * @param container
 * @param sticky element inside of container
 * @param containerOffset caused by borders or paddings
 */
export function calculateScrollingOffset(container: HTMLElement, sticky: HTMLElement) {
  const stickyRect = getLogicalBoundingClientRect(sticky);
  const containerRect = getLogicalBoundingClientRect(container);
  return stickyRect.insetBlockStart - containerRect.insetBlockStart;
}

/**
 * Scrolls suitable parent of container up by amount of pixels
 * @param amount pixels to be scrolled up
 * @param container used to determine next parent element for scrolling
 */
export function scrollUpBy(amount: number, container: HTMLElement) {
  const parent = getOverflowParents(container);
  if (parent.length) {
    // Take next overflow parent in stack
    parent[0].scrollTop -= amount;
  } else {
    window.scrollTo({ top: window.pageYOffset - amount });
  }
}
