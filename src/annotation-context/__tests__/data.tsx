// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { AnnotationContextProps } from '../../../lib/components/annotation-context/interfaces';
import { TutorialPanelProps } from '../../../lib/components/tutorial-panel/interfaces';

export const i18nStrings: AnnotationContextProps.I18nStrings = {
  nextButtonText: 'NEXT_BUTTON_TEST',
  previousButtonText: 'PREVIOUS_BUTTON_TEST',
  finishButtonText: 'FINISH_BUTTON_TEST',
  labelDismissAnnotation: 'DISMISS_ANNOTATION_TEST',
  labelHotspot: (openState: boolean, stepIndex: number, totalStepCount: number) =>
    openState
      ? `CLOSE_HOTSPOT_TEST_FOR_STEP_${stepIndex + 1}_OF_${totalStepCount}_TEST`
      : `OPEN_HOTSPOT_TEST_FOR_STEP_${stepIndex + 1}_OF_${totalStepCount}_TEST`,
  stepCounterText: (stepIndex: number, totalStepCount: number) => `STEP_${stepIndex + 1}_OF_${totalStepCount}_TEST`,
  taskTitle: (taskIndex: number, taskTitle: string) => `TASK_${taskIndex + 1}_${taskTitle}`,
};

export function getTutorial(): TutorialPanelProps.Tutorial {
  return {
    title: 'TUTORIAL_TITLE_TEST',
    description: 'TUTORIAL_DESCRIPTION_TEST',
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
          { title: 'SECOND_STEP_TEST', content: <div>Second step content</div>, hotspotId: 'second-hotspot' },
          { title: 'THIRD_STEP_TEST', content: <div>Third step content</div>, hotspotId: 'third-hotspot' },
        ],
      },
    ],
  };
}

export function getTutorialWithMultipleStepsPerHotspot(): TutorialPanelProps.Tutorial {
  return {
    title: 'TUTORIAL_TITLE_TEST',
    description: 'TUTORIAL_DESCRIPTION_TEST',
    completed: false,
    completedScreenDescription: 'COMPLETED_SCREEN_DESCRIPTION_TEST',
    tasks: [
      {
        title: 'FIRST_TASK_TEST',
        steps: [
          { title: 'FIRST_STEP_TEST', content: <div>First step content</div>, hotspotId: 'first-hotspot' },
          { title: 'SECOND_STEP_TEST', content: <div>Second step content</div>, hotspotId: 'first-hotspot' },
        ],
      },
      {
        title: 'SECOND_TASK_TEST',
        steps: [
          { title: 'THIRD_STEP_TEST', content: <div>Third step content</div>, hotspotId: 'second-hotspot' },
          { title: 'FOURTH_STEP_TEST', content: <div>Fourth step content</div>, hotspotId: 'second-hotspot' },
          { title: 'FIFTH_STEP_TEST', content: <div>Fifth step content</div>, hotspotId: 'second-hotspot' },
        ],
      },
    ],
  };
}
