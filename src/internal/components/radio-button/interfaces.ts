// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../../base-component';
import { NonCancelableEventHandler } from '../../events';
import { NativeAttributes } from '../../utils/with-native-attributes';

export interface RadioButtonProps extends BaseComponentProps {
  /**
   * Specifies if the component is selected.
   */
  checked: boolean;

  /**
   * Specifies the ID of the native form element. You can use it to relate
   * a label element's `for` attribute to this control.
   */
  controlId?: string;

  /**
   * Name of the group that the radio button belongs to.
   */
  name: string;

  /**
   * Description that appears below the label.
   */
  description?: React.ReactNode;

  /**
   * Specifies if the control is disabled, which prevents the
   * user from modifying the value and prevents the value from
   * being included in a form submission. A disabled control can't
   * receive focus.
   */
  disabled?: boolean;

  /**
   * The control's label that's displayed next to the radio button. A state change occurs when a user clicks on it.
   * @displayname label
   */
  children?: React.ReactNode;

  /**
   * Attributes to add to the native `input` element.
   * Some attributes will be automatically combined with internal attribute values:
   * - `className` will be appended.
   * - Event handlers will be chained, unless the default is prevented.
   *
   * We do not support using this attribute to apply custom styling.
   */
  nativeInputAttributes?: NativeAttributes<React.InputHTMLAttributes<HTMLInputElement>>;

  /**
   * Called when the user changes the component state. The event `detail` contains the current value for the `checked` property.
   */
  onChange?: NonCancelableEventHandler<RadioButtonProps.ChangeDetail>;

  /**
   * Specifies if the radio button is read-only, which prevents the
   * user from modifying the value, but does not prevent the value from
   * being included in a form submission. A read-only control is still focusable.
   *
   * This property should be set for either all or none of the radio buttons in a group.
   */
  readOnly?: boolean;

  style?: RadioButtonProps.Style;

  /**
   * Sets the value attribute to the native control.
   * If using native form submission, this value is sent to the server if the radio button is checked.
   * It is never shown to the user by their user agent.
   * For more details, see the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/radio#value).
   */
  value?: string;
}

export namespace RadioButtonProps {
  export interface ChangeDetail {
    checked: boolean;
  }

  export interface Ref {
    /**
     * Sets input focus onto the UI control.
     */
    focus(): void;
  }

  export interface Style {
    input?: {
      fill?: {
        checked?: string;
        default?: string;
        disabled?: string;
        readOnly?: string;
      };
      stroke?: {
        default?: string;
        disabled?: string;
        readOnly?: string;
      };
      circle?: {
        fill?: {
          checked?: string;
          disabled?: string;
          readOnly?: string;
        };
      };
      focusRing?: {
        borderColor?: string;
        borderRadius?: string;
        borderWidth?: string;
      };
    };
    label?: {
      color?: {
        checked?: string;
        default?: string;
        disabled?: string;
        readOnly?: string;
      };
    };
    description?: {
      color?: {
        checked?: string;
        default?: string;
        disabled?: string;
        readOnly?: string;
      };
    };
  }
}
