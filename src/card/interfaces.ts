// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { IconProps } from '../icon/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
/**
 * @awsuiSystem core
 */
import { NativeAttributes } from '../internal/utils/with-native-attributes';

export interface BaseCardProps extends BaseComponentProps {
  /**
   * Heading element of the card. Use this to add a title or header text.
   */
  header?: React.ReactNode;

  /**
   * A description or subtitle displayed below the header.
   */
  description?: React.ReactNode;

  /**
   * Footer content displayed at the bottom of the card.
   */
  footer?: React.ReactNode;

  /**
   * Actions to display in the card header area, typically buttons or links.
   */
  actions?: React.ReactNode;

  /**
   * Main content of the card.
   */
  children?: React.ReactNode;

  /**
   * Displays an icon next to the content. You can use the `iconPosition` and `iconVerticalAlignment` properties to position the icon.
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
   * Specifies alternate text for a custom icon. We recommend that you provide this for accessibility.
   * This property is ignored if you use a predefined icon or if you set your custom icon using the `iconSvg` slot.
   */
  iconAlt?: string;

  /**
   * Removes the default padding from the header area.
   * @default false
   */
  disableHeaderPaddings?: boolean;

  /**
   * Removes the default padding from the content area.
   * @default false
   */
  disableContentPaddings?: boolean;

  /**
   * Removes the default padding from the footer area.
   * @default false
   */
  disableFooterPaddings?: boolean;

  /**
   * An object containing CSS properties to customize the card's visual appearance.
   * Refer to the [style](/components/card/?tabId=style) tab for more details.
   * @awsuiSystem core
   */
  style?: CardProps.Style;
}

export interface CardProps extends BaseCardProps {
  /**
   * Attributes to add to the native root element.
   * Some attributes will be automatically combined with internal attribute values:
   * - `className` will be appended.
   * - Event handlers will be chained, unless the default is prevented.
   *
   * We do not support using this attribute to apply custom styling.
   *
   * @awsuiSystem core
   */
  nativeAttributes?: NativeAttributes<React.HTMLAttributes<HTMLDivElement>>;
}

export namespace CardProps {
  export type IconPosition = 'left' | 'right';
  export type IconVerticalAlignment = 'top' | 'center';

  export interface Style {
    root?: {
      background?: string;
      borderColor?: string;
      borderRadius?: string;
      borderWidth?: string;
      boxShadow?: string;
    };
    content?: {
      paddingBlock?: string;
      paddingInline?: string;
    };
    header?: {
      paddingBlock?: string;
      paddingInline?: string;
    };
    footer?: {
      root?: {
        paddingBlock?: string;
        paddingInline?: string;
      };
      divider?: {
        borderColor?: string;
        borderWidth?: string;
      };
    };
  }
}

export interface InternalCardProps
  extends BaseCardProps,
    InternalBaseComponentProps,
    Pick<CardProps, 'nativeAttributes'> {
  /**
   * Called when the user clicks on the card.
   */
  onClick?: React.MouseEventHandler<HTMLElement>;

  /**
   * Specifies whether the card is in highlighted state.
   */
  highlighted?: boolean;

  metadataAttributes?: Record<string, string | undefined>;
}
