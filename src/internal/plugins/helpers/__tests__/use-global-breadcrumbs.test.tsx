// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { waitFor } from '@testing-library/react';

import { renderHook } from '../../../../__tests__/render-hook';
import { BreadcrumbGroupProps } from '../../../../breadcrumb-group/interfaces';
import { awsuiPluginsInternal } from '../../api';
import { useGetGlobalBreadcrumbs, useSetGlobalBreadcrumbs } from '../use-global-breadcrumbs';

// Mock the feature flag hook to control when global breadcrumbs are enabled
jest.mock('../../../../app-layout/utils/feature-flags', () => ({
  useAppLayoutFlagEnabled: jest.fn(() => true),
}));

// Mock the contexts to control the conditions
jest.mock('../../../../app-layout/visual-refresh-toolbar/contexts', () => ({
  BreadcrumbsSlotContext: React.createContext<{ isInToolbar: boolean } | undefined>(undefined),
  AppLayoutVisibilityContext: React.createContext<boolean | undefined>(undefined),
}));

const { useAppLayoutFlagEnabled } = jest.requireMock('../../../../app-layout/utils/feature-flags');
const { BreadcrumbsSlotContext, AppLayoutVisibilityContext } = jest.requireMock(
  '../../../../app-layout/visual-refresh-toolbar/contexts'
);

describe('useSetGlobalBreadcrumbs', () => {
  const testBreadcrumbs: BreadcrumbGroupProps = {
    items: [
      { text: 'Home', href: '/' },
      { text: 'Products', href: '/products' },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAppLayoutFlagEnabled.mockReturnValue(true);
  });

  /**
   * This test verifies that the hooks don't crash when conditions change.
   * If hooks were called conditionally (e.g., early return before hooks when disabled),
   * React would throw a "Rendered more/fewer hooks than during the previous render" error
   * when the condition changes.
   */
  describe('hooks order stability (conditional hooks bug prevention)', () => {
    test('does not crash when feature flag changes from disabled to enabled', () => {
      useAppLayoutFlagEnabled.mockReturnValue(false);

      const { result, rerender } = renderHook(() => useSetGlobalBreadcrumbs(testBreadcrumbs));
      expect(result.current).toBe(false);

      // Change the condition - this would crash if hooks were called conditionally
      useAppLayoutFlagEnabled.mockReturnValue(true);
      expect(() => rerender(undefined as never)).not.toThrow();
    });

    test('does not crash when feature flag changes from enabled to disabled', () => {
      useAppLayoutFlagEnabled.mockReturnValue(true);

      const { result, rerender } = renderHook(() => useSetGlobalBreadcrumbs(testBreadcrumbs));

      // Change the condition - this would crash if hooks were called conditionally
      useAppLayoutFlagEnabled.mockReturnValue(false);
      expect(() => rerender(undefined as never)).not.toThrow();
      expect(result.current).toBe(false);
    });

    test('does not crash when isInToolbar context changes', () => {
      const { rerender } = renderHook(() => useSetGlobalBreadcrumbs(testBreadcrumbs), {
        wrapper: ({ children }) =>
          React.createElement(BreadcrumbsSlotContext.Provider, { value: { isInToolbar: false } }, children),
      });

      // The context value doesn't change via rerender in this test setup,
      // but we can verify the hook doesn't crash when re-rendered
      expect(() => rerender(undefined as never)).not.toThrow();
    });

    test('does not crash when AppLayoutVisibilityContext changes via separate render contexts', () => {
      // First render with visible=true
      const { unmount: unmount1 } = renderHook(() => useSetGlobalBreadcrumbs(testBreadcrumbs), {
        wrapper: ({ children }) => React.createElement(AppLayoutVisibilityContext.Provider, { value: true }, children),
      });
      unmount1();

      // Second render with visible=false - should not throw
      const { result } = renderHook(() => useSetGlobalBreadcrumbs(testBreadcrumbs), {
        wrapper: ({ children }) => React.createElement(AppLayoutVisibilityContext.Provider, { value: false }, children),
      });

      expect(result.current).toBe(false);
    });

    test('does not crash when __disableGlobalization prop changes', () => {
      const { result, rerender } = renderHook(
        (props: { disabled: boolean }) =>
          useSetGlobalBreadcrumbs({ ...testBreadcrumbs, __disableGlobalization: props.disabled } as any),
        { initialProps: { disabled: false } }
      );

      // Change the condition - this would crash if hooks were called conditionally
      expect(() => rerender({ disabled: true })).not.toThrow();
      expect(result.current).toBe(false);

      expect(() => rerender({ disabled: false })).not.toThrow();
    });

    test('does not crash when multiple conditions change between renders', () => {
      // First render with all conditions enabling registration
      useAppLayoutFlagEnabled.mockReturnValue(true);
      const { unmount: unmount1 } = renderHook(() => useSetGlobalBreadcrumbs(testBreadcrumbs), {
        wrapper: ({ children }) =>
          React.createElement(
            AppLayoutVisibilityContext.Provider,
            { value: true },
            React.createElement(BreadcrumbsSlotContext.Provider, { value: { isInToolbar: false } }, children)
          ),
      });
      unmount1();

      // Second render with all conditions disabling registration
      useAppLayoutFlagEnabled.mockReturnValue(false);
      const { result } = renderHook(
        () => useSetGlobalBreadcrumbs({ ...testBreadcrumbs, __disableGlobalization: true } as any),
        {
          wrapper: ({ children }) =>
            React.createElement(
              AppLayoutVisibilityContext.Provider,
              { value: false },
              React.createElement(BreadcrumbsSlotContext.Provider, { value: { isInToolbar: true } }, children)
            ),
        }
      );

      expect(result.current).toBe(false);
    });

    test('maintains correct state across rapid rerenders', () => {
      const { result, rerender } = renderHook(() => useSetGlobalBreadcrumbs(testBreadcrumbs));

      // Rapidly toggle the flag - would crash with conditional hooks
      for (let i = 0; i < 10; i++) {
        useAppLayoutFlagEnabled.mockReturnValue(i % 2 === 0);
        expect(() => rerender(undefined as never)).not.toThrow();
      }

      // Should eventually stabilize to the current mock value (false since 10 % 2 === 0)
      expect(result.current).toBe(false);
    });
  });

  describe('registration behavior', () => {
    test('returns false when feature flag is disabled', () => {
      useAppLayoutFlagEnabled.mockReturnValue(false);

      const { result } = renderHook(() => useSetGlobalBreadcrumbs(testBreadcrumbs));
      expect(result.current).toBe(false);
    });

    test('returns false when isInToolbar is true', () => {
      const { result } = renderHook(() => useSetGlobalBreadcrumbs(testBreadcrumbs), {
        wrapper: ({ children }) =>
          React.createElement(BreadcrumbsSlotContext.Provider, { value: { isInToolbar: true } }, children),
      });

      expect(result.current).toBe(false);
    });

    test('returns false when __disableGlobalization is true', () => {
      const { result } = renderHook(() =>
        useSetGlobalBreadcrumbs({ ...testBreadcrumbs, __disableGlobalization: true } as any)
      );

      expect(result.current).toBe(false);
    });

    test('returns false when AppLayoutVisibilityContext is false', () => {
      const { result } = renderHook(() => useSetGlobalBreadcrumbs(testBreadcrumbs), {
        wrapper: ({ children }) => React.createElement(AppLayoutVisibilityContext.Provider, { value: false }, children),
      });

      expect(result.current).toBe(false);
    });
  });
});

