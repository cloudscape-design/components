// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { WizardProps } from '~components/wizard';

const i18nStrings: WizardProps.I18nStrings = {
  stepNumberLabel: stepNumber => `Step ${stepNumber}`,
  collapsedStepsLabel: (stepNumber, stepsCount) => `Step ${stepNumber} of ${stepsCount}`,
  skipToButtonLabel: step => `Skip to ${step.title}`,
  cancelButton: 'Cancel',
  previousButton: 'Previous',
  nextButton: 'Next',
  submitButton: 'Create',
  optional: 'optional',
};

export { i18nStrings };
