// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { StatusIndicatorProps } from '../status-indicator/interfaces';

export interface StepsProps extends BaseComponentProps {
  /**
   * An array of individual steps
   *
   * Each step definition has the following properties:
   *  * `status` (string) - Status of the step corresponding to a status indicator.
   *  * `statusIconAriaLabel` - (string) - (Optional) Alternative text for the status icon.
   *  * `header` (ReactNode) - Summary corresponding to the step.
   *  * `details` (ReactNode) - (Optional) Additional information corresponding to the step.
   */
  steps: ReadonlyArray<StepsProps.Step>;
  /**
   * The visual orientation of the steps (vertical or horizontal).
   * By default the orientation is vertical.
   *
   * @awsuiSystem core
   */
  orientation?: StepsProps.Orientation;
  /**
   * Render a step. This overrides the default icon, header, and details provided by the component.
   * The function is called for each step and should return an object with the following keys:
   * * `header` (React.ReactNode) - Summary corresponding to the step.
   * * `details` (React.ReactNode) - (Optional) Additional information corresponding to the step.
   * * `icon` (React.ReactNode) - (Optional) Replaces the standard step icon from the status indicator.
   *
   * @awsuiSystem core
   */
  renderStep?: (step: StepsProps.Step) => {
    header: React.ReactNode;
    details?: React.ReactNode;
    icon?: React.ReactNode;
  };
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

  export type Orientation = 'vertical' | 'horizontal';
}
