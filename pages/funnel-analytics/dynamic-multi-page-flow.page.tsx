// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Wizard, { WizardProps } from '~components/wizard';

import { i18nStrings } from '../wizard/common';
import Container from '~components/container';
import Header from '~components/header';
import Link from '~components/link';
import { Button, SpaceBetween } from '~components';

export default function WizardPage() {
  const [subStepCount1, setSubStepCount1] = useState(2);
  const [subStepCount2, setSubStepCount2] = useState(7);

  const steps: WizardProps.Step[] = [
    {
      title: 'Step 1',
      info: <Link variant="info">Info</Link>,
      content: (
        <div>
          <SpaceBetween size="l">
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={() => setSubStepCount1(c => c + 1)}>Increase substep count</Button>
              <Button onClick={() => setSubStepCount1(c => c - 1)}>Decrease substep count</Button>
            </SpaceBetween>

            {Array(subStepCount1)
              .fill(0)
              .map((_, i) => (
                <Container key={i} header={<Header>A container in step 1 for substep {i + 1}</Header>}>
                  This is a text on the substep level
                </Container>
              ))}
          </SpaceBetween>
        </div>
      ),
    },
    {
      title: 'Step 2',
      content: (
        <div>
          <SpaceBetween size="l">
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={() => setSubStepCount2(c => c + 1)}>Increase substep count</Button>
              <Button onClick={() => setSubStepCount2(c => c - 1)}>Decrease substep count</Button>
            </SpaceBetween>

            {Array(subStepCount2)
              .fill(0)
              .map((_, i) => (
                <Container key={i} header={<Header>A container in step 2 for substep {i + 1}</Header>}>
                  This is a text on the substep level
                </Container>
              ))}
          </SpaceBetween>
        </div>
      ),
    },
  ];

  return <Wizard steps={steps} i18nStrings={i18nStrings} />;
}
