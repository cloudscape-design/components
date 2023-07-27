// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Wizard, { WizardProps } from '~components/wizard';

import { i18nStrings } from '../wizard/common';
import Alert from '~components/alert';
import Container from '~components/container';
import Header from '~components/header';
import Link from '~components/link';

export default function WizardPage() {
  const [errorMode, setErrorMode] = useState(0);

  const steps: WizardProps.Step[] = [
    {
      title: 'Step 1',
      info: <Link variant="info">Info</Link>,
      content: (
        <div>
          <div>Content 1</div>
          <div>{errorMode === 1 && <Alert type="error">This is an error on the step level</Alert>}</div>
          <div>
            {errorMode === 2 && (
              <Container header={<Header>A container around the alert</Header>}>
                <Alert type="error">This is an error on the substep level</Alert>
              </Container>
            )}
          </div>
          <div>
            {errorMode === 3 && (
              <>
                <Alert type="error">This is an error on the step level</Alert>
                <Container header={<Header>A container around the alert</Header>}>
                  <Alert type="error">This is an error on the substep level</Alert>
                </Container>
              </>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Step 2',
      content: <div>Content 2</div>,
    },
  ];

  return (
    <Wizard
      steps={steps}
      i18nStrings={i18nStrings}
      activeStepIndex={0}
      onNavigate={() => setErrorMode((errorMode + 1) % 4)}
    />
  );
}
