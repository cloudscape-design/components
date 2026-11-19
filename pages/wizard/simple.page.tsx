// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import Link from '~components/link';
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
