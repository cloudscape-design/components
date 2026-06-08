// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { NonCancelableEventHandler } from '../internal/events';

export type OptionsFilteringType = 'none' | 'auto' | 'manual';

export namespace DropdownProps {
  export interface Style {
    dropdown?: {
      /**
       * Background color of the dropdown content wrapper.
       */
      background?: string;
      /**
       * Border color of the dropdown content wrapper.
       */
      borderColor?: string;
      /**
       * Border radius of the dropdown content wrapper.
       */
      borderRadius?: string;
      /**
       * Border width of the dropdown content wrapper.
       */
      borderWidth?: string;
    };
  }
}

/**
 * Alignment of the dropdown relative to its trigger.
 */
export type DropdownAlignment =
  | 'start' // Aligns to the start edge of trigger (default)
  | 'center'; // Centers dropdown on trigger

/**
 * Width constraint for the dropdown.
 * - 'trigger': references the trigger element's width
 * - number: width in pixels
 */
export type DropdownWidthConstraint = 'trigger' | number;

export interface OptionsLoadItemsDetail {
  filteringText: string;
  firstPage: boolean;
  samePage: boolean;
}

export interface BaseDropdownHostProps extends ExpandToViewport {
  /**
   * If you have more than 500 options, enable this flag to apply a performance optimization
   * that makes the filtering experience smoother. We don't recommend enabling the feature if you
   * have less than 500 options, because the improvements to performance are offset by a
   * visible scrolling lag.
   *
   * When you set this flag to `true`, it removes options that are not currently in view from the DOM.
   * If your test accesses such options, you need to first scroll the options container
   * to the correct offset, before performing any operations on them. Use the element returned
   * by the `findOptionsContainer` test utility for this.
   */
  virtualScroll?: boolean;

  /**
   * Use this event to implement the asynchronous behavior for the component.
   *
   * The event is called in the following situations:
   * * The user scrolls to the end of the list of options, if `statusType` is set to `pending`.
   * * The user clicks on the recovery button in the error state.
   * * The user types inside the input field.
   * * The user focuses the input field.
   *
   * The detail object contains the following properties:
   * * `filteringText` - The value that you need to use to fetch options.
   * * `firstPage` - Indicates that you should fetch the first page of options that match the `filteringText`.
   * * `samePage` - Indicates that you should fetch the same page that you have previously fetched (for example, when the user clicks on the recovery button).
   **/
  onLoadItems?: NonCancelableEventHandler<OptionsLoadItemsDetail>;
}

export interface DropdownProps extends ExpandToViewport {
  /**
   * The trigger element that opens/closes the dropdown.
   */
  trigger: React.ReactNode;

  /**
   * Optional header content that stays fixed at the top while
   * scrolling dropdown content.
   */
  header?: React.ReactNode;

  /**
   * Optional footer content that stays fixed at the bottom while
   * scrolling dropdown content.
   * Typically used to display loading status or action buttons.
   */
  footer?: React.ReactNode;

  /**
   * Main content of the dropdown.
   */
  content?: React.ReactNode;

  /**
   * Open state of the dropdown.
   */
  open?: boolean;

  /**
   * Called when the user clicks outside the dropdown. The dropdown does not
   * close automatically - the `open` prop needs to be updated to actually close
   * the dropdown.
   */
  onOutsideClick?: NonCancelableEventHandler<null>;

  /**
   * Minimum width for the dropdown in pixels. If no value is specified, the
   * dropdown will shrink to fit its content.
   */
  minWidth?: number;

  /**
   * Maximum width for the dropdown in pixels. If no value is specified, the
   * dropdown will expand to fit its content.
   */
  maxWidth?: number;

  /**
   * Called when the user presses the Escape key while the dropdown is open.
   * The dropdown does not close automatically - the `open` prop needs to be
   * updated to actually close the dropdown.
   */
  onEscape?: NonCancelableEventHandler;

  /**
   * Called when any element inside the dropdown content gains focus.
   * This includes nested interactive elements like buttons, links, or inputs.
   */
  onFocusEnter?: NonCancelableEventHandler<Pick<React.FocusEvent, 'target' | 'relatedTarget'>>;

  /**
   * Called when focus leaves the dropdown content entirely.
   */
  onFocusLeave?: NonCancelableEventHandler<Pick<React.FocusEvent, 'target' | 'relatedTarget'>>;

  /**
   * Adds `role` to the dropdown content element.
   */
  ariaRole?: string;

  /**
   * Adds `aria-label` to the dropdown content element.
   */
  ariaLabel?: string;

  /**
   * Adds `aria-labelledby` to the dropdown content element.
   */
  ariaLabelledby?: string;

  /**
   * Adds `aria-describedby` to the dropdown content element.
   */
  ariaDescribedby?: string;

  /**
   * An object containing CSS properties to customize the dropdown's visual appearance.
   * @awsuiSystem core
   */
  style?: DropdownProps.Style;
}

export interface ExpandToViewport {
  /**
   * By default, the dropdown height is constrained to fit inside the height of its next scrollable container element.
   * Enabling this property will allow the dropdown to extend beyond that container by using fixed positioning and
   * [React Portals](https://reactjs.org/docs/portals.html).
   *
   * Set this property if the dropdown would otherwise be constrained by a scrollable container,
   * for example inside table and split view layouts.
   *
   * We recommend you use discretion, and don't enable this property unless necessary
   * because fixed positioning results in a slight, visible lag when scrolling complex pages.
   */
  expandToViewport?: boolean;
}
