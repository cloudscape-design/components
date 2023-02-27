// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useEffect, useRef } from 'react';

// The code is copied from https://github.com/cloudscape-design/components/blob/main/src/internal/hooks/use-stable-event-handler/index.ts

/**
 * A callback that stays stable between renders even as the dependencies change.
 * Not a recommended React pattern, so it should be used sparingly and only if
 * the callback is an event handler (i.e. not used during rendering) and causing
 * clear performance issues.
 *
 * @see https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback
 */
export function useStableEventHandler<T extends (...args: any[]) => any>(fn: T): T {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = fn;
  });

  return useCallback((...args: any[]) => ref.current?.apply(undefined, args), []) as T;
}
