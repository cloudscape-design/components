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
   * Orientation of the divider line.
   *
   * - `"horizontal"` (default) — renders a full-width horizontal line. Use inside block-level
   *   containers to separate stacked content sections.
   * - `"vertical"` — renders a full-height vertical line. Use inside flex or inline containers
   *   to separate side-by-side elements.
   */
  orientation?: DividerProps.Orientation;

  /**
   * Text label rendered at the center of a horizontal divider line.
   * Use for labels or short section titles.
   *
   * Only supported by horizontal dividers.
   *
   * @displayname label
   */
  children?: React.ReactNode;

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

export namespace DividerProps {
  export type Orientation = 'horizontal' | 'vertical';
}
