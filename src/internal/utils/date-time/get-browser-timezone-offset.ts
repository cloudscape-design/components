// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Returns the time offset of the browser.
 *
 * I.e. determines the `x` in `current offset = UTC + x`
 */
export function getBrowserTimezoneOffset() {
  return 0 - new Date().getTimezoneOffset();
}
