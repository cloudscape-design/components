// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Checkbox, NonCancelableCustomEvent, SpaceBetween } from '~components';
import Box from '~components/box';
import Wizard, { WizardProps } from '~components/wizard';

import { i18nStrings } from './common';

import styles from './styles.scss';

const steps: WizardProps.Step[] = [
  {
    title: 'Step 1',
    content: (
      <div className={styles['step-content']}>
        <div id="content-text">Content 1</div>
      </div>
    ),
  },
  {
    title: 'Step 2',
    content: (
      <div className={styles['step-content']}>
        <div id="content-text">Content 2</div>
      </div>
    ),
  },
  {
    title: 'Step 3',
    content: (
      <div className={styles['step-content']}>
        <div id="content-text">Content 3</div>
      </div>
    ),
  },
  {
    title: 'Step 4',
    content: (
      <div className={styles['step-content']}>
        <div id="content-text">Content 4</div>
      </div>
    ),
  },
  {
    title: 'Step 5',
    content: (
      <div className={styles['step-content']}>
        <div id="content-text">Content 5</div>
      </div>
    ),
  },
];

const skipToButtonLabel = (targetStep: WizardProps.Step, targetStepNumber: number) =>
  targetStepNumber === 5 ? 'Skip to end' : `Skip to ${targetStep.title}`;

export default function WizardPage() {
  const [allowSkipTo, setAllowSkipTo] = useState(true);
  const [requiredSteps, setRequiredSteps] = useState<{ [key: string]: boolean }>({});
  const [eventLog, setEventLog] = useState<WizardProps.NavigateDetail[]>([]);

  return (
    <Box margin="xxxl">
      <SpaceBetween direction="vertical" size="m">
        <SpaceBetween direction="horizontal" size="m">
          <Checkbox id="allow-skip-to" checked={allowSkipTo} onChange={e => setAllowSkipTo(e.detail.checked)}>
            Allow skipping through steps
          </Checkbox>

          {steps.map((step, index) => (
            <Checkbox
              key={step.title}
              id={`step-${index + 1}-optional`}
              checked={!!requiredSteps[step.title]}
              onChange={e => setRequiredSteps(prev => ({ ...prev, [step.title]: e.detail.checked }))}
            >
              {step.title} required
            </Checkbox>
          ))}
        </SpaceBetween>

        <Wizard
          id="wizard"
          steps={steps.map(step => ({ ...step, isOptional: !requiredSteps[step.title] }))}
          i18nStrings={{ ...i18nStrings, skipToButtonLabel }}
          allowSkipTo={allowSkipTo}
          onCancel={() => alert('Cancelled!')}
          onSubmit={() => alert('Created!')}
          onNavigate={(event: NonCancelableCustomEvent<WizardProps.NavigateDetail>) =>
            setEventLog(prev => [...prev, event.detail])
          }
        />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {eventLog.map((event, index) => (
            <div key={index}>
              {event.requestedStepIndex} - {event.reason}
            </div>
          ))}
        </div>
      </SpaceBetween>
    </Box>
  );
}
