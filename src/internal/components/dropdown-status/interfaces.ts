// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ReactNode } from 'react';

export interface DropdownStatusProps {
  /**
   * Displayed when there are no options to display.
   * This is only shown when `statusType` is set to `finished` or not set at all.
   */
  empty?: ReactNode;
  /**
   * Specifies the text to display when in the loading state.
   **/
  loadingText?: string;
  /**
   * Specifies the text to display at the bottom of the dropdown menu after pagination has reached the end.
   **/
  finishedText?: string;
  /**
   * Specifies the text to display when a data fetching error occurs. Make sure that you provide `recoveryText`.
   **/
  errorText?: string;
  /**
   * Specifies the text for the recovery button. The text is displayed next to the error text.
   * Use the `onLoadItems` event to perform a recovery action (for example, retrying the request).
   * @i18n
   **/
  recoveryText?: string;

  /**
   * Provides a text alternative for the error icon in the error message.
   * @i18n
   */
  errorIconAriaLabel?: string;
  /**
   * Specifies the current status of loading more options.
   * * `pending` - Indicates that no request in progress, but more options may be loaded.
   * * `loading` - Indicates that data fetching is in progress.
   * * `finished` - Indicates that pagination has finished and no more requests are expected.
   * * `error` - Indicates that an error occurred during fetch. You should use `recoveryText` to enable the user to recover.
   **/
  statusType?: DropdownStatusProps.StatusType;
}

export namespace DropdownStatusProps {
  export type StatusType = 'pending' | 'loading' | 'finished' | 'error';
}
