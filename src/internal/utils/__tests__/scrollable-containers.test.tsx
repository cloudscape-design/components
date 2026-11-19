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

describe('getFirstScrollableParent with requireOverflow: false', () => {
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
    expect(getFirstScrollableParent(target, { requireOverflow: false })).toBe(parent);
    expect(getFirstScrollableParent(parent, { requireOverflow: false })).toBe(outer);
  });

  test('returns the scroll container even when its content does not overflow', () => {
    const { outer, middle, target } = renderTree();
    mockOverflow({ outer: { overflowY: 'auto' }, middle: { overflowY: 'auto' } });
    Object.defineProperty(outer, 'scrollHeight', { configurable: true, value: 1000 });
    Object.defineProperty(outer, 'clientHeight', { configurable: true, value: 100 });
    Object.defineProperty(middle, 'scrollHeight', { configurable: true, value: 100 });
    Object.defineProperty(middle, 'clientHeight', { configurable: true, value: 100 });

    expect(getFirstScrollableParent(target, { requireOverflow: false })).toBe(middle);
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
    expect(getFirstScrollableParent(target, { requireOverflow: false })).toBe(outer);
  });

  test('returns undefined when no ancestor scrolls vertically', () => {
    const { target } = renderTree();
    mockOverflow({ outer: { overflowY: 'visible' }, parent: { overflowY: 'hidden' } });
    expect(getFirstScrollableParent(target, { requireOverflow: false })).toBeUndefined();
  });

  describe('when the nearest scroll container is the body', () => {
    let target: HTMLElement;

    // jsdom does not resolve the initial `visible` value for the root element, so it is set explicitly.
    function mockRootOverflow(overflowX: string, overflowY: string) {
      window.getComputedStyle = ((element: Element, pseudoElt?: string | null) => {
        const result = originalGetComputedStyle(element as Element, pseudoElt);
        if (element === document.documentElement) {
          result.overflowX = overflowX;
          result.overflowY = overflowY;
        }
        return result;
      }) as Window['getComputedStyle'];
    }

    beforeEach(() => {
      target = document.createElement('div');
      document.body.appendChild(target);
      document.body.style.overflowY = 'auto';
    });

    afterEach(() => {
      target.remove();
      document.body.removeAttribute('style');
      document.documentElement.removeAttribute('style');
    });

    function mockDocument(property: 'scrollingElement' | 'compatMode', value: unknown) {
      Object.defineProperty(document, property, { configurable: true, get: () => value });
    }

    afterEach(() => {
      delete (document as unknown as Record<string, unknown>).scrollingElement;
      delete (document as unknown as Record<string, unknown>).compatMode;
    });

    test('returns document.scrollingElement when the body overflow propagates to the viewport', () => {
      mockRootOverflow('visible', 'visible');
      mockDocument('scrollingElement', document.documentElement);
      expect(getFirstScrollableParent(target, { requireOverflow: false })).toBe(document.documentElement);
    });

    test('returns the body as document.scrollingElement in quirks mode', () => {
      mockRootOverflow('visible', 'visible');
      mockDocument('compatMode', 'BackCompat');
      mockDocument('scrollingElement', document.body);
      expect(getFirstScrollableParent(target, { requireOverflow: false })).toBe(document.body);
    });

    test('falls back to the root element in standards mode when scrollingElement is unavailable', () => {
      mockRootOverflow('visible', 'visible');
      mockDocument('scrollingElement', null);
      expect(getFirstScrollableParent(target, { requireOverflow: false })).toBe(document.documentElement);
    });

    test('falls back to the body in quirks mode when scrollingElement is unavailable', () => {
      mockRootOverflow('visible', 'visible');
      mockDocument('compatMode', 'BackCompat');
      mockDocument('scrollingElement', null);
      expect(getFirstScrollableParent(target, { requireOverflow: false })).toBe(document.body);
    });

    test.each([
      ['hidden', 'hidden'],
      ['auto', 'auto'],
      ['clip', 'clip'],
      ['hidden', 'visible'],
      ['visible', 'hidden'],
    ])('keeps the body as an independent scroller when the root overflow is %s / %s', (overflowX, overflowY) => {
      mockRootOverflow(overflowX, overflowY);
      expect(getFirstScrollableParent(target, { requireOverflow: false })).toBe(document.body);
    });

    test.each(['documentElement', 'body'] as const)(
      'keeps the body as an independent scroller when %s has CSS containment',
      element => {
        mockRootOverflow('visible', 'visible');
        mockDocument('scrollingElement', document.documentElement);
        document[element].style.contain = 'layout';
        expect(getFirstScrollableParent(target, { requireOverflow: false })).toBe(document.body);
      }
    );

    test('treats contain: none as no containment', () => {
      mockRootOverflow('visible', 'visible');
      mockDocument('scrollingElement', document.documentElement);
      document.body.style.contain = 'none';
      expect(getFirstScrollableParent(target, { requireOverflow: false })).toBe(document.documentElement);
    });

    test('keeps a non-body nearest scroll container unchanged', () => {
      mockRootOverflow('visible', 'visible');
      const scroller = document.createElement('div');
      scroller.style.overflowY = 'auto';
      document.body.appendChild(scroller);
      scroller.appendChild(target);
      try {
        expect(getFirstScrollableParent(target, { requireOverflow: false })).toBe(scroller);
      } finally {
        scroller.remove();
      }
    });
  });
});
