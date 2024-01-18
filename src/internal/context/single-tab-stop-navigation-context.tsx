// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

export type FocusableDefinition = React.RefObject<Element>;

export type FocusableChangeHandler = (focusTarget: null | Element, suppressed: boolean) => void;

export interface SingleTabStopNavigationOptions {
  tabIndex?: number;
}

/**
 * Single tab stop navigation context is used together with keyboard navigation that requires a single tab stop.
 * It instructs interactive elements to override tab indices for just a single one to remain user-focusable.
 */
export const SingleTabStopNavigationContext = createContext<{
  navigationActive: boolean;
  registerFocusable(focusable: FocusableDefinition, handler: FocusableChangeHandler): () => void;
}>({
  navigationActive: false,
  registerFocusable: () => () => {},
});

export function useSingleTabStopNavigation(focusable: null | FocusableDefinition, options?: { tabIndex?: number }) {
  const { navigationActive: contextNavigationActive, registerFocusable: contextRegisterFocusable } =
    useContext(SingleTabStopNavigationContext);
  const [focusTargetActive, setFocusTargetActive] = useState(false);
  const focusTargetActivePrevious = useRef(false);

  const navigationActive = contextNavigationActive && (!options?.tabIndex || options?.tabIndex >= 0);
  const registerFocusable = useCallback(
    (focusable: FocusableDefinition, changeHandler: FocusableChangeHandler) =>
      navigationActive ? contextRegisterFocusable(focusable, changeHandler) : () => {},
    [navigationActive, contextRegisterFocusable]
  );

  useEffect(() => {
    if (focusable) {
      const changeHandler = (element: null | Element, suppressed: boolean) => {
        const isActive = focusable.current === element || suppressed;
        if (focusTargetActivePrevious.current !== isActive) {
          focusTargetActivePrevious.current = isActive;
          setFocusTargetActive(isActive);
        }
      };
      const unregister = registerFocusable(focusable, changeHandler);
      return () => unregister();
    }
  }, [focusable, registerFocusable]);

  let tabIndex = options?.tabIndex;
  if (navigationActive) {
    tabIndex = !focusTargetActive ? -1 : options?.tabIndex ?? 0;
  }

  return { navigationActive, tabIndex };
}
