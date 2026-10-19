// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, useContext } from 'react';

export type GroupedControlPosition = 'first' | 'middle' | 'last' | 'only';

export type GroupedControlDirection = 'horizontal' | 'vertical';

export type GroupedControlValidation = 'error' | 'warning';

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
  /**
   * The surrounding control group's validation state, or `null` for none.
   */
  validation?: GroupedControlValidation | null;
}

export const GroupedControlContext = createContext<GroupedControlContextProps>({
  position: null,
  direction: 'horizontal',
  hasAction: false,
  validation: null,
});

export function useGroupedControlContext() {
  return useContext(GroupedControlContext);
}

/**
 * Resets the grouped-control context back to "not in a group" for a subtree.
 *
 * Controls that render caller-supplied content (for example, custom dropdown
 * content) should wrap that content with this provider. Otherwise a nested
 * control rendered inside such a slot would inherit the surrounding group's
 * `position` and incorrectly pick up the grouped-control styling
 * where adjacent borders lose their border radii. The group's `validation`
 * state is also cleared so nested custom-slot controls never inherit the
 * group's validation styling.
 */
export function ResetGroupedControlContext({ children }: { children: React.ReactNode }) {
  const { direction } = useGroupedControlContext();
  return (
    <GroupedControlContext.Provider value={{ position: null, direction, validation: null }}>
      {children}
    </GroupedControlContext.Provider>
  );
}
