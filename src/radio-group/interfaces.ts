// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { FormFieldControlProps } from '../internal/context/form-field-context';
import { NonCancelableEventHandler } from '../internal/events';

export interface RadioGroupProps extends BaseComponentProps, FormFieldControlProps {
  /**
   * Specify a custom name for the radio buttons. If not provided, the radio group generates a random name.
   */
  name?: string;

  /**
   * Sets the value of the selected radio button.
   * If you want to clear the selection, use `null`.
   */
  value: string | null;

  /**
   * Specifies an array of radio buttons to display. Each of these objects have the following properties:
   *
   * - `value` (string) - Sets the value of the radio button. Assigned to the radio group when a user selects the radio button.
   * - `label` (ReactNode) - Specifies a label for the radio button.
   * - `description` (ReactNode) - (Optional) Specifies descriptive text that appears below the label.
   * - `disabled` (boolean) - (Optional) Determines whether the radio button is disabled, which prevents the user from selecting it.
   * - `controlId` (string) - (Optional) Sets the ID of the internal input. You can use it to relate a label element's `for` attribute to this control.
   *        In general it's not recommended to set this because the ID is automatically set by the radio group component.
   */
  items?: ReadonlyArray<RadioGroupProps.RadioButtonDefinition>;

  /**
   * Adds `aria-label` to the group. If you are using this form element within a form field,
   * don't set this property because the form field component automatically sets the correct labels to make the component accessible.
   */
  ariaLabel?: string;

  /**
   * Adds `aria-required` to the group.
   */
  ariaRequired?: boolean;

  /**
   * Adds `aria-controls` attribute to the radio group.
   * If the radio group controls any secondary content (for example, another form field), use this to provide an ID referring to the secondary content.
   */
  ariaControls?: string;

  /**
   * Called when the user selects a different radio button. The event `detail` contains the current `value`.
   */
  onChange?: NonCancelableEventHandler<RadioGroupProps.ChangeDetail>;

  /**
   * @deprecated Has no effect.
   */
  controlId?: string;

  /**
   * Specifies if the whole group is read-only, which prevents the
   * user from modifying the value, but does not prevent the value from
   * being included in a form submission. A read-only control is still focusable.
   */
  readOnly?: boolean;
}

export namespace RadioGroupProps {
  export interface RadioButtonDefinition {
    value: string;
    label: React.ReactNode;
    description?: React.ReactNode;
    disabled?: boolean;
    controlId?: string;
  }

  export interface ChangeDetail {
    value: string;
  }

  export interface Ref {
    /**
     * Sets input focus onto the UI control.
     */
    focus(): void;
  }
}
