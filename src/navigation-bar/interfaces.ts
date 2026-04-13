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
   * Content aligned to the start of the navigation bar.
   *
   * - Horizontal placement: inline-start (left in LTR, right in RTL).
   * - Vertical placement: block-start (top).
   *
   * This slot has a fixed width — it takes only the space its content needs
   * and does not grow to fill available space. To place expanding content
   * (e.g. a search input), use `centerContent` instead.
   *
   * Accepts any ReactNode. Common content: logo, branding, primary nav links.
   */
  startContent?: ReactNode;

  /**
   * Content aligned to the center of the navigation bar.
   *
   * Only rendered in horizontal placements (`block-start`, `block-end`).
   * Ignored in vertical placements.
   *
   * This is the only slot that grows to fill available space. It expands to
   * occupy all remaining width between `startContent` and `endContent`, with
   * its content centered within that region. When used alone, it fills the
   * entire bar width.
   *
   * Note: content is centered within the available region, not absolute-centered
   * in the viewport. If `startContent` is wider than `endContent`, the center
   * region shifts accordingly.
   *
   * Accepts any ReactNode. Common content: search input, navigation tabs.
   */
  centerContent?: ReactNode;

  /**
   * Content aligned to the end of the navigation bar.
   *
   * - Horizontal placement: inline-end (right in LTR, left in RTL).
   * - Vertical placement: block-end (bottom).
   *
   * This slot has a fixed width — it takes only the space its content needs
   * and is pushed to the far end of the bar. When used without `startContent`,
   * the left side of the bar remains empty.
   *
   * Accepts any ReactNode. Common content: utility buttons, profile menu.
   */
  endContent?: ReactNode;

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
