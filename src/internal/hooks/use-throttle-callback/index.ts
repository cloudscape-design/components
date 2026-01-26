// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';

import { throttle, ThrottledFunction } from '../../utils/throttle';

export function useThrottleCallback<F extends (...args: any) => any>(
  func: F,
  delay: number,
  deps: React.DependencyList
): ThrottledFunction<F> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => throttle(func, delay), deps);
}
