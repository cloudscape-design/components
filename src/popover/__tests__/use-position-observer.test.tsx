// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { renderHook } from '../../__tests__/render-hook';
import usePositionObserver from '../use-position-observer';

describe('usePositionObserver', () => {
  let mockObserve: jest.Mock;
  let mockDisconnect: jest.Mock;
  let mockCallback: jest.Mock;
  let mockTriggerRef: React.RefObject<HTMLElement>;
  let mockBoundingClientRect: { x: number; y: number };
  let mutationCallback: (mutations: any) => void;

  beforeEach(() => {
    mockObserve = jest.fn();
    mockDisconnect = jest.fn();
    mockCallback = jest.fn();

    // Mock MutationObserver
    global.MutationObserver = jest.fn().mockImplementation(callback => {
      mutationCallback = callback;
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
      };
    });

    // Mock triggerRef
    mockBoundingClientRect = { x: 100, y: 100 };
    mockTriggerRef = {
      current: {
        getBoundingClientRect: jest.fn().mockReturnValue(mockBoundingClientRect),
        ownerDocument: document,
      } as unknown as HTMLElement,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should not set up observer when triggerRef is undefined', () => {
    renderHook(() => usePositionObserver(undefined, 'key1', mockCallback));
    expect(mockObserve).not.toHaveBeenCalled();
  });

  test('should not set up observer when triggerRef.current is undefined', () => {
    const emptyRef = { current: null };
    renderHook(() => usePositionObserver(emptyRef, 'key1', mockCallback));
    expect(mockObserve).not.toHaveBeenCalled();
  });

  test('should set up observer when triggerRef is defined', () => {
    renderHook(() => usePositionObserver(mockTriggerRef, 'key1', mockCallback));
    expect(mockObserve).toHaveBeenCalledWith(document, { attributes: true, subtree: true, childList: true });
  });

  test('should call callback when position changes', () => {
    renderHook(() => usePositionObserver(mockTriggerRef, 'key1', mockCallback));

    // Initial position
    expect(mockCallback).not.toHaveBeenCalled();

    // Simulate a mutation that changes the position
    const getBoundingClientRectMock = mockTriggerRef.current!.getBoundingClientRect as jest.Mock;
    getBoundingClientRectMock.mockReturnValue({ x: 200, y: 100 });
    mutationCallback([]);

    expect(mockCallback).toHaveBeenCalledTimes(1);

    // Another position change
    getBoundingClientRectMock.mockReturnValue({ x: 200, y: 200 });
    mutationCallback([]);

    expect(mockCallback).toHaveBeenCalledTimes(2);
  });

  test('should not call callback when position does not change', () => {
    // Set initial position
    const getBoundingClientRectMock = mockTriggerRef.current!.getBoundingClientRect as jest.Mock;
    getBoundingClientRectMock.mockReturnValue({ x: 100, y: 100 });

    renderHook(() => usePositionObserver(mockTriggerRef, 'key1', mockCallback));

    // Simulate a mutation that doesn't change the position
    mutationCallback([]);

    // The callback should not be called since position hasn't changed
    expect(mockCallback).not.toHaveBeenCalled();
  });

  test('should not call callback when triggerRef.current becomes null after setup', () => {
    renderHook(() => usePositionObserver(mockTriggerRef, 'key1', mockCallback));

    // Make triggerRef.current null after setup
    Object.defineProperty(mockTriggerRef, 'current', {
      get: jest.fn().mockReturnValue(null),
    });

    mutationCallback([]);

    expect(mockCallback).not.toHaveBeenCalled();
  });

  test('should disconnect observer on useEffect cleanup', () => {
    const { unmount } = renderHook(() => usePositionObserver(mockTriggerRef, 'key1', mockCallback));
    unmount();
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  test('should use stable callback', () => {
    // First render with initial callback
    const { rerender } = renderHook(({ callback }) => usePositionObserver(mockTriggerRef, 'key1', callback), {
      initialProps: { callback: mockCallback },
    });

    // Simulate a position change to trigger the callback
    const getBoundingClientRectMock = mockTriggerRef.current!.getBoundingClientRect as jest.Mock;
    getBoundingClientRectMock.mockReturnValue({ x: 200, y: 200 });
    mutationCallback([]);

    expect(mockCallback).toHaveBeenCalledTimes(1);

    // Create a new callback
    const newCallback = jest.fn();

    // Rerender with new callback
    rerender({ callback: newCallback });

    // Simulate another position change
    getBoundingClientRectMock.mockReturnValue({ x: 300, y: 300 });
    mutationCallback([]);

    // The new callback should be used
    expect(newCallback).toHaveBeenCalledTimes(1);
    // The old callback should not be called again
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  test('should recreate observer when trackKey changes', () => {
    // Set initial position
    const getBoundingClientRectMock = mockTriggerRef.current!.getBoundingClientRect as jest.Mock;
    getBoundingClientRectMock.mockReturnValue({ x: 100, y: 100 });

    // Initial render with key1
    const { rerender } = renderHook(({ trackKey }) => usePositionObserver(mockTriggerRef, trackKey, mockCallback), {
      initialProps: { trackKey: 'key1' },
    });

    // Clear initial setup calls
    mockObserve.mockClear();
    mockDisconnect.mockClear();

    // Change trackKey to key2
    rerender({ trackKey: 'key2' });

    // Verify that the observer was disconnected and set up again when trackKey changed
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
    expect(mockObserve).toHaveBeenCalledTimes(1);
  });

  test('should call callback when position changes after trackKey changes', () => {
    // Set initial position
    const getBoundingClientRectMock = mockTriggerRef.current!.getBoundingClientRect as jest.Mock;
    getBoundingClientRectMock.mockReturnValue({ x: 100, y: 100 });

    // Initial render with key1
    const { rerender } = renderHook(({ trackKey }) => usePositionObserver(mockTriggerRef, trackKey, mockCallback), {
      initialProps: { trackKey: 'key1' },
    });

    // Simulate a first mutation to establish the initial state
    mutationCallback([]);

    // Clear any initial calls
    mockCallback.mockClear();

    // Change trackKey to key2
    rerender({ trackKey: 'key2' });

    // Simulate a mutation with a different position
    getBoundingClientRectMock.mockReturnValue({ x: 150, y: 100 });
    mutationCallback([]);

    // The callback should be called because the position changed after trackKey changed
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
