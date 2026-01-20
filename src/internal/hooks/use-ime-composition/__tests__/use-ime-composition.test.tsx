// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef } from 'react';
import { act, render } from '@testing-library/react';

import { renderHook } from '../../../../__tests__/render-hook';
import { useIMEComposition } from '../index';

interface Ref {
  getIsComposing: () => boolean;
  triggerCompositionStart: () => void;
  triggerCompositionEnd: (data?: string) => void;
  getInputElement: () => HTMLInputElement | null;
}

const Component = React.forwardRef((props, ref: React.Ref<Ref>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isComposing } = useIMEComposition(inputRef);

  useImperativeHandle(ref, () => ({
    getIsComposing: () => isComposing(),
    triggerCompositionStart: () => {
      const input = inputRef.current;
      if (input) {
        input.dispatchEvent(new CompositionEvent('compositionstart'));
      }
    },
    triggerCompositionEnd: (data = 'test') => {
      const input = inputRef.current;
      if (input) {
        input.dispatchEvent(new CompositionEvent('compositionend', { data }));
      }
    },
    getInputElement: () => inputRef.current,
  }));

  return <input ref={inputRef} data-testid="test-input" />;
});

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
    const ref = React.createRef<Ref>();
    render(<Component ref={ref} />);

    ref.current!.triggerCompositionStart();
    ref.current!.triggerCompositionEnd('가');

    expect(ref.current!.getIsComposing()).toBe(true);

    // Execute the requestAnimationFrame callback
    act(() => {
      if (rafCallback) {
        rafCallback(performance.now());
      }
    });

    expect(ref.current!.getIsComposing()).toBe(false);
  });

  test('handles multiple composition cycles correctly', () => {
    const ref = React.createRef<Ref>();
    render(<Component ref={ref} />);

    // First composition
    ref.current!.triggerCompositionStart();
    ref.current!.triggerCompositionEnd('ㄱ');
    expect(ref.current!.getIsComposing()).toBe(true);

    // Second composition before first is cleared
    ref.current!.triggerCompositionStart();
    ref.current!.triggerCompositionEnd('가');
    expect(ref.current!.getIsComposing()).toBe(true);

    // Clear all pending callbacks
    act(() => {
      if (rafCallback) {
        rafCallback(performance.now());
      }
    });

    expect(ref.current!.getIsComposing()).toBe(false);
  });

  test('handles composition start without composition end', () => {
    const ref = React.createRef<Ref>();
    render(<Component ref={ref} />);

    ref.current!.triggerCompositionStart();
    expect(ref.current!.getIsComposing()).toBe(true);

    // Simulate user navigating away or canceling composition
    // Flag should remain true until explicitly ended
    expect(ref.current!.getIsComposing()).toBe(true);
  });

  test('works correctly when input element is null', () => {
    const NullRefComponent = React.forwardRef((props, ref: React.Ref<Ref>) => {
      const inputRef = useRef<HTMLInputElement>(null);
      const { isComposing } = useIMEComposition(inputRef);

      useImperativeHandle(ref, () => ({
        getIsComposing: () => isComposing(),
        triggerCompositionStart: () => {}, // No-op since ref is null
        triggerCompositionEnd: () => {}, // No-op since ref is null
        getInputElement: () => inputRef.current,
      }));

      return <div>No input element</div>;
    });

    const ref = React.createRef<Ref>();

    expect(() => {
      render(<NullRefComponent ref={ref} />);
    }).not.toThrow();

    expect(ref.current!.getIsComposing()).toBe(false);
    expect(ref.current!.getInputElement()).toBe(null);
  });

  test('properly cleans up event listeners on unmount', () => {
    const ref = React.createRef<Ref>();
    const addEventListenerSpy = jest.spyOn(HTMLInputElement.prototype, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(HTMLInputElement.prototype, 'removeEventListener');

    const { unmount } = render(<Component ref={ref} />);

    expect(addEventListenerSpy).toHaveBeenCalledWith('compositionstart', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('compositionend', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('compositionstart', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('compositionend', expect.any(Function));

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  test('handles Korean IME character formation sequence', () => {
    const ref = React.createRef<Ref>();
    render(<Component ref={ref} />);

    // Simulate IME typing 가 (ㄱ + ㅏ = 가)
    ref.current!.triggerCompositionStart();
    expect(ref.current!.getIsComposing()).toBe(true);

    ref.current!.triggerCompositionEnd('가');
    expect(ref.current!.getIsComposing()).toBe(true);

    // After requestAnimationFrame, should be cleared
    act(() => {
      if (rafCallback) {
        rafCallback(performance.now());
      }
    });

    expect(ref.current!.getIsComposing()).toBe(false);
  });
});
