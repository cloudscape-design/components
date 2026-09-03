// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';

export interface ControlGroupProps extends BaseComponentProps {
  /**
   * Adds an `aria-label` to the group element. The group is rendered with
   * `role="group"`, so this label provides the accessible name that
   * announces the grouped controls as a single unit.
   *
   * Use this to give each control group a unique, descriptive name
   * (for example, `"Label matcher"`).
   */
  ariaLabel: string;

  /**
   * The controls that make up the group (for example, `Input`, `Select`,
   * `Multiselect`, or `Button`). They render in DOM order, so keyboard `Tab`
   * navigation flows through them naturally, and their borders are fused
   * into a single visual unit.
   * @displayname controls
   */
  children?: React.ReactNode;

  /**
   * Detailed information about the group that's displayed below the controls.
   * It's associated with the group through `aria-describedby`.
   */
  description?: React.ReactNode;

  /**
   * Text that displays as a group-level validation error message. If this is
   * set to a non-empty string, the group renders in an invalid state and the
   * message is associated with the group through `aria-describedby`.
   *
   * A group-level error takes precedence over a group-level warning.
   */
  errorText?: React.ReactNode;

  /**
   * Text that displays as a group-level validation warning message. If this is
   * set to a non-empty string, the group renders in a warning state and the
   * message is associated with the group through `aria-describedby`.
   *
   * It's not shown when `errorText` is also set.
   */
  warningText?: React.ReactNode;

  /**
   * An object containing all the necessary localized strings required by the component.
   * @i18n
   */
  i18nStrings?: ControlGroupProps.I18nStrings;
}

export namespace ControlGroupProps {
  export interface I18nStrings {
    /**
     * Provides a text alternative for the error icon in the error message.
     */
    errorIconAriaLabel?: string;

    /**
     * Provides a text alternative for the warning icon in the warning message.
     */
    warningIconAriaLabel?: string;
  }
}
