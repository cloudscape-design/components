// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { findUpUntil } from './dom';
export interface BoundingBox {
  blockSize: number;
  inlineSize: number;
  insetBlockStart: number;
  insetInlineStart: number;
}

export const getOverflowParents = (element: HTMLElement): HTMLElement[] => {
  const parents = [];
  let node: HTMLElement | null = element;

  while ((node = node.parentElement) && node !== document.body) {
    getComputedStyle(node).overflow !== 'visible' && parents.push(node);
  }
  return parents;
};

export const getOverflowParentDimensions = ({
  element,
  excludeClosestParent = false,
  expandToViewport = false,
  canExpandOutsideViewport = false,
}: {
  element: HTMLElement;
  excludeClosestParent: boolean;
  expandToViewport: boolean;
  canExpandOutsideViewport: boolean;
}): BoundingBox[] => {
  const parents = expandToViewport
    ? []
    : getOverflowParents(element).map(el => {
        const { height, width, top, left } = el.getBoundingClientRect();
        return {
          // Treat the whole scrollable area as the available height
          // if we're allowed to expand past the viewport.
          blockSize: canExpandOutsideViewport ? el.scrollHeight : height,
          inlineSize: width,
          insetBlockStart: top,
          insetInlineStart: left,
        };
      });

  if (canExpandOutsideViewport && !expandToViewport) {
    const documentDimensions = document.documentElement.getBoundingClientRect();
    parents.push({
      inlineSize: Math.max(documentDimensions.width, document.documentElement.clientWidth),
      blockSize: Math.max(documentDimensions.height, document.documentElement.clientHeight),
      insetBlockStart: documentDimensions.top,
      insetInlineStart: documentDimensions.left,
    });
  } else {
    parents.push({
      blockSize: window.innerHeight,
      inlineSize: window.innerWidth,
      insetBlockStart: 0,
      insetInlineStart: 0,
    });
  }

  if (excludeClosestParent && !expandToViewport) {
    parents.shift();
  }

  return parents;
};

type ScrollIntoViewOptions = Parameters<HTMLElement['scrollIntoView']>[0];

/**
 * Calls `scrollIntoView` on the provided element with sensible defaults. If
 * the element does not exist or does not support the `scrollIntoView`
 * method, it will do nothing. This wrapper is created to support environments
 * where the native function is not available like JSDom (feature request:
 * https://github.com/jsdom/jsdom/issues/1422).
 *
 * @param element to be scrolled into view
 * @param options native options for `scrollIntoView`
 */
export function scrollElementIntoView(
  element: HTMLElement | undefined,
  options: ScrollIntoViewOptions = { block: 'nearest', inline: 'nearest' }
) {
  element?.scrollIntoView?.(options);
}

export function calculateScroll({ insetBlockStart, blockSize }: BoundingBox) {
  if (insetBlockStart < 0) {
    return insetBlockStart;
  } else if (insetBlockStart + blockSize > window.innerHeight) {
    if (blockSize > window.innerHeight) {
      return insetBlockStart;
    } else {
      return insetBlockStart + blockSize - window.innerHeight;
    }
  }
  return 0;
}

/**
 * For elements with fixed position, the browser's native scrollIntoView API doesn't work,
 * so we need to manually scroll to the element's position.
 * Supports only vertical scrolling.
 */
export function scrollRectangleIntoView(box: BoundingBox, scrollableParent?: HTMLElement) {
  const scrollAmount = calculateScroll(box);
  if (scrollAmount) {
    (scrollableParent || window).scrollBy(0, scrollAmount);
  }
}

export function getFirstScrollableParent(element: HTMLElement): HTMLElement | undefined {
  return (
    findUpUntil(element, el => {
      const overflows = el.scrollHeight > el.clientHeight;
      return overflows && ['scroll', 'auto'].includes(getComputedStyle(el).overflowY);
    }) || undefined
  );
}
