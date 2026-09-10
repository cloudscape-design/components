// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { IconProps } from '../icon/interfaces';

/**
 * Shared icon-related props for components that render a predefined or custom (URL-based) icon
 * alongside their content.
 *
 * This intentionally omits `iconSvg`, whose documentation is component-specific (for example, it
 * references variant and hover states). Components that support a custom SVG icon should declare
 * `iconSvg` on their own interface.
 */
export interface BaseIconProps {
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
   * Specifies alternate text for a custom icon. We recommend that you provide this for accessibility.
   * This property is ignored if you use a predefined icon or if you set your custom icon using the `iconSvg` slot.
   */
  iconAlt?: string;
}
