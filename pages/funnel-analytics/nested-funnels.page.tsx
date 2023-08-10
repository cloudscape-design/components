// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { i18nStrings } from '../wizard/common';

import {
  Box,
  BreadcrumbGroup,
  Form,
  Wizard,
  WizardProps,
  Input,
  Container,
  Header,
  SpaceBetween,
  FormField,
} from '~components';

export default function WizardPage() {
  const steps: WizardProps.Step[] = [
    {
      title: 'Step 1',
      content: (
        <SpaceBetween size="l" key="step 1">
          <div>content</div>
          <Form>
            <Container>
              This page contains funnels nested inside funnels. The code automatically deduplicates them.
            </Container>
          </Form>
          <Form>
            <Container header={<Header>Header</Header>}>
              <Container header={<Header>Another header</Header>}>
                <Form>
                  Here is a substep nested inside a substep.
                  <FormField label="An input field">
                    <Input readOnly={true} value="" />
                  </FormField>
                </Form>
              </Container>
            </Container>
          </Form>
        </SpaceBetween>
      ),
    },
    {
      title: 'Step 2',
      content: (
        <SpaceBetween size="l" key="step 2">
          <Form>
            <Container>
              This page contains funnels nested inside funnels. The code automatically deduplicates them.
            </Container>
          </Form>
          <Form>
            <Container header={<Header>Header</Header>}>
              <Container header={<Header>Another header</Header>}>
                <Form>
                  Here is a substep nested inside a substep.
                  <FormField label="An input field">
                    <Input readOnly={true} value="" />
                  </FormField>
                </Form>
              </Container>
            </Container>
          </Form>
        </SpaceBetween>
      ),
    },
  ];

  return (
    <Box padding="xl">
      <Form>
        <SpaceBetween size="xxl">
          <BreadcrumbGroup
            items={[
              { text: 'Resources', href: '#example-link' },
              { text: 'Create resource', href: '#example-link' },
            ]}
            onFollow={e => e.preventDefault()}
          />

          <Form>
            <Wizard steps={steps} i18nStrings={i18nStrings} activeStepIndex={0} onNavigate={() => {}} />
          </Form>
        </SpaceBetween>
      </Form>
    </Box>
  );
}
