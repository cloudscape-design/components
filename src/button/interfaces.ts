// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { IconProps } from '../icon/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { BaseNavigationDetail, CancelableEventHandler, ClickDetail as _ClickDetail } from '../internal/events';

export interface BaseButtonProps {
  /**
   * Renders the button as disabled and prevents clicks.
   */
  disabled?: boolean;
  /**
   * Provides a reason why the button is disabled (only when `disabled` is `true`).
   * If provided, the button becomes focusable.
   * Applicable for all button variants, except link.
   */
  disabledReason?: string;
  /**
   * Renders the button as being in a loading state. It takes precedence over the `disabled` if both are set to `true`.
   * It prevents users from clicking the button, but it can still be focused.
   */
  loading?: boolean;
  /**
   * Specifies the text that screen reader announces when the button is in a loading state.
   */
  loadingText?: string;
  /**
   * Displays an icon next to the text. You can use the `iconAlign` property to position the icon.
   */
  iconName?: IconProps.Name;
  /**
   * Specifies the URL of a custom icon. Use this property if the icon you want isn't available.
   *
   * If you set both `iconUrl` and `iconSvg`, `iconSvg` will take precedence.
   */
  iconUrl?: string;
  /**
   * Specifies the SVG of a custom icon.
   *
   * Use this property if you want your custom icon to inherit colors dictated by variant or hover states.
   * When this property is set, the component will be decorated with `aria-hidden="true"`. Ensure that the `svg` element:
   * - has attribute `focusable="false"`.
   * - has `viewBox="0 0 16 16"`.
   *
   * If you set the `svg` element as the root node of the slot, the component will automatically
   * - set `stroke="currentColor"`, `fill="none"`, and `vertical-align="top"`.
   * - set the stroke width based on the size of the icon.
   * - set the width and height of the SVG element based on the size of the icon.
   *
   * If you don't want these styles to be automatically set, wrap the `svg` element into a `span`.
   * You can still set the stroke to `currentColor` to inherit the color of the surrounding elements.
   *
   * If you set both `iconUrl` and `iconSvg`, `iconSvg` will take precedence.
   *
   * *Note:* Remember to remove any additional elements (for example: `defs`) and related CSS classes from SVG files exported from design software.
   * In most cases, they aren't needed, as the `svg` element inherits styles from the icon component.
   */
  iconSvg?: React.ReactNode;

  /**
   * Adds `aria-label` to the button element. Use this to provide an accessible name for buttons
   * that don't have visible text, and to distinguish between multiple buttons with identical visible text.
   * The text will also be added to the `title` attribute of the button.
   */
  ariaLabel?: string;

  /**
   * Adds `aria-describedby` to the button.
   */
  ariaDescribedby?: string;

  /**
   * Specifies if the `text` content wraps. If you set it to `false`, it prevents the text from wrapping.
   */
  wrapText?: boolean;

  /**
   * Text displayed in the button element.
   * @displayname text
   */
  children?: React.ReactNode;

  /**
   * Adds `aria-controls` to the button. Use when the button controls the contents or presence of an element.
   */
  ariaControls?: string;

  /**
   * Adds an external icon after the button label text.
   * If an href is provided, it opens the link in a new tab.
   */
  external?: boolean;

  /**
   * An object containing all the necessary localized strings required by the component. The object should contain:
   *
   * * `externalIconAriaLabel` - (optional) Specifies the aria-label for the external icon when `external` is set to `true`.
   * @i18n
   */
  i18nStrings?: ButtonProps.I18nStrings;
}

export interface ButtonProps extends BaseComponentProps, BaseButtonProps {
  /**
   * Specifies the alignment of the icon.
   */
  iconAlign?: ButtonProps.IconAlign;

  /**
   * The form action that is performed by a button click.
   */
  formAction?: ButtonProps.FormAction;

  /**
   * Applies button styling to a link. Use this property if you need a link styled as a button (`variant=link`).
   * For example, if you have a 'help' button that links to a documentation page.
   */
  href?: string;

  /**
   * Specifies where to open the linked URL (for example, to open in a new browser window or tab use `_blank`).
   * This property only applies when an `href` is provided.
   */
  target?: string;

