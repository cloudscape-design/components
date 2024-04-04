// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export function isRtl(element: HTMLElement | SVGElement) {
  return getComputedStyle(element).direction === 'rtl';
}

/**
 * The scrollLeft value will be a negative number if the direction is RTL and
 * needs to be converted to a positive value for direction independent scroll
 * computations. Additionally, the scrollLeft value can be a decimal value on
 * systems using display scaling requiring the floor and ceiling calls.
 */
export function getScrollInlineStart(element: HTMLElement) {
  return isRtl(element) ? Math.floor(element.scrollLeft) * -1 : Math.ceil(element.scrollLeft);
}

/**
 * The getBoundingClientRect() function returns values relative to the top left
 * corner of the document regardless of document direction. The left/right position
 * will be transformed to insetInlineStart based on element direction in order to
 * support direction agnostic position computation.
 */
export function getLogicalBoundingClientRect(element: Element) {
  const boundingClientRect = element.getBoundingClientRect();
  const insetInlineStart = isRtl(element) ? window.innerWidth - boundingClientRect.right : boundingClientRect.left;

  return {
    blockSize: boundingClientRect.height,
    inlineSize: boundingClientRect.width,
    insetBlockStart: boundingClientRect.top,
    insetInlineStart,
  };
}
