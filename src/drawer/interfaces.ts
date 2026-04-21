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
   * Sets the `aria-label` on the drawer body (focused when the drawer opens).
   * By default the body is labelled by the drawer's `header` content. Use this when you need a different
   * or more specific label (e.g. to include additional context or exclude parts of the header).
   * Don't use `ariaLabel` and `ariaLabelledby` at the same time.
   *
   * @awsuiSystem core
   */
  ariaLabel?: string;

  /**
   * Sets the `aria-labelledby` on the drawer body (focused when the drawer opens).
   * By default the body is labelled by the drawer's `header` content. Use this when you need a different
   * or more specific label (e.g. to include additional context or exclude parts of the header).
   * Don't use `ariaLabel` and `ariaLabelledby` at the same time.
   *
   * @awsuiSystem core
   */
  ariaLabelledby?: string;

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
   * Called when the user requests to close the drawer. The `event.detail.method` indicates the trigger:
   * * `'close-action'` - The close button was clicked.
   * * `'backdrop-click'` - The backdrop was clicked (only when `backdrop=true`).
   * * `'escape'` - The Escape key was pressed (only when `backdrop=true`).
   *
   * The event is cancelable - call `event.preventDefault()` to prevent the drawer from closing.
   *
   * @awsuiSystem core
   */
  onClose?: CancelableEventHandler<NextDrawerProps.CloseDetail>;

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

  /**
   * Shows a semi-transparent backdrop behind the drawer when open. Used with `absolute`
   * and `fixed` positions.
   *
   * When a backdrop is set, the keyboard focus is trapped inside the drawer by default
   * to prevent it from moving to elements covered by the backdrop. This can be overridden
   * with `focusBehavior.trapFocus`.
   *
   * @awsuiSystem core
   */
  backdrop?: boolean;

  /**
   * Customizes focus-related behavior:
   *
   * - `trapFocus` - Whether keyboard focus is constrained to elements inside the drawer.
   *   Defaults to `true` when `backdrop` is set, `false` otherwise.
   *
   * - `returnFocus` - Called instead of the default return-focus behavior when the drawer
   *   closes after being opened via `ref.current.open()` or `ref.current.toggle()`.
   *   Use this to override where focus lands on close (e.g. a specific trigger element).
   *   If the element that was focused when the drawer opened is no longer in the DOM,
   *   the default behavior silently no-ops; use `returnFocus` to handle this case explicitly.
   *
   * @awsuiSystem core
   */
  focusBehavior?: NextDrawerProps.FocusBehavior;
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

  export interface CloseDetail {
    method: 'close-action' | 'backdrop-click' | 'escape';
  }

  export interface FocusBehavior {
    returnFocus?: () => void;
    trapFocus?: boolean;
  }

  export interface Ref {
    /**
     * Opens the drawer and moves focus inside. No-op in controlled mode.
     * The element focused before calling `open()` is remembered and focus returns to it
     * when the drawer closes, unless overridden by `focusBehavior.returnFocus`.
     */
    open(): void;
    /**
     * Closes the drawer and returns focus to the element that was focused when the drawer
     * was opened (or calls `focusBehavior.returnFocus` if provided). No-op in controlled mode.
     */
    close(): void;
    /**
     * Toggles the drawer open/closed. When opening, behaves like `open()`. When closing,
     * behaves like `close()`. No-op in controlled mode.
     */
    toggle(): void;
    /**
     * Moves focus to the drawer body. In controlled mode, call this after setting `open={true}`
     * to move focus inside. No-op if the drawer is not currently open.
     */
    focus(): void;
  }
}
