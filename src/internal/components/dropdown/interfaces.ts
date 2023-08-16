// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { NonCancelableEventHandler } from '../../events';
import React from 'react';

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
   * Called when a mouse button is pressed inside the dropdown content.
   */
  onMouseDown?: React.MouseEventHandler;
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
   * Indicates if this dropdown lies within a parent dropdown and positions itself relative to it (as a fly out).
   */
  interior?: boolean;
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
   * However, use discretion. We recommend you don't enable this property unless necessary
   * because fixed positioning results in a slight, visible lag when scrolling complex pages.
   */
  expandToViewport?: boolean;
}
