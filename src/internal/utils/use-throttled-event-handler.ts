// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback } from 'react';
import { throttle } from './throttle';
import { useStableEventHandler } from './use-stable-event-handler';

export function useThrottledEventHandler<T extends (...args: any[]) => void>(callback: T, delay: number) {
  const stableCallback = useStableEventHandler(callback);

  // ESLint rule requires an inline function which we cannot provide here
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(throttle(((...args) => stableCallback(...args)) as T, delay), []);
}
