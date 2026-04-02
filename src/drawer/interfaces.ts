// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface DrawerProps extends BaseComponentProps {
  /**
   * Header of the drawer.
   *
   * It should contain the only `h2` used in the drawer.
   */
  header?: React.ReactNode;

  /**
   * Main content of the drawer.
   */
  children?: React.ReactNode;

  /**
   * Renders the drawer in a loading state. We recommend that you also set a `i18nStrings.loadingText`.
   */
  loading?: boolean;

  /**
   * Determines whether the drawer content has padding. If `true`, removes the default padding from the content area.
   */
  disableContentPaddings?: boolean;

  /**
   * An object containing all the necessary localized strings required by the component.
   * - `loadingText` - The text that's displayed when the drawer is in a loading state.
   * @i18n
   */
  i18nStrings?: DrawerProps.I18nStrings;

  /**
   * Actions for the header. Available only if you specify the `header` property.
   */
  headerActions?: React.ReactNode;

  /**
   * Sticky footer content that remains visible at the bottom during scroll.
   *
   * Automatically becomes non-sticky when scrollable content area is too small
   * to ensure content remains accessible (not covered by the footer).
   */
  footer?: React.ReactNode;
}

export namespace DrawerProps {
  export interface I18nStrings {
    loadingText?: string;
  }
}

// Props for a future release
export interface NextDrawerProps extends DrawerProps {
  /**
   * Specifies the CSS positioning mode of the drawer, and supports the following options:
   * * `static` (default) - The drawer is positioned in the normal document flow.
   * * `sticky` - The drawer sticks to its nearest scrolling ancestor. Only meaningful with `placement="top"` or `placement="bottom"`. Using `sticky` with `placement="start"` or `placement="end"` falls back to `static`.
   * * `absolute` - The drawer is positioned relative to its nearest positioned ancestor.
   * * `viewport` - The drawer is fixed relative to the viewport.
   *
   * @awsuiSystem core
   */
  position?: NextDrawerProps.Position;

  /**
   * Specifies which edge of its container the drawer is anchored to, and supports these options:
   * * `start` - Anchored to the inline-start edge.
   * * `end` - (default) Anchored to the inline-end edge.
   * * `top` - Anchored to the top edge.
   * * `bottom` - Anchored to the bottom edge.
   *
   * @awsuiSystem core
   */
  placement?: NextDrawerProps.Placement;

  /**
   * Specifies the distance in pixels between the drawer and the edges of its container.
   * Applicable when using `position="absolute"` or `position="viewport"`.
   * Supported properties:
   * * `top` - Distance from the top edge. Not applicable when `placement` is `"bottom"`.
   * * `bottom` - Distance from the bottom edge. Not applicable when `placement` is `"top"`.
   * * `start` - Distance from the inline-start edge. Not applicable when `placement` is `"end"`.
   * * `end` - Distance from the inline-end edge. Not applicable when `placement` is `"start"`.
   *
   * @awsuiSystem core
   */
  offset?: NextDrawerProps.Offset;

  /**
   * Specifies the distance in pixels from the top or bottom edge of the scrolling container
   * at which the drawer sticks. Applicable only when using `position="sticky"` with `placement="top"` or `placement="bottom"`.
   * * Supported properties:
   * * `top` - Distance from the top of the scrolling container.
   * * `bottom` - Distance from the bottom of the scrolling container.
   *
   * @awsuiSystem core
   */
  stickyOffset?: NextDrawerProps.StickyOffset;

  /**
   * Sets the CSS `z-index` of the drawer. Use this to control stacking order when the drawer
   * overlaps other positioned elements on the page.
   *
   * Applicable when using `position="sticky"`, `position="absolute"`, or `position="viewport"`.
   *
   * @awsuiSystem core
   */
  zIndex?: number;
}

export namespace NextDrawerProps {
  export type Position = 'static' | 'sticky' | 'absolute' | 'viewport';

  export type Placement = 'start' | 'end' | 'top' | 'bottom';

  export interface Offset {
    start?: number;
    end?: number;
    top?: number;
    bottom?: number;
  }

  export interface StickyOffset {
    top?: number;
    bottom?: number;
  }
}
