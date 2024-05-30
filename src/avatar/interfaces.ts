// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { IconProps } from '../icon/interfaces';

export interface AvatarProps extends BaseComponentProps {
  /**
   * Determines the color of the avatar.
   * Use `gen-ai` for AI assistants and `default` for people and everything else.
   */
  color?: AvatarProps.Color;

  /**
   * The text content shown in the avatar's on-hover tooltip.
   * Use it to define the entity the avatar belongs to which can be the name of the user (like "John Doe") or the AI assistant (like "Configuration Buddy").
   * You can keep the property empty if the information is clear from the context in which case no tooltip will be shown.
   */
  tooltipText?: string;

  /**
   * The text content shown directly in the avatar's body.
   * Can be 1 or 2 symbols long, every subsequent symbol is ignored.
   * Use it to define initials that uniquely identify the avatar's owner.
   */
  initials?: string;

  /**
   * Indicates whether avatar is in loading state.
   * ??Note: this property is ignored for avatars with variant=`default`.??
   */
  loading?: boolean;

  /**
   * Text to describe the avatar for assistive technology.
   * When more than one avatar is used, provide a unique label to each.
   * For example, "User avatar" and "AI assistant avatar". Or "Your avatar" and "User avatar for John Doe".
   * We suggest you include the `tooltipText` inside ariaLabel to ensure tooltipText is accessible.
   */
  ariaLabel?: string;

  /**
   * Specifies the icon to be displayed as Avatar.
   * If you set both `iconName` and `initials`, `initials` will take precedence.
   * By default, "user-profile" icon is used for avatars with variant=`default`.
   * By default, "gen-ai" icon is used for avatars with variant=`gen-ai`
   */
  iconName?: IconProps.Name;

  /**
   * Specifies the URL of a custom icon. Use this property if the icon you want isn't available, and your custom icon cannot be an SVG.
   * For SVG icons, use the `iconSvg` slot instead.
   *
   * If you set both `iconUrl` and `iconSvg`, `iconSvg` will take precedence.
   */
  iconUrl?: string;

  /**
   * Specifies the SVG of a custom icon.
   *
   * Use this property if the icon you want isn't available, and you want your custom icon to inherit colors dictated by variant or hover states.
   * When this property is set, the component will be decorated with `aria-hidden="true"`. Ensure that the `svg` element:
   * - has attribute `focusable="false"`.
   * - has `viewBox="0 0 16 16"`.
   *
   * If you set the `svg` element as the root node of the slot, the component will automatically
   * - set `stroke="currentColor"`, `fill="none"`, and `vertical-align="top"`.
   * - set the stroke width based on the size of the icon.
   * - set the width and height of the SVG element based on the size of the icon.
   *
   * If you don't want these styles to be automatically set, wrap the `svg` element into a `span` and ensure icon `size` is not set to `inherit`.
   * You can still set the stroke to `currentColor` to inherit the color of the surrounding elements.
   *
   * If you set both `iconUrl` and `iconSvg`, `iconSvg` will take precedence.
   *
   * *Note:* Remember to remove any additional elements (for example: `defs`) and related CSS classes from SVG files exported from design software.
   * In most cases, they aren't needed, as the `svg` element inherits styles from the icon component.
   */
  iconSvg?: React.ReactNode;
}

export namespace AvatarProps {
  export type Color = 'default' | 'gen-ai';
}
