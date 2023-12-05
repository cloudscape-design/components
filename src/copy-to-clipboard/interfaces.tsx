// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BaseComponentProps } from '../internal/base-component';
import { CancelableEventHandler, ClickDetail as _ClickDetail } from '../internal/events';

export interface CopyToClipboardProps extends BaseComponentProps {
  /** Determines the general styling of the copy button as follows:
   * * `normal` to display a secondary button with an icon and `i18nStrings.copyButtonText` as text.
   * * `inline` to display an icon-only (no text) button within a text context.
   * Defaults to `normal`.
   */
  variant?: CopyToClipboardProps.Variant;

  /**
   * Adds `aria-label` to the button element. It should be used in buttons that don't have text in order to make
   * them accessible. The text will also be added to the `title` attribute of the button.
   */
  ariaLabel?: string;

  /**
   * Specifies the message type and can be either `success` or `error`.
   * Defaults to `success`.
   */
  messageType?: CopyToClipboardProps.MessageType;

  /**
   * A text fragment that communicates the outcome. The recommended messages are:
   * * "[Name of the content] copied" for success;
   * * "[Name of the content] failed to copy" for error.
   */
  message: string;

  /**
   * Called when the user clicks on the copy button. Use it to copy the related content to clipboard: `navigator.clipboard.writeText('[text to be copied]')`.
   */
  onClick: CancelableEventHandler<CopyToClipboardProps.ClickDetail>;

  /**
   * An object containing all the necessary localized strings required by the component.
   * @i18n
   */
  i18nStrings?: CopyToClipboardProps.I18nStrings;
}

export namespace CopyToClipboardProps {
  export type MessageType = 'success' | 'error';

  export type Variant = 'normal' | 'inline';

  export interface I18nStrings {
    copyButtonText?: string;
  }

  export type ClickDetail = _ClickDetail;
}
