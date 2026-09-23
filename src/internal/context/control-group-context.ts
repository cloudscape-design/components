// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, useContext } from 'react';

export type ControlGroupPosition = 'first' | 'middle' | 'last' | 'only';

export interface ControlGroupContextProps {
  /**
   * The control's position within a control group,
   * or `null` when the control is not in a control group.
   */
  position: ControlGroupPosition | null;
}

export const ControlGroupContext = createContext<ControlGroupContextProps>({
  position: null,
});

export function useControlGroupContext() {
  return useContext(ControlGroupContext);
}
