// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { NonCancelableEventHandler } from '../internal/events';

export type OptionsFilteringType = 'none' | 'auto' | 'manual';

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
   * Trigger element.
   */
  trigger: React.ReactNode;

  /**
   * "Sticky" header of the dropdown content
   */
  header?: React.ReactNode;

  /**
   * Footer slot fixed at the bottom of the dropdown
   */
  footer?: React.ReactNode;

  /**
   * Dropdown content elements.
   */
  content?: React.ReactNode;

  /**
   * Open state of the dropdown.
   */
  open?: boolean;

  /**
   * Called when the user clicks outside the dropdown and trigger.
   * The dropdown does not close automatically - the parent component
   * must update the `open` prop to close the dropdown.
   */
  onOutsideClick?: NonCancelableEventHandler<null>;

  /**
   * Minimum width constraint for the dropdown in pixels.
   */
  minWidth?: number;

  /**
   * Maximum width constraint for the dropdown in pixels.
   */
  maxWidth?: number;

  /**
   * Called when the user presses the Escape key while the dropdown is open.
   * The dropdown does not close automatically - the parent component
   * must update the `open` prop to close the dropdown.
   */
  onEscape?: NonCancelableEventHandler;

  /**
   * Called when focus enters the dropdown content from outside.
   * This fires only once when focus moves into the dropdown, not when moving between elements within it.
   */
  onFocusEnter?: NonCancelableEventHandler<Pick<React.FocusEvent, 'target' | 'relatedTarget'>>;

  /**
   * Called when focus leaves the dropdown content entirely.
   */
  onFocusLeave?: NonCancelableEventHandler<Pick<React.FocusEvent, 'target' | 'relatedTarget'>>;

  /**
   * HTML role for the dropdown content wrapper
   */
  ariaRole?: string;

  /**
   * Aria label for the dropdown content wrapper
   */
  ariaLabel?: string;

  /**
   * Labelledby for the dropdown (required when role="dialog")
   */
  ariaLabelledby?: string;

  /**
   * Describedby for the dropdown (recommended when role="dialog")
   */
  ariaDescribedby?: string;
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
