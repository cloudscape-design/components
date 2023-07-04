// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface TextFilterProps extends BaseComponentProps {
  /**
   * The current value of the filtering input.
   */
  filteringText: string;

  /**
   * Placeholder for the filtering input.
   */
  filteringPlaceholder?: string;

  /**
   * Label for the filtering input clear button.
   */
  filteringClearAriaLabel?: string;

  /**
   * Accepts a human-readable, localized string that indicates the number of results. For example, "1 match" or "165 matches."
   * If the total number of results is unknown, also include an indication that there may be more results than
   * the number listed. For example, "25+ matches."
   *
   * The count text is only displayed when `filteringText` isn't empty.
   */
  countText?: string;

  /**
   * Specifies if the filtering input is disabled.
   * For example, you can use it if you are fetching new items upon filtering change
   * in order to prevent the user from changing the filtering text.
   */
  disabled?: boolean;

  /**
   * Adds an `aria-label` on the filtering input.
   */
  filteringAriaLabel?: string;

  /**
   * Called when a change in filtering is caused by a user interaction. The event `detail` contains the current `filteringText`.
   */
  onChange?: NonCancelableEventHandler<TextFilterProps.ChangeDetail>;

  /**
   * Called after the user changes the value of the filtering input field and stops typing for a certain
   * period of time. If you want a delayed handler to invoke a filtering API call, you can use this event in addition to `onChange`.
   */
  onDelayedChange?: NonCancelableEventHandler<TextFilterProps.ChangeDetail>;
}

export namespace TextFilterProps {
  export interface ChangeDetail {
    filteringText: string;
  }

  export interface Ref {
    /**
     * Sets focus on the underlying input control.
     */
    focus(): void;
  }
}
