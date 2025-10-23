// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { IconProps } from '../icon/interfaces';
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
   *  * `iconName` (IconProps.Name) - (Optional) Specifies a custom icon to be displayed instead of the status icon.
   *  * `iconSvg` (React.ReactNode) - (Optional) Specifies the SVG of a custom icon that is displayed instead of the status icon. For more information, see [SVG icon guidelines](/components/icon/?tabId=api#slots)
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
   * Enables an alternative placement of the header that seperates the status icon from the header text.
   * Only has an effect in horizontal orientation.
   *
   * @awsuiSystem core
   */
  separateHorizontalHeader?: boolean;
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
    iconName?: IconProps.Name;
    iconSvg?: React.ReactNode;
  }

  export type Orientation = 'vertical' | 'horizontal';
}
