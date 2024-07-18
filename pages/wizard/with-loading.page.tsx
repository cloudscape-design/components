// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Toggle from '~components/toggle';
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
    isOptional: true,
    content: (
      <div className={styles['step-content']}>
        <div id="content-text">Content 3</div>
      </div>
    ),
  },
  {
    title: 'Step 4',
    isOptional: true,
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

export default function WizardPage() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [simulateApiCall, setSimulateApiCall] = useState(true);
  const [loadingNextStep, setLoadingNextStep] = useState(false);
  return (
    <div>
      <div style={{ padding: 20 }}>
        <Toggle checked={simulateApiCall} onChange={e => setSimulateApiCall(e.detail.checked)}>
          Simulate slow API call when clicking &quot;Next&quot;
        </Toggle>
        <Toggle checked={loadingNextStep} onChange={e => setLoadingNextStep(e.detail.checked)}>
          Is loading next step
        </Toggle>
      </div>

      <div style={{ maxWidth: 900, margin: '20px auto 0' }}>
        <Wizard
          steps={steps}
          isLoadingNextStep={loadingNextStep}
          allowSkipTo={true}
          i18nStrings={i18nStrings}
          activeStepIndex={activeStepIndex}
          onNavigate={e => {
            if (e.detail.reason === 'next' && simulateApiCall) {
              setLoadingNextStep(true);
              setTimeout(() => {
                setActiveStepIndex(e.detail.requestedStepIndex);
                setLoadingNextStep(false);
              }, 2000);
            } else {
              setActiveStepIndex(e.detail.requestedStepIndex);
            }
          }}
        />
      </div>
    </div>
  );
}
