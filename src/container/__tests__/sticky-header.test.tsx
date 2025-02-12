// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { act, renderHook } from '../../__tests__/render-hook';
import { useStickyHeader } from '../use-sticky-header';

jest.mock('../../../lib/components/container/use-sticky-header', () => ({
  useStickyHeader: () => ({ isSticky: true }),
}));

jest.mock('../../../lib/components/internal/hooks/use-mobile', () => ({
  useMobile: jest.fn().mockReturnValue(true),
}));
jest.mock('../../internal/hooks/use-visual-mode', () => ({
  useVisualRefresh: jest.fn().mockReturnValue(true),
}));

jest.mock('@cloudscape-design/component-toolkit/dom', () => ({
  findUpUntil: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
});

test('should set isStuck to false when __stickyHeader is false', () => {
  const rootRef = {
    current: document.createElement('div'),
  };
  rootRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 100, bottom: 500 });

  const headerRef = {
    current: document.createElement('div'),
  };
  headerRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: -200, bottom: -100 });

  const { result } = renderHook(() => useStickyHeader(rootRef, headerRef, false, 0, 0, false));
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });

  expect(result.current.isStuck).toBe(false);
  expect(result.current.isStuckAtBottom).toBe(false);
});

test('should set isStuck to false when __disableMobile is false', () => {
  const rootRef = {
    current: document.createElement('div'),
  };
  rootRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 100, bottom: 500 });

  const headerRef = {
    current: document.createElement('div'),
  };
  headerRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: -200, bottom: -100 });

  const { result } = renderHook(() => useStickyHeader(rootRef, headerRef, true, 0, 0, true));
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });

  expect(result.current.isStuck).toBe(false);
  expect(result.current.isStuckAtBottom).toBe(false);
});

test('should set isStuck to false when rootTop headerTop are equal and headerTop is not 0', () => {
  const rootRef = {
    current: document.createElement('div'),
  };
  rootRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 100, bottom: 500 });

  const headerRef = {
    current: document.createElement('div'),
  };
  headerRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 100, bottom: 200 });

  const { result } = renderHook(() => useStickyHeader(rootRef, headerRef, true, 0, 0, false));
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });

  expect(result.current.isStuck).toBe(false);
  expect(result.current.isStuckAtBottom).toBe(false);
});

test('should set isStuck to true when rootTop less than a headerTop at 0', () => {
  const rootRef = {
    current: document.createElement('div'),
  };
  rootRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: -100, bottom: 500 });

  const headerRef = {
    current: document.createElement('div'),
  };
  headerRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 0, bottom: 100 });

  const { result } = renderHook(() => useStickyHeader(rootRef, headerRef, true, 0, 0, false));
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });

  expect(result.current.isStuck).toBe(true);
  expect(result.current.isStuckAtBottom).toBe(false);
});

test('should set isStuck to false when rootTop and headerTop are equal at 0', () => {
  const rootRef = {
    current: document.createElement('div'),
  };
  rootRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 0, bottom: 500 });

  const headerRef = {
    current: document.createElement('div'),
  };
  headerRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 0, bottom: 100 });

  const { result } = renderHook(() => useStickyHeader(rootRef, headerRef, true, 0, 0, false));
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });

  expect(result.current.isStuck).toBe(false);
  expect(result.current.isStuckAtBottom).toBe(false);
});

test('should set isStuck to true when rootTop is less than headerTop', () => {
  const rootRef = {
    current: document.createElement('div'),
  };
  rootRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 100, bottom: 500 });

  const headerRef = {
    current: document.createElement('div'),
  };
  headerRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 200, bottom: 100 });

  const { result } = renderHook(() => useStickyHeader(rootRef, headerRef, true, 0, 0, false));
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });

  expect(result.current.isStuck).toBe(true);
  expect(result.current.isStuckAtBottom).toBe(false);
});

test('should set isStuck to false when rootTop is larger than than nonZero headerTop', () => {
  const rootRef = {
    current: document.createElement('div'),
  };
  rootRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 200, bottom: 500 });

  const headerRef = {
    current: document.createElement('div'),
  };
  headerRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 100, bottom: 150 });

  const { result } = renderHook(() => useStickyHeader(rootRef, headerRef, true, 0, 0, false));
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });

  expect(result.current.isStuck).toBe(false);
  expect(result.current.isStuckAtBottom).toBe(false);
});

