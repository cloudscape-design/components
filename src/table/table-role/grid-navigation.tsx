// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getFocusableElement } from './utils';
import {
  FocusableChangeHandler,
  FocusableDefinition,
  FocusableOptions,
  GridNavigationProviderProps,
} from './interfaces';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';
import { GridNavigationHelper } from './grid-navigation-helper';

export const GridNavigationContext = createContext<{
  focusMuted: boolean;
  registerFocusable(
    focusable: FocusableDefinition,
    handler: FocusableChangeHandler,
    options?: FocusableOptions
  ): () => void;
  unregisterFocusable(focusable: FocusableDefinition): void;
}>({
  focusMuted: false,
  registerFocusable: () => () => {},
  unregisterFocusable: () => {},
});

export const GridNavigationSuppressionContext = createContext<{ navigationSuppressed: boolean }>({
  navigationSuppressed: false,
});

export function GridNavigationSuppressed({ children }: { children: React.ReactNode }) {
  return (
    <GridNavigationSuppressionContext.Provider value={{ navigationSuppressed: true }}>
      <div style={{ display: 'contents' }} data-awsui-table-suppress-navigation={true}>
        {children}
      </div>
    </GridNavigationSuppressionContext.Provider>
  );
}

/**
 * Makes table navigable with keyboard commands.
 * See https://www.w3.org/WAI/ARIA/apg/patterns/grid
 *
 * The hook attaches the GridNavigationHelper helper when active=true.
 * See GridNavigationHelper for more details.
 */
export function GridNavigationProvider({
  children,
  keyboardNavigation,
  pageSize,
  getTable,
}: GridNavigationProviderProps) {
  const gridNavigation = useMemo(() => new GridNavigationHelper(), []);

  const getTableStable = useStableCallback(getTable);

  // Initialize the helper with the table container assuming it is mounted synchronously and only once.
  useEffect(() => {
    if (keyboardNavigation) {
      const table = getTableStable();
      table && gridNavigation.init(table);
    }
    return () => gridNavigation.cleanup();
  }, [keyboardNavigation, gridNavigation, getTableStable]);

  // Notify the helper of the props change.
  useEffect(() => {
    gridNavigation.update({ pageSize });
  }, [gridNavigation, pageSize]);

  // Notify the helper of the new render.
  useEffect(() => {
    if (keyboardNavigation) {
      gridNavigation.refresh();
    }
  });

  return (
    <GridNavigationContext.Provider
      value={{
        focusMuted: keyboardNavigation,
        registerFocusable: gridNavigation.registerFocusable,
        unregisterFocusable: gridNavigation.unregisterFocusable,
      }}
    >
      {children}
    </GridNavigationContext.Provider>
  );
}

export function useGridNavigationContext() {
  const { navigationSuppressed } = useContext(GridNavigationSuppressionContext);
  const { focusMuted, registerFocusable, unregisterFocusable } = useContext(GridNavigationContext);
  return { focusMuted: focusMuted && !navigationSuppressed, registerFocusable, unregisterFocusable };
}

export function useGridNavigationFocusable(
  focusable: FocusableDefinition,
  { suppressNavigation }: FocusableOptions = {}
) {
  const { focusMuted, registerFocusable } = useGridNavigationContext();
  const [focusTargetActive, setFocusTargetActive] = useState(false);

  useEffect(() => {
    const changeHandler = (focusTarget: null | HTMLElement) =>
      setFocusTargetActive(getFocusableElement(focusable) === focusTarget);

    const unregister = registerFocusable(focusable, changeHandler, { suppressNavigation });

    return () => unregister();
  }, [focusable, registerFocusable, suppressNavigation]);

  const focusTargetMuted = focusMuted && !focusTargetActive;

  return { focusMuted, focusTargetMuted };
}

export function useGridNavigationAutoRegisterFocusable(getElementRoot: FocusableDefinition) {
  // do the magic here:
  // find user-focusable elements on every render
  // make all element but focusTarget no longer user focusable
  // keep track of all overrides to make a revert if needed
  // register and unregister all found elements
}
