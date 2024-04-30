// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { FormFieldValidationControlProps } from '../internal/context/form-field-context';
import { NonCancelableEventHandler } from '../internal/events';

export interface SliderProps extends BaseComponentProps, FormFieldValidationControlProps {
  /**
   * Indicates the current value.
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
   * Formats the values. This will format both the labels and the tooltip.
   */
  valueFormatter?: (value: number) => string;

  /**
   * Called when the user selects a value.
   * The event `detail` contains the current `value`.
   */
  onChange?: NonCancelableEventHandler<SliderProps.ChangeDetail>;

  /**
   * How big the step size is.
   */
  step?: number;

  /**
   * Hides the colored fill line, so only the handle is visible.
   */
  hideFillLine?: boolean;

  /**
   * Show the tick marks along the slider line. Use with stepped sliders, except in extreme cases.
   */
  tickMarks?: boolean;

  /**
   * Whether or not the slider is disabled.
   */
  disabled?: boolean;

  /**
   * Labels shown between the minimum and maximum values.
   */
  referenceValues?: ReadonlyArray<number>;

  /**
   * Adds an `aria-label` to the native control.
   *
   * Use this if you don't have a visible label for this control.
   */
  ariaLabel?: string;

  /**
   * Adds an aria-description for slider labels.
   *
   * Use when sliders have formatted reference values.
   */
  ariaDescription?: string;

  /**
   * An object containing all the necessary localized strings required by the component.
   * @i18n
   */
  i18nStrings?: SliderProps.I18nStrings;
}

export namespace SliderProps {
  export interface ChangeDetail {
    value: number;
  }
  export interface I18nStrings {
    /**
      The aria value text displayed when the slider value is between two labeled values.
     */
    valueTextRange: (previousValue: string, value: number, nextValue: string) => string;
  }
}
