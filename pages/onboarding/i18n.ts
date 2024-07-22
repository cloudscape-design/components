// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import type { AnnotationContextProps } from '~components/annotation-context';
import type { TutorialPanelProps } from '~components/tutorial-panel';

export const tutorialPanelStrings: TutorialPanelProps.I18nStrings = {
  labelsTaskStatus: { pending: 'Pending', 'in-progress': 'In progress', success: 'Success' },
  loadingText: 'Loading',
  tutorialListTitle: 'Choose a tutorial',
  tutorialListDescription:
    'Use our walk-through tutorials to learn how to achieve your desired objectives within Amazon Transcribe.',
  tutorialListDownloadLinkText: 'Download PDF version',
  labelTutorialListDownloadLink: 'Download PDF version of this tutorial',
  tutorialCompletedText: 'Tutorial completed',
  labelExitTutorial: 'dismiss tutorial',
  learnMoreLinkText: 'Learn more',
  labelLearnMoreLink: 'Learn more about transcribe audio (opens new tab)',
  startTutorialButtonText: 'Start tutorial',
  restartTutorialButtonText: 'Restart tutorial',
  completionScreenTitle: 'Congratulations! You completed the tutorial',
  feedbackLinkText: 'Feedback',
  dismissTutorialButtonText: 'Dismiss tutorial',
  taskTitle: (taskIndex, taskTitle) => `Task ${taskIndex + 1}: ${taskTitle}`,
  stepTitle: (stepIndex, stepTitle) => `Step ${stepIndex + 1}: ${stepTitle}`,
  labelTotalSteps: totalStepCount => `Total steps: ${totalStepCount}`,
  labelLearnMoreExternalIcon: 'Opens in a new tab',
};

export const annotationContextStrings: AnnotationContextProps.I18nStrings = {
  stepCounterText: (stepIndex, totalStepCount) => `Step ${stepIndex + 1}/${totalStepCount}`,
  taskTitle: (taskIndex, taskTitle) => `Task ${taskIndex + 1}: ${taskTitle}`,
  labelHotspot: (openState, stepIndex, totalStepCount) =>
    openState
      ? `close annotation for step ${stepIndex + 1}/${totalStepCount}`
      : `open annotation for step ${stepIndex + 1}/${totalStepCount}`,
  nextButtonText: 'Next',
  previousButtonText: 'Previous',
  finishButtonText: 'Finish',
  labelDismissAnnotation: 'dismiss annotation',
};
