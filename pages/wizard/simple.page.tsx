// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Wizard, { WizardProps } from '~components/wizard';
import Toggle from '~components/toggle';
import Button from '~components/button';
import styles from './styles.scss';

import { i18nStrings } from './common';

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
];

export default function WizardPage() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [scrollableContainer, setScrollableContainer] = useState<boolean>(false);
  return (
    <div>
      <Toggle
        checked={scrollableContainer}
        ariaLabel={'toggle'}
        onChange={({ detail }) => setScrollableContainer(detail.checked)}
      />
      <input id="focus-reset" aria-label="input" />
      <div id="scrollable-container" className={scrollableContainer ? styles['scrollable-container'] : ''}>
        <Wizard
          id="wizard"
          steps={steps}
          i18nStrings={i18nStrings}
          activeStepIndex={activeStepIndex}
          onNavigate={e => setActiveStepIndex(e.detail.requestedStepIndex)}
          secondaryActions={activeStepIndex === 2 ? <Button>Save as draft</Button> : null}
        />
      </div>
    </div>
  );
}
