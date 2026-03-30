// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface TokenProps extends BaseComponentProps {
  /** Slot for the label of the token as text or an element.
   *
   * For `variant="inline"`, only plain text is supported, for example, strings or numbers.
   */
  label: React.ReactNode;

  /**
   * Adds an `aria-label` to the token.
   *
   * Use this if the label is not plain text.
   */
  ariaLabel?: string;

  /** A label tag that provides additional guidance, shown next to the label. */
  labelTag?: string;

  /** Further information about the token that appears below the label. */
  description?: string;

  /** A list of tags giving further guidance about the token. */
  tags?: ReadonlyArray<string>;

  /** An icon at the start of the token.
   *
   * When `variant="normal"`, if a description or tags are set, icon size should be `normal`.
   *
   * When `variant="inline"`, icon size should be `small`.
   */
  icon?: React.ReactNode;

  /**
   * Specifies the token's visual style and functionality.
   *
   * For `inline` only label, icon and dismiss button are displayed.
   *
   * Defaults to `normal` if not specified.
   */
  variant?: TokenProps.Variant;

  /** Determines whether the token is disabled. */
  disabled?: boolean;

  /**
   * Specifies if the control is read-only. A read-only control is still focusable.
   */
  readOnly?: boolean;

  /** Adds an `aria-label` to the dismiss button. */
  dismissLabel?: string;

  /**
   * Called when the user clicks on the dismiss button.
   *
   * Make sure that you add a listener to this event to update your application state.
   */
  onDismiss?: NonCancelableEventHandler;

  /**
   * Content to display in the tooltip when `variant="inline"`. The tooltip appears when the token label is truncated due to insufficient space.
   *
   * Only applies to plain text labels.
   */
  tooltipContent?: string;
}

export namespace TokenProps {
  export type Variant = 'normal' | 'inline';
}
