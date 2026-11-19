// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Wizard, { WizardProps } from '~components/wizard';

import { i18nStrings } from './common';

const StepContent = () => {
  const [counter, setCounter] = useState(0);
  return (
    <div>
      <div id="counter">{counter}</div>
      <button id="increase-counter" onClick={() => setCounter(counter + 1)}>
        Increase counter
      </button>
    </div>
  );
};

const steps: WizardProps.Step[] = [
  {
    title: 'Step 1',
    content: <StepContent />,
  },
];

export default function WizardPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <div>
      <button id="set-loading" onClick={() => setIsLoading(true)}>
        Set loading
      </button>
      <Wizard id="wizard" steps={steps} i18nStrings={i18nStrings} isLoadingNextStep={isLoading} />
    </div>
  );
}
