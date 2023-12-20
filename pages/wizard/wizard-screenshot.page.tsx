// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import repeat from 'lodash/repeat';
import Wizard, { WizardProps } from '~components/wizard';
import Link from '~components/link';
import ScreenshotArea from '../utils/screenshot-area';

import { i18nStrings } from './common';

const steps: WizardProps.Step[] = [
  {
    title: 'Step 1',
    content: 'Content 1',
    info: <Link variant="info">Info</Link>,
    errorText: 'Page error',
    isOptional: true,
    description: 'Description of the step',
  },
  {
    title: 'Step 2 - reallylongsteptitlewithoutspacestowraptonextline',
    content: (
      <>
        <p>{repeat('Really long text to wrap. ', 10)}</p>
        <p>{repeat('textwithoutspacestowrap', 10)}</p>
      </>
    ),
    isOptional: true,
  },
  {
    title: 'Step 3',
    content: 'Content 3',
  },
];

const skipToButtonLabel = (targetStep: WizardProps.Step) => `Skip to ${targetStep.title} Long Text`;

export default function WizardPage() {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  return (
    <div>
      <button
        id="next"
        onClick={() => {
          setActiveStepIndex(1);
        }}
      >
        Next
      </button>
      <ScreenshotArea>
        <Wizard
          activeStepIndex={activeStepIndex}
          steps={steps}
          i18nStrings={{ ...i18nStrings, nextButton: 'Next Button With Long Long Long Text', skipToButtonLabel }}
          isLoadingNextStep={activeStepIndex === 1}
          onNavigate={() => {}}
          allowSkipTo={true}
        />
      </ScreenshotArea>
    </div>
  );
}
