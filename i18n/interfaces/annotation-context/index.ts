// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface AnnotationContextI18n {
  i18nStrings: {
    finishButtonText: string;
    labelDismissAnnotation: string;
    labelHotspotOpen: string;
    labelHotspotClose: string;
    nextButtonText: string;
    previousButtonText: string;
    stepCounterText: ({ stepIndex, totalStepCount }: { stepIndex: string; totalStepCount: string }) => string;
    taskTitle: ({ taskIndex, taskTitle }: { taskIndex: string; taskTitle: string }) => string;
  };
}
