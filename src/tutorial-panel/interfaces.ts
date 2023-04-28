// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface TutorialPanelProps extends BaseComponentProps {
  /**
   * Whether the content of the panel is currently loading. If this property
   * is set to `true`, the panel displays a spinner and the loadingText that is
   * specified in the `i18nStrings` property.
   */
  loading?: boolean;

  /**
   * List of all available tutorials. An array of objects with the following properties:
   *
   * * `title` (string) - Name of the tutorial
   *
   * * `description` (ReactNode) - Short description of the tutorial's content.
   *
   * * `tasks` - Array of tasks (in intended order). Each Task has the following properties:
   *   * `title` (string) - Name of this task. This is shown in the task list overview of the tutorial's detail view.
   *   * `steps` - Array of steps in this task (in intended order). Each step has the following properties:
   *     * `title` (string) - Title of this step. This is shown in the step list in the tutorial's detail view.
   *     * `content` (ReactNode) - Content to be shown in the popover of this step. Can be JSX or plain text.
   *     * `warningAlert` (ReactNode) - (Optional) If this field is present, a warning alert will be displayed
   *        inside the step's popover, showing this field's content. Can be JSX or plain text.
   *     * `hotspotId` (string) - ID of the hotspot that this tutorial step points to.
   *
   *        A hotspot with this ID needs to be added manually to the code of the application and represents a location
   *        in the application that a tutorial step can be attached to. It can be re-used by multiple tutorials. Hotspot
   *        IDs need to be unique in the scope of the whole application that uses this tutorial.
   *
   * * `completedScreenDescription` (ReactNode) - Description to be shown on the last page of the tutorial, when the
   *    user has successfully completed the tutorial.
   *
   * * `prerequisitesAlert` (ReactNode) - (Optional) If the application determines that the user cannot start the tutorial
   *    yet (by specifying the property `prerequisitesNeeded` on the tutorial object), the content of `prerequisitesAlert`
   *    will be shown in the tutorial list underneath the tutorial title.
   *
   *    Example: `<><Link>Create a bucket first</Link> to complete this tutorial.</>`
   *
   * * `prerequisitesNeeded` (boolean) - (Optional) If this property is set to `true`, the tutorial list will disable the
   *   `Start tutorial` button for this tutorial, and it will show the contents of the tutorial's `prerequisitesAlert` field
   *    in an alert underneath the tutorial title.
   *
   * * `learnMoreUrl` (string | null) - (Optional) If present, the tutorial list will show a "Learn More" link pointing to
   *    this URL underneath the tutorial's description.
   *
   * * `completed` (boolean) - Whether the user has already completed this tutorial.
   *
   *   If this property is set to `true`, the tutorial list will show a status indicator underneath the tutorial title with
   *   a message that indicates that this tutorial has already been completed by the user (e.g. "Tutorial completed"), and
   *   the "Start tutorial" button will be replaced by a "Restart tutorial" button.
   */
  tutorials: ReadonlyArray<TutorialPanelProps.Tutorial>;

  /**
   * The link to a file documenting all tutorials (usually a PDF).
   */
  downloadUrl?: string;

  /**
   * An object containing all the necessary localized strings required by the component.
   */
  i18nStrings: TutorialPanelProps.I18nStrings;

  /**
   * Fired when the user clicks on the feedback link at the end of a tutorial.
   */
  onFeedbackClick?: NonCancelableEventHandler<TutorialPanelProps.TutorialDetail>;
}

export namespace TutorialPanelProps {
  export interface TutorialDetail {
    tutorial: Tutorial;
  }

  export interface Tutorial {
    /**
     * Title of the tutorial
     * */
    title: string;

    /**
     * Short description of the tutorial's content. This is displayed in the tutorial list.
     */
    description: React.ReactNode;

    /**
     * List of tasks (in intended order)
     */
    tasks: ReadonlyArray<Task>;

    /**
     * Description to be shown on the last page of the tutorial, when the user has
     * successfully completed the tutorial.
     */
    completedScreenDescription: React.ReactNode;

    /**
     * If the application determines that the user cannot start
     * the tutorial yet (by specifying the property `prerequisitesNeeded` on the
     * tutorial object), the content of `prerequisitesAlert` will be shown in the
     * tutorial list underneath the tutorial title.
     *
     * @deprecated Use alert component inside description property directly.
     */
    prerequisitesAlert?: React.ReactNode;

    /**
     * If this property is set to `true`, the tutorial list
     * will disable the `Start tutorial` button for this
     * tutorial, and it will show the contents of the
     * tutorial's `prerequisitesAlert` field in an alert underneath
     * the tutorial title.
     */
    prerequisitesNeeded?: boolean;

    /**
     * If present, the tutorial list will show a "Learn More" link pointing to
     * this URL underneath the tutorial's description.
     */
    learnMoreUrl?: string | null;

    /**
     * Whether the user has already completed this tutorial.
     *
     * If this property is set to `true`, the tutorial list
     * will show a status indicator underneath the tutorial
     * title with a message that indicates that this tutorial
     * has already been completed by the user (e.g.
     * "Tutorial completed"), and the "Start tutorial" button
     * will be replaced by a "Restart tutorial" button.
     *
     */
    completed: boolean;
  }

  export interface Task {
    /**
     * Title of this task. This is shown in the task list overview of the tutorial's
     * detail view.
     */
    title: string;

    /**
     * Steps in this task (in intended order)
     */
    steps: ReadonlyArray<Step>;
  }

  export interface Step {
    /**
     * Title of this step. This is shown in the step list in the tutorial's
     * detail view.
     */
    title: string;

    /**
     * Content to be shown in the popover of this step. Can be JSX or plain text.
     */
    content: React.ReactNode;

    /**
     * If this field is present, a warning alert will be displayed inside
     * the step's popover, showing this field's content. Can be JSX or plain text.
     * @deprecated Use alert component inside content property directly.
     */
    warningAlert?: React.ReactNode;

    /**
     * ID of the hotspot that this tutorial step points to.
     *
     * A hotspot with this ID needs to be added manually to the code of the application
     * and represents a location in the application that a tutorial step can be
     * attached to. It can be re-used by multiple tutorials. Hotspot IDs need
     * to be unique in the scope of the whole application that uses this tutorial.
     */
    hotspotId: string;
  }

  export interface I18nStrings {
    loadingText: string;

    tutorialListTitle: string;
    tutorialListDescription: React.ReactNode;
    tutorialListDownloadLinkText: string;

    tutorialCompletedText: string;
    learnMoreLinkText: string;

    startTutorialButtonText: string;
    restartTutorialButtonText: string;

    completionScreenTitle: string;

    feedbackLinkText: string;
    dismissTutorialButtonText: string;

    taskTitle: (taskIndex: number, taskTitle: string) => string;
    stepTitle: (stepIndex: number, stepTitle: string) => string;

    labelExitTutorial: string;
    labelTotalSteps: (totalStepCount: number) => string;
    labelLearnMoreExternalIcon: string;

    labelsTaskStatus: {
      pending: string;
      'in-progress': string;
      success: string;
    };

    labelTutorialListDownloadLink?: string;
    labelLearnMoreLink?: string;
  }
}
