// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { i18nStrings } from './common';
import { Container, FormField, Header, Input, Link, Wizard, WizardProps } from '~components';

export default function WizardPage() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [value, setValue] = useState('');
  const [attemptedToSubmit, setAttemptedToSubmit] = useState(false);
  const [counter, setCounter] = useState(1);

  const steps: WizardProps['steps'] = [
    {
      title: 'Step 1',
      content: (
        <Container header={<Header>A container for step 1</Header>}>
          <FormField
            key="1"
            label="Form field in step 1"
            errorText={attemptedToSubmit && value.length > 4 ? 'The text must not be longer than 4 letters' : undefined}
            constraintText="Maximum length: 4 letters"
          >
            <Input value={value} onChange={e => setValue(e.detail.value)} />
          </FormField>
        </Container>
      ),
    },
    {
      title: 'Step 2',
      content: (
        <>
          <Container header={<Header>A container for step 2</Header>}>
            <FormField
              key="2"
              label="Form field in step 2"
              errorText={
                attemptedToSubmit && value.length > 4 ? 'The text must not be longer than 4 letters' : undefined
              }
              constraintText="Maximum length: 4 letters"
            >
              <Input value={value} onChange={e => setValue(e.detail.value)} />
            </FormField>
          </Container>
          <button onClick={() => setCounter(counter + 1)}>Add container</button>
          <button onClick={() => setCounter(counter - 1)}>Remove container</button>
          {Array.from(Array(counter).keys()).map(i => (
            <Container key={i} header={<Header>Another container for step 2</Header>}>
              This one is almost empty.
            </Container>
          ))}
        </>
      ),
    },
    {
      title: 'Step 3',
      info: <Link variant="info">Info</Link>,
      content: (
        <>
          {Array.from(Array(5).keys()).map(key => (
            <div key={key}>Item {key}</div>
          ))}
          <Container header={<Header>A container for step 3</Header>}>This one is almost empty.</Container>
          <Container header={<Header>A container for step 3</Header>}>This one is almost empty.</Container>
        </>
      ),
    },
  ];

  return (
    <Wizard
      steps={steps}
      i18nStrings={i18nStrings}
      activeStepIndex={activeStepIndex}
      onNavigate={e => {
        setAttemptedToSubmit(true);
        if (value.length > 4 && e.detail.requestedStepIndex > activeStepIndex) {
          return;
        }
        setAttemptedToSubmit(false);
        setActiveStepIndex(e.detail.requestedStepIndex);
      }}
    />
  );
}
