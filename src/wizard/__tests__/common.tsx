// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Container from '../../../lib/components/container';
import Header from '../../../lib/components/header';
import { WizardProps } from '../interfaces';

export const DEFAULT_I18N_SETS = [
  {
    stepNumberLabel: stepNumber => `Step ${stepNumber}`,
    collapsedStepsLabel: (stepNumber, stepsCount) => `Step ${stepNumber} of ${stepsCount}`,
    skipToButtonLabel: (step: WizardProps.Step, stepNumber) => `Skip to ${step.title}(${stepNumber})`,
    navigationAriaLabel: 'Steps',
    cancelButton: 'Cancel',
    previousButton: 'Previous',
    nextButton: 'Next',
    submitButton: 'Create record',
    optional: 'optional',
    nextButtonLoadingAnnouncement: 'Loading next step',
    submitButtonLoadingAnnouncement: 'Submitting form',
  },
  {
    stepNumberLabel: stepNumber => `第 ${stepNumber} 步`,
    collapsedStepsLabel: (stepNumber, stepsCount) => `第 ${stepNumber} 步 / 共 ${stepsCount} 步`,
    navigationAriaLabel: 'Steps',
    cancelButton: '取消',
    previousButton: '上一步',
    nextButton: '下一步',
    submitButton: '提交',
    optional: '視需要',
    nextButtonLoadingAnnouncement: 'Lade nächsten Schritt',
    submitButtonLoadingAnnouncement: 'Schicke Formular ab',
  },
] as ReadonlyArray<WizardProps.I18nStrings>;

export const DEFAULT_STEPS = [
  {
    title: 'Step 1',
    content: (
      <>
        <Container header={<Header>Step 1, substep one</Header>}></Container>
        <Container header={<Header>Step 1, substep two</Header>}></Container>
      </>
    ),
  },
  {
    title: 'Step 2',
    content: (
      <>
        <Container header={<Header>Step 2, substep one</Header>}></Container>
        <Container header={<Header>Step 2, substep two</Header>}></Container>
      </>
    ),
    isOptional: true,
  },
  {
    title: 'Step 3',
    content: (
      <>
        <Container header={<Header>Step 3, substep one</Header>}></Container>
        <Container header={<Header>Step 3, substep two</Header>}></Container>
      </>
    ),
  },
] as ReadonlyArray<WizardProps.Step>;
