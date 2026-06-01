// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
/**
 * @awsuiSystem core
 */
import { NativeAttributes } from '../internal/utils/with-native-attributes';

export interface BadgeProps extends BaseComponentProps {
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
   * An object containing CSS properties to customize the badge's visual appearance.
   * Refer to the [style](/components/badge/?tabId=style) tab for more details.
   * @awsuiSystem core
   */
  style?: BadgeProps.Style;

  /**
   * An object that maps the badge's slots to CSS class names for custom styling.
   * Use these classes to scope `--awsui-style-*` custom properties.
   * * `root` - The badge's root element.
   * @awsuiSystem core
   */
  classNames?: BadgeProps.ClassNames;

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
  export interface ClassNames {
    root?: string;
  }

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
