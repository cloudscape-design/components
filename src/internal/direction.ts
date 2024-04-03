// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export function isRtl(element: Element) {
  return getComputedStyle(element).direction === 'rtl';
}
