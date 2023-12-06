// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface CopyToClipboardProps extends BaseComponentProps {
  /** Determines the general styling of the copy button as follows:
   * * `standalone` to display a secondary button with an icon and `i18nStrings.copyButtonText` as text.
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
   * The name of the resource to copy used as argument for `i18nStrings.copySuccessText` and `i18nStrings.copyErrorText`.
   */
  copyTarget: string;

  /**
   * The text content to be copied. It is displayed next to the copy button when `variant="inline"` and is not shown otherwise.
   */
  textToCopy: string;

  /**
   * Called when the text is successfully copied to the clipboard.
   */
  onCopySuccess?: NonCancelableEventHandler<null>;

  /**
   * Called when there is an error from the Clipboard API preventing the text from being copied.
   */
  onCopyError?: NonCancelableEventHandler<null>;

  /**
   * An object containing all the necessary localized strings required by the component.
   * @i18n
   */
  i18nStrings?: CopyToClipboardProps.I18nStrings;
}

export namespace CopyToClipboardProps {
  export type Variant = 'standalone' | 'inline';

  export interface I18nStrings {
    copyButtonText?: string;
    copySuccessText?: (resourceName: string) => string;
    copyErrorText?: (resourceName: string) => string;
  }
}
