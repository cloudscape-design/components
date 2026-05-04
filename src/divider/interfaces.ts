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
   * Announces the divider component as a semantic separator to assistive technology
   * by adding semantic attributes like `role="separator"` and `aria-orientation`.
   * Only set this to `true` when the divider genuinely separates distinct, meaningful content
   * regions that assistive technology needs to be aware of.
   *
   * By default, the divider is not semantic and is therefore hidden from assistive technology.
   *
   * @defaultValue `false`
   */
  semantic?: boolean;

  /**
   * Orientation of the divider line.
   *
   * - `"horizontal"` (default) — renders a full-width horizontal line. Use inside block-level
   *   containers to separate stacked content sections.
   * - `"vertical"` — renders a full-height vertical line. Use inside flex or inline containers
   *   to separate side-by-side elements.
   *
   * When `semantic` is `true`, `aria-orientation` is set automatically to match this value.
   *
   * @defaultValue `"horizontal"`
   */
  orientation?: DividerProps.Orientation;

  /**
   * Text label rendered at the center of a horizontal divider line.
   * Use for labels or short section titles.
   *
   * Only supported by horizontal dividers.
   *
   * When a label is provided and `semantic` is `true`, the separator is automatically
   * associated with the label text via `aria-labelledby`.
   *
   * @displayname label
   */
  children?: React.ReactNode;

  /**
   * Adds an `aria-label` to the separator element.
   * Use when the divider needs an accessible name but you don't want visible label text,
   * or to provide a more descriptive label for assistive technology.
   *
   * Only takes effect when `semantic` is `true`.
   */
  ariaLabel?: string;

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
