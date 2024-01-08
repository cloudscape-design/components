// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { createContext, useContext } from 'react';

/**
 * Single tab stop navigation context is used together with keyboard navigation that requires a single tab stop.
 * It instructs interactive elements to override tab indices for just a single one to remain user-focusable.
 */
export const SingleTabStopNavigationContext = createContext<{
  focusTarget: null | Element;
  navigationActive: boolean;
}>({
  focusTarget: null,
  navigationActive: false,
});

export function useSingleTabStopNavigation(
  focusable: null | React.RefObject<HTMLElement>,
  options?: { tabIndex?: number }
) {
  const { focusTarget, navigationActive } = useContext(SingleTabStopNavigationContext);

  const focusTargetActive = Boolean(focusable && focusable.current === focusTarget);

  let tabIndex: undefined | number = options?.tabIndex;
  if (navigationActive) {
    tabIndex = !focusTargetActive ? -1 : tabIndex ?? 0;
  }

  return { navigationActive, tabIndex };
}
