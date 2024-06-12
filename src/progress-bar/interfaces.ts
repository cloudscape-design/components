// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface ProgressBarProps extends BaseComponentProps {
  /**
   * Indicates the current progress as a percentage. The value must be between 0 and 100. Decimals are rounded.
   */
  value?: number;

  /**
   * Specifies the status of the progress bar. You can set it to one of the following:
   *
   * - `"in-progress"` - Displays a progress bar.
   * - `"success"` or `"error"` - Displays a result state and replaces the progress element with a status indicator,
   * `resultText`, and a result button.
   */
  status?: ProgressBarProps.Status;

  /**
   * Enables the correct styling of the progress bar in different contexts. You can set it to one of the following:
   *
   * - `"flash"` - Use this variatn when using the progress bar within a flash component.
   *              Note that the result button isn't displayed when using this variant.
   *              Use the `buttonText` property and the `onButtonClick` event listener of the flashbar item instead of the result button provided by the progress bar.
   * - `"key-value"` - Use this variant when using the progress bar within the key-value pairs pattern.
   * - `"standalone"` Use in all other cases. This is the default value.
   */
  variant?: ProgressBarProps.Variant;

  /**
   * Specifies the text for the button that's displayed when the `status` is set to `error` or `success`.
   * If `resultButtonText` is empty, the result button isn't displayed.
   *
   * Note: If you use the `flash` variant, the result button isn't displayed.
   * Add a button using the `action` property of the flashbar item instead.
   */
  resultButtonText?: string;

  /**
   * Adds an `aria-label` to the progress bar.
   */
  ariaLabel?: string;

  /**
   * Adds `aria-labelledby` to the progress bar.
   */
  ariaLabelledby?: string;

  /**
   * Adds `aria-describedby` to the progress bar.
   */
  ariaDescribedby?: string;

  /**
   * Short description of the operation that appears at the top of the component.
   *
   * Make sure that you always provide a label for accessibility.
   */
  label?: React.ReactNode;

  /**
   * More detailed information about the operation that appears below the label.
   */
  description?: React.ReactNode;

  /**
   * Information that's displayed below the progress bar or status text.
   */
  additionalInfo?: React.ReactNode;

  /**
   * Content that's displayed when `status` is set to `error` or `success`.
   */
  resultText?: React.ReactNode;

  /**
   * Called when the user clicks the result state button.
   *
   * Note: If you are using the `flash` variant, the result button isn't displayed.
   * Use the `buttonText` property and the `onButtonClick` event listener of the flashbar item instead.
   */
  onResultButtonClick?: NonCancelableEventHandler;
}

export namespace ProgressBarProps {
  export type Status = 'in-progress' | 'success' | 'error';
  export type Variant = 'standalone' | 'flash' | 'key-value';
}
