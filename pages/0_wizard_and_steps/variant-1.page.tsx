// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import {
  AppLayout,
  Box,
  Checkbox,
  Container,
  Drawer,
  FormField,
  Header,
  Select,
  SpaceBetween,
  StatusIndicatorProps,
  Steps,
} from '~components';
import Button from '~components/button';
import I18nProvider from '~components/i18n';
import messages from '~components/i18n/messages/all.en';
import Wizard from '~components/wizard';

import { i18nStrings as wizardI18nStrings } from '../wizard/common';
import { StepDescription, StepHeader } from './common/steps-components';

const stepsMetadata = [
  { title: 'Step 1: Workflow overview', subtitle: 'Review step progress' },
  { title: 'Step 2: Select EC2 instance', subtitle: 'Create or choose target EC2 instance' },
  { title: 'Step 3: Select S3 bucket', subtitle: 'Pick S3 bucket access' },
  { title: 'Step 4: Configure IAM role', subtitle: 'Set permissions and policies' },
  { title: 'Step 5: Updated S3 bucket policy', subtitle: 'Configure bucket access rules' },
  { title: 'Step 6: Updated KMS key policy', subtitle: 'Set encryption permissions based on the S3 bucket selection' },
];

const statusOptions = [{ value: 'success' }, { value: 'in-progress' }, { value: 'pending' }, { value: 'error' }];

interface StateSettings {
  status: StatusIndicatorProps.Type;
  isNew: boolean;
}

export default function WizardPage() {
  const [activeStepIndex, setActiveStepIndex] = useState(3);
  const [stepStates, setStepStates] = useState<StateSettings[]>([
    { status: 'success', isNew: false },
    { status: 'error', isNew: false },
    { status: 'success', isNew: false },
    { status: 'in-progress', isNew: false },
    { status: 'pending', isNew: false },
    { status: 'pending', isNew: true },
  ]);
  const changeStepSettings = (index: number, settings: (prev: StateSettings) => StateSettings) => {
    setStepStates(prev => {
      const copy = [...prev];
      copy[index] = settings(copy[index]);
      return copy;
    });
  };
  const changeStepStatus = (index: number, status: StatusIndicatorProps.Type) =>
    changeStepSettings(index, prev => ({ ...prev, status }));
  const changeStepNew = (index: number, isNew: boolean) => changeStepSettings(index, prev => ({ ...prev, isNew }));
  const getStatusProps = (status: StatusIndicatorProps.Type) => {
    switch (status) {
      case 'success':
        return { status: 'success', statusIconAriaLabel: 'success' } as const;
      case 'in-progress':
        return { status: 'in-progress', statusIconAriaLabel: 'in progress', statusColorOverride: 'blue' } as const;
      case 'pending':
        return { status: 'pending', statusIconAriaLabel: 'pending' } as const;
      case 'error':
      default:
        return { status: 'error', statusIconAriaLabel: 'error' } as const;
    }
  };
  const steps = stepsMetadata.map((_, index) => {
    const { title, subtitle } = stepsMetadata[index];
    const { status, isNew } = stepStates[index];
    const statusProps = getStatusProps(status);
    return {
      title,
      ...statusProps,
      header: (
        <StepHeader
          visited={status === 'success' || status === 'error'}
          active={activeStepIndex === index}
          onClick={() => setActiveStepIndex(index)}
          isNew={isNew}
        >
          {title}
        </StepHeader>
      ),
      details: <StepDescription>{subtitle}</StepDescription>,
      content: (
        <SpaceBetween size="s">
          <Container>
            <div style={{ height: 400 }}>Content {index + 1}</div>
          </Container>
        </SpaceBetween>
      ),
    };
  });

  const [activeDrawerId, setActiveDrawerId] = useState<null | string>('settings');
  return (
    <I18nProvider messages={[messages]} locale="en">
      <AppLayout
        navigationHide={true}
        activeDrawerId={activeDrawerId}
        onDrawerChange={({ detail }) => setActiveDrawerId(detail.activeDrawerId)}
        drawers={[
          {
            id: 'settings',
            content: (
              <Drawer header={<Header variant="h2">Steps settings</Header>}>
                <SpaceBetween size="m">
                  {stepsMetadata.map(({ title }, index) => (
                    <FormField key={title} label={`Step ${index + 1} settings`}>
                      <SpaceBetween size="xs">
                        <Select
                          options={statusOptions}
                          selectedOption={statusOptions.find(o => o.value === stepStates[index].status)!}
                          onChange={({ detail }) =>
                            changeStepStatus(index, detail.selectedOption.value as StatusIndicatorProps.Type)
                          }
                        ></Select>

                        <Checkbox
                          checked={stepStates[index].isNew}
                          onChange={({ detail }) => changeStepNew(index, detail.checked)}
                        >
                          New
                        </Checkbox>
                      </SpaceBetween>
                    </FormField>
                  ))}
                </SpaceBetween>
              </Drawer>
            ),
            trigger: { iconName: 'settings' },
            ariaLabels: {
              drawerName: 'Steps settings',
              triggerButton: 'Open steps settings',
              closeButton: 'Close steps settings',
            },
          },
        ]}
        contentType="wizard"
        content={
          <Wizard
            id="wizard"
            steps={steps}
            i18nStrings={wizardI18nStrings}
            activeStepIndex={activeStepIndex}
            onNavigate={e => setActiveStepIndex(e.detail.requestedStepIndex)}
            secondaryActions={activeStepIndex === 2 ? <Button>Save as draft</Button> : null}
            customNavigationSide={
              <Box>
                <Steps steps={steps} />
              </Box>
            }
            customNavigationTop={<Box>Custom nav top!</Box>}
          />
        }
      />
    </I18nProvider>
  );
}
