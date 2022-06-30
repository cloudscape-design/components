// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { TutorialPanelProps } from '../../../lib/components/tutorial-panel/interfaces';

export const i18nStrings: TutorialPanelProps.I18nStrings = {
  loadingText: 'LOADING',

  tutorialListTitle: 'TUTORIAL_LIST_TITLE',
  tutorialListDescription: <span>TUTORIAL_LIST_DESCRIPTION</span>,
  tutorialListDownloadLinkText: 'DOWNLOAD_LINK_TEXT',

  tutorialCompletedText: 'TUTORIAL_COMPLETED',
  learnMoreLinkText: 'LEARN_MORE_LINK_TEXT',

  startTutorialButtonText: 'START_TUTORIAL',
  restartTutorialButtonText: 'RESTART_TUTORIAL',

  completionScreenTitle: 'COMPLETION_SCREEN_TITLE',

  feedbackLinkText: 'FEEDBACK_LINK_TEXT',
  dismissTutorialButtonText: 'DISMISS_TUTORIAL_BUTTON',

  taskTitle: (taskIndex: number, taskTitle: string) => `TASK_${taskIndex + 1}_${taskTitle}`,
  stepTitle: (stepIndex: number, stepTitle: string) => `STEP_${stepIndex + 1}_${stepTitle}`,

  labelExitTutorial: 'EXIT_TUTORIAL',
  labelTotalSteps: (totalStepCount: number) => `TOTAL_STEPS_${totalStepCount}`,
  labelLearnMoreExternalIcon: 'LEARN_MORE_ICON_LABEL',

  labelsTaskStatus: {
    pending: 'LABEL_PENDING',
    'in-progress': 'LABEL_IN_PROGRESS',
    success: 'LABEL_SUCCESS',
  },
};

export function getTutorials(): TutorialPanelProps.Tutorial[] {
  return [
    {
      title: 'TUTORIAL_1_TITLE_TEST',
      description: 'TUTORIAL_DESCRIPTION_TEST',
      learnMoreUrl: 'LEARN_MORE_URL',
      completed: false,
      completedScreenDescription: 'COMPLETED_SCREEN_DESCRIPTION_TEST',
      tasks: [
        {
          title: 'FIRST_TASK_TEST',
          steps: [{ title: 'FIRST_STEP_TEST', content: <div>First step content</div>, hotspotId: 'first-hotspot' }],
        },
        {
          title: 'SECOND_TASK_TEST',
          steps: [
            { title: 'SECOND_STEP_TEST', content: <div>Second step content</div>, hotspotId: 'third-hotspot' },
            { title: 'THIRD_STEP_TEST', content: <div>Third step content</div>, hotspotId: 'second-hotspot' },
          ],
        },
      ],
    },
    {
      title: 'TUTORIAL_2_TITLE_TEST',
      description: 'TUTORIAL_DESCRIPTION_TEST',
      completed: true,
      completedScreenDescription: 'COMPLETED_SCREEN_DESCRIPTION_TEST',
      prerequisitesAlert: 'PREREQUISITES_ALERT_TEXT',
      prerequisitesNeeded: true,
      tasks: [
        {
          title: 'FIRST_TASK_TEST',
          steps: [{ title: 'FIRST_STEP_TEST', content: <div>First step content</div>, hotspotId: 'first-hotspot' }],
        },
        {
          title: 'SECOND_TASK_TEST',
          steps: [
            { title: 'SECOND_STEP_TEST', content: <div>Second step content</div>, hotspotId: 'third-hotspot' },
            { title: 'THIRD_STEP_TEST', content: <div>Third step content</div>, hotspotId: 'second-hotspot' },
          ],
        },
      ],
    },
  ];
}
