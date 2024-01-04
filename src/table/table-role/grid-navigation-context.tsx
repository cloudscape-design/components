// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { createContext, useContext, useEffect, useState } from 'react';
import { FocusableDefinition } from './interfaces';

export const GridNavigationContext = createContext<{
  focusTarget: null | Element;
  keyboardNavigation: boolean;
}>({
  focusTarget: null,
  keyboardNavigation: false,
});

export function useGridNavigationFocusable(focusable: null | FocusableDefinition, options?: { tabIndex?: number }) {
  const { focusTarget, keyboardNavigation } = useContext(GridNavigationContext);
  const [focusTargetActive, setFocusTargetActive] = useState(false);

  useEffect(() => {
    if (!focusable) {
      setFocusTargetActive(false);
    } else if (typeof focusable === 'function') {
      setFocusTargetActive(focusable() === focusTarget);
    } else {
      setFocusTargetActive(focusable.current === focusTarget);
    }
  }, [focusable, focusTarget]);

  let tabIndex: undefined | number = options?.tabIndex;
  if (keyboardNavigation) {
    tabIndex = !focusTargetActive ? -1 : tabIndex ?? 0;
  }

  return { keyboardNavigation, tabIndex };
}
