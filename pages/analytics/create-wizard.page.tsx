// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import {
  AppLayout,
  BreadcrumbGroup,
  Button,
  Container,
  FormField,
  Header,
  Input,
  KeyValuePairs,
  Link,
  SpaceBetween,
  Wizard,
} from '~components';

function Content() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleCancel = () => {};

  return (
    <Wizard
      analyticsMetadata={{
        instanceIdentifier: 'my-custom-creation',
        flowType: 'create',
      }}
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
      steps={[
        {
          analyticsMetadata: {
            instanceIdentifier: 'my-custom-first-step',
          },
          title: 'Choose instance type',
          info: <Link variant="info">Info</Link>,
          description:
            'Each instance type includes one or more instance sizes, allowing you to scale your resources to the requirements of your target workload.',
          content: (
            <SpaceBetween direction="vertical" size="l">
              <Container header={<Header variant="h2">Section 1</Header>}>
                <SpaceBetween direction="vertical" size="l">
                  <FormField label="First field">
                    <Input value="" />
                  </FormField>
                  <FormField label="Second field">
                    <Input value="" />
                  </FormField>
                </SpaceBetween>
              </Container>
              <Container header={<Header variant="h2">Section 2</Header>}>
                <SpaceBetween direction="vertical" size="l">
                  <FormField label="Third field">
                    <Input value="" />
                  </FormField>
                  <FormField label="Forth field">
                    <Input value="" />
                  </FormField>
                </SpaceBetween>
              </Container>
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
        {
          title: 'Configure security group',
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
        {
          analyticsMetadata: {
            instanceIdentifier: 'my-custom-last-step',
          },
          title: 'Review and launch',
          content: (
            <SpaceBetween size="xs">
              <Header variant="h3" actions={<Button onClick={() => setActiveStepIndex(0)}>Edit</Button>}>
                Step 1: Instance type
              </Header>
              <Container header={<Header variant="h2">Container title</Header>}>
                <KeyValuePairs
                  columns={2}
                  items={[
                    {
                      label: 'First field',
                      value: 'Value',
                    },
                    {
                      label: 'Second Field',
                      value: 'Value',
                    },
                  ]}
                />
              </Container>
            </SpaceBetween>
          ),
        },
      ]}
    />
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

export default App;
