// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import {
  AppLayout,
  Box,
  Button,
  Container,
  ErrorBoundary,
  ExpandableSection,
  Form,
  Header,
  Popover,
  SpaceBetween,
} from '~components';
import I18nProvider from '~components/i18n';
import messages from '~components/i18n/messages/all.en';

import ScreenshotArea from '../utils/screenshot-area';

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <I18nProvider messages={[messages]} locale="en">
        <ErrorBoundary
          onError={error => console.log(`Error "${error.message.slice(0, 20)}… reported."`)}
          feedback={{ href: '#' }}
        >
          <AppLayout
            contentType="form"
            navigationHide={true}
            content={
              <Box>
                <h1>Error boundary demo: form</h1>
                <p>When an unexpected error occurs inside a form, it is no longer scoped to sections.</p>

                <Form
                  actions={
                    <SpaceBetween direction="horizontal" size="m">
                      <BrokenButton />
                    </SpaceBetween>
                  }
                >
                  <SpaceBetween size="m">
                    <Container header={<Header>Container 1</Header>}>
                      <BrokenButton />
                    </Container>

                    <Container header={<Header>Container 2</Header>}>
                      <Popover header="Header" content={<BrokenButton />} triggerType="custom">
                        <Button>Show popover</Button>
                      </Popover>
                    </Container>

                    <ExpandableSection
                      variant="container"
                      headerText="Expandable section"
                      headerActions={<BrokenButton />}
                      defaultExpanded={true}
                    >
                      <BrokenButton />
                    </ExpandableSection>
                  </SpaceBetween>
                </Form>
              </Box>
            }
          />
        </ErrorBoundary>
      </I18nProvider>
    </ScreenshotArea>
  );
}

function BrokenButton() {
  const [errorState, setErrorState] = useState(false);
  return <Button onClick={() => setErrorState(true)}>Broken button {errorState ? {} : ''}</Button>;
}