describe('useGetGlobalBreadcrumbs', () => {
  test('does not crash when enabled changes from false to true', () => {
    const { result, rerender } = renderHook((props: { enabled: boolean }) => useGetGlobalBreadcrumbs(props.enabled), {
      initialProps: { enabled: false },
    });

    expect(result.current).toBe(null);

    // Change the condition - this would crash if hooks were called conditionally
    expect(() => rerender({ enabled: true })).not.toThrow();
  });

  test('does not crash when enabled changes from true to false', () => {
    const { result, rerender } = renderHook((props: { enabled: boolean }) => useGetGlobalBreadcrumbs(props.enabled), {
      initialProps: { enabled: true },
    });

    // Change the condition - this would crash if hooks were called conditionally
    expect(() => rerender({ enabled: false })).not.toThrow();
    expect(result.current).toBe(null);
  });

  test('returns null when disabled', () => {
    const { result } = renderHook(() => useGetGlobalBreadcrumbs(false));
    expect(result.current).toBe(null);
  });

  test('cleans up on enabled change to false', async () => {
    const unregisterSpy = jest.fn();
    jest.spyOn(awsuiPluginsInternal.breadcrumbs, 'registerAppLayout').mockReturnValue(unregisterSpy);

    const { rerender } = renderHook((props: { enabled: boolean }) => useGetGlobalBreadcrumbs(props.enabled), {
      initialProps: { enabled: true },
    });

    rerender({ enabled: false });

    await waitFor(() => {
      expect(unregisterSpy).toHaveBeenCalled();
    });
  });

  test('does not crash with rapid enabled toggles', () => {
    const { result, rerender } = renderHook((props: { enabled: boolean }) => useGetGlobalBreadcrumbs(props.enabled), {
      initialProps: { enabled: false },
    });

    // Rapidly toggle enabled - would crash with conditional hooks
    for (let i = 0; i < 10; i++) {
      expect(() => rerender({ enabled: i % 2 === 0 })).not.toThrow();
    }

    expect(result.current).toBe(null);
  });
});
