// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';
import { BaseIconProps } from '../types/base-icon';
/**
 * @awsuiSystem core
 */
import { NativeAttributes } from '../types/native-attributes';

export interface BadgeProps extends BaseComponentProps, BaseIconProps {
  /**
   * Specifies the badge color.
   */
  color?:
    | 'blue'
    | 'grey'
    | 'green'
    | 'red'
    | 'severity-critical'
    | 'severity-high'
    | 'severity-medium'
    | 'severity-low'
    | 'severity-neutral';

  /**
   * Text displayed inside the badge.
   */
  children?: React.ReactNode;

  /**
   * Specifies the alignment of the icon.
   */
  iconAlign?: BadgeProps.IconAlign;

  /**
   * Specifies the SVG of a custom icon.
   *
   * Use this property if you want your custom icon to inherit colors dictated by the badge color.
   * When this property is set, the component will be decorated with `aria-hidden="true"`. Ensure that the `svg` element:
   * - has attribute `focusable="false"`.
   * - has `viewBox="0 0 16 16"`.
   *
   * If you set both `iconUrl` and `iconSvg`, `iconSvg` will take precedence.
   */
  iconSvg?: React.ReactNode;

  /**
   * An object containing CSS properties to customize the badge's visual appearance.
   * Refer to the [style](/components/badge/?tabId=style) tab for more details.
   * @awsuiSystem core
   */
  style?: BadgeProps.Style;

  /**
   * Attributes to add to the native element.
   * Some attributes will be automatically combined with internal attribute values:
   * - `className` will be appended.
   * - Event handlers will be chained, unless the default is prevented.
   *
   * We do not support using this attribute to apply custom styling.
   *
   * @awsuiSystem core
   */
  nativeAttributes?: NativeAttributes<React.HTMLAttributes<HTMLElement>>;
}

export namespace BadgeProps {
  export type IconAlign = 'left' | 'right';

  export interface Style {
    root?: {
      background?: string;
      borderColor?: string;
      borderRadius?: string;
      borderWidth?: string;
      color?: string;
      paddingBlock?: string;
      paddingInline?: string;
    };
  }
}
