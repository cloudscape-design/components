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
   * True when the group has collapsed to a vertical (stacked) layout because the
   * controls do not fit in the available width. Controls flip their fused corners
   * and seams from the inline axis to the block axis when this is set. The group
   * measures fit in JS (not a fixed CSS breakpoint), so this is provided via context
   * rather than a container query.
   */
  stacked?: boolean;
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
  /**
   * True for a consumer-provided button in the custom `actions` slot. In a row it
   * fuses with the group like other controls, but when the group wraps (stacks) it
   * renders as an ordinary, detached button (the slot right-aligns it) instead of the
   * full-width, field-styled control the group's fusing would otherwise impose. Unlike
   * the built-in dismiss button, its content is authored by the consumer, so the group
   * does not swap its icon/text.
   */
  customStandalone?: boolean;
  /**
   * True for a custom `actions` button placed at the group's END SIDE while the group is
   * stacked (`actionsPosition="side"`). Unlike the default stacked custom button (which
   * fuses on its block-start edge and fills the row width), a side button spans the full
   * height of the stacked control column and fuses on its leading (inline-start) edge,
   * like a control in a row.
   */
  sideActions?: boolean;
  /**
   * True when the group is in an error state. Consumed by the built-in dismiss button
   * (which has no validation state of its own) so it paints its border — including the
   * seam it shares with the last control — in the error color, continuing the group's
   * unit error styling onto the button.
   */
  invalid?: boolean;
  /**
   * True when the group is in a warning state. See `invalid`.
   */
  warning?: boolean;
}

export const ControlGroupContext = createContext<ControlGroupContextProps>({
  isInControlGroup: false,
});

export function useControlGroupContext() {
  return useContext(ControlGroupContext);
}
