// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Polyfills for DOM APIs missing in jsdom.
 * Import this module at the top of any test file that exercises CaretController.
 *
 * Tests that need custom return values should use jest.spyOn(Range.prototype, 'getBoundingClientRect')
 * so that jest.restoreAllMocks() in afterEach properly restores the polyfill.
 */

const zeroDOMRect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  toJSON: () => {},
} as DOMRect;

Range.prototype.getBoundingClientRect = () => zeroDOMRect;
Range.prototype.getClientRects = () =>
  ({ length: 0, item: () => null, [Symbol.iterator]: [][Symbol.iterator] }) as unknown as DOMRectList;
