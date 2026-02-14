// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { NonCancelableEventHandler } from '../internal/events';
/**
 * @awsuiSystem core
 */
import { NativeAttributes } from '../internal/utils/with-native-attributes';
import { BaseCheckboxProps } from './base-checkbox';

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

  /**
   * An object containing CSS properties to customize the checkbox's visual appearance.
   * @awsuiSystem core
   */
  style?: CheckboxProps.Style;

  /**
   * Attributes to add to the native `input` element.
   * Some attributes will be automatically combined with internal attribute values:
   * - `className` will be appended.
   * - Event handlers will be chained, unless the default is prevented.
   *
   * We do not support using this attribute to apply custom styling.
   *
   * @awsuiSystem core
   */
  nativeInputAttributes?: NativeAttributes<React.InputHTMLAttributes<HTMLInputElement>>;
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

  export interface Style {
    input?: {
      fill?: {
        checked?: string;
        default?: string;
        disabled?: string;
        indeterminate?: string;
        readOnly?: string;
      };
      stroke?: {
        checked?: string;
        default?: string;
        disabled?: string;
        indeterminate?: string;
        readOnly?: string;
      };
      check?: {
        stroke?: {
          checked?: string;
          disabled?: string;
          indeterminate?: string;
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
        indeterminate?: string;
        readOnly?: string;
      };
    };
  }
}
