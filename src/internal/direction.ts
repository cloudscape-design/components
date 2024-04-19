// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export type IsRtl = boolean;
export type ElementWithDirection = Document | HTMLElement | SVGElement;

export function getIsRtl(element: ElementWithDirection) {
  if (element instanceof Document) {
    return document.documentElement.dir === 'rtl';
  } else {
    return getComputedStyle(element).direction === 'rtl';
  }
}

/**
 * The scrollLeft value will be a negative number if the direction is RTL and
 * needs to be converted to a positive value for direction independent scroll
 * computations. Additionally, the scrollLeft value can be a decimal value on
 * systems using display scaling requiring the floor and ceiling calls.
 */
export function getScrollInlineStart(element: HTMLElement) {
  return getIsRtl(element) ? Math.floor(element.scrollLeft) * -1 : Math.ceil(element.scrollLeft);
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
  const insetInlineStart = getIsRtl(element)
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

/**
 * The pageX position needs to be converted so it is relative to the right of
 * the document in order for computations to yield the same result in both
 * element directions.
 */
export function getLogicalPageX(event: MouseEvent) {
  return event.target instanceof HTMLElement && getIsRtl(event.target)
    ? document.documentElement.clientWidth - event.pageX
    : event.pageX;
}

/**
 * The clientX position needs to be converted so it is relative to the right of
 * the document in order for computations to yield the same result in both
 * element directions.
 */
export function getLogicalClientX(event: PointerEvent, IsRtl: IsRtl) {
  return IsRtl ? document.documentElement.clientWidth - event.clientX : event.clientX;
}
