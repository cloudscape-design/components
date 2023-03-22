// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Wizard, { WizardProps } from '~components/wizard';
import Button from '~components/button';
import Link from '~components/link';
import styles from '../wizard/styles.scss';
import { useHistory } from 'react-router-dom';
import { AppLayout, BreadcrumbGroup, Container, FormField, Header, Input, SpaceBetween, Toggle } from '~components';

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
};

export default function WizardPage() {
  const history = useHistory();
  const [nameTag, setNameTag] = useState('');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [checked, setChecked] = useState(false);

  const handleNavigation = () => {
    history.push('/');
  };
  return (
    <AppLayout
      contentType="wizard"
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'EKS', href: '#' },
            { text: 'Clusters', href: '#clusters' },
            { text: 'Create EKS cluster', href: '#clusters/create' },
          ]}
        />
      }
      content={
        <Wizard
          data-analytics-funnel="Create EKS cluster"
          steps={[
            {
              title: 'Configure cluster',
              content: (
                <SpaceBetween direction="vertical" size="l">
                  <Container header={<Header variant="h2">VPC settings</Header>}>
                    <SpaceBetween direction="vertical" size="l">
                      <FormField
                        label="Name tag"
                        description="Enter a unique name for this cluster. This property cannot be changed after the cluster is created"
                        constraintText="The cluster name should begin with letter or digit can have up to 32 letters, digits, or hyphens."
                      >
                        <Input
                          placeholder="Type name"
                          value={nameTag}
                          onChange={(event: { detail: { value: any } }) => setNameTag(event.detail.value)}
                        />
                      </FormField>
                      <FormField
                        label="Kubernetes versioon"
                        description="Select the Kubernetes version for the cluster"
                        constraintText="The cluster name should begin with letter or digit can have up to 32 letters, digits, or hyphens."
                      >
                        <Input
                          placeholder="Type name"
                          value={nameTag}
                          onChange={(event: { detail: { value: any } }) => setNameTag(event.detail.value)}
                        />
                      </FormField>
                    </SpaceBetween>
                  </Container>
                  <Container
                    header={
                      <Header
                        variant="h2"
                        description="Once turned on, secerets encryption cannot be modified or removed"
                      >
                        Secrets encryption
                      </Header>
                    }
                  >
                    <SpaceBetween direction="vertical" size="l">
                      <FormField>
                        <Toggle onChange={({ detail }) => setChecked(detail.checked)} checked={checked}>
                          Turn on envelope encryption of Kubernetes secrets using KMS
                        </Toggle>
                      </FormField>
                    </SpaceBetween>
                  </Container>
                </SpaceBetween>
              ),
            },
            {
              title: 'Specify networking',
              content: (
                <div className={styles['step-content']}>
                  <div id="content-text">Content 2</div>
                </div>
              ),
            },
            {
              title: 'Configure logging',
              info: <Link variant="info">Info</Link>,
              content: (
                <div className={styles['step-content']}>
                  {Array.from(Array(15).keys()).map(key => (
                    <div key={key} className={styles['content-item']}>
                      Item {key}
                    </div>
                  ))}
                </div>
              ),
            },
          ]}
          i18nStrings={i18nStrings}
          activeStepIndex={activeStepIndex}
          onNavigate={e => setActiveStepIndex(e.detail.requestedStepIndex)}
          secondaryActions={activeStepIndex === 2 ? <Button>Save as draft</Button> : null}
          onCancel={handleNavigation}
          onSubmit={handleNavigation}
        />
      }
    />
  );
}
