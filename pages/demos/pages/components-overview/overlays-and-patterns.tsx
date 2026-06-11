// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
// code-view replaced with <pre> — @cloudscape-design/code-view not available in this environment
import React, { useState } from 'react';

import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import TokenGroup from '@cloudscape-design/components/token-group';
import Wizard from '@cloudscape-design/components/wizard';

import { Section, SubSection } from './utils';

const codeSnippet = `import { applyTheme } from '@cloudscape-design/components/theming';

applyTheme({
  theme: {
    tokens: {
      colorBackgroundLayoutMain: '#f5f5f5',
      borderRadiusContainer: '8px',
    },
  },
});`;

export default function OverlaysAndPatterns() {
  const [tokens, setTokens] = useState([
    { label: 'us-east-1', dismissLabel: 'Remove us-east-1' },
    { label: 'eu-west-1', dismissLabel: 'Remove eu-west-1' },
    { label: 'ap-southeast-1', dismissLabel: 'Remove ap-southeast-1' },
  ]);
  const [activeWizardStep, setActiveWizardStep] = useState(0);

  return (
    <Section header="Tokens, code & patterns" level="h2">
      <>
        <SubSection header="Token group">
          <ColumnLayout columns={2}>
            <TokenGroup
              items={tokens}
              onDismiss={({ detail }) => setTokens(tokens.filter((_, i) => i !== detail.itemIndex))}
            />
            <TokenGroup
              items={[{ label: 'Read-only token 1' }, { label: 'Read-only token 2' }, { label: 'Read-only token 3' }]}
              readOnly={true}
            />
          </ColumnLayout>
        </SubSection>

        <SubSection header="Code view">
          <pre
            style={{
              padding: '12px',
              background: 'var(--color-background-code-view)',
              overflow: 'auto',
              fontSize: '13px',
            }}
          >
            {codeSnippet}
          </pre>
        </SubSection>

        <SubSection header="Wizard">
          <Box padding={{ vertical: 's' }}>
            <Wizard
              i18nStrings={{
                stepNumberLabel: stepNumber => `Step ${stepNumber}`,
                collapsedStepsLabel: (stepNumber, stepsCount) => `Step ${stepNumber} of ${stepsCount}`,
                cancelButton: 'Cancel',
                previousButton: 'Previous',
                nextButton: 'Next',
                submitButton: 'Create distribution',
                optional: 'optional',
              }}
              activeStepIndex={activeWizardStep}
              onNavigate={({ detail }) => setActiveWizardStep(detail.requestedStepIndex)}
              steps={[
                {
                  title: 'Choose origin',
                  description: 'Select the origin for your distribution.',
                  content: (
                    <Box padding={{ vertical: 's' }}>
                      Configure the origin settings for your CloudFront distribution.
                    </Box>
                  ),
                },
                {
                  title: 'Configure behaviors',
                  description: 'Set up cache behaviors and path patterns.',
                  content: (
                    <Box padding={{ vertical: 's' }}>
                      Define how CloudFront handles requests for different URL paths.
                    </Box>
                  ),
                },
                {
                  title: 'Review and create',
                  description: 'Review your configuration before creating.',
                  content: (
                    <Box padding={{ vertical: 's' }}>Review all settings and confirm the distribution creation.</Box>
                  ),
                },
              ]}
            />
          </Box>
        </SubSection>
      </>
    </Section>
  );
}
