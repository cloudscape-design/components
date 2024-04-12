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
export function getLogicalBoundingClientRect(element: HTMLElement | SVGElement) {
  const boundingClientRect = element.getBoundingClientRect();

  const blockSize = boundingClientRect.height;
  const inlineSize = boundingClientRect.width;
  const insetBlockStart = boundingClientRect.top;
  const insetBlockEnd = boundingClientRect.bottom;
  const insetInlineStart = isRtl(element)
    ? document.documentElement.clientWidth - boundingClientRect.right
    : boundingClientRect.left;
  const insetInlineEnd = insetInlineStart + inlineSize;

  return {
    blockSize,
    inlineSize,
    insetBlockStart,
    insetBlockEnd,
    insetInlineStart,
    insetInlineEnd,
  };
}
