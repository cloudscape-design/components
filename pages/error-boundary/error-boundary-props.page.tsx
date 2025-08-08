// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Box, Container, ErrorBoundary, ErrorBoundaryProps, SpaceBetween } from '~components';
import I18nProvider from '~components/i18n';
import messages from '~components/i18n/messages/all.en';

import { SimplePage } from '../app/templates';
import ScreenshotArea from '../utils/screenshot-area';

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <I18nProvider messages={[messages]} locale="en">
        <SimplePage title="Error boundary props">
          <SpaceBetween size="m">
            <Container header={<Box variant="h3">Built-in i18n</Box>}>
              <SpaceBetween size="s">
                <ErrorBoundaryFallback title="No props" />
                <ErrorBoundaryFallback title="Feedback href" feedback={{ href: '#' }} />
                <ErrorBoundaryFallback
                  title="Feedback on-click"
                  feedback={{ onClick: () => console.log('feedback clicked') }}
                />
              </SpaceBetween>
            </Container>

            <Container header={<Box variant="h3">I18n messages</Box>}>
              <SpaceBetween size="s">
                <ErrorBoundaryFallback
                  title="Without feedback"
                  i18nStrings={{
                    headerText: 'Error header',
                    descriptionText: () => 'Error description',
                    refreshActionText: 'Refresh action',
                  }}
                />

                <ErrorBoundaryFallback
                  title="With feedback"
                  i18nStrings={{
                    headerText: 'Error header',
                    descriptionText: feedbackAction => `Error description ${feedbackAction}`,
                    feedbackActionText: 'feedback action',
                    refreshActionText: 'Refresh action',
                  }}
                  feedback={{ href: 'feedback link' }}
                />
              </SpaceBetween>
            </Container>

            <Container header={<Box variant="h3">Custom content</Box>}>
              <SpaceBetween size="s">
                <ErrorBoundaryFallback
                  title="With action"
                  fallback={() => ({
                    header: (
                      <Box color="text-status-error" fontWeight="bold">
                        Custom header
                      </Box>
                    ),
                    description: <Box color="text-status-error">Custom description</Box>,
                    action: <Box color="text-status-error">Custom action</Box>,
                  })}
                />

                <ErrorBoundaryFallback
                  title="Without action"
                  fallback={() => ({
                    header: (
                      <Box color="text-status-error" fontWeight="bold">
                        Custom header
                      </Box>
                    ),
                    description: <Box color="text-status-error">Custom description</Box>,
                    action: null,
                  })}
                />
              </SpaceBetween>
            </Container>

            <Container header={<Box variant="h3">Provider props</Box>}>
              <ErrorBoundary
                onError={() => {}}
                fallback={() => ({ action: null })}
                feedback={{ href: '#' }}
                i18nStrings={{ headerText: 'Ooops, something is not right' }}
              >
                <Container>
                  <BrokenContent />
                </Container>
              </ErrorBoundary>
            </Container>
          </SpaceBetween>
        </SimplePage>
      </I18nProvider>
    </ScreenshotArea>
  );
}

function ErrorBoundaryFallback({
  title,
  ...props
}: Omit<ErrorBoundaryProps, 'children' | 'onError'> & { title: string }) {
  return (
    <SpaceBetween size="xxs">
      <Box>{title}</Box>
      <ErrorBoundary {...props} onError={() => {}}>
        <BrokenContent />
      </ErrorBoundary>
    </SpaceBetween>
  );
}

function BrokenContent() {
  return <>{{}}</>;
}
