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
];

export default function WizardPage() {
  const [allowNonLinearNavigation, setAllowNonLinearNavigation] = useState(true);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [eventLog, setEventLog] = useState<WizardProps.NavigateDetail[]>([]);

  return (
    <Box margin="xxxl">
      <SpaceBetween direction="vertical" size="m">
        <Checkbox
          id="allow-non-linear-navigation"
          checked={allowNonLinearNavigation}
          onChange={e => setAllowNonLinearNavigation(e.detail.checked)}
        >
          Allow non-linear navigation (jump directly to any step)
        </Checkbox>

        <Wizard
          id="wizard"
          steps={steps}
          i18nStrings={i18nStrings}
          activeStepIndex={activeStepIndex}
          allowNonLinearNavigation={allowNonLinearNavigation}
          onCancel={() => alert('Cancelled!')}
          onSubmit={() => alert('Created!')}
          onNavigate={(event: NonCancelableCustomEvent<WizardProps.NavigateDetail>) => {
            setActiveStepIndex(event.detail.requestedStepIndex);
            setEventLog(prev => [...prev, event.detail]);
          }}
        />

        <div id="event-log" style={{ display: 'flex', flexDirection: 'column' }}>
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