test('should set isStuck to false when rootTop is larger than than zero headerTop', () => {
  const rootRef = {
    current: document.createElement('div'),
  };
  rootRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 200, bottom: 800 });

  const headerRef = {
    current: document.createElement('div'),
  };
  headerRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 0, bottom: 100 });

  const { result } = renderHook(() => useStickyHeader(rootRef, headerRef, true, 0, 0, false));
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });

  expect(result.current.isStuck).toBe(false);
  expect(result.current.isStuckAtBottom).toBe(false);
});

test('should not set isStuck to true when rootTop has a border and is larger than than headerTop', () => {
  const rootRef = {
    current: document.createElement('div'),
  };
  rootRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 199, bottom: 800 });
  rootRef.current.style.borderTopWidth = '1px';

  const headerRef = {
    current: document.createElement('div'),
  };
  headerRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 200, bottom: 100 });

  const { result } = renderHook(() => useStickyHeader(rootRef, headerRef, true, 0, 0, false));
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });

  expect(result.current.isStuck).toBe(false);
  expect(result.current.isStuckAtBottom).toBe(false);
});

test('should set isStuck and isStuckAtBottom to false when headerRef is null', () => {
  const rootRef = {
    current: document.createElement('div'),
  };
  rootRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 200, bottom: 500 });

  const headerRef = {
    current: null,
  };

  const { result } = renderHook(() => useStickyHeader(rootRef, headerRef, true, 0, 0, false));
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });

  expect(result.current.isStuck).toBe(false);
  expect(result.current.isStuckAtBottom).toBe(false);
});

test('should not react to synthetic window resize events', () => {
  const rootRef = {
    current: document.createElement('div'),
  };
  rootRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 100, bottom: 500 });

  const headerRef = {
    current: document.createElement('div'),
  };
  headerRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 200, bottom: 100 });

  const { result } = renderHook(() => useStickyHeader(rootRef, headerRef, true, 0, 0, false));
  act(() => {
    window.dispatchEvent(new Event('resize'));
  });

  expect(result.current.isStuck).toBe(false);
  expect(result.current.isStuckAtBottom).toBe(false);
});

test('should set isStuckAtBottom to true when rootBottom equals headerBottom', () => {
  const rootRef = {
    current: document.createElement('div'),
  };
  rootRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: -500, bottom: 100 });

  const headerRef = {
    current: document.createElement('div'),
  };
  headerRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 0, bottom: 100 });

  const { result } = renderHook(() => useStickyHeader(rootRef, headerRef, true, 0, 0, false));
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });

  expect(result.current.isStuck).toBe(true);
  expect(result.current.isStuckAtBottom).toBe(true);
});

test('should set isStuckAtBottom to true when rootBottom less than headerBottom', () => {
  const rootRef = {
    current: document.createElement('div'),
  };
  rootRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: -500, bottom: 100 });

  const headerRef = {
    current: document.createElement('div'),
  };
  headerRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 0, bottom: 200 });

  const { result } = renderHook(() => useStickyHeader(rootRef, headerRef, true, 0, 0, false));
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });

  expect(result.current.isStuck).toBe(true);
  expect(result.current.isStuckAtBottom).toBe(true);
});

test('should set isStuckAtBottom to false when rootBottom larger than headerBottom', () => {
  const rootRef = {
    current: document.createElement('div'),
  };
  rootRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: -500, bottom: 200 });

  const headerRef = {
    current: document.createElement('div'),
  };
  headerRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 0, bottom: 100 });

  const { result } = renderHook(() => useStickyHeader(rootRef, headerRef, true, 0, 0, false));
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });

  expect(result.current.isStuck).toBe(true);
  expect(result.current.isStuckAtBottom).toBe(false);
});

test('should set isStuckAtBottom to false when rootBottom larger than headerBottom and headerTop is not 0', () => {
  const rootRef = {
    current: document.createElement('div'),
  };
  rootRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: -500, bottom: 200 });

  const headerRef = {
    current: document.createElement('div'),
  };
  headerRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 100, bottom: 100 });

  const { result } = renderHook(() => useStickyHeader(rootRef, headerRef, true, 0, 0, false));
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });

  expect(result.current.isStuck).toBe(true);
  expect(result.current.isStuckAtBottom).toBe(false);
});

test('should set isStuckAtBottom to false when headerRef is null', () => {
  const rootRef = {
    current: document.createElement('div'),
  };
  rootRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: -500, bottom: 200 });

  const headerRef = {
    current: null,
  };

  const { result } = renderHook(() => useStickyHeader(rootRef, headerRef, true, 0, 0, false));
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });

  expect(result.current.isStuck).toBe(false);
  expect(result.current.isStuckAtBottom).toBe(false);
});
