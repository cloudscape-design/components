// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { NonCancelableEventHandler } from '../internal/events';

export type OptionsFilteringType = 'none' | 'auto' | 'manual';
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

/**
 * Props for the exposed Dropdown component
 */
export interface DropdownProps extends ExpandToViewport {
  /**
   * The trigger element that opens/closes the dropdown
   */
  trigger: React.ReactNode;

  /**
   * Whether the dropdown is currently open
   */
  open?: boolean;

  /**
   * Called when the user clicks outside the dropdown. The dropdown does not close
   * automatically - the parent component must update the `open` prop to actually
   * close the dropdown.
   */
  onDismiss?: NonCancelableEventHandler<null>;

  /**
   * Main content of the dropdown
   */
  content?: React.ReactNode;

  /**
   * Optional header content that stays fixed at the top while
   * scrolling dropdown content
   */
  header?: React.ReactNode;

  /**
   * Optional footer content that stays fixed at the bottom while
   * scrolling dropdown content.
   * Typically used to display loading status or action buttons.
   */
  footer?: React.ReactNode;

  /**
   * Minimum width constraint for the dropdown.
   * - Number: minimum width in pixels
   * - 'trigger': dropdown will be at least as wide as the trigger
   * @defaultValue 'trigger'
   */
  minWidth?: DropdownProps.DropdownWidthConstraint;

  /**
   * Maximum width constraint for the dropdown.
   * - Number: maximum width in pixels
   * - 'trigger': dropdown cannot exceed the trigger width
   *
   * If not specified, dropdown can grow up to 465px by default.
   */
  maxWidth?: DropdownProps.DropdownWidthConstraint;

  /**
   * Preferred alignment of the dropdown relative to its trigger.
   * The dropdown will attempt this alignment first, but will automatically
   * adjust if there's insufficient space on the preferred side.
   * @defaultValue 'start'
   */
  preferredAlignment?: DropdownProps.DropdownAlignment;

  /**
   * ARIA role for the dropdown content (e.g., 'menu', 'listbox', 'dialog')
   */
  role?: string;

  /**
   * ARIA label for the dropdown content.
   * Use either this or ariaLabelledby, not both.
   */
  ariaLabel?: string;

  /**
   * ARIA labelledby attribute for the dropdown content.
   * Use either this or ariaLabel, not both.
   */
  ariaLabelledby?: string;

  /**
   * ARIA describedby attribute for the dropdown content
   */
  ariaDescribedby?: string;

  /**
   * Called when any element inside the dropdown content gains focus.
   * This includes nested interactive elements like buttons, links, or inputs.
   */
  onFocusIn?: NonCancelableEventHandler<Pick<React.FocusEvent, 'target' | 'relatedTarget'>>;

  /**
   * Called when focus leaves the dropdown content entirely.
   */
  onFocusOut?: NonCancelableEventHandler<Pick<React.FocusEvent, 'target' | 'relatedTarget'>>;

  /**
   * Key that forces dropdown position recalculation when changed.
   * Use when dropdown content changes dynamically.
   */
  contentKey?: string;
}

export namespace DropdownProps {
  /**
   * Width constraint that can be a pixel value or reference the trigger width
   */
  export type DropdownWidthConstraint = number | 'trigger';

  /**
   * Preferred alignment of the dropdown relative to its trigger.
   * The dropdown will attempt this alignment first, but will automatically
   * adjust if there's insufficient space on the preferred side.
   */
  export type DropdownAlignment = 'start' | 'center';
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
   *
   * Note: When expandToViewport is enabled, the dropdown width is determined by its content
   * rather than the minWidth/maxWidth constraints. Use this property primarily for positioning,
   * not for width control.
   */
  expandToViewport?: boolean;
}

/**
 * Internal props used by the internal dropdown implementation.
 * This maintains the original internal API for backward compatibility.
 */
export interface InternalDropdownProps extends ExpandToViewport {
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
   * Dropdown content elements (passed as children).
   */
  children?: React.ReactNode;
  /**
   * Updating content key triggers dropdown position re-evaluation.
   */
  contentKey?: string;
  /**
   * Open state of the dropdown.
   */
  open?: boolean;
  /**
   * Called when a user clicks outside of the dropdown content, when it is open.
   */
  onDropdownClose?: NonCancelableEventHandler<null>;
  /**
   * Dropdown id
   */
  dropdownId?: string;
  /**
   * Stretches dropdown to occupy entire width.
   */
  stretchWidth?: boolean;
  /**
   * Stretches dropdown to occupy entire height.
   */
  stretchHeight?: boolean;

  /**
   * Stretches the trigger to the height of the dropdown container.
   */
  stretchTriggerHeight?: boolean;

  /**
   * Whether the dropdown content should be at least as wide as the trigger.
   *
   * @defaultValue true
   */
  stretchToTriggerWidth?: boolean;

  /**
   * Whether the dropdown content can grow beyond the width of the trigger.
   */
  stretchBeyondTriggerWidth?: boolean;

  /**
   * Determines that the dropdown should preferably be aligned to the center of the trigger
   * instead of dropping left or right.
   */
  preferCenter?: boolean;

  /**
   * Sets the min width of the dropdown (in px)
   */
  minWidth?: number;
  /**
   * Whether the dropdown will have a scrollbar or not
   */
  scrollable?: boolean;

  /**
   * Whether the dropdown will have a focus loop including trigger, header, content and footer.
   */
  loopFocus?: boolean;

  /**
   * Called when focus enters the trigger or dropdown content.
   */
  onFocus?: NonCancelableEventHandler<Pick<React.FocusEvent, 'target' | 'relatedTarget'>>;

  /**
   * Called when focus leaves the trigger or dropdown content.
   */
  onBlur?: NonCancelableEventHandler<Pick<React.FocusEvent, 'target' | 'relatedTarget'>>;

  /**
   * ID for the dropdown content wrapper
   */
  dropdownContentId?: string;
  /**
   * HTML role for the dropdown content wrapper
   */
  dropdownContentRole?: string;
  /**
   * Labelledby for the dropdown (required when role="dialog")
   */
  ariaLabelledby?: string;
  /**
   * Describedby for the dropdown (recommended when role="dialog")
   */
  ariaDescribedby?: string;
  /**
   * Whether this is an interior dropdown (flyout)
   */
  interior?: boolean;
  /**
   * Mouse down handler
   */
  onMouseDown?: React.MouseEventHandler;
}
