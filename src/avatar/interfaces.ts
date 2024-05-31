// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { IconProps } from '../icon/interfaces';

export interface AvatarProps extends BaseComponentProps {
  /**
   * Determines the color of the avatar.
   * Use `gen-ai` for AI assistants and `default` otherwise.
   */
  color?: AvatarProps.Color;

  /**
   * The text content shown in the avatar's tooltip.
   *
   * When you use this property, make sure to include it in the "ariaLabel".
   */
  tooltipText?: string;

  /**
   * The text content shown directly in the avatar's body.
   * Can be 1 or 2 symbols long, every subsequent symbol is ignored.
   * Use it to define initials that uniquely identify the avatar's owner.
   *
   * When you use this property, make sure to include it in the "ariaLabel".
   */
  initials?: string;

  /**
   * When set to true a loading indicator is shown in avatar.
   */
  loading?: boolean;

  /**
   * Text to describe the avatar for assistive technology.
   * When more than one avatar is used, provide a unique label to each.
   * For example, "User avatar" and "AI assistant avatar". Or "Your avatar" and "User avatar for John Doe".
   *
   * If "tooltipText" or "initials" are used make sure to include them in the "ariaLabel".
   */
  ariaLabel: string;

  /**
   * Specifies the icon to be displayed as Avatar.
   * Use "gen-ai" icon for AI assistants. By default "user-profile" icon is used.
   *
   * If you set both `iconName` and `initials`, `initials` will take precedence.
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
   * Use this property if the icon you want isn't available.
   * If you set both `iconUrl` and `iconSvg`, `iconSvg` will take precedence.
   */
  iconSvg?: React.ReactNode;
}

export namespace AvatarProps {
  export type Color = 'default' | 'gen-ai';
}
