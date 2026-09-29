// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, useContext } from 'react';

export type GroupedControlPosition = 'first' | 'middle' | 'last' | 'only';

export interface GroupedControlContextProps {
  /**
   * The control's position within a control group,
   * or `null` when the control is not in a control group.
   */
  position: GroupedControlPosition | null;
}

export const GroupedControlContext = createContext<GroupedControlContextProps>({
  position: null,
});

export function useGroupedControlContext() {
  return useContext(GroupedControlContext);
}
