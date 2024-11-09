// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Container from '~components/container';
import FormField from '~components/form-field';
import Header from '~components/header';
import Input from '~components/input';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import Wizard, { WizardProps } from '~components/wizard';

import { i18nStrings } from '../../wizard/common';

import styles from '../../wizard/styles.scss';

interface WizardFlowProps {
  onUnmount?: () => void;
}

export function WizardFlow({ onUnmount }: WizardFlowProps) {
  const [value, setValue] = useState('');
  const [value2, setValue2] = useState('');
  const [value3, setValue3] = useState('');
  const [value4, setValue4] = useState('');

  const [errorText, setErrorText] = useState('');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const steps: WizardProps.Step[] = [
    {
      title: 'Step 1',
      errorText,
      content: (
        <SpaceBetween size="s">
          <Container
            header={<Header>Container 1 - header</Header>}
            analyticsMetadata={{
              instanceIdentifier: 'step1-container1',
            }}
          >
            <SpaceBetween size="s">
              <FormField
                info={
                  <Link data-testid="external-link" external={true} href="#">
                    Learn more
                  </Link>
                }
                errorText={value === 'error' ? 'Trigger error' : ''}
                label="Field 1"
              >
                <Input
                  data-testid="field1"
                  value={value}
                  onChange={event => {
                    setValue(event.detail.value);
                  }}
                />
              </FormField>
              <FormField label="Field 2">
                <Input
                  data-testid="field2"
                  value={value2}
                  onChange={event => {
                    setValue2(event.detail.value);
                  }}
                />
              </FormField>
            </SpaceBetween>
          </Container>
          <Container
            header={<Header>Container 2 - header</Header>}
            analyticsMetadata={{ instanceIdentifier: 'step1-container2' }}
          >
            <SpaceBetween size="s">
              <FormField label="Field 3">
                <Input
                  data-testid="field3"
                  value={value3}
                  onChange={event => {
                    setValue3(event.detail.value);
                  }}
                />
              </FormField>
              <FormField label="Field 4">
                <Input
                  data-testid="field4"
                  value={value4}
                  onChange={event => {
                    setValue4(event.detail.value);
                  }}
                />
              </FormField>
            </SpaceBetween>
          </Container>
        </SpaceBetween>
      ),
      analyticsMetadata: { instanceIdentifier: 'step-1' },
    },
    {
      title: 'Step 2',
      isOptional: true,
      errorText,
      content: (
        <div className={styles['step-content']}>
          <div id="content-text">Content 2</div>
        </div>
      ),
      analyticsMetadata: { instanceIdentifier: 'step-2' },
    },
    {
      title: 'Step 3',
      info: <Link variant="info">Info</Link>,
      errorText: 'Simulated final step error',
      content: (
        <div className={styles['step-content']}>
          {Array.from(Array(15).keys()).map(key => (
            <div key={key} className={styles['content-item']}>
              Item {key}
            </div>
          ))}
        </div>
      ),
      analyticsMetadata: { instanceIdentifier: 'step-3' },
    },
  ];

  return (
    <Wizard
      analyticsMetadata={{
        instanceIdentifier: 'multi-page-demo',
        flowType: 'create',
      }}
      i18nStrings={i18nStrings}
      steps={steps}
      activeStepIndex={activeStepIndex}
      onNavigate={e => {
        if (value === 'error') {
          setErrorText('There is an error');
        } else {
          setErrorText('');
          setActiveStepIndex(e.detail.requestedStepIndex);
        }
      }}
      onCancel={onUnmount}
      onSubmit={onUnmount}
    />
  );
}
