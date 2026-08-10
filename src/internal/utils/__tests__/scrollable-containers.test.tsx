// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import { getFirstScrollableParent, getScrollableParents, scrollRectangleIntoView } from '../scrollable-containers';

const originalScrollBy = window.scrollBy;

beforeEach(() => {
  window.scrollBy = jest.fn();
  window.innerHeight = 500;
});
afterEach(() => {
  window.scrollBy = originalScrollBy;
});

describe('scrollRectangleIntoView', () => {
  test("scrolls up until the rectangle's top position fits the viewport top, if the rectangle's top position was further up", () => {
    scrollRectangleIntoView({ insetBlockStart: -50, blockSize: 100, inlineSize: 100, insetInlineStart: 0 });
    expect(window.scrollBy).toHaveBeenCalledWith(0, -50);
  });
  test("scrolls down until the rectangle's bottom position fits the viewport bottom, if the rectangle's bottom position was further down", () => {
    scrollRectangleIntoView({ insetBlockStart: 300, blockSize: 300, inlineSize: 100, insetInlineStart: 0 });
    expect(window.scrollBy).toHaveBeenCalledWith(0, 100);
  });
  test("scrolls down only until the rectangle's top position fits the viewport top, if the rectangle's bottom position was further down but it is taller than the viewport", () => {
    scrollRectangleIntoView({ insetBlockStart: 300, blockSize: 600, inlineSize: 100, insetInlineStart: 0 });
    expect(window.scrollBy).toHaveBeenCalledWith(0, 300);
  });
});

describe('getFirstScrollableParent', () => {
  const { container } = render(
    <div id="outer">
      <div id="inner" />
    </div>
  );
  const outer = container.querySelector('#outer')!;
  const inner: HTMLElement = container.querySelector('#inner')!;

  let clientHeightSpy: jest.SpyInstance;
  let scrollHeightSpy: jest.SpyInstance;
  const originalGetComputedStyle = window.getComputedStyle;

  afterEach(() => {
    clientHeightSpy.mockRestore();
    scrollHeightSpy.mockRestore();
    window.getComputedStyle = originalGetComputedStyle;
  });

  test('returns first scrollable parent', () => {
    clientHeightSpy = jest.spyOn(outer, 'clientHeight', 'get').mockImplementation(() => 10);
    scrollHeightSpy = jest.spyOn(outer, 'scrollHeight', 'get').mockImplementation(() => 20);
    const fakeGetComputedStyle: Window['getComputedStyle'] = (...args) => {
      const result = originalGetComputedStyle(...args);
      result.overflowY = 'scroll';
      return result;
    };
    window.getComputedStyle = fakeGetComputedStyle;

    expect(getFirstScrollableParent(inner)).toBe(outer);
  });
  test('returns undefined if no scrollable parent is found', () => {
    expect(getFirstScrollableParent(inner)).toBe(undefined);
  });
});

describe('getScrollableParents', () => {
  const originalGetComputedStyle = window.getComputedStyle;

  afterEach(() => {
    window.getComputedStyle = originalGetComputedStyle;
  });

  function mockOverflowByOverflowY(overflowByTestId: Record<string, string>) {
    window.getComputedStyle = ((element: Element, pseudoElt?: string | null) => {
      const result = originalGetComputedStyle(element as Element, pseudoElt);
      const testId = (element as HTMLElement).dataset?.testid;
      if (testId && overflowByTestId[testId]) {
        result.overflowY = overflowByTestId[testId];
      }
      return result;
    }) as Window['getComputedStyle'];
  }

  test('returns scrollable ancestors nearest-first, excluding non-scrollable ones', () => {
    const { container } = render(
      <div data-testid="outer">
        <div data-testid="middle">
          <div data-testid="scroll-parent">
            <div data-testid="target" />
          </div>
        </div>
      </div>
    );
    mockOverflowByOverflowY({ outer: 'scroll', middle: 'visible', 'scroll-parent': 'auto' });

    const target = container.querySelector<HTMLElement>('[data-testid="target"]')!;
    const outer = container.querySelector<HTMLElement>('[data-testid="outer"]')!;
    const scrollParent = container.querySelector<HTMLElement>('[data-testid="scroll-parent"]')!;

    expect(getScrollableParents(target)).toEqual([scrollParent, outer]);
  });

  test('returns an empty array when no ancestor is scrollable', () => {
    const { container } = render(
      <div data-testid="outer">
        <div data-testid="target" />
      </div>
    );
    mockOverflowByOverflowY({ outer: 'visible' });

    const target = container.querySelector<HTMLElement>('[data-testid="target"]')!;
    expect(getScrollableParents(target)).toEqual([]);
  });
});
