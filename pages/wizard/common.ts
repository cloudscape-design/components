// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { WizardProps } from '~components/wizard';

const i18nStrings: WizardProps.I18nStrings = {
  stepNumberLabel: stepNumber => `Step ${stepNumber}`,
  collapsedStepsLabel: (stepNumber, stepsCount) => `Step ${stepNumber} of ${stepsCount}`,
  skipToButtonLabel: step => `Skip to ${step.title}`,
  navigationAriaLabel: 'Steps',
  errorIconAriaLabel: 'Error',
  cancelButton: 'Cancel',
  previousButton: 'Previous',
  nextButton: 'Next',
  submitButton: 'Create',
  optional: 'optional',
  nextButtonLoadingAnnouncement: 'Loading next step',
  submitButtonLoadingAnnouncement: 'Submitting form',
};

export { i18nStrings };
