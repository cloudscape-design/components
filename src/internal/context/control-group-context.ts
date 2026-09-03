// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, useContext } from 'react';

export type ControlGroupPosition = 'first' | 'middle' | 'last' | 'only';

export interface ControlGroupContextProps {
  /**
   * True when a control is rendered as a direct participant of a `ControlGroup`.
   * Participating controls keep their own border but drop the border radius and
   * doubled border on the sides where they meet a neighbor, so the group reads as
   * one fused unit.
   */
  isInControlGroup: boolean;
  /**
   * The control's position within the group, used to decide which corners keep
   * their radius and which side collapses the shared seam.
   */
  position?: ControlGroupPosition;
}

export const ControlGroupContext = createContext<ControlGroupContextProps>({
  isInControlGroup: false,
});

export function useControlGroupContext() {
  return useContext(ControlGroupContext);
}
