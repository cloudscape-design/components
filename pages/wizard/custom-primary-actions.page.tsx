// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { SpaceBetween } from '~components';
import Button from '~components/button';
import Container from '~components/container';
import Header from '~components/header';
import Wizard, { WizardProps } from '~components/wizard';

import { i18nStrings } from './common';

const steps: WizardProps.Step[] = [
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
];

export default function WizardPage() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const onNext = () => {
    if (activeStepIndex >= steps.length) {
      return;
    }
    setActiveStepIndex(activeStepIndex + 1);
  };

  const onPrevious = () => {
    if (activeStepIndex <= 0) {
      return;
    }
    setActiveStepIndex(activeStepIndex - 1);
  };

  const onFinish = () => {
    alert('Finish');
  };

  const customPrimaryActions = (
    <SpaceBetween size="m" direction="horizontal">
      {activeStepIndex > 0 && (
        <Button variant="normal" onClick={onPrevious}>
          Custom Previous
        </Button>
      )}
      {activeStepIndex < steps.length - 1 && (
        <Button variant="primary" onClick={onNext}>
          Custom Next
        </Button>
      )}
      {activeStepIndex === steps.length - 1 && (
        <Button variant="primary" onClick={onFinish}>
          Custom Finish
        </Button>
      )}
    </SpaceBetween>
  );

  return (
    <Wizard
      id="wizard"
      steps={steps}
      i18nStrings={i18nStrings}
      allowSkipTo={true}
      activeStepIndex={activeStepIndex}
      onNavigate={e => setActiveStepIndex(e.detail.requestedStepIndex)}
      secondaryActions={activeStepIndex === 2 ? <Button>Save as draft</Button> : null}
      customPrimaryActions={customPrimaryActions}
    />
  );
}
