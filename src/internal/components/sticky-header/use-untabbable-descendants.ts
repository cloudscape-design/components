// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RefObject, useLayoutEffect } from 'react';

import { getAllFocusableCandidates } from '../focus-lock/utils';

// Takes a sticky header copy's controls, including hidden ones, out of the tab order but leaves them clickable.
// `inert` would also stop clicks, letting them fall through to whatever is underneath.
export function useUntabbableDescendants(containerRef: RefObject<HTMLElement>) {
  useLayoutEffect(() => {
    if (containerRef.current) {
      for (const element of getAllFocusableCandidates(containerRef.current)) {
        element.tabIndex = -1;
      }
    }
  });
}
