// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Determine if the direction of a given element is left-to-right
 * or right-to-left. The is the JavaScript equivalent of the
 * with-direction mixin that implements the dir() pseudoclass.
 */
export function isRtl(element: HTMLElement | EventTarget) {
  let isRtl = false;

  if (element instanceof HTMLElement) {
    isRtl = getComputedStyle(element).direction === 'rtl';
  }

  return isRtl;
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
