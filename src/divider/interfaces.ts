// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
/**
 * @awsuiSystem core
 */
import { NativeAttributes } from '../internal/utils/with-native-attributes';

export interface DividerProps extends BaseComponentProps {
  /**
   * When `true` (default), the divider is purely decorative and hidden from assistive technology (`role="presentation"`).
   * When `false`, the divider is announced by screen readers as a separator (`role="separator"`).
   *
   * Set to `false` only when the divider genuinely separates distinct, meaningful content regions
   * that a screen reader user needs to be aware of.
   *
   * @defaultValue `true`
   */
  decorative?: boolean;

  /**
   * An object containing CSS properties to customize the divider's visual appearance.
   * Refer to the [style](/components/divider/?tabId=style) tab for more details.
   * @awsuiSystem core
   */
  style?: DividerProps.Style;

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
  nativeAttributes?: NativeAttributes<React.HTMLAttributes<HTMLHRElement>>;
}

export namespace DividerProps {
  export interface Style {
    root?: {
      borderColor?: string;
      borderWidth?: string;
    };
  }
}
