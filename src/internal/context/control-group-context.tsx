// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, useContext } from 'react';

export type GroupedControlPosition = 'first' | 'middle' | 'last' | 'only';

export type GroupedControlDirection = 'horizontal' | 'vertical';

export interface GroupedControlContextProps {
  /**
   * The control's position within a control group,
   * or `null` when the control is not in a control group.
   */
  position: GroupedControlPosition | null;
  /**
   * The axis along which the surrounding control group lays out its
   * controls.
   */
  direction: GroupedControlDirection;
  /**
   * Whether an action is fused onto the group's inline-end. Controls square the
   * inline-end corners facing the action so it owns the only rounded ones.
   */
  hasAction?: boolean;
}

export const GroupedControlContext = createContext<GroupedControlContextProps>({
  position: null,
  direction: 'horizontal',
  hasAction: false,
});

export function useGroupedControlContext() {
  return useContext(GroupedControlContext);
}

/**
 * Resets the grouped-control context for a subtree so nested controls rendered in a
 * control's custom slot don't inherit the surrounding group's position and styling.
 */
export function ResetGroupedControlContext({ children }: { children: React.ReactNode }) {
  const { direction } = useGroupedControlContext();
  return (
    <GroupedControlContext.Provider value={{ position: null, direction }}>{children}</GroupedControlContext.Provider>
  );
}
