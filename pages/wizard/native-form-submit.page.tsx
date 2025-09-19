// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Container, FormField, Header, Input, Wizard, WizardProps } from '~components';

import { i18nStrings } from './common';

export default function WizardPage() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [attemptedToSubmit, setAttemptedToSubmit] = useState(false);
  const [resultText, setResultText] = useState('');

  const steps: WizardProps['steps'] = [
    {
      title: 'Step 1',
      content: (
        <Container header={<Header>A container for step 1</Header>}>
          <FormField
            data-testid="first-name-form-field"
            key="1"
            label="First name (required)"
            description={'Enter your first name.'}
            errorText={attemptedToSubmit && value1.length < 1 ? 'This field cannot be left blank.' : undefined}
          >
            <Input data-testid="first-name-input" value={value1} onChange={e => setValue1(e.detail.value)} />
          </FormField>
        </Container>
      ),
    },
    {
      title: 'Step 2',
      content: (
        <Container header={<Header>A container for step 2</Header>}>
          <FormField
            data-testid="last-name-form-field"
            key="2"
            label="Last name"
            description={'Enter your last name.'}
            errorText={attemptedToSubmit && value2.length < 1 ? 'This field cannot be left blank.' : undefined}
          >
            <Input data-testid="last-name-input" value={value2} onChange={e => setValue2(e.detail.value)} />
          </FormField>
        </Container>
      ),
    },
  ];

  return (
    <>
      <div data-testid="result-text">{resultText}</div>
      <Wizard
        steps={steps}
        i18nStrings={i18nStrings}
        activeStepIndex={activeStepIndex}
        onNavigate={e => {
          setAttemptedToSubmit(true);
          if (value1.length < 1) {
            return;
          }
          setAttemptedToSubmit(false);
          setActiveStepIndex(e.detail.requestedStepIndex);
          setResultText(
            `Navigate action was called. Starting index: ${activeStepIndex}. Ending index: ${e.detail.requestedStepIndex}`
          );
        }}
        onSubmit={() => {
          setAttemptedToSubmit(true);
          if (value2.length < 1) {
            return;
          }
          setResultText('Submit action was called.');
        }}
        onCancel={() => {
          setResultText('Cancel action was called.');
        }}
      />
    </>
  );
}
