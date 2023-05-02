// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { ButtonDropdownProps } from '../button-dropdown/interfaces';

export interface SplitButtonProps extends ButtonDropdownProps {
  /** Determines the general styling of the split button.
   * * `primary` for primary buttons
   * * `normal` for secondary buttons
   */
  variant?: SplitButtonProps.Variant;
  /**
   * Adds `aria-label` to the dropdown trigger.
   */
  ariaLabel: string;
  /**
   * Text displayed in the main action button.
   * @displayname text
   */
  children: React.ReactNode;
}

// TODO: "extend" button dropdown interface
export namespace SplitButtonProps {
  export type Variant = 'normal' | 'primary';

  export interface Ref {
    /**
     * Focuses the underlying native button.
     */
    focus(): void;
  }
}
