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
