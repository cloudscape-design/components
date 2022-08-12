// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useRef } from 'react';

function makeMemoizedArray<T>(
  prev: ReadonlyArray<T>,
  next: ReadonlyArray<T>,
  isEqual: (prev: T, next: T) => boolean
): ReadonlyArray<T> {
  for (let i = 0; i < Math.max(prev.length, next.length); i++) {
    // The next array is shorter, but all the items match.
    if (i === next.length) {
      return prev.slice(0, i);
    }
    // The prev array is shorter, but all the items so far match.
    if (i === prev.length) {
      return [...prev.slice(0, i), ...next.slice(i)];
    }
    // The item is not equal. Partition at this point.
    if (!isEqual(prev[i], next[i])) {
      return [...prev.slice(0, i), next[i], ...makeMemoizedArray(prev.slice(i + 1), next.slice(i + 1), isEqual)];
    }
  }

  // All the references match. Return the old array.
  return prev;
}

export function useMemoizedArray<T>(array: ReadonlyArray<T>, isEqual: (prev: T, next: T) => boolean): ReadonlyArray<T> {
  const ref = useRef<ReadonlyArray<T>>(array);
  const updated = makeMemoizedArray(ref.current, array, isEqual);
  useEffect(() => {
    ref.current = updated;
  }, [updated]);
  return updated;
}
