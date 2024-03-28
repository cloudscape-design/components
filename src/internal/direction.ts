// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export function isRtl(element: HTMLElement | EventTarget) {
  let isRtl = false;

  if (element instanceof HTMLElement) {
    isRtl = getComputedStyle(element).direction === 'rtl';
  }

  return isRtl;
}
