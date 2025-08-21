// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface TokenProps extends BaseComponentProps {
  /** Slot for the label of the token as text or an element. */
  label?: React.ReactNode;

  /** A label tag that provides additional guidance, shown next to the label. */
  labelTag?: string;

  /** Further information about the token that appears below the label. */
  description?: string;

  /** A list of tags giving further guidance about the token. */
  tags?: ReadonlyArray<string>;

  /** An icon at the start of the token, an [icon](/components/icon/) can be used here or a custom element. */
  icon?: React.ReactNode;

  /**
   * Determines the general styling of the token as follows:
   * - `normal` for a standard style token with various features to display information.
   * - `inline` for a slimmer version of the token with limited features, displayed inline for text contexts.
   *   - Displays the label, icon and dismiss button as specified.
   *
   * Defaults to `normal` if not specified.
   */
  variant?: TokenProps.Variant;

  /** Determines whether the token is disabled. */
  disabled?: boolean;

  /**
   * Specifies if the control is read-only, which prevents the
   * user from modifying the value. A read-only control is still focusable.
   */
  readOnly?: boolean;

  /** Adds an `aria-label` to the dismiss button. */
  dismissLabel?: string;

  /**
   * Called when the user clicks on the dismiss button.
   * Make sure that you add a listener to this event to update your application state.
   */
  onDismiss?: NonCancelableEventHandler;
}

export namespace TokenProps {
  export type Variant = 'normal' | 'inline';
}
