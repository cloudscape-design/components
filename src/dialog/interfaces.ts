// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';
import { NonCancelableEventHandler } from '../types/events';

export interface DialogProps extends BaseComponentProps {
  /**
   * Specifies the heading of the dialog. We recommend that you always provide it:
   * it labels the dialog as its accessible name (via `aria-labelledby`).
   */
  header?: React.ReactNode;

  /**
   * Actions displayed in the header row, before the always-present close button.
   * Use this for controls related to the dialog, such as a compact `Pagination`.
   */
  headerActions?: React.ReactNode;

  /**
   * Content of the dialog. The dialog is a shell: the interactive content it hosts
   * (for example a radio group, a `Select`, or a form) is provided through this slot.
   * @displayname content
   */
  children?: React.ReactNode;

  /**
   * Specifies a footer for the dialog, typically action buttons. If empty, the footer
   * isn't displayed.
   */
  footer?: React.ReactNode;

  /**
   * An object containing all the necessary localized strings required by the component.
   *
   * - `dismissAriaLabel` (string) - Adds an `aria-label` to the close button.
   * @i18n
   */
  i18nStrings?: DialogProps.I18nStrings;

  /**
   * Called when the user dismisses the dialog by using the close button or pressing
   * `Escape`. The event detail contains the dismissal reason, which can be one of the
   * following: `['closeButton', 'keyboard']`.
   *
   * Remove the dialog from the render tree in response. When the dialog unmounts, it returns
   * focus to the element that was focused before it mounted. If you move focus to another
   * element from this handler, the dialog preserves that focus instead.
   */
  onDismiss: NonCancelableEventHandler<DialogProps.DismissDetail>;
}

export namespace DialogProps {
  export interface DismissDetail {
    reason: string;
  }

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
