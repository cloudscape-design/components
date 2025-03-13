// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { useHistory } from 'react-router';

import {
  AppLayout,
  BreadcrumbGroup,
  Button,
  Container,
  FormField,
  Header,
  Input,
  Link,
  SpaceBetween,
  Wizard,
} from '~components';

import { withFunnelTestingApi } from './components/funnel-testing-page';

function Content() {
  const history = useHistory();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState([
    {
      analyticsMetadata: {
        instanceIdentifier: 'my-custom-first-step',
      },
      title: 'Choose instance type',
      info: <Link variant="info">Info</Link>,
      description:
        'Each instance type includes one or more instance sizes, allowing you to scale your resources to the requirements of your target workload.',
      content: (
        <SpaceBetween size="l">
          <Container header={<Header variant="h2">Static container header</Header>}>
            <SpaceBetween direction="vertical" size="l">
              <FormField label="First field">
                <Input value="" />
              </FormField>
              <FormField label="Second field">
                <Input value="" />
              </FormField>
            </SpaceBetween>
          </Container>
          <DynamicStepContent />
        </SpaceBetween>
      ),
    },
    {
      title: 'Add storage',
      content: (
        <Container header={<Header variant="h2">Form container header</Header>}>
          <SpaceBetween direction="vertical" size="l">
            <FormField label="First field">
              <Input value="" />
            </FormField>
            <FormField label="Second field">
              <Input value="" />
            </FormField>
          </SpaceBetween>
        </Container>
      ),
      isOptional: true,
    },
  ]);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      history.push('/');
    }, 2000);
  };

  const handleCancel = () => {
    history.push('/');
  };

  const addStep = () => {
    const newStep = {
      title: `New step ${steps.length + 1}`,
      isOptional: true,
      content: (
        <Container header={<Header variant="h2">{`Step ${steps.length + 1} Container`}</Header>}>
          <FormField label="New field">
            <Input value="" />
          </FormField>
        </Container>
      ),
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = () => {
    if (steps.length > 1) {
      setSteps(steps.slice(0, -1));
    }
  };

  return (
    <SpaceBetween size="l">
      <Wizard
        analyticsMetadata={{
          instanceIdentifier: 'my-custom-creation',
          flowType: 'create',
        }}
        secondaryActions={
          <SpaceBetween direction="horizontal" size="s">
            <Button onClick={addStep}>Add Step</Button>
            <Button onClick={removeStep} disabled={steps.length === 1}>
              Remove Last Step
            </Button>
          </SpaceBetween>
        }
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoadingNextStep={loading}
        i18nStrings={{
          stepNumberLabel: stepNumber => `Step ${stepNumber}`,
          collapsedStepsLabel: (stepNumber, stepsCount) => `Step ${stepNumber} of ${stepsCount}`,
          skipToButtonLabel: step => `Skip to ${step.title}`,
          navigationAriaLabel: 'Steps',
          cancelButton: 'Cancel',
          previousButton: 'Previous',
          nextButton: 'Next',
          submitButton: 'Launch instance',
          optional: 'optional',
        }}
        onNavigate={({ detail }) => setActiveStepIndex(detail.requestedStepIndex)}
        activeStepIndex={activeStepIndex}
        allowSkipTo={true}
        steps={steps}
      />
    </SpaceBetween>
  );
}

function DynamicStepContent() {
  const [containerCount, setContainerCount] = useState(0);

  const addContainer = () => {
    setContainerCount(containerCount + 1); // Increment the container count
  };

  return (
    <SpaceBetween size="l">
      {[...Array(containerCount)].map((_, index) => (
        <Container key={index} header={<Header variant="h2">{`Dynamic Container ${index + 1}`}</Header>}>
          <SpaceBetween size="s">
            <FormField label={`Field ${index + 1}`}>
              <Input value="" />
            </FormField>
          </SpaceBetween>
        </Container>
      ))}
      <SpaceBetween direction="horizontal" size="s">
        <Button onClick={addContainer}>Add Container</Button>
      </SpaceBetween>
    </SpaceBetween>
  );
}

function App() {
  return (
    <AppLayout
      contentType="wizard"
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'System', href: '#' },
            { text: 'Components', href: '#components' },
            { text: 'Create component', href: '#components/create' },
          ]}
          ariaLabel="Breadcrumbs"
        />
      }
      content={<Content />}
    />
  );
}

export default withFunnelTestingApi(App);
