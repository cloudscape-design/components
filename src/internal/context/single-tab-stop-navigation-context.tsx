// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type FocusableDefinition = React.RefObject<Element>;

export type FocusableChangeHandler = (focusTarget: null | Element) => void;

export interface SingleTabStopNavigationSuppressedProps {
  children: React.ReactNode;
  suppressed?: boolean;
}

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

export function SingleTabStopNavigationSuppressed({
  children,
  suppressed = true,
}: SingleTabStopNavigationSuppressedProps) {
  const parentContextValue = useContext(SingleTabStopNavigationContext);
  const value = suppressed ? { ...parentContextValue, navigationActive: false } : parentContextValue;
  return <SingleTabStopNavigationContext.Provider value={value}>{children}</SingleTabStopNavigationContext.Provider>;
}

export function useSingleTabStopNavigation(focusable: null | FocusableDefinition, options?: { tabIndex?: number }) {
  const { navigationActive: contextNavigationActive, registerFocusable: contextRegisterFocusable } =
    useContext(SingleTabStopNavigationContext);
  const [focusTargetActive, setFocusTargetActive] = useState(false);

  const navigationActive = contextNavigationActive && (!options?.tabIndex || options?.tabIndex >= 0);
  const registerFocusable = useCallback(
    (focusable: FocusableDefinition, changeHandler: FocusableChangeHandler) =>
      navigationActive ? contextRegisterFocusable(focusable, changeHandler) : () => {},
    [navigationActive, contextRegisterFocusable]
  );

  useEffect(() => {
    if (focusable) {
      const changeHandler = (element: null | Element) => setFocusTargetActive(focusable.current === element);
      return registerFocusable(focusable, changeHandler);
    }
  }, [focusable, registerFocusable]);

  let tabIndex = options?.tabIndex;
  if (navigationActive) {
    tabIndex = !focusTargetActive ? -1 : options?.tabIndex ?? 0;
  }

  return { navigationActive, tabIndex };
}
