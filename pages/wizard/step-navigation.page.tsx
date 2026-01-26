// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import ColumnLayout from '~components/column-layout';
import Container from '~components/container';
import FormField from '~components/form-field';
import Header from '~components/header';
import Input from '~components/input';
import Link from '~components/link';
import RadioGroup from '~components/radio-group';
import SpaceBetween from '~components/space-between';
import Toggle from '~components/toggle';
import Wizard, { WizardProps } from '~components/wizard';

import { i18nStrings, i18nStringsWithModal } from './common';

import styles from './styles.scss';

const steps: WizardProps.Step[] = [
  {
    title: 'Choose distribution settings',
    description: 'Configure the basic settings for your distribution.',
    content: (
      <Container header={<Header variant="h2">Distribution settings</Header>}>
        <SpaceBetween size="m">
          <FormField label="Distribution name">
            <Input value="" placeholder="Enter distribution name" onChange={() => {}} />
          </FormField>
          <FormField label="Origin domain name">
            <Input value="" placeholder="example.com" onChange={() => {}} />
          </FormField>
        </SpaceBetween>
      </Container>
    ),
  },
  {
    title: 'Configure origin settings',
    isOptional: true,
    description: 'Specify where your content originates from.',
    content: (
      <Container header={<Header variant="h2">Origin settings</Header>}>
        <SpaceBetween size="m">
          <FormField label="Origin path">
            <Input value="" placeholder="/path" onChange={() => {}} />
          </FormField>
          <FormField label="Origin protocol policy">
            <RadioGroup
              value="https-only"
              items={[
                { value: 'https-only', label: 'HTTPS only' },
                { value: 'match-viewer', label: 'Match viewer' },
                { value: 'http-only', label: 'HTTP only' },
              ]}
              onChange={() => {}}
            />
          </FormField>
        </SpaceBetween>
      </Container>
    ),
  },
  {
    title: 'Configure cache behavior',
    isOptional: true,
    description: 'Define how CloudFront caches your content.',
    content: (
      <Container header={<Header variant="h2">Cache behavior settings</Header>}>
        <SpaceBetween size="m">
          <FormField label="Path pattern">
            <Input value="*" onChange={() => {}} />
          </FormField>
          <FormField label="Viewer protocol policy">
            <RadioGroup
              value="redirect-https"
              items={[
                { value: 'redirect-https', label: 'Redirect HTTP to HTTPS' },
                { value: 'https-only', label: 'HTTPS only' },
                { value: 'http-https', label: 'HTTP and HTTPS' },
              ]}
              onChange={() => {}}
            />
          </FormField>
        </SpaceBetween>
      </Container>
    ),
  },
  {
    title: 'Configure SSL certificate',
    isOptional: true,
    content: (
      <Container header={<Header variant="h2">SSL certificate</Header>}>
        <FormField label="Certificate">
          <RadioGroup
            value="default"
            items={[
              { value: 'default', label: 'Default CloudFront certificate' },
              { value: 'custom', label: 'Custom SSL certificate' },
            ]}
            onChange={() => {}}
          />
        </FormField>
      </Container>
    ),
  },
  {
    title: 'Configure logging',
    isOptional: true,
    content: (
      <Container header={<Header variant="h2">Logging settings</Header>}>
        <SpaceBetween size="m">
          <FormField label="Enable logging">
            <Toggle checked={false} onChange={() => {}}>
              Log requests to S3 bucket
            </Toggle>
          </FormField>
        </SpaceBetween>
      </Container>
    ),
  },
  {
    title: 'Review and create',
    info: <Link variant="info">Info</Link>,
    description: 'Review your configuration before creating the distribution.',
    content: (
      <SpaceBetween size="l">
        <Container header={<Header variant="h2">Distribution summary</Header>}>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="awsui-key-label">Distribution name</Box>
              <Box>my-distribution</Box>
            </div>
            <div>
              <Box variant="awsui-key-label">Origin domain</Box>
              <Box>example.com</Box>
            </div>
            <div>
              <Box variant="awsui-key-label">Protocol policy</Box>
              <Box>HTTPS only</Box>
            </div>
            <div>
              <Box variant="awsui-key-label">Cache behavior</Box>
              <Box>Redirect HTTP to HTTPS</Box>
            </div>
          </ColumnLayout>
        </Container>
      </SpaceBetween>
    ),
  },
];

export default function StepNavigationPage() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [smallContainer, setSmallContainer] = useState(true);
  const [useModalNavigation, setUseModalNavigation] = useState(false);
  const [allowSkipTo, setAllowSkipTo] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const currentI18nStrings = useModalNavigation ? i18nStringsWithModal : i18nStrings;

  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Container header={<Header variant="h2">Step Navigation Demo Options</Header>}>
          <SpaceBetween size="m">
            <Toggle checked={smallContainer} onChange={({ detail }) => setSmallContainer(detail.checked)}>
              Small container (shows collapsed step navigation)
            </Toggle>
            <Toggle checked={useModalNavigation} onChange={({ detail }) => setUseModalNavigation(detail.checked)}>
              Use modal navigation (requires additional i18n strings)
            </Toggle>
            <Toggle checked={allowSkipTo} onChange={({ detail }) => setAllowSkipTo(detail.checked)}>
              Allow skip to (enables skipping optional steps)
            </Toggle>
            <Toggle checked={isLoading} onChange={({ detail }) => setIsLoading(detail.checked)}>
              Loading state (disables navigation)
            </Toggle>
          </SpaceBetween>
        </Container>

        <Box>
          <Header variant="h2">
            {useModalNavigation ? 'Modal Navigation Variant' : 'Dropdown Navigation Variant (Default)'}
          </Header>
          <Box variant="p" color="text-body-secondary">
            {useModalNavigation
              ? 'Using modal for step navigation. Requires stepNavigationTitle, stepNavigationConfirmButton, and cancelButton i18n strings.'
              : 'Using dropdown for step navigation. No additional i18n strings required - works with basic i18n strings.'}
          </Box>
        </Box>

        <div
          id="wizard-container"
          className={smallContainer ? styles['scrollable-container'] : ''}
          style={smallContainer ? { maxWidth: '600px' } : undefined}
        >
          <Wizard
            id="step-navigation-wizard"
            steps={steps}
            i18nStrings={currentI18nStrings}
            activeStepIndex={activeStepIndex}
            isLoadingNextStep={isLoading}
            allowSkipTo={allowSkipTo}
            onNavigate={e => {
              console.log('Navigate:', e.detail);
              setActiveStepIndex(e.detail.requestedStepIndex);
            }}
            onCancel={() => console.log('Cancelled')}
            onSubmit={() => console.log('Submitted')}
          />
        </div>
      </SpaceBetween>
    </Box>
  );
}
