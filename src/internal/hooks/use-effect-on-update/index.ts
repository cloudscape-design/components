// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

// useEffect, which skips the initial render
export function useEffectOnUpdate(callback: EffectCallback, deps: DependencyList) {
  const previousDepsRef = useRef<null | DependencyList>(null);

  useEffect(() => {
    const previousDeps = previousDepsRef.current;
    previousDepsRef.current = deps;

    // The initial render is ignored by design.
    if (previousDeps === null) {
      return;
    }
    // In React 18 strict mode the useEffect callback is executed twice. We prevent the
    // callback from firing in case the dependencies did not actually change.
    if (isDepsEqual(previousDeps, deps)) {
      // This line is only reachable in React 18+ strict mode.
      // istanbul ignore next
      return;
    }
    return callback();
    // This is a useEffect extension, will be validated at the call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

function isDepsEqual(prev: DependencyList, next: DependencyList) {
  for (let i = 0; i < Math.max(prev.length, next.length); i++) {
    // This is how React compared dependencies, documented here: https://react.dev/reference/react/useEffect.
    if (!Object.is(prev[i], next[i])) {
      return false;
    }
  }
  // This line is only reachable in React 18+ strict mode.
  // istanbul ignore next
  return true;
}
