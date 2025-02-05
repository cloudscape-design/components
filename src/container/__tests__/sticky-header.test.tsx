// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { act, renderHook } from '../../__tests__/render-hook';
import { ContainerProps } from '../interfaces';
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

describe.each(['embedded', 'full-page', 'cards', 'default', 'stacked'] as Array<
  ContainerProps['variant'] | 'embedded' | 'full-page' | 'cards'
>)('useStickyHeader with variant %s', variant => {
  test('should set isStuck properly when rootTop is less than headerTop', () => {
    const rootRef = {
      current: document.createElement('div'),
    };
    rootRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 100 });

    const headerRef = {
      current: document.createElement('div'),
    };
    headerRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 200 });

    const { result } = renderHook(() => useStickyHeader(rootRef, headerRef, variant, true, 0, 0, false));
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.isStuck).toBe(variant === 'full-page');
  });

  test('should set isStuck to false when rootTop is larger than than headerTop', () => {
    const rootRef = {
      current: document.createElement('div'),
    };
    rootRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 200 });

    const headerRef = {
      current: document.createElement('div'),
    };
    headerRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 100 });

    const { result } = renderHook(() => useStickyHeader(rootRef, headerRef, variant, true, 0, 0, false));
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.isStuck).toBe(false);
  });

  test('should not set isStuck to true when rootTop has a border and is larger than than headerTop', () => {
    const rootRef = {
      current: document.createElement('div'),
    };
    rootRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 199 });
    rootRef.current.style.borderTopWidth = '1px';

    const headerRef = {
      current: document.createElement('div'),
    };
    headerRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 200 });

    const { result } = renderHook(() => useStickyHeader(rootRef, headerRef, variant, true, 0, 0, false));
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.isStuck).toBe(false);
  });

  test('should set isStuck to false when headerRef is null', () => {
    const rootRef = {
      current: document.createElement('div'),
    };
    rootRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 200 });

    const headerRef = {
      current: null,
    };

    const { result } = renderHook(() => useStickyHeader(rootRef, headerRef, variant, true, 0, 0, false));
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.isStuck).toBe(false);
  });

  test('should not react to synthetic window resize events', () => {
    const rootRef = {
      current: document.createElement('div'),
    };
    rootRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 100 });

    const headerRef = {
      current: document.createElement('div'),
    };
    headerRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 200 });

    const { result } = renderHook(() => useStickyHeader(rootRef, headerRef, variant, true, 0, 0, false));
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current.isStuck).toBe(false);
  });
});
