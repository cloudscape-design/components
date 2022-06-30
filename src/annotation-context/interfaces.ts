// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { NonCancelableEventHandler } from '../internal/events';
import { TutorialPanelProps } from '../tutorial-panel/interfaces';

export interface AnnotationContextProps {
  /**
   * The currently launched tutorial. This should be the object received
   * in the `detail` property of the `onStartTutorial` event.
   */
  currentTutorial: AnnotationContextProps.Tutorial | null;

  /**
   * This event is fired when a user clicks the "Next" or "Previous"
   * button on a popover, when the user clicks on a closed hotspot icon,
   * or when the AnnotationOverlay determines that the current hotspot
   * has disappeared from the page and a different one should be
   * selected (e.g. when navigating between pages).
   *
   * Use the `reason` property of the event detail to determine why
   * this event was fired.
   */
  onStepChange?: NonCancelableEventHandler<AnnotationContextProps.StepChangeDetail>;

  /**
   * Fired when the user selects a tutorial from the list.
   */
  onStartTutorial: NonCancelableEventHandler<TutorialPanelProps.TutorialDetail>;

  /**
   * Fired when the user exits the current tutorial.
   */
  onExitTutorial: NonCancelableEventHandler<TutorialPanelProps.TutorialDetail>;

  /**
   * Fired when the user clicks the "Finish" button on the last step of
   * the tutorial.
   */
  onFinish?: NonCancelableEventHandler<void>;

  /**
   * Put all page content inside this component's children. This component
   * will provide a context which is used by the Hotspot elements throughout
   * the page.
   */
  children: React.ReactNode;

  /**
   * An object containing all the necessary localized strings required by
   * the component.
   */
  i18nStrings: AnnotationContextProps.I18nStrings;
}

export namespace AnnotationContextProps {
  export interface StepChangeDetail {
    step: number;
    reason: 'next' | 'previous' | 'open' | 'auto-fallback';
  }

  export interface OpenChangeDetail {
    open: boolean;
  }

  export type Task = TutorialPanelProps.Task;
  export type Step = TutorialPanelProps.Step;
  export type Tutorial = TutorialPanelProps.Tutorial;

  export interface I18nStrings {
    nextButtonText: string;
    previousButtonText: string;
    finishButtonText: string;

    labelDismissAnnotation: string;
    labelHotspot: (openState: boolean) => string;

    stepCounterText: (stepIndex: number, totalStepCount: number) => string;
    taskTitle: (taskIndex: number, taskTitle: string) => string;
  }
}
