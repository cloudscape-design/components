// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useRef } from 'react';
import debounce from '../../debounce';

export function useDebounceCallback<T extends (...args: unknown[]) => void>(callback: T, delay?: number): T {
  const callbackRef = useRef<T>();
  callbackRef.current = callback;

  // ESLint rule requires an inline function which we cannot provide here
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    debounce(
      ((...args) => {
        if (callbackRef.current) {
          callbackRef.current(...args);
        }
      }) as T,
      delay
    ),
    []
  );
}
