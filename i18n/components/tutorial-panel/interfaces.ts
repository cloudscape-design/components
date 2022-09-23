// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TutorialPanelI18n {
  i18nStrings: {
    labelsTaskStatus: {
      pending: string;
      'in-progress': string;
      success: string;
    };
    loadingText: string;
    tutorialCompletedText: string;
    labelExitTutorial: string;
    learnMoreLinkText: string;
    startTutorialButtonText: string;
    restartTutorialButtonText: string;
    feedbackLinkText: string;
    dismissTutorialButtonText: string;
    taskTitle: ({ taskIndex, taskTitle }: { taskIndex: string; taskTitle: string }) => string;
    stepTitle: ({ stepIndex, stepTitle }: { stepIndex: string; stepTitle: string }) => string;
    labelTotalSteps: ({ totalStepCount }: { totalStepCount: string }) => string;
    labelLearnMoreExternalIcon: string;
  };
}
