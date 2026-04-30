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
   *   to separate side-by-side elements (e.g. toolbar actions, breadcrumb segments).
   *
   * When `semantic={true}`, `aria-orientation` is set automatically to match this value.
   *
   * @defaultValue `"horizontal"`
   */
  orientation?: DividerProps.Orientation;

  /**
   * Text label rendered at the center of a horizontal divider line.
   * Use for labels like "OR", "AND", or short section titles.
   *
   * Only supported when `orientation="horizontal"`. Ignored for vertical dividers.
   *
   * @displayname content
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
