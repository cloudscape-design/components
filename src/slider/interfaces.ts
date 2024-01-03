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
   * Whether or not the slider is disabled.
   */
  disabled?: boolean;

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
  }

  export interface RangeChangeDetail {
    value: [number, number];
  }
}
