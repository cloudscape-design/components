// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getFocusableElement } from './utils';
import { FocusableChangeHandler, FocusableDefinition, GridNavigationProviderProps } from './interfaces';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';
import { GridNavigationProcessor } from './grid-navigation-processor';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import { getAllFocusables } from '../../internal/components/focus-lock/utils';
import { useEffectOnUpdate } from '../../internal/hooks/use-effect-on-update';

export const GridNavigationContext = createContext<{
  focusMuted: boolean;
  registerFocusable(focusable: FocusableDefinition, handler: FocusableChangeHandler): () => void;
  unregisterFocusable(focusable: FocusableDefinition): void;
}>({
  focusMuted: false,
  registerFocusable: () => () => {},
  unregisterFocusable: () => {},
});

export function GridNavigationSuppressed({ children, active = true }: { children: React.ReactNode; active?: boolean }) {
  const parentContext = useContext(GridNavigationContext);
  return (
    <GridNavigationContext.Provider value={active ? { ...parentContext, focusMuted: false } : parentContext}>
      {children}
    </GridNavigationContext.Provider>
  );
}

/**
 * Makes table navigable with keyboard commands.
 * See https://www.w3.org/WAI/ARIA/apg/patterns/grid
 *
 * The hook attaches the GridNavigationProcessor helper when active=true.
 * See GridNavigationProcessor for more details.
 */
export function GridNavigationProvider({
  children,
  keyboardNavigation,
  pageSize,
  getTable,
}: GridNavigationProviderProps) {
  const gridNavigation = useMemo(() => new GridNavigationProcessor(), []);

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
  const { focusMuted, registerFocusable, unregisterFocusable } = useContext(GridNavigationContext);
  const registerFocusableContext = useCallback(
    (focusable: FocusableDefinition, changeHandler: FocusableChangeHandler) =>
      focusMuted ? registerFocusable(focusable, changeHandler) : () => {},
    [focusMuted, registerFocusable]
  );
  return { focusMuted, registerFocusable: registerFocusableContext, unregisterFocusable };
}

export function useGridNavigationFocusable(
  focusable: FocusableDefinition,
  { navigationSuppressed = false }: { navigationSuppressed?: boolean } = {}
) {
  const { focusMuted, registerFocusable } = useGridNavigationContext();
  const [focusTargetActive, setFocusTargetActive] = useState(false);

  useEffect(() => {
    if (!navigationSuppressed) {
      const changeHandler = (focusTarget: null | HTMLElement) =>
        setFocusTargetActive(getFocusableElement(focusable) === focusTarget);

      const unregister = registerFocusable(focusable, changeHandler);

      return () => unregister();
    }
  }, [navigationSuppressed, focusable, registerFocusable]);

  const focusTargetMuted = focusMuted && !focusTargetActive;

  return { focusMuted, focusTargetMuted };
}

export function useGridNavigationAutoRegisterFocusable(
  getElementRoot: FocusableDefinition,
  isSuppressed: (el: HTMLElement) => boolean = () => false
) {
  const uniqueId = useUniqueId();
  const { focusMuted, registerFocusable } = useGridNavigationContext();

  const stableIsSuppressed = useStableCallback(isSuppressed);

  useEffect(() => {
    const root = getFocusableElement(getElementRoot);
    if (!root || !focusMuted) {
      return;
    }

    const allFocusables = getAllFocusables(root).filter(
      element =>
        !element.tabIndex || element.tabIndex >= 0 || element.getAttribute('data-awsui-auto-focusable') === uniqueId
    );

    const registers = allFocusables
      .filter(element => !stableIsSuppressed(element))
      .map(element => {
        element.tabIndex = -1;
        element.setAttribute('data-awsui-auto-focusable', uniqueId);

        const handler = (focusTarget: null | HTMLElement) => {
          if (element === focusTarget) {
            element.tabIndex = 0;
          }
        };

        return registerFocusable(() => element, handler);
      });

    return () => registers.forEach(reg => reg());
  });

  useEffectOnUpdate(() => {
    const root = getFocusableElement(getElementRoot);
    if (root && !focusMuted) {
      root.querySelectorAll(`[data-awsui-auto-focusable="${uniqueId}"]`).forEach(element => {
        if (element instanceof HTMLElement) {
          element.tabIndex = 0;
        }
      });
    }
  }, [getElementRoot, focusMuted, uniqueId]);
}
