// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';
import { NonCancelableEventHandler } from '../types/events';

export interface DialogProps extends BaseComponentProps {
  /**
   * Heading text of the dialog. This is used as the dialog's accessible name
   * (wired to the `role="dialog"` element via `aria-labelledby`), so it should
   * always be provided.
   */
  header?: React.ReactNode;

  /**
   * Main content of the dialog. The dialog is a shell only: the interactive
   * content it hosts (for example a radio group, a `Select`, or a form) is
   * owned by the consumer and passed in through this slot.
   */
  children?: React.ReactNode;

  /**
   * Footer content displayed at the bottom of the dialog, typically action buttons.
   */
  footer?: React.ReactNode;

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
   * @i18n
   */
  i18nStrings?: DialogProps.I18nStrings;

  /**
   * Fired when the user dismisses the dialog using the close button (always
   * present) or by pressing `Escape`. Dismissal never advances focus on its
   * own, so the consumer decides where focus goes after the dialog is removed.
   */
  onDismiss?: NonCancelableEventHandler;
}

export namespace DialogProps {
  export type InitialFocus = 'header' | 'none';

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
