// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ReactNode } from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface NavigationBarProps extends BaseComponentProps {
  /**
   * Visual variant of the navigation bar.
   *
   * - `primary`: Branded/dark background matching the Top Navigation visual context.
   *   Applies the `awsui-context-top-navigation` visual context so child components
   *   (buttons, links, icons) automatically adapt their colors.
   * - `secondary`: Neutral background matching the App Layout toolbar style.
   *
   * @default 'primary'
   */
  variant?: NavigationBarProps.Variant;

  /**
   * Placement of the navigation bar relative to its container, using CSS logical
   * property names. Controls flex direction and border placement.
   *
   * - `block-start`: Top of the container (horizontal bar, border on bottom edge).
   * - `block-end`: Bottom of the container (horizontal bar, border on top edge).
   * - `inline-start`: Start side — left in LTR, right in RTL (vertical bar, border on end edge).
   * - `inline-end`: End side — right in LTR, left in RTL (vertical bar, border on start edge).
   *
   * @default 'block-start'
   */
  placement?: NavigationBarProps.Placement;

  /**
   * Content of the navigation bar. Accepts any ReactNode.
   * The consumer is responsible for layout within the bar (flex, spacing, alignment).
   */
  content?: ReactNode;

  /**
   * Accessible label for the navigation landmark.
   *
   * The component renders as a `<nav>` element. When multiple navigation bars
   * exist on the same page, each must have a unique `ariaLabel` to distinguish
   * them for assistive technology users.
   */
  ariaLabel?: string;

  /**
   * Makes the navigation bar stick to the edge of the viewport corresponding
   * to its placement. Uses `position: sticky`.
   *
   * @default false
   */
  sticky?: boolean;

  /**
   * Gap in pixels between the bar and the edge it sticks to.
   * Adds `padding-block-start` to the bar (visible gap always) and adjusts
   * `inset-block-start` when sticky so the gap is preserved while scrolling.
   *
   * Only applies to horizontal sticky bars (`block-start`/`block-end`).
   *
   * @default 0
   */
  stickyOffset?: number;

  /**
   * Removes the built-in padding from the navigation bar.
   * Useful when embedding inside another padded container or for edge-to-edge content.
   *
   * @default false
   */
  disablePadding?: boolean;

  /**
   * Maximum width of the navigation bar in pixels.
   * When not set, the bar fills the full available width.
   *
   * The consumer controls the content layout inside the bar via the `content` prop.
   */
  maxWidth?: number;

  /**
   * An object containing all the necessary localized strings required by
   * the component.
   * @i18n
   */
  i18nStrings?: NavigationBarProps.I18nStrings;
}

export namespace NavigationBarProps {
  export type Variant = 'primary' | 'secondary';
  export type Placement = 'block-start' | 'block-end' | 'inline-start' | 'inline-end';

  export interface I18nStrings {
    /** Accessible label for the navigation bar. Overrides the `ariaLabel` prop. */
    ariaLabel?: string;
  }
}
