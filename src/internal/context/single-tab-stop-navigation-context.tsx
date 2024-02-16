// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { createContext, useContext, useEffect, useState } from 'react';

export type FocusableChangeHandler = (isFocusable: boolean) => void;

export interface SingleTabStopNavigationOptions {
  tabIndex?: number;
}

export const defaultValue: {
  navigationActive: boolean;
  registerFocusable(focusable: Element, handler: FocusableChangeHandler): () => void;
} = {
  navigationActive: false,
  registerFocusable: () => () => {},
};

/**
 * Single tab stop navigation context is used together with keyboard navigation that requires a single tab stop.
 * It instructs interactive elements to override tab indices for just a single one to remain user-focusable.
 */
export const SingleTabStopNavigationContext = createContext(defaultValue);

export function useSingleTabStopNavigation(
  focusable: null | React.RefObject<Element>,
  options?: { tabIndex?: number }
) {
  const { navigationActive: contextNavigationActive, registerFocusable } = useContext(SingleTabStopNavigationContext);
  const [focusTargetActive, setFocusTargetActive] = useState(false);
  const navigationDisabled = options?.tabIndex && options?.tabIndex < 0;
  const navigationActive = contextNavigationActive && !navigationDisabled;

  useEffect(() => {
    if (navigationActive && focusable && focusable.current) {
      const unregister = registerFocusable(focusable.current, isFocusable => setFocusTargetActive(isFocusable));
      return () => unregister();
    }
  });

  let tabIndex = options?.tabIndex;
  if (navigationActive) {
    tabIndex = !focusTargetActive ? -1 : options?.tabIndex ?? 0;
  }

  return { navigationActive, tabIndex };
}
