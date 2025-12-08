// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { MINIMUM_SCROLLABLE_SPACE, useStickyFooter } from '../../../lib/components/drawer/use-sticky-footer';
import { renderHook } from '../../__tests__/render-hook';

function createElementWithHeight(tag: string, height = 0) {
  const element = document.createElement(tag);
  jest.spyOn(element, 'getBoundingClientRect').mockImplementation(() => ({ height }) as DOMRect);
  return element;
}

describe('useStickyFooter', () => {
  let drawerElement: HTMLElement;
  let footerElement: HTMLElement;
  let parentElement: HTMLElement;

  beforeEach(() => {
    drawerElement = createElementWithHeight('div', 400);
    footerElement = createElementWithHeight('div', 100);
    parentElement = createElementWithHeight('div', 500);
    parentElement.appendChild(drawerElement);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns isSticky true when there is enough scrollable space', () => {
    const drawerRef = { current: drawerElement };
    const footerRef = { current: footerElement };

    const { result, rerender } = renderHook(() => useStickyFooter({ drawerRef, footerRef }));

    rerender({});

    // Drawer: 400px, Footer: 100px → Scrollable: 300px (enough scrollable area)
    expect(result.current.isSticky).toBe(true);
  });

  test('returns isSticky false when there is not enough scrollable space', () => {
    footerElement = createElementWithHeight('div', 300);

    const drawerRef = { current: drawerElement };
    const footerRef = { current: footerElement };

    const { result, rerender } = renderHook(() => useStickyFooter({ drawerRef, footerRef }));

    rerender({});

    // Drawer: 400px, Footer: 300px → Scrollable: 100px (< 148px)
    expect(result.current.isSticky).toBe(false);
  });

  test('uses parent element height when it is smaller than drawer height', () => {
    parentElement = createElementWithHeight('div', 300);
    drawerElement = createElementWithHeight('div', 400);
    parentElement.appendChild(drawerElement);

    const drawerRef = { current: drawerElement };
    const footerRef = { current: footerElement };

    const { result, rerender } = renderHook(() => useStickyFooter({ drawerRef, footerRef }));

    rerender({});

    // Should use parent height (300) not drawer height (400)
    // Effective: 300px, Footer: 100px → Scrollable: 200px (> 148px)
    expect(result.current.isSticky).toBe(true);
  });

  test('handles drawer without parent element', () => {
    const standaloneDrawer = createElementWithHeight('div', 400);

    const drawerRef = { current: standaloneDrawer };
    const footerRef = { current: footerElement };

    const { result, rerender } = renderHook(() => useStickyFooter({ drawerRef, footerRef }));

    rerender({});

    // Should use drawer height when no parent
    expect(result.current.isSticky).toBe(true);
  });

  test('registers and removes resize event listener', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const drawerRef = { current: drawerElement };
    const footerRef = { current: footerElement };

    const { unmount } = renderHook(() => useStickyFooter({ drawerRef, footerRef }));

    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  test('updates sticky state on resize', () => {
    const drawerRef = { current: drawerElement };
    const footerRef = { current: footerElement };

    const { result, rerender } = renderHook(() => useStickyFooter({ drawerRef, footerRef }));

    rerender({});

    expect(result.current.isSticky).toBe(true);

    // Change parent height to reduce scrollable space
    jest.spyOn(parentElement, 'getBoundingClientRect').mockImplementation(() => ({ height: 200 }) as DOMRect);

    window.dispatchEvent(new Event('resize'));

    rerender({});

    // Effective: 200px, Footer: 100px → Scrollable: 100px (< 148px)
    expect(result.current.isSticky).toBe(false);
  });

  test('handles exactly at minimum scrollable space threshold', () => {
    const exactFooterHeight = 400 - MINIMUM_SCROLLABLE_SPACE;
    footerElement = createElementWithHeight('div', exactFooterHeight);

    const drawerRef = { current: drawerElement };
    const footerRef = { current: footerElement };

    const { result, rerender } = renderHook(() => useStickyFooter({ drawerRef, footerRef }));

    rerender({});

    // Drawer: 400px, Footer: 252px → Scrollable: 148px (>= 148px)
    expect(result.current.isSticky).toBe(true);
  });

  test('handles one pixel below threshold', () => {
    const footerHeight = 400 - MINIMUM_SCROLLABLE_SPACE + 1;
    footerElement = createElementWithHeight('div', footerHeight);

    const drawerRef = { current: drawerElement };
    const footerRef = { current: footerElement };

    const { result, rerender } = renderHook(() => useStickyFooter({ drawerRef, footerRef }));

    rerender({});

    // Drawer: 400px, Footer: 253px → Scrollable: 147px (< 148px)
    expect(result.current.isSticky).toBe(false);
  });

  test('maintains initial state when refs are null', () => {
    const drawerRef = { current: null };
    const footerRef = { current: null };

    const { result, rerender } = renderHook(() => useStickyFooter({ drawerRef, footerRef }));

    rerender({});

    // Should maintain initial state (true) when refs are null
    expect(result.current.isSticky).toBe(true);
  });

  test('maintains initial state when drawer ref is null', () => {
    const drawerRef = { current: null };
    const footerRef = { current: footerElement };

    const { result, rerender } = renderHook(() => useStickyFooter({ drawerRef, footerRef }));

    rerender({});

    expect(result.current.isSticky).toBe(true);
  });

  test('maintains initial state when footer ref is null', () => {
    const drawerRef = { current: drawerElement };
    const footerRef = { current: null };

    const { result, rerender } = renderHook(() => useStickyFooter({ drawerRef, footerRef }));

    rerender({});

    expect(result.current.isSticky).toBe(true);
  });

  test('updates state when properties change', () => {
    const drawerRef = { current: drawerElement };
    const footerRef = { current: footerElement };

    const { result, rerender } = renderHook(() => useStickyFooter({ drawerRef, footerRef }));

    rerender({});
    expect(result.current.isSticky).toBe(true);

    jest.spyOn(footerElement, 'getBoundingClientRect').mockImplementation(() => ({ height: 300 }) as DOMRect);

    window.dispatchEvent(new Event('resize'));

    rerender({});
    expect(result.current.isSticky).toBe(false);

    jest.spyOn(footerElement, 'getBoundingClientRect').mockImplementation(() => ({ height: 50 }) as DOMRect);

    window.dispatchEvent(new Event('resize'));

    rerender({});
    expect(result.current.isSticky).toBe(true);
  });

  test('element heights fallback to actual values when parent is larger', () => {
    parentElement = createElementWithHeight('div', 600);
    drawerElement = createElementWithHeight('div', 400);
    parentElement.appendChild(drawerElement);

    const drawerRef = { current: drawerElement };
    const footerRef = { current: footerElement };

    const { result, rerender } = renderHook(() => useStickyFooter({ drawerRef, footerRef }));

    rerender({});

    // Should use drawer height (400) since it's smaller than parent (600)
    // Drawer: 400px, Footer: 100px → Scrollable: 300px (> 148px)
    expect(result.current.isSticky).toBe(true);
  });
});
