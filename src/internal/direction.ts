// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export function isRtl(element: HTMLElement | EventTarget) {
  let isRtl = false;

  if (element instanceof HTMLElement) {
    isRtl = getComputedStyle(element).direction === 'rtl';
  }

  return isRtl;
}

export function getScrollInlineStart(element: HTMLElement) {
  // scrollLeft can be a decimal value on systems using display scaling
  // scrollLeft will be a negative number if the direction is RTL
  return isRtl(element) ? Math.floor(element.scrollLeft) * -1 : Math.ceil(element.scrollLeft);
}
