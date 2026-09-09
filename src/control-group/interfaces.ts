// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';
import { NonCancelableEventHandler } from '../types/events';

export interface ControlGroupProps extends BaseComponentProps {
  /**
   * Adds an `aria-label` to the group element. The group is rendered with
   * `role="group"`, so this label provides the accessible name that
   * announces the grouped controls as a single unit.
   *
   * Use this to give each control group a unique, descriptive name
   * (for example, `"Label matcher"`). Provide either `ariaLabel` or
   * `ariaLabelledby`. This does not name the individual controls: each control
   * still needs its own accessible name.
   */
  ariaLabel?: string;

  /**
   * Sets the `aria-labelledby` property on the group element. Use this instead of
   * `ariaLabel` when the group is named by a visible element elsewhere on the page
   * (pass that element's `id`). Provide either `ariaLabel` or `ariaLabelledby`.
   */
  ariaLabelledby?: string;

  /**
   * The controls that make up the group (for example, `Input`, `Select`,
   * `Multiselect`, or `SegmentedControl`). They render in DOM order, so keyboard
   * `Tab` navigation flows through them naturally, and their borders are fused
   * into a single visual unit.
   * @displayname controls
   */
  children?: React.ReactNode;

  /**
   * Renders a remove button as the last control in the group, fused with the
   * other controls. Use `onDismiss` to handle activation,
   * `i18nStrings.dismissText` to provide its visible label (for example
   * "Remove"), and optionally `i18nStrings.dismissAriaLabel` to override its
   * accessible name.
   */
  dismissible?: boolean;

  /**
   * Called when the user activates the remove button rendered by `dismissible`.
   */
  onDismiss?: NonCancelableEventHandler;

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

    /**
     * Visible text of the remove button rendered when `dismissible` is set
     * (for example, "Remove"). It's also used as the button's accessible name
     * unless `dismissAriaLabel` overrides it.
     */
    dismissText?: string;

    /**
     * Provides an `aria-label` for the remove button rendered when `dismissible` is set.
     * Use this to override the accessible name when it should differ from `dismissText`.
     */
    dismissAriaLabel?: string;
  }
}
