// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { ButtonProps } from '../button/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { CancelableEventHandler } from '../internal/events';

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
   * * `sticky` - The drawer sticks to its nearest scrolling ancestor. Only meaningful with `placement="top"` or `placement="bottom"`.
   * Using `sticky` with `placement="start"` or `placement="end"` falls back to `static`.
   * * `absolute` - The drawer is positioned relative to its nearest positioned ancestor.
   * * `fixed` - The drawer is positioned relative to the viewport.
   */
  position?: NextDrawerProps.Position;

  /**
   * Specifies which edge of its container the drawer is anchored to, and supports these options:
   * * `start` - Anchored to the inline-start edge.
   * * `end` - (default) Anchored to the inline-end edge.
   * * `top` - Anchored to the top edge.
   * * `bottom` - Anchored to the bottom edge.
   */
  placement?: NextDrawerProps.Placement;

  /**
   * Specifies the distance in pixels between the drawer and the edges of its container.
   * Applicable when using `position="absolute"` or `position="fixed"`.
   * Supported properties:
   * * `start` - Distance from the inline-start edge. Not applicable when `placement` is `"end"`.
   * * `end` - Distance from the inline-end edge. Not applicable when `placement` is `"start"`.
   * * `top` - Distance from the top edge. Not applicable when `placement` is `"bottom"`.
   * * `bottom` - Distance from the bottom edge. Not applicable when `placement` is `"top"`.
   */
  offset?: NextDrawerProps.Offset;

  /**
   * Specifies the distance in pixels from the top or bottom edge of the scrolling container
   * at which the drawer sticks. Applicable only when using `position="sticky"` with `placement="top"` or `placement="bottom"`.
   * * Supported properties:
   * * `top` - Distance from the top of the scrolling container.
   * * `bottom` - Distance from the bottom of the scrolling container.
   */
  stickyOffset?: NextDrawerProps.StickyOffset;

  /**
   * Sets the CSS `z-index` of the drawer. Use this to control stacking order when the drawer
   * overlaps other positioned elements on the page.
   *
   * Applicable when using `position="sticky"`, `position="absolute"`, or `position="fixed"`.
   */
  zIndex?: number;

  /**
   * Renders a close button in the header with the provided configuration.
   * The close button fires the `onClose` event with method `'close-action'` when
   * clicked.
   *
   * @awsuiSystem core
   */
  closeAction?: Pick<
    ButtonProps,
    'ariaLabel' | 'disabled' | 'disabledReason' | 'iconName' | 'iconSvg' | 'iconUrl' | 'iconAlt'
  >;

  /**
   * Hides the close action slot next to the header actions, which is present even
   * when close action is not set. Use it when a close action is not needed, or a
   * custom close action implementation is used.
   *
   * @awsuiSystem core
   */
  hideCloseAction?: boolean;

  /**
   * Called when the drawer's close action is clicked.
   *
   * The event is cancelable - call `event.preventDefault()` to prevent the drawer from closing.
   *
   * @awsuiSystem core
   */
  onClose?: CancelableEventHandler<null>;

  /**
   * Drawer open state in controlled mode. When provided, the component operates in controlled mode
   * and you must handle the `onClose` event to update this value.
   *
   * @awsuiSystem core
   */
  open?: boolean;

  /**
   * Default open state for uncontrolled mode. Use `ref.current.open()`, `ref.current.close()`, or `ref.current.toggle()`
   * to change drawer's visibility when in uncontrolled mode.
   *
   * When neither `open` nor `defaultOpen` is provided, the drawer is always visible.
   *
   * @awsuiSystem core
   */
  defaultOpen?: boolean;
}

export namespace NextDrawerProps {
  export type Position = 'static' | 'sticky' | 'absolute' | 'fixed';

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

  export interface Ref {
    /** Opens the drawer. No-op in controlled mode. */
    open(): void;
    /** Closes the drawer. No-op in controlled mode. */
    close(): void;
    /** Toggles the drawer open/closed. No-op in controlled mode. */
    toggle(): void;
  }
}
