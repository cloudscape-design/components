// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import {
  Alert,
  Box,
  Button,
  Container,
  ErrorBoundary,
  ErrorBoundaryProps,
  Link,
  SpaceBetween,
  StatusIndicator,
} from '~components';
import { colorBackgroundStatusWarning } from '~design-tokens';

import { SimplePage } from '../app/templates';

// Mute console errors on this page to not trigger unexpected console error checks in e2e tests.
window.addEventListener('error', e => e.preventDefault(), true);
console.error = () => {};

export default function () {
  return (
    <SimplePage title="Error boundary fallbacks" i18n={{}}>
      <SpaceBetween size="l">
        <Section title="Default">
          <Example code="{}" />
          <Example
            code="{ i18nStrings: { components: { Feedback: FeedbackLink } } }"
            i18nStrings={{ components: { Feedback } }}
          />
          <Example
            code="{ i18nStrings: { components: { Feedback: FeedbackButton } } }"
            i18nStrings={{ components: { Feedback: FeedbackButton } }}
          />
        </Section>

        <Section title="i18n-strings">
          <Example
            code="{ i18nStrings: { headerText: 'Header', descriptionText: 'Description', refreshActionText: 'Refresh' } }"
            i18nStrings={{ headerText: 'Header', descriptionText: 'Description', refreshActionText: 'Refresh' }}
          />

          <Example
            code="{ i18nStrings: { descriptionText: 'Description <Feedback></Feedback>', components: { Feedback } } }"
            i18nStrings={{
              descriptionText: 'Description <Feedback></Feedback>',
              components: { Feedback: FeedbackNoProps },
            }}
          />

          <Example
            code="{ i18nStrings: { descriptionText: 'Description <Feedback>feedback text</Feedback>', components: { Feedback } } }"
            i18nStrings={{
              descriptionText: 'Description <Feedback>feedback text</Feedback>',
              components: { Feedback },
            }}
          />
        </Section>

        <Section title="Custom render">
          <Example
            code="{ renderFallback: (def) => <Alert type='error' {...def} style={customStyle}>{def.description}</Alert> }"
            renderFallback={def => (
              <Alert type="error" {...def} style={{ root: { background: colorBackgroundStatusWarning } }}>
                {def.description}
              </Alert>
            )}
          />

          <Example
            code="{ i18nStrings: { components: { Feedback } }, renderFallback: (def) => <CustomFallback {...def} /> }"
            i18nStrings={{ components: { Feedback } }}
            renderFallback={def => (
              <Container
                header={
                  <StatusIndicator type="warning">
                    <Box fontSize="heading-s" fontWeight="bold" variant="span">
                      {def.header}
                    </Box>
                  </StatusIndicator>
                }
              >
                {def.description}
              </Container>
            )}
          />

          <Example
            code="{ renderFallback: () => <CustomFallback /> }"
            renderFallback={() => (
              <Container
                header={
                  <Box fontSize="heading-s" fontWeight="bold" variant="span">
                    Custom header
                  </Box>
                }
              >
                Custom content
              </Container>
            )}
          />
        </Section>
      </SpaceBetween>
    </SimplePage>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <SpaceBetween size="xs">
      <Box variant="h2">{title}</Box>
      <SpaceBetween size="m">{children}</SpaceBetween>
    </SpaceBetween>
  );
}

function Example({ code, ...props }: Omit<ErrorBoundaryProps, 'children' | 'onError'> & { code: string }) {
  return (
    <SpaceBetween size="xxs">
      <Box variant="awsui-inline-code">{code}</Box>
      <ErrorBoundary {...props} onError={() => {}}>
        <>{{}}</>
      </ErrorBoundary>
    </SpaceBetween>
  );
}

function Feedback({ children }: { children: React.ReactNode }) {
  return <Link>{children}</Link>;
}

function FeedbackButton({ children }: { children: React.ReactNode }) {
  return <Button variant="inline-link">{children}</Button>;
}

function FeedbackNoProps() {
  return <Link>consumer-provided action text</Link>;
}
