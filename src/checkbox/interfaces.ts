// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseCheckboxProps } from './base-checkbox';
import React from 'react';
import { NonCancelableEventHandler } from '../internal/events';

export interface CheckboxProps extends BaseCheckboxProps {
  /**
   * The control's label that's displayed next to the checkbox. A state change occurs when a user clicks on it.
   * @displayname label
   */
  children?: React.ReactNode;

  /**
   * Specifies that the component is in an indeterminate state. The behavior of this property replicates
   * the behavior of [the respective property](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#Indeterminate_state_checkboxes)
   * in the native control.
   */
  indeterminate?: boolean;

  /**
   * Called when the user changes the component state. The event `detail` contains the current value for the `checked` property.
   */
  onChange?: NonCancelableEventHandler<CheckboxProps.ChangeDetail>;

  /**
   * Specifies whether to add `aria-required` to the native control.
   */
  ariaRequired?: boolean;
}

export namespace CheckboxProps {
  export interface Ref {
    /**
     * Sets input focus onto the UI control.
     */
    focus(): void;
  }

  export interface ChangeDetail {
    checked: boolean;
    indeterminate: false;
  }
}
