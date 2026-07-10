// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode } from 'react';

import { BaseComponentProps } from '../types/base-component';
import { BaseNavigationDetail, CancelableEventHandler } from '../types/events';
import { NativeAttributes } from '../types/native-attributes';

export interface ActionCardProps extends BaseComponentProps {
  /**
   * The header content displayed at the top of the action card.
   */
  header?: ReactNode;

  /**
   * The description content displayed below the header.
   */
  description?: ReactNode;

  /**
   * The main content of the action card.
   */
  children?: ReactNode;

  /**
   * Called when the user clicks on the action card.
   */
  onClick?: CancelableEventHandler<ActionCardProps.ClickDetail>;

  /**
   * Turns the action card into a link, pointing to the given URL. The card is rendered using an `a` element instead of a `button`.
   * For example, use this property if selecting the card should navigate the user to another page.
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
   * This property only applies when an `href` is provided.
   */
  rel?: string;

  /**
   * Specifies whether the linked URL, when selected, will prompt the user to download instead of navigate.
   * You can specify a string value that will be suggested as the name of the downloaded file.
   * This property only applies when an `href` is provided.
   */
  download?: boolean | string;

  /**
   * Called when the user clicks on the action card with the left mouse button without pressing
   * modifier keys (that is, CTRL, ALT, SHIFT, META), and the action card has an `href` set.
   */
  onFollow?: CancelableEventHandler<ActionCardProps.FollowDetail>;

  /**
   * Adds an aria-label to the action card.
   */
  ariaLabel?: string;

  /**
   * Adds an aria-describedby reference for the action card.
   */
  ariaDescribedby?: string;

  /**
   * Determines whether the action card is disabled.
   */
  disabled?: boolean;

  /**
   * Removes the default padding from the header area.
   */
  disableHeaderPaddings?: boolean;

  /**
   * Removes the default padding from the content area.
   */
  disableContentPaddings?: boolean;

  /**
   * Displays an icon next to the content. You can use the `iconVerticalAlignment` property to control vertical alignment.
   */
  icon?: React.ReactNode;

  /**
   * Specifies the vertical alignment of the icon.
   */
  iconVerticalAlignment?: ActionCardProps.IconVerticalAlignment;

  /**
   * Specifies the visual variant of the card, which controls the border radius and padding.
   *
   * - `default` - Uses container-level border radius and padding (larger).
   * - `embedded` - Uses compact border radius and padding (smaller).
   */
  variant?: ActionCardProps.Variant;

  /**
   * Attributes to add to the native button element.
   * Some attributes will be automatically combined with internal attribute values:
   * - `className` will be appended.
   * - Event handlers will be chained, unless the default is prevented.
   *
   * We do not support using this attribute to apply custom styling.
   *
   * @awsuiSystem core
   */
  nativeButtonAttributes?: NativeAttributes<React.ButtonHTMLAttributes<HTMLButtonElement>>;

  /**
   * Attributes to add to the native `a` element (when `href` is provided).
   * Some attributes will be automatically combined with internal attribute values:
   * - `className` will be appended.
   * - Event handlers will be chained, unless the default is prevented.
   *
   * We do not support using this attribute to apply custom styling.
   *
   * @awsuiSystem core
   */
  nativeAnchorAttributes?: NativeAttributes<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
}

export namespace ActionCardProps {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface ClickDetail {}

  export type FollowDetail = BaseNavigationDetail;

  export type IconVerticalAlignment = 'top' | 'center';
  export type Variant = 'default' | 'embedded';

  export interface Ref {
    /**
     * Sets focus on the action card.
     */
    focus(): void;
  }
}