  /**
   * Adds a `rel` attribute to the link. By default, the component sets the `rel` attribute to "noopener noreferrer" when `target` is `"_blank"`.
   * If the `rel` property is provided, it overrides the default behavior.
   */
  rel?: string;

  /**
   * Specifies whether the linked URL, when selected, will prompt the user to download instead of navigate.
   * You can specify a string value that will be suggested as the name of the downloaded file.
   * This property only applies when an `href` is provided.
   **/
  download?: boolean | string;

  /** The id of the <form> element to associate with the button. The value of this attribute must be the id of a <form> in the same document.
   *  Use when a button is not the descendant of a form element, such as when used in a modal.
   */
  form?: string;

  /**
   * Adds aria-expanded to the button element. Use when the button controls an expandable element.
   */
  ariaExpanded?: boolean;

  /**
   * Called when the user clicks on the button and the button is not disabled or in loading state.
   */
  onClick?: CancelableEventHandler<ButtonProps.ClickDetail>;

  /**
   * Called when the user clicks on the button with the left mouse button without pressing
   * modifier keys (that is, CTRL, ALT, SHIFT, META), and the button has an `href` set.
   */
  onFollow?: CancelableEventHandler<ButtonProps.FollowDetail>;

  /**
   * Sets the button width to be 100% of the parent container width. Button content is centered.
   */
  fullWidth?: boolean;

  /** Determines the general styling of the button as follows:
   * * `primary` for primary buttons.
   * * `normal` for secondary buttons.
   * * `link` for tertiary buttons.
   * * `icon` to display an icon only (no text).
   * * `inline-icon` to display an icon-only (no text) button within a text context.
   * * `inline-link` to display a tertiary button with no outer padding.
   */
  variant?: ButtonProps.Variant;

  /**
   * Specifies alternate text for a custom icon. We recommend that you provide this for accessibility.
   * This property is ignored if you use a predefined icon or if you set your custom icon using the `iconSvg` slot.
   */
  iconAlt?: string;

  /**
   * Specifies an object of selectors and properties that are used to apply custom styles.
   *
   * - `root.background` {active, default, disabled, hover} - (Optional) Background for component states.
   * - `root.borderColor` {active, default, disabled, hover} - (Optional) Border color for component states.
   * - `root.borderRadius` (string) - (Optional) Border radius style.
   * - `root.borderWidth` (string) - (Optional) Border width style.
   * - `root.color` {active, default, disabled, hover} - (Optional) Color for component states.
   * - `root.focusRing.borderColor` (string) - (Optional) Focus ring border color.
   * - `root.focusRing.borderRadius` (string) - (Optional) Focus ring border radius.
   * - `root.focusRing.borderWidth` (string) - (Optional) Focus ring border width.
   * - `root.paddingBlock` (string) - (Optional) Block dimension padding.
   * - `root.paddingInline` (string) - (Optional) Inline dimension padding.
   * @awsuiSystem core
   */
  style?: ButtonProps.Style;
}

export namespace ButtonProps {
  export type Variant = 'normal' | 'primary' | 'link' | 'icon' | 'inline-icon' | 'inline-link';
  export type ClickDetail = _ClickDetail;
  export type FollowDetail = BaseNavigationDetail;

  export type FormAction = 'submit' | 'none';

  export type IconAlign = 'left' | 'right';

  export interface I18nStrings {
    /**
     * Specifies the aria-label for the external icon when `external` is set to `true`.
     */
    externalIconAriaLabel?: string;
  }

  export interface Ref {
    /**
     * Focuses the underlying native button.
     */
    focus(options?: FocusOptions): void;
  }

  export interface Style {
    root?: {
      background?: {
        active?: string;
        default?: string;
        disabled?: string;
        hover?: string;
      };
      borderColor?: {
        active?: string;
        default?: string;
        disabled?: string;
        hover?: string;
      };
      borderRadius?: string;
      borderWidth?: string;
      color?: {
        active?: string;
        default?: string;
        disabled?: string;
        hover?: string;
      };
      focusRing?: {
        borderColor?: string;
        borderRadius?: string;
        borderWidth?: string;
      };
      paddingBlock?: string;
      paddingInline?: string;
    };
  }
}
