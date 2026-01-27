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
 * Sizing strategy for the dropdown content
 */
export type DropdownSizingStrategy =
  | 'fit-content' // Dropdown sizes to its content width
  | 'match-trigger' // Dropdown matches trigger width exactly
  | 'min-trigger-width' // Dropdown is at least as wide as trigger but can grow
  | 'full-width'; // Dropdown takes full available width

/**
 * Height behavior for the dropdown content
 */
export type DropdownHeightStrategy =
  | 'fit-content' // Height matches content (default)
  | 'full-height'; // Takes available height

/**
 * Alignment of the dropdown relative to its trigger
 */
export type DropdownAlignment =
  | 'start' // Aligns to left/right edges (default)
  | 'center' // Centers dropdown on trigger
  | 'end'; // Aligns to opposite edge

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
   * Called when the dropdown should be closed (e.g., outside click, escape key)
   */
  onDropdownClose?: NonCancelableEventHandler<null>;

  /**
   * Main content of the dropdown
   */
  content?: React.ReactNode;

  /**
   * Optional header content that stays fixed at the top of the dropdown
   */
  header?: React.ReactNode;

  /**
   * Optional footer content that can be sticky or scroll with content
   */
  footer?: React.ReactNode;

  /**
   * How the dropdown should size itself relative to its trigger and content.
   * - `fit-content`: Dropdown sizes to its content width
   * - `match-trigger`: Dropdown matches trigger width exactly
   * - `min-trigger-width`: Dropdown is at least as wide as trigger but can grow
   * - `full-width`: Dropdown takes full available width
   *
   * @defaultValue 'min-trigger-width'
   */
  sizing?: DropdownSizingStrategy;

  /**
   * How the dropdown should handle height.
   * - `fit-content`: Height matches content (default)
   * - `full-height`: Takes available height
   *
   * @defaultValue 'fit-content'
   */
  height?: DropdownHeightStrategy;

  /**
   * How to align the dropdown relative to its trigger.
   * - `start`: Aligns to left/right edges (default)
   * - `center`: Centers dropdown on trigger
   * - `end`: Aligns to opposite edge
   *
   * @defaultValue 'start'
   */
  alignment?: DropdownAlignment;

  /**
   * Whether the trigger element should stretch to match the height of its container.
   * Useful for components like navigation where consistent height is important.
   *
   * @defaultValue false
   */
  stretchTrigger?: boolean;

  /**
   * Whether focus should loop between trigger and dropdown content.
   * When true, tabbing past the last focusable element in the dropdown will move focus
   * back to the trigger, and shift+tabbing from the trigger will move to the last
   * focusable element in the dropdown. This creates a focus trap for accessibility.
   *
   * @defaultValue true when expandToViewport=true, false otherwise
   */
  loopFocus?: boolean;

  /**
   * Unique identifier for the dropdown
   */
  dropdownId?: string;

  /**
   * ID for the dropdown content wrapper
   */
  contentId?: string;

  /**
   * ARIA role for the dropdown content (e.g., 'menu', 'listbox', 'dialog')
   */
  role?: string;

  /**
   * ARIA labelledby attribute for the dropdown content
   */
  ariaLabelledby?: string;

  /**
   * ARIA describedby attribute for the dropdown content
   */
  ariaDescribedby?: string;

  /**
   * Called when focus enters the dropdown or trigger
   */
  onFocus?: NonCancelableEventHandler<Pick<React.FocusEvent, 'target' | 'relatedTarget'>>;

  /**
   * Called when focus leaves the dropdown or trigger
   */
  onBlur?: NonCancelableEventHandler<Pick<React.FocusEvent, 'target' | 'relatedTarget'>>;

  /**
   * Key that forces dropdown position recalculation when changed.
   * Useful when dropdown content changes dynamically.
   */
  contentKey?: string;
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

/**
 * Internal props used by the internal dropdown implementation.
 * These props use the low-level positioning flags.
 */
export interface InternalDropdownProps {
  trigger: React.ReactNode;
  children?: React.ReactNode;
  open?: boolean;
  onDropdownClose?: NonCancelableEventHandler<null>;
  onMouseDown?: React.MouseEventHandler;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  dropdownId?: string;
  stretchTriggerHeight?: boolean;
  stretchWidth?: boolean;
  stretchHeight?: boolean;
  stretchToTriggerWidth?: boolean;
  stretchBeyondTriggerWidth?: boolean;
  expandToViewport?: boolean;
  preferCenter?: boolean;
  interior?: boolean;
  minWidth?: number;
  scrollable?: boolean;
  loopFocus?: boolean;
  onFocus?: NonCancelableEventHandler<Pick<React.FocusEvent, 'target' | 'relatedTarget'>>;
  onBlur?: NonCancelableEventHandler<Pick<React.FocusEvent, 'target' | 'relatedTarget'>>;
  contentKey?: string;
  dropdownContentId?: string;
  dropdownContentRole?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
}
