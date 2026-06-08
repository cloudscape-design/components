// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useRef } from 'react';
import { act } from '@testing-library/react';

import { renderHook } from '../../../../__tests__/render-hook';
import { useIMEComposition } from '../index';

describe('useIMEComposition', () => {
  let rafCallback: FrameRequestCallback | null = null;

  beforeEach(() => {
    jest.restoreAllMocks();
    rafCallback = null;
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
      rafCallback = callback;
      return 1;
    });
  });

  test('returns false when no composition is active', () => {
    const { result } = renderHook(() => {
      const inputRef = useRef<HTMLInputElement>(null);
      return useIMEComposition(inputRef);
    });

    expect(result.current.isComposing()).toBe(false);
  });

  test('returns true during active composition', () => {
    const { result } = renderHook(() => {
      const mockInput = document.createElement('input');
      const inputRef = { current: mockInput };
      return { hook: useIMEComposition(inputRef), inputElement: mockInput };
    });

    const { hook, inputElement } = result.current;
    inputElement.dispatchEvent(new CompositionEvent('compositionstart'));
    expect(hook.isComposing()).toBe(true);
  });

  test('remains true immediately after composition ends', () => {
    const { result } = renderHook(() => {
      const mockInput = document.createElement('input');
      const inputRef = { current: mockInput };
      return { hook: useIMEComposition(inputRef), inputElement: mockInput };
    });

    const { hook, inputElement } = result.current;
    inputElement.dispatchEvent(new CompositionEvent('compositionstart'));
    inputElement.dispatchEvent(new CompositionEvent('compositionend', { data: '가' }));

    expect(hook.isComposing()).toBe(true);
  });

  test('returns false after requestAnimationFrame callback executes', () => {
    const { result } = renderHook(() => {
      const mockInput = document.createElement('input');
      const inputRef = { current: mockInput };
      return { hook: useIMEComposition(inputRef), inputElement: mockInput };
    });

    const { hook, inputElement } = result.current;
    inputElement.dispatchEvent(new CompositionEvent('compositionstart'));
    inputElement.dispatchEvent(new CompositionEvent('compositionend', { data: '가' }));

    expect(hook.isComposing()).toBe(true);

    // Execute the requestAnimationFrame callback
    act(() => {
      if (rafCallback) {
        rafCallback(performance.now());
      }
    });

    expect(hook.isComposing()).toBe(false);
  });

  test('handles multiple composition cycles correctly', () => {
    const { result } = renderHook(() => {
      const mockInput = document.createElement('input');
      const inputRef = { current: mockInput };
      return { hook: useIMEComposition(inputRef), inputElement: mockInput };
    });

    const { hook, inputElement } = result.current;

    // First composition
    inputElement.dispatchEvent(new CompositionEvent('compositionstart'));
    inputElement.dispatchEvent(new CompositionEvent('compositionend', { data: 'ㄱ' }));
    expect(hook.isComposing()).toBe(true);

    // Second composition before first is cleared
    inputElement.dispatchEvent(new CompositionEvent('compositionstart'));
    inputElement.dispatchEvent(new CompositionEvent('compositionend', { data: '가' }));
    expect(hook.isComposing()).toBe(true);

    // Clear all pending callbacks
    act(() => {
      if (rafCallback) {
        rafCallback(performance.now());
      }
    });

    expect(hook.isComposing()).toBe(false);
  });

  test('handles composition start without composition end', () => {
    const { result } = renderHook(() => {
      const mockInput = document.createElement('input');
      const inputRef = { current: mockInput };
      return { hook: useIMEComposition(inputRef), inputElement: mockInput };
    });

    const { hook, inputElement } = result.current;
    inputElement.dispatchEvent(new CompositionEvent('compositionstart'));
    expect(hook.isComposing()).toBe(true);

    // Simulate user navigating away or canceling composition
    // Flag should remain true until explicitly ended
    expect(hook.isComposing()).toBe(true);
  });

  test('works correctly when input element is null', () => {
    const { result } = renderHook(() => {
      const inputRef = useRef<HTMLInputElement>(null);
      return useIMEComposition(inputRef);
    });

    expect(() => {
      result.current.isComposing();
    }).not.toThrow();

    expect(result.current.isComposing()).toBe(false);
  });

  test('properly cleans up event listeners on unmount', () => {
    const addEventListenerSpy = jest.spyOn(HTMLInputElement.prototype, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(HTMLInputElement.prototype, 'removeEventListener');

    const { unmount } = renderHook(() => {
      const mockInput = document.createElement('input');
      const inputRef = { current: mockInput };
      return { hook: useIMEComposition(inputRef), inputElement: mockInput };
    });

    expect(addEventListenerSpy).toHaveBeenCalledWith('compositionstart', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('compositionend', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('compositionstart', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('compositionend', expect.any(Function));

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  test('handles Korean IME character formation sequence', () => {
    const { result } = renderHook(() => {
      const mockInput = document.createElement('input');
      const inputRef = { current: mockInput };
      return { hook: useIMEComposition(inputRef), inputElement: mockInput };
    });

    const { hook, inputElement } = result.current;

    // Simulate IME typing 가 (ㄱ + ㅏ = 가)
    inputElement.dispatchEvent(new CompositionEvent('compositionstart'));
    expect(hook.isComposing()).toBe(true);

    inputElement.dispatchEvent(new CompositionEvent('compositionend', { data: '가' }));
    expect(hook.isComposing()).toBe(true);

    // After requestAnimationFrame, should be cleared
    act(() => {
      if (rafCallback) {
        rafCallback(performance.now());
      }
    });

    expect(hook.isComposing()).toBe(false);
  });
});

describe('onCompositionStart callback and composing state', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
      setTimeout(() => cb(performance.now()), 0);
      return 1;
    });
  });

  test('onCompositionStart is called when composition begins', () => {
    const onCompositionStart = jest.fn();
    const { result } = renderHook(() => {
      const mockInput = document.createElement('input');
      const inputRef = { current: mockInput };
      return { hook: useIMEComposition(inputRef, { onCompositionStart }), inputElement: mockInput };
    });

    result.current.inputElement.dispatchEvent(new CompositionEvent('compositionstart'));
    expect(onCompositionStart).toHaveBeenCalledTimes(1);
  });

  test('onCompositionEnd is called when composition ends', () => {
    const onCompositionEnd = jest.fn();
    const { result } = renderHook(() => {
      const mockInput = document.createElement('input');
      const inputRef = { current: mockInput };
      return { hook: useIMEComposition(inputRef, { onCompositionEnd }), inputElement: mockInput };
    });

    const { inputElement } = result.current;
    inputElement.dispatchEvent(new CompositionEvent('compositionstart'));
    inputElement.dispatchEvent(new CompositionEvent('compositionend', { data: '가' }));
    expect(onCompositionEnd).toHaveBeenCalledTimes(1);
  });

  test('isComposing() is still true when onCompositionEnd fires (spurious Enter guard)', () => {
    let isComposingDuringCallback = false;
    const { result } = renderHook(() => {
      const mockInput = document.createElement('input');
      const inputRef = { current: mockInput };
      // Use a ref to capture the hook's isComposing function after it's created.
      const hookRef = { current: null as ReturnType<typeof useIMEComposition> | null };
      const hook = useIMEComposition(inputRef, {
        onCompositionEnd: () => {
          isComposingDuringCallback = hookRef.current!.isComposing();
        },
      });
      hookRef.current = hook;
      return { hook, inputElement: mockInput };
    });

    result.current.inputElement.dispatchEvent(new CompositionEvent('compositionstart'));
    result.current.inputElement.dispatchEvent(new CompositionEvent('compositionend', { data: '가' }));
    expect(isComposingDuringCallback).toBe(true);
  });
});
