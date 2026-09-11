// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';
import { NonCancelableEventHandler } from '../types/events';

export interface DialogProps extends BaseComponentProps {
  /**
   * Specifies the heading of the dialog.
   */
  header: React.ReactNode;

  /**
   * Actions displayed in the header row, before the close button.
   */
  headerActions?: React.ReactNode;

  /**
   * Content of the dialog.
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
   * Called when the user dismisses the dialog by using the close button or pressing `Escape`.
   *
   * Remove the dialog from the render tree in response. When the dialog unmounts, it returns
   * focus to the element that was focused before it mounted, as long as that element still exists.
   */
  onDismiss: NonCancelableEventHandler;
}

export namespace DialogProps {
  export interface I18nStrings {
    dismissAriaLabel?: string;
  }
}
