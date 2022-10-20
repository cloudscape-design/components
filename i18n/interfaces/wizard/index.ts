// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface WizardI18n {
  i18nStrings: {
    stepNumberLabel: ({ stepNumber }: { stepNumber: string }) => string;
    collapsedStepsLabel: ({ stepNumber, stepsCount }: { stepNumber: string; stepsCount: string }) => string;
    cancelButton: string;
    previousButton: string;
    nextButton: string;
    optional: string;
  };
}
