// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StatusIndicatorProps } from '../status-indicator/interfaces';
import { BaseComponentProps } from '../types/base-component';

export interface StepsProps extends BaseComponentProps {
  /**
   * An array of individual steps
   *
   * Each step definition has the following properties:
   *  * `status` (string) - (Optional) Status of the step corresponding to a status indicator. If not set, the step renders a neutral dot instead of a status icon.
   *  * `statusIconAriaLabel` - (string) - (Optional) Alternative text for the status icon or neutral dot.
   *  * `header` (ReactNode) - Summary corresponding to the step.
   *  * `details` (ReactNode) - (Optional) Additional information corresponding to the step.
   *  * `headerStart` (ReactNode) - (Optional) Content rendered in a fixed-width column at the start of the step, before the icon. Typically a timestamp in a timeline view. Applies to the default `vertical` orientation and is ignored when `orientation="horizontal"`.
   */
  steps: ReadonlyArray<StepsProps.Step>;
  /**
   * The visual orientation of the steps (vertical or horizontal).
   * By default the orientation is vertical.
   */
  orientation?: StepsProps.Orientation;
  /**
   * Render a step. This overrides the default icon, header, and details provided by the component.
   * The function is called for each step and should return an object with the following keys:
   * * `header` (React.ReactNode) - Summary corresponding to the step.
   * * `details` (React.ReactNode) - (Optional) Additional information corresponding to the step.
   * * `icon` (React.ReactNode) - (Optional) Replaces the standard step icon from the status indicator.
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
    status?: Status;
    statusIconAriaLabel?: string;
    header: React.ReactNode;
    details?: React.ReactNode;
    headerStart?: React.ReactNode;
  }

  export type Orientation = 'vertical' | 'horizontal';
}
