// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';
import { NonCancelableEventHandler } from '../types/events';

/**
 * The Dialog is an in-flow, non-modal surface. Its API is intentionally built
 * around two independent, additive axes so future modes stay non-breaking:
 *
 * - Placement — today the dialog is always inline (in the document flow). A
 *   future `variant` (`'inline' | 'floating'`, defaulting to `'inline'`) adds
 *   the floating mode without changing the meaning of any existing prop.
 * - Modality — the dialog is non-modal and never traps focus. A future opt-in
 *   could add a backdrop + focus trap. Placement and modality must NOT be
 *   collapsed into a single prop (that would lose valid combinations such as
 *   "floating but non-modal").
 */
export interface DialogProps extends BaseComponentProps {
  /**
   * Heading text of the dialog. Always provide this: it labels the dialog as
   * its accessible name (wired to the `role="dialog"` element via
   * `aria-labelledby`) and is the default target for `initialFocus`.
   */
  header?: React.ReactNode;

  /**
   * Main content of the dialog. The dialog is a shell only: the interactive
   * content it hosts (for example a radio group, a `Select`, or a form) is
   * owned by the consumer and passed in through this slot.
   */
  children?: React.ReactNode;

  /**
   * Footer content displayed at the bottom of the dialog. Although any content
   * is technically possible, our UX guidelines recommend using action buttons.
   */
  footer?: React.ReactNode;

  /**
   * Controls the dialog's visibility and focus lifecycle.
   *
   * - When set (`true`/`false`), the dialog manages its own visibility: it is
   *   hidden when `false`, moves focus in (per `initialFocus`) when it becomes
   *   visible, and restores focus to the previously focused element when it
   *   becomes hidden. Provide `onDismiss` to respond to close actions.
   * - When left unset, the dialog is always rendered; mounting/unmounting and
   *   focus restoration on removal are the consumer's responsibility. Focus
   *   still moves in on mount (per `initialFocus`).
   *
   * The dialog never traps focus, regardless of this property.
   */
  open?: boolean;

  /**
   * Determines where focus moves when the dialog appears.
   *
   * - `header` - Moves focus to the dialog heading so assistive technology
   *   announces the dialog on entry.
   * - `none` - Leaves focus where it is; the consumer is responsible for
   *   managing focus.
   *
   * The dialog never traps focus: `Tab` moves through the dialog content and
   * out into the rest of the page, matching its non-modal, in-flow behavior.
   *
   * @default 'header'
   */
  initialFocus?: DialogProps.InitialFocus;

  /**
   * An object containing all the necessary localized strings required by the component.
   *
   * - `dismissAriaLabel` (string) - Provides an ARIA label for the close button.
   * @i18n
   */
  i18nStrings?: DialogProps.I18nStrings;

  /**
   * Fired when the user dismisses the dialog, either with the close button
   * (always present) or by pressing `Escape`. Dismissal never advances focus on
   * its own. When `open` is controlled, respond by setting `open={false}`;
   * otherwise unmount the dialog. In both cases decide where focus goes next
   * (controlled dialogs restore it to the previously focused element for you).
   */
  onDismiss?: NonCancelableEventHandler;
}

export namespace DialogProps {
  export type InitialFocus = 'header' | 'none';

  // Reserved for the placement axis (floating extension). When added:
  //   export type Variant = 'inline' | 'floating'; // prop default: 'inline'
  // It must remain independent of modality (no implicit backdrop/focus trap).

  export interface I18nStrings {
    /**
     * Specifies the ARIA label for the dismiss button.
     */
    dismissAriaLabel?: string;
  }

  export interface Ref {
    /**
     * Sets focus on the dialog heading.
     */
    focus(): void;
  }
}
