// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BaseComponentProps } from '../internal/base-component';

export interface CopyToClipboardProps extends BaseComponentProps {
  /** Determines the general styling of the copy button as follows:
   *
   * * `button` to display a standalone secondary button with an icon, and `copyButtonText` as text.
   * * `icon` to display a standalone icon-only (no text) button.
   * * `inline` to display an icon-only (no text) button within a text context.
   *
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
   * The text content to be copied. It is displayed next to the copy button when `variant="inline"` unless when `content` is specified, and is not shown otherwise.
   */
  textToCopy: string;

  /**
   * The message shown when the text is copied successfully.
   */
  copySuccessText: string;

  /**
   * The message shown when the text is not copied due to an error, see [https://w3c.github.io/clipboard-apis/#dom-clipboard-writetext](https://w3c.github.io/clipboard-apis/#dom-clipboard-writetext).
   */
  copyErrorText: string;

  /**
   * By default, the popover is constrained to fit inside its parent
   * [stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context).
   * Enabling this property will allow the popover to be rendered in the root stack context using
   * [React Portals](https://reactjs.org/docs/portals.html).
   * Enable this setting if you need the popover to ignore its parent stacking context.
   */
  popoverRenderWithPortal?: boolean;

  /**
   * The content to display for next to the copy button when `variant="inline"`. If not provided, `textToCopy` will be displayed instead.
   */
  content?: string;
}

export namespace CopyToClipboardProps {
  export type Variant = 'button' | 'icon' | 'inline';
}
