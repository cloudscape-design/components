// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

// useEffect, which skips the initial render
export function useEffectOnUpdate(callback: EffectCallback, deps: DependencyList) {
  const isFirstRender = useRef<boolean>(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      return callback();
    }
    // This is a useEffect extension, will be validated at the call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
