// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { createContext, useContext } from 'react';
import { FocusableDefinition } from './interfaces';

/**
 * Grid navigation context is used in tables with grid navigation enabled (see grid-navigation.md).
 * It instructs interactive elements inside the table to update the tab index to ensure just a single
 * element is user-focusable at a time.
 */
export const GridNavigationContext = createContext<{
  focusTarget: null | Element;
  keyboardNavigation: boolean;
}>({
  focusTarget: null,
  keyboardNavigation: false,
});

/**
 * Subscribes to the grid navigation context to override element's tab index when necessary.
 */
export function useGridNavigationFocusable(focusable: null | FocusableDefinition, options?: { tabIndex?: number }) {
  const { focusTarget, keyboardNavigation } = useContext(GridNavigationContext);

  let focusTargetActive = false;
  if (typeof focusable === 'function') {
    focusTargetActive = focusable() === focusTarget;
  } else if (focusable) {
    focusTargetActive = focusable.current === focusTarget;
  }

  let tabIndex: undefined | number = options?.tabIndex;
  if (keyboardNavigation) {
    tabIndex = !focusTargetActive ? -1 : tabIndex ?? 0;
  }

  return { keyboardNavigation, tabIndex };
}
