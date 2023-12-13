// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BaseComponentProps } from '../internal/base-component';

export interface CopyToClipboardProps extends BaseComponentProps {
  /** Determines the general styling of the copy button as follows:
   * * `button` to display a secondary button with an icon and `copyButtonText` as text.
   * * `inline` to display an icon-only (no text) button within a text context.
   * Defaults to `button`.
   */
  variant?: CopyToClipboardProps.Variant;

  /**
   * The text of the copy button (for variant="button").
   */
  copyButtonText?: string;

  /**
   * Adds `aria-label` to the copy button. Use this to provide an accessible name for buttons that don't have visible text,
   * and to distinguish between multiple buttons with identical visible text. The text will also be added to the `title` attribute of the button.
   */
  copyButtonAriaLabel?: string;

  /**
   * The text content to be copied. It is displayed next to the copy button when `variant="inline"` and is not shown otherwise.
   */
  textToCopy: string;

  /**
   * An object containing all the necessary localized strings required by the component.
   * @i18n
   */
  i18nStrings?: CopyToClipboardProps.I18nStrings;
}

export namespace CopyToClipboardProps {
  export type Variant = 'button' | 'inline';

  export interface I18nStrings {
    /**
     * The message shown when the text is copied successfully.
     */
    copySuccessText?: string;
    /**
     * The message shown when the text was not copied due to an error, see https://w3c.github.io/clipboard-apis/#dom-clipboard-writetext.
     */
    copyErrorText?: string;
  }
}
