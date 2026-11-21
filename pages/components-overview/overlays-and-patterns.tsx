// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import ColumnLayout from '~components/column-layout';
import TokenGroup from '~components/token-group';
import Wizard from '~components/wizard';

import { Section, SubSection } from './utils';

export default function OverlaysAndPatterns() {
  const [tokens, setTokens] = useState([
    { label: 'us-east-1', dismissLabel: 'Remove us-east-1' },
    { label: 'eu-west-1', dismissLabel: 'Remove eu-west-1' },
    { label: 'ap-southeast-1', dismissLabel: 'Remove ap-southeast-1' },
  ]);
  const [activeWizardStep, setActiveWizardStep] = useState(0);

  return (
    <Section header="Tokens & patterns" level="h2">
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
