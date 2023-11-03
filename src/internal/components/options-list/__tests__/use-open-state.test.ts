// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { renderHook, act } from '../../../../__tests__/render-hook';
import { useOpenState } from '../utils/use-open-state';

describe('useOpenState', () => {
  test('should open', () => {
    const onOpen = jest.fn();
    const onClose = jest.fn();
    const hook = renderHook(useOpenState, {
      initialProps: {
        onOpen,
        onClose,
      },
    });
    expect(hook.result.current.isOpen).toBe(false);
    act(() => hook.result.current.openDropdown(false));
    expect(hook.result.current.isOpen).toBe(true);
    expect(hook.result.current.openedWithKeyboard).toBe(false);
    expect(onOpen).toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
  test('should open with keyboard flag', () => {
    const onOpen = jest.fn();
    const onClose = jest.fn();
    const hook = renderHook(useOpenState, {
      initialProps: {
        onOpen,
        onClose,
      },
    });
    act(() => hook.result.current.openDropdown(true));
    expect(hook.result.current.openedWithKeyboard).toBe(true);
  });

  test('should close', () => {
    const onClose = jest.fn();
    const hook = renderHook(useOpenState, {
      initialProps: {
        onClose,
      },
    });
    expect(hook.result.current.isOpen).toBe(false);
    act(() => hook.result.current.openDropdown(false));
    expect(hook.result.current.isOpen).toBe(true);
    act(() => hook.result.current.closeDropdown());
    expect(hook.result.current.isOpen).toBe(false);
    expect(onClose).toHaveBeenCalled();
  });

  test('should toggle open state', () => {
    const hook = renderHook(useOpenState, {
      initialProps: {},
    });
    expect(hook.result.current.isOpen).toBe(false);
    act(() => hook.result.current.toggleDropdown());
    expect(hook.result.current.isOpen).toBe(true);
    act(() => hook.result.current.toggleDropdown());
    expect(hook.result.current.isOpen).toBe(false);
  });
});
