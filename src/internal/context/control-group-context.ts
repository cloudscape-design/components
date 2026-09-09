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
  /**
   * True when this control renders a visible inline label. Such a control does not
   * fuse into the previous control when the group wraps (stacks); it keeps its
   * spacing and its rounded top corners instead of collapsing the shared seam.
   */
  hasInlineLabel?: boolean;
  /**
   * True when the NEXT control detaches when the group wraps (it has a visible inline
   * label, or it is the built-in dismiss button, which becomes standalone). Such a
   * control leaves a gap, so this control (its predecessor) must keep its bottom
   * corners squared instead of rounding them off against the gap.
   */
  precedesDetached?: boolean;
  /**
   * True for the built-in dismiss button, which becomes a fully standalone control
   * when the group wraps (stacks): a gap above it and all four corners rounded,
   * instead of fusing to the control above it.
   */
  standaloneWhenStacked?: boolean;
}

export const ControlGroupContext = createContext<ControlGroupContextProps>({
  isInControlGroup: false,
});

export function useControlGroupContext() {
  return useContext(ControlGroupContext);
}
