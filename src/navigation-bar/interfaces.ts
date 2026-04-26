// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ReactNode } from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface NavigationBarProps extends BaseComponentProps {
  /**
   * Visual variant of the navigation bar.
   *
   * - `primary`: Default header style. Uses page theme colors.
   * - `primary-accent`: Inverted/branded header. Applies `navigation-bar` visual context
   *    so child components auto-adapt to inverted colors.
   * - `secondary`: Toolbar style with neutral background.
   *
   * Primary and secondary use identical default tokens (both white background).
   * The separation exists for theming — themes can target them independently.
   *
   * @default 'primary'
   */
  variant?: NavigationBarProps.Variant;

  /**
   * Landmark role rendered by the navigation bar.
   *
   * - `navigation`: Renders `<nav>`. For bars containing navigation links.
   *    Multiple allowed per page; each must have a unique accessible name.
   * - `banner`: Renders `<header>`. For the site-wide header consistent across pages.
   *    Only one per page. Should be first in DOM order.
   * - `region`: Renders `<section role="region">`. For tools/actions areas
   *    without navigation links. Must have an accessible name.
   *
   * Role is independent of variant.
   *
   * @default 'region'
   */
  role?: NavigationBarProps.Role;

  /**
   * Placement relative to container. Controls border edge and content flow.
   *
   * - `top`: Horizontal, border on bottom edge.
   * - `bottom`: Horizontal, border on top edge.
   * - `start`: Vertical on start side (left in LTR), border on end edge.
   * - `end`: Vertical on end side (right in LTR), border on start edge.
   *
   * @default 'top'
   */
  placement?: NavigationBarProps.Placement;

  /** Content of the navigation bar. Any ReactNode. */
  content?: ReactNode;

  /**
   * Accessible label for the landmark. Required when multiple navigation bars
   * exist on the same page to distinguish them for assistive technology.
   */
  ariaLabel?: string;

  /**
   * ID of an element that labels this landmark. Alternative to `ariaLabel`.
   * Ignored when `ariaLabel` or `i18nStrings.ariaLabel` is provided.
   */
  ariaLabelledBy?: string;

  /**
   * Localized strings required by the component.
   * @i18n
   */
  i18nStrings?: NavigationBarProps.I18nStrings;
}

export namespace NavigationBarProps {
  export type Variant = 'primary' | 'primary-accent' | 'secondary';
  export type Placement = 'top' | 'bottom' | 'start' | 'end';
  export type Role = 'navigation' | 'banner' | 'region';

  export interface I18nStrings {
    /** Overrides `ariaLabel` prop. */
    ariaLabel?: string;
  }
}
