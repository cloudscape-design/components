// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface WizardProps extends BaseComponentProps {
  /**
   * Array of step objects. Each object represents a step in the wizard with the following properties:
   *
   * - `title` (string) - Text that's displayed as the title in the navigation pane and form header.
   * - `info` (ReactNode) - (Optional) Area for a page level info link that's displayed in the form header.
   *    The page level info link should trigger the default help panel content for the step. Use the [link component](/components/link/) to display the link.
   * - `description` (ReactNode) - (Optional) Area below the form header for a page level description text to further explain the purpose, goal, or main actions of the step.
   * - `content` (ReactNode) - Main content area to display form sections, form fields, and controls.
   * - `errorText` (ReactNode) - (Optional) Error text that's displayed in a page level error alert.
   *    Use this for rendering actionable server-side validation failure messages.
   * - `isOptional` (boolean) - Specifies whether the step is optional or required. If set to `true`, the text from `i18nStrings.optional`
   *    is rendered next to the `title` in the navigation step label and the form header title.
   */
  steps: ReadonlyArray<WizardProps.Step>;

  /**
   * Index of the step that's currently displayed. The first step has an index of zero (0).
   *
   * If you don't set this property, the component starts on the first step and switches step automatically
   * when a user navigates using the buttons or an enabled step link in the navigation pane (that is, uncontrolled behavior).
   *
   * If you provide a value for this property, you must also set an `onNavigate` listener to update the property when
   * a user navigates (that is, controlled behavior).
   *
   * If you set it to a value that exceeds the maximum value (that is, the number of steps minus 1), its value is ignored and the component uses the maximum value.
   */
  activeStepIndex?: number;

  /**
   * An object containing all the necessary localized strings required by the component.
   *
   * - `stepNumberLabel` ((stepNumber: number) => string) - A function that accepts a number (1-based indexing),
   *    and returns a human-readable, localized string displaying the step number in the navigation pane. For example, "Step 1" or "Step 2".
   * - `collapsedStepsLabel` ((stepNumber: number, stepsCount: number) => string) - A function that accepts two number parameters (1-based indexing),
   *    and returns a string responsible for the navigation summary on smaller screens. For example, "Step 1 of 3". The parameters are as follows:
   *    - `stepNumber` (number) - The step number that the user is currently on.
   *    - `stepsCount` (number) - The total number of steps in the wizard.
   * - `skipToButtonLabel`: ((targetStep: WizardProps.Step, targetStepNumber: number) => string) - An optional function that accepts the target step object
   *    and the target step number (1-based indexing), and returns a string to be used as the *skip-to* button label. For example, "Skip to Step 2" or "Skip to end".
   * - `navigationAriaLabel` (string) - The aria label for the navigation pane.
   * - `cancelButton` (string) - The text of the button that enables the user to exit the flow.
   * - `previousButton` (string) - The text of the button that enables the user to return to the previous step.
   * - `nextButton` (string) - The text of the button that enables the user to move to the next step.
   * - `submitButton` (string) - The text of the button that enables the user to submit the form.
   * - `optional` (string) - The text displayed next to the step title and form header title when a step is declared optional.
   * - `nextButtonLoadingAnnouncement` (string) - The text that a screen reader announces when the *next* button is in a loading state.
   * - `submitButtonLoadingAnnouncement` (string) - The text that a screen reader announces when the *submit* button is in a loading state.
   * @i18n
   */
  i18nStrings: WizardProps.I18nStrings;

  /**
   * Renders the *next* or *submit* button in a loading state.
   *
   * Use this if you need to wait for a response from the server before the user can proceed to the next step, such as during server-side validation or retrieving the next step's information.
   */
  isLoadingNextStep?: boolean;

  /**
   * When set to `false`, the *skip-to* button is never shown.
   * When set to `true`, the *skip-to* button may appear to offer faster navigation for the user.
   *
   * The *skip-to* button only allows to skip optional steps. It is shown when there is one or more optional
   * steps ahead having no required steps in-between.
   *
   * Note: the *skip-to* button requires the function i18nStrings.skipToButtonLabel to be defined.
   *
   * Defaults to `false`.
   */
  allowSkipTo?: boolean;

  /**
   * Specifies left-aligned secondary actions for the wizard. Use a button dropdown if multiple actions are required.
   */
  secondaryActions?: React.ReactNode;

  /**
   * Called when a user clicks the *cancel* button.
   * If a user has entered data in the form, you should prompt the user with a modal before exiting the wizard flow.
   */
  onCancel?: NonCancelableEventHandler;

  /**
   * Called when a user clicks the *submit* button.
   */
  onSubmit?: NonCancelableEventHandler;

  /**
   * Called when a user clicks the *next* button, the *previous* button, or an enabled step link in the navigation pane.
   *
   * The event `detail` includes the following:
   * - `requestedStepIndex` - The index of the requested step.
   * - `reason` - The user action that triggered the navigation event. It can be `next` (when the user clicks the *next* button),
   * `previous` (when the user clicks the *previous* button), `step` (an enabled step link in the navigation pane),
   * or `skip` (when navigated using navigation pane or the *skip-to* button to the previously unvisited step).
   */
  onNavigate?: NonCancelableEventHandler<WizardProps.NavigateDetail>;
}

export namespace WizardProps {
  export interface Step {
    title: string;
    info?: React.ReactNode;
    description?: React.ReactNode;
    content: React.ReactNode;
    errorText?: React.ReactNode;
    isOptional?: boolean;
  }

  export interface I18nStrings {
    stepNumberLabel?(stepNumber: number): string;
    collapsedStepsLabel?(stepNumber: number, stepsCount: number): string;
    skipToButtonLabel?(targetStep: WizardProps.Step, targetStepNumber: number): string;
    navigationAriaLabel?: string;
    errorIconAriaLabel?: string;
    cancelButton?: string;
    previousButton?: string;
    nextButton?: string;
    submitButton: string;
    optional?: string;
    nextButtonLoadingAnnouncement?: string;
    submitButtonLoadingAnnouncement?: string;
  }

  export interface NavigateDetail {
    requestedStepIndex: number;
    reason: WizardProps.NavigationReason;
  }

  export type NavigationReason = 'next' | 'previous' | 'step' | 'skip';
}
