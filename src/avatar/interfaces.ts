// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { IconProps } from '../icon/interfaces';

export interface AvatarProps extends BaseComponentProps {
  /**
   * Type of the avatar.
   * It can be "user" or "gen-ai"
   */
  type: AvatarProps.Type;

  /**
   * The full name of agent shown in the tooltip.
   */
  fullName?: string;

  /**
   * The initials of user avatar's name.
   * If passed, the avatar will show these initials.
   * It should be at max 2 letters. If string is longer, the first 2 letters will be used.
   * It can only be used with "user" avatar.
   */
  initials?: string;

  /**
   * Indicates whether avatar is in loading state.
   * It can only be used with "gen-ai" avatar.
   */
  loading?: boolean;

  /**
   * Text to describe avatar's loading state, shown in tooltip.
   * It can only be used with "gen-ai" avatar.
   */
  loadingText?: string;

  /**
   * Text to describe avatar if "initials" are not passed. We recommend that you provide this for accessibility.
   * If both "altText" and "initials" are defined, "initials" take precedence.
   */
  altText?: string;

  /**
   * Specifies the icon to be displayed in Avatar.
   * "user-profile" icon is used by default for "user" avatar
   * "gen-ai" icon is used by default for "gen-ai" avatar
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
  export type Type = 'user' | 'gen-ai';
}
