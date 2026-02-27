// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ReactNode } from 'react';

import { IconProps } from '../icon/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { CancelableEventHandler } from '../internal/events';

export type InternalActionCardProps = ActionCardProps;

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
   * Adds an aria-label to the action card.
   */
  ariaLabel?: string;

  /**
   * Adds an aria-describedby reference for the action card.
   */
  ariaDescribedby?: string;

  /**
   * Determines whether the action card is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Displays an icon next to the content. You can use the `iconAlign` and `iconVerticalAlign` properties to position the icon.
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
  iconSvg?: ReactNode;

  /**
   * Specifies alternate text for a custom icon. We recommend that you provide this for accessibility.
   * This property is ignored if you use a predefined icon or if you set your custom icon using the `iconSvg` slot.
   */
  iconAlt?: string;

  /**
   * Specifies the horizontal position of the icon.
   * @default 'left'
   */
  iconPosition?: ActionCardProps.IconAlign;

  /**
   * Specifies the vertical alignment of the icon.
   * @default 'top'
   */
  iconVerticalAlignment?: ActionCardProps.IconVerticalAlign;
}

export namespace ActionCardProps {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface ClickDetail {}

  export type IconAlign = 'left' | 'right';
  export type IconVerticalAlign = 'top' | 'center' | 'bottom';

  export interface Ref {
    /**
     * Sets focus on the action card.
     */
    focus(): void;
  }
}
