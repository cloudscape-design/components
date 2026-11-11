// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getScrollerContentInlineSize } from '../../../lib/components/table-root/internal';

describe('getScrollerContentInlineSize', () => {
  test('measures overflowing content without the scroller padding', () => {
    expect(getScrollerContentInlineSize(table(), scroller({ scrollWidth: 1004, clientWidth: 604, width: 604 }))).toBe(
      1000
    );
  });

  test('measures content that fits as the scroller width, without the scroller padding', () => {
    expect(getScrollerContentInlineSize(table(), scroller({ scrollWidth: 604, clientWidth: 604, width: 604.5 }))).toBe(
      600.5
    );
  });
});

function table() {
  return document.createElement('table');
}

function scroller({ scrollWidth, clientWidth, width }: { scrollWidth: number; clientWidth: number; width: number }) {
  const element = document.createElement('div');
  element.style.paddingInlineStart = '4px';
  Object.defineProperty(element, 'scrollWidth', { value: scrollWidth });
  Object.defineProperty(element, 'clientWidth', { value: clientWidth });
  element.getBoundingClientRect = () => ({ width }) as DOMRect;
  return element;
}
