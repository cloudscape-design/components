// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface NavigationBarProps extends BaseComponentProps {
  /**
   * Visual style and semantic role of the navigation bar.
   *
   * - `"primary"`: Top-navigation style. Renders as a `<nav>` landmark.
   *   Use for the main application navigation bar.
   * - `"secondary"`: Toolbar style. Renders as `role="toolbar"`.
   *   Use for page-level toolbars, secondary navigation strips, or contextual action bars.
   *
   * @defaultvalue "primary"
   */
  variant?: NavigationBarProps.Variant;

  /**
   * Placement of the navigation bar.
   *
   * - `"horizontal"`: Bar is laid out along the horizontal axis (top/bottom).
   * - `"vertical"`: Bar is laid out along the vertical axis (left/right side).
   *   Sets `aria-orientation="vertical"` on the element.
   *
   * @defaultvalue "horizontal"
   */
  placement?: NavigationBarProps.Placement;

  /**
   * Content of the navigation bar. Any React node is accepted.
   */
  children?: React.ReactNode;

  /**
   * Disables the default border on the trailing edge of the navigation bar
   * (block-end for horizontal placement, inline-end for vertical placement).
   * @defaultvalue false
   */
  disableBorder?: boolean;

  /**
   * Adds an `aria-label` to the navigation bar element.
   * Recommended when multiple navigation landmarks or toolbars exist on the same page.
   */
  ariaLabel?: string;

  /**
   * Sets `aria-labelledby` on the navigation bar element.
   * Use as an alternative to `ariaLabel` when a visible label element exists.
   */
  ariaLabelledby?: string;
}

export namespace NavigationBarProps {
  export type Variant = 'primary' | 'secondary';
  export type Placement = 'horizontal' | 'vertical';

  export interface Ref {
    /**
     * Focuses the navigation bar element.
     */
    focus(): void;
  }
}
