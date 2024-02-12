// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { FormFieldValidationControlProps } from '../internal/context/form-field-context';
import { NonCancelableEventHandler } from '../internal/events';

export interface SliderProps extends BaseComponentProps, FormFieldValidationControlProps {
  /**
   * Indicates the current value. If variant is 'range', use format [number, number], otherwise, use number.
   */
  value?: number;

  /**
   * Indicates the minimum value.
   */
  min: number;

  /**
   * Indicates the maximum value.
   */
  max: number;

  /**
   * Formats the values
   */
  valueFormatter?: (value: number) => string;

  /**
   * onChange handler.
   */
  onChange?: NonCancelableEventHandler<SliderProps.ChangeDetail>;

  /**
   * How big the step size is.
   */
  step?: number;

  /**
   * Hide the tooltip on focus.
   */
  hideTooltip?: boolean;

  /**
   * Thumb only.
   */
  thumbOnly?: boolean;

  /**
   * Whether or not the slider is disabled.
   */
  disabled?: boolean;

  /**
   * Stepped labels.
   */
  referenceValues?: Array<number>;

  /**
   * Adds an `aria-label` to the native control.
   *
   * Use this if you don't have a visible label for this control.
   */
  ariaLabel?: string;
}

export namespace SliderProps {
  export interface ChangeDetail {
    value: number;
  }
}
