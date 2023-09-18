// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Container from '~components/container';
import Header from '~components/header';
import { Box, BreadcrumbGroup, Button, Form, SpaceBetween } from '~components';

export default function WizardPage() {
  const [containerCount, setContainerCount] = useState(2);

  return (
    <Box padding="xl">
      <SpaceBetween size="xxl">
        <BreadcrumbGroup
          items={[
            { text: 'Resources', href: '#example-link' },
            { text: 'Create resource', href: '#example-link' },
          ]}
          onFollow={e => e.preventDefault()}
        />

        <Form header={<Header variant="h1">A form with dynamic substeps</Header>}>
          <SpaceBetween size="l">
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={() => setContainerCount(c => c + 1)}>Increase substep count</Button>
              <Button onClick={() => setContainerCount(c => c - 1)} disabled={containerCount <= 0}>
                Decrease substep count
              </Button>
            </SpaceBetween>

            {Array(containerCount)
              .fill(0)
              .map((_, i) => (
                <Container key={i} header={<Header>A container for substep {i + 1}</Header>}>
                  This is a text on the substep level
                </Container>
              ))}
          </SpaceBetween>
        </Form>
      </SpaceBetween>
    </Box>
  );
}
