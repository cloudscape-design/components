// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface SliderProps extends BaseComponentProps {
  /**
   * Indicates the current value. If variant is 'range', use format [number, number], otherwise, use number.
   */
  value?: number;

  /**
   * Indicates the current value. If variant is 'range', use format [number, number], otherwise, use number.
   */
  rangeValue?: [number, number];

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
   * onRangeChange handler.
   */
  onRangeChange?: NonCancelableEventHandler<SliderProps.RangeChangeDetail>;

  /**
   * Indicates the variant.
   */
  variant?: SliderProps.Variant;

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
   * Whether or not the slider has an error.
   */
  error?: boolean;

  /**
   * Stepped labels.
   */
  referenceValues?: Array<number>;

  /**
   * Specifies the ID for the trigger component. It uses an automatically generated ID by default.
   */
  controlId?: string;

  /**
   * Adds an `aria-label` to the native control.
   *
   * Use this if you don't have a visible label for this control.
   */
  ariaLabel?: string;

  /**
   * Adds an `aria-labelledBy` to the native control.
   */
  ariaLabelledBy?: string;
}

export namespace SliderProps {
  export type Variant = 'default' | 'range';

  export interface ChangeDetail {
    value: number;
    label?: string;
  }

  export interface RangeChangeDetail {
    value: [number, number];
  }
}
