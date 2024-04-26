// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import InternalContainer from '../../../lib/components/container/internal';
import { AppLayoutContext } from '../../../lib/components/internal/context/app-layout-context';
import { useStickyHeader } from '../use-sticky-header';
import { renderHook, act } from '../../__tests__/render-hook';
import { supportsStickyPosition } from '../../internal/utils/dom';
jest.mock('../../../lib/components/container/use-sticky-header', () => ({
  useStickyHeader: () => ({ isSticky: true }),
}));

jest.mock('../../../lib/components/internal/hooks/use-mobile', () => ({
  useMobile: jest.fn().mockReturnValue(true),
}));
jest.mock('../../internal/hooks/use-visual-mode', () => ({
  useVisualRefresh: jest.fn().mockReturnValue(true),
}));

jest.mock('../../internal/utils/dom', () => ({
  supportsStickyPosition: jest.fn(),
  findUpUntil: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
});

test('should report sticky background in full-page variant', () => {
  const setHasStickyBackground = jest.fn();
  const { rerender } = render(
    <AppLayoutContext.Provider value={{ setHasStickyBackground }}>
      <InternalContainer variant="full-page">test content</InternalContainer>
    </AppLayoutContext.Provider>
  );
  expect(setHasStickyBackground).toHaveBeenCalledWith(true);
  setHasStickyBackground.mockReset();
  rerender(<></>);
  expect(setHasStickyBackground).toHaveBeenCalledWith(false);
});

test('should not report sticky state in default variant', () => {
  const setHasStickyBackground = jest.fn();
  const { rerender } = render(
    <AppLayoutContext.Provider value={{ setHasStickyBackground }}>
      <InternalContainer variant="default">test content</InternalContainer>
    </AppLayoutContext.Provider>
  );
  expect(setHasStickyBackground).not.toHaveBeenCalled();
  rerender(<></>);
  expect(setHasStickyBackground).not.toHaveBeenCalled();
});

test('should set isStuck to true when rootTop is less than headerTop', () => {
  (supportsStickyPosition as jest.Mock).mockReturnValue(true);

  const rootRef = {
    current: document.createElement('div'),
  };
  rootRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 100 });

  const headerRef = {
    current: document.createElement('div'),
  };
  headerRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 200 });

  const { result } = renderHook(() => useStickyHeader(rootRef, headerRef, true, 0, 0, false));
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });

  expect(result.current.isStuck).toBe(true);
});

test('should set isStuck to false when rootTop is larger than than headerTop', () => {
  (supportsStickyPosition as jest.Mock).mockReturnValue(true);

  const rootRef = {
    current: document.createElement('div'),
  };
  rootRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 200 });

  const headerRef = {
    current: document.createElement('div'),
  };
  headerRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 100 });

  const { result } = renderHook(() => useStickyHeader(rootRef, headerRef, true, 0, 0, false));
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });

  expect(result.current.isStuck).toBe(false);
});

test('should not set isStuck to true when rootTop has a border and is larger than than headerTop', () => {
  (supportsStickyPosition as jest.Mock).mockReturnValue(true);

  const rootRef = {
    current: document.createElement('div'),
  };
  rootRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 199 });
  rootRef.current.style.borderTopWidth = '1px';

  const headerRef = {
    current: document.createElement('div'),
  };
  headerRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 200 });

  const { result } = renderHook(() => useStickyHeader(rootRef, headerRef, true, 0, 0, false));
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });

  expect(result.current.isStuck).toBe(false);
});

test('should set isStuck to false when headerRef is null', () => {
  (supportsStickyPosition as jest.Mock).mockReturnValue(true);

  const rootRef = {
    current: document.createElement('div'),
  };
  rootRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ top: 200 });

  const headerRef = {
    current: null,
  };

  const { result } = renderHook(() => useStickyHeader(rootRef, headerRef, true, 0, 0, false));
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });

  expect(result.current.isStuck).toBe(false);
});
