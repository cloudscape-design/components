// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import React from 'react';
import {
  BaseNavigationDetail,
  CancelableEventHandler,
  NonCancelableEventHandler,
  ClickDetail as _ClickDetail,
} from '../internal/events';

export interface LinkProps extends BaseComponentProps {
  /**
   * Determines the visual style of the link as follows:
   *
   * - `primary` - Displays the link text with bold styling for sufficient contrast with surrounding text.
   *     Use this for links where the context doesn't imply interactivity such as
   *     "Learn more" links and links within paragraphs.
   * - `secondary` - Does not provide any additional indicators for interactivity (except for an underline when the user hovers over or focuses the link).
   *     This can be used in cases where the interactivity is strongly implied by its context,
   *     such as in a table or a list of external links.
   * - `info` - Use for "info" links that link to content in a help panel.
   *
   * The default is `secondary`, except inside the following components where it defaults to `primary`:
   * - Table
   * - Cards
   * - Alert
   * - Popover
   * - Help Panel (main `content` only)
   */
  variant?: LinkProps.Variant;

  /**
   * Determines the font size and line height.
   * This property is overridden if the variant is `info`.
   */
  fontSize?: LinkProps.FontSize;

  /**
   * Determines the text color of the link and its icon.
   *
   * - `normal`: Use in most cases where a link is required.
   * - `inverted`: Use to style links inside Flashbars.
   *
   * This property is overridden if the variant is `info`.
   */
  color?: LinkProps.Color;

  /**
   * Marks the link as external by adding an icon after the text. If `href`
   * is provided, opens the link in a new tab when clicked.
   */
  external?: boolean;

  /**
   * Specifies where to open the linked URL. Set this to `_blank` to open the URL
   * in a new tab. If you set this property to `_blank`, the component
   * automatically adds `rel="noopener noreferrer"` to avoid performance
   * and security issues.
   *
   * For other options see the documentation for <a> tag's
   * [target attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target).
   */
  target?: string;

  /**
   * The URL that the link points to.
   * If an `href` is not provided, the component will render using a
   * "button" role and `target` will not be used.
   */
  href?: string;

  /**
   * The text to render inside the link.
   */
  children?: React.ReactNode;

  /**
   * Adds an aria-label to the HTML element.
   */
  ariaLabel?: string;

  /**
   * Adds an aria-label to the external icon.
   * @i18n
   */
  externalIconAriaLabel?: string;

  /**
   * Called when a link is clicked without any modifier keys. If the link has no `href` provided, it will be called on
   * all clicks.
   *
   * If you want to implement client-side routing yourself, use this event and prevent default browser navigation
   * (by calling `preventDefault`).
   */
  onFollow?: CancelableEventHandler<LinkProps.FollowDetail>;

  /**
   * Called when the user clicks on the link. Do not use this handler for navigation, use the `onFollow` event instead.
   */
  onClick?: NonCancelableEventHandler<LinkProps.ClickDetail>;

  /**
   * Adds a `rel` attribute to the link. If the `rel` property is provided, it overrides the default behaviour.
   * By default, the component sets the `rel` attribute to "noopener noreferrer" when `external` is `true` or `target` is `"_blank"`.
   */
  rel?: string;
}

export namespace LinkProps {
  export type Variant = 'primary' | 'secondary' | 'info' | 'awsui-value-large';
  export type FontSize =
    | 'body-s'
    | 'body-m'
    | 'heading-xs'
    | 'heading-s'
    | 'heading-m'
    | 'heading-l'
    | 'heading-xl'
    | 'display-l'
    | 'inherit';
  export type Color = 'normal' | 'inverted';

  export type FollowDetail = BaseNavigationDetail;

  export interface Ref {
    /**
     * Sets the browser focus on the anchor element.
     */
    focus(): void;
  }

  export type ClickDetail = _ClickDetail;
}
