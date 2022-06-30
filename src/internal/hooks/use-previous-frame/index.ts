// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useRef, useEffect } from 'react';

/**
 * This hook provides access to the value of any variable
 * from the previous render frame.
 * Even if multiple effects are flushed in a single render
 * loop, this hook still keeps the original value.
 */
export const usePreviousFrameValue = <T>(value: T) => {
  const ref = useRef<T>();
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      ref.current = value;
    });
    return () => cancelAnimationFrame(handle);
  });
  return ref.current;
};
