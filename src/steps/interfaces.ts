// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { StatusIndicatorProps } from '../status-indicator/internal';

export interface StepsProps extends BaseComponentProps {
  /**
   * An array of individual steps
   *
   * Each step definition has the following properties:
   *  * `status` (string) - Status of the step corresponding to a status indicator.
   *  * `statusIconAriaLabel` - (string) - (Optional) Text alternative for the status icon.
   *  * `header` (ReactNode) - Summary corresponding to the step.
   *  * `details` (ReactNode) - (Optional) Additional information corresponding to the step.
   */
  steps: ReadonlyArray<StepsProps.Step>;
  /**
   * Provides an `aria-label` to the progress steps container.
   * Don't use `ariaLabel` and `ariaLabelledby` at the same time.
   */
  ariaLabel?: string;
  /**
   * Sets the `aria-labelledby` property on the progress steps container.
   * If there's a visible label element that you can reference, use this instead of `ariaLabel`.
   * Don't use `ariaLabel` and `ariaLabelledby` at the same time.
   */
  ariaLabelledby?: string;
  /**
   * Sets the `aria-describedby` property on the progress steps container.
   */
  ariaDescribedby?: string;
}

export namespace StepsProps {
  export type Status = StatusIndicatorProps.Type;

  export interface Step {
    status: Status;
    statusIconAriaLabel?: string;
    header: React.ReactNode;
    details?: React.ReactNode;
  }
}
