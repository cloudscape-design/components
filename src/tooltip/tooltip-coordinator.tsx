// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

interface TooltipCoordinatorContextValue {
  activeTooltipId: string | null;
  registerTooltip: (id: string) => void;
  unregisterTooltip: (id: string) => void;
}

const TooltipCoordinatorContext = createContext<TooltipCoordinatorContextValue | null>(null);

/**
 * TooltipCoordinator ensures only one tooltip is visible at a time within its scope.
 * Wrap multiple elements with tooltips in this component to enable coordination.
 *
 * @example
 * ```tsx
 * <TooltipCoordinator>
 *   <button {...targetProps1}>Button 1</button>
 *   {tooltip1 && <Tooltip {...tooltip1} />}
 *
 *   <button {...targetProps2}>Button 2</button>
 *   {tooltip2 && <Tooltip {...tooltip2} />}
 * </TooltipCoordinator>
 * ```
 */
export function TooltipCoordinator({ children }: { children: ReactNode }) {
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);

  const registerTooltip = useCallback((id: string) => {
    setActiveTooltipId(id);
  }, []);

  const unregisterTooltip = useCallback((id: string) => {
    setActiveTooltipId(current => (current === id ? null : current));
  }, []);

  const contextValue = useMemo(
    () => ({ activeTooltipId, registerTooltip, unregisterTooltip }),
    [activeTooltipId, registerTooltip, unregisterTooltip]
  );

  return <TooltipCoordinatorContext.Provider value={contextValue}>{children}</TooltipCoordinatorContext.Provider>;
}

/**
 * Hook to access the tooltip coordinator context.
 * Returns null if not within a TooltipCoordinator.
 */
export function useTooltipCoordinator() {
  return useContext(TooltipCoordinatorContext);
}
