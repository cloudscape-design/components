// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import {
  getFirstScrollableParent,
  getNearestScrollContainer,
  getScrollableParents,
  scrollRectangleIntoView,
} from '../scrollable-containers';

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

describe('getNearestScrollContainer', () => {
  const originalGetComputedStyle = window.getComputedStyle;

  afterEach(() => {
    window.getComputedStyle = originalGetComputedStyle;
  });

  function mockOverflow(overflowByTestId: Record<string, { overflowX?: string; overflowY?: string }>) {
    window.getComputedStyle = ((element: Element, pseudoElt?: string | null) => {
      const result = originalGetComputedStyle(element as Element, pseudoElt);
      const testId = (element as HTMLElement).dataset?.testid;
      const overflow = testId ? overflowByTestId[testId] : undefined;
      if (overflow?.overflowX) {
        result.overflowX = overflow.overflowX;
      }
      if (overflow?.overflowY) {
        result.overflowY = overflow.overflowY;
      }
      return result;
    }) as Window['getComputedStyle'];
  }

  function renderTree() {
    const { container } = render(
      <div data-testid="outer">
        <div data-testid="middle">
          <div data-testid="parent">
            <div data-testid="target" />
          </div>
        </div>
      </div>
    );
    const get = (testId: string) => container.querySelector<HTMLElement>(`[data-testid="${testId}"]`)!;
    return { outer: get('outer'), middle: get('middle'), parent: get('parent'), target: get('target') };
  }

  test.each(['auto', 'scroll', 'overlay'])('returns the nearest ancestor with overflow-y: %s', overflowY => {
    const { outer, parent, target } = renderTree();
    mockOverflow({ outer: { overflowY: 'auto' }, parent: { overflowY } });
    expect(getNearestScrollContainer(target)).toBe(parent);
    expect(getNearestScrollContainer(parent)).toBe(outer);
  });

  test('returns the scroll container even when its content does not overflow', () => {
    const { outer, middle, target } = renderTree();
    mockOverflow({ outer: { overflowY: 'auto' }, middle: { overflowY: 'auto' } });
    Object.defineProperty(outer, 'scrollHeight', { configurable: true, value: 1000 });
    Object.defineProperty(outer, 'clientHeight', { configurable: true, value: 100 });
    Object.defineProperty(middle, 'scrollHeight', { configurable: true, value: 100 });
    Object.defineProperty(middle, 'clientHeight', { configurable: true, value: 100 });

    expect(getNearestScrollContainer(target)).toBe(middle);
    expect(getFirstScrollableParent(target)).toBe(outer);
  });

  test('ignores the element itself and ancestors that only scroll horizontally or clip', () => {
    const { outer, target } = renderTree();
    mockOverflow({
      target: { overflowY: 'auto' },
      parent: { overflowX: 'auto', overflowY: 'hidden' },
      middle: { overflowY: 'clip' },
      outer: { overflowY: 'scroll' },
    });
    expect(getNearestScrollContainer(target)).toBe(outer);
  });

  test('returns undefined when no ancestor scrolls vertically', () => {
    const { target } = renderTree();
    mockOverflow({ outer: { overflowY: 'visible' }, parent: { overflowY: 'hidden' } });
    expect(getNearestScrollContainer(target)).toBeUndefined();
  });
});
