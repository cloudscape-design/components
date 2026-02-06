// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout from '~components/app-layout';
import Box from '~components/box';
import BreadcrumbGroup from '~components/breadcrumb-group';
import ColumnLayout from '~components/column-layout';
import Container from '~components/container';
import FormField from '~components/form-field';
import Header from '~components/header';
import Input from '~components/input';
import Link from '~components/link';
import RadioGroup from '~components/radio-group';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';
import Tiles from '~components/tiles';
import Wizard, { WizardProps } from '~components/wizard';

import ScreenshotArea from '../utils/screenshot-area';
import { i18nStrings } from './common';

const appLayoutLabels = {
  navigation: 'Side navigation',
  navigationToggle: 'Open navigation',
  navigationClose: 'Close navigation',
  notifications: 'Notifications',
  tools: 'Tools',
  toolsToggle: 'Open tools',
  toolsClose: 'Close tools',
};

// Step 1: Choose instance type
function Step1Content() {
  const [instanceType, setInstanceType] = useState('t3.micro');

  return (
    <SpaceBetween size="l">
      <Container header={<Header variant="h2">Instance type</Header>}>
        <Tiles
          value={instanceType}
          onChange={({ detail }) => setInstanceType(detail.value)}
          columns={3}
          items={[
            {
              value: 't3.micro',
              label: 't3.micro',
              description: '1 vCPU, 1 GiB memory',
            },
            {
              value: 't3.small',
              label: 't3.small',
              description: '2 vCPU, 2 GiB memory',
            },
            {
              value: 't3.medium',
              label: 't3.medium',
              description: '2 vCPU, 4 GiB memory',
            },
            {
              value: 't3.large',
              label: 't3.large',
              description: '2 vCPU, 8 GiB memory',
            },
            {
              value: 'm5.large',
              label: 'm5.large',
              description: '2 vCPU, 8 GiB memory',
            },
            {
              value: 'm5.xlarge',
              label: 'm5.xlarge',
              description: '4 vCPU, 16 GiB memory',
            },
          ]}
        />
      </Container>
    </SpaceBetween>
  );
}

// Step 2: Configure storage
function Step2Content() {
  const [volumeSize, setVolumeSize] = useState('30');
  const [volumeType, setVolumeType] = useState<SelectProps.Option | null>({
    value: 'gp3',
    label: 'General Purpose SSD (gp3)',
  });

  return (
    <SpaceBetween size="l">
      <Container header={<Header variant="h2">Storage configuration</Header>}>
        <SpaceBetween size="l">
          <FormField label="Volume size (GiB)" description="Size of the root volume">
            <Input value={volumeSize} onChange={({ detail }) => setVolumeSize(detail.value)} type="number" />
          </FormField>
          <FormField label="Volume type" description="The type of EBS volume">
            <Select
              selectedOption={volumeType}
              onChange={({ detail }) => setVolumeType(detail.selectedOption)}
              options={[
                { value: 'gp3', label: 'General Purpose SSD (gp3)' },
                { value: 'gp2', label: 'General Purpose SSD (gp2)' },
                { value: 'io1', label: 'Provisioned IOPS SSD (io1)' },
                { value: 'st1', label: 'Throughput Optimized HDD (st1)' },
              ]}
            />
          </FormField>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}

// Step 3: Configure security
function Step3Content() {
  const [securityOption, setSecurityOption] = useState('new');
  const [keyPair, setKeyPair] = useState<SelectProps.Option | null>(null);

  return (
    <SpaceBetween size="l">
      <Container header={<Header variant="h2">Security group</Header>}>
        <RadioGroup
          value={securityOption}
          onChange={({ detail }) => setSecurityOption(detail.value)}
          items={[
            {
              value: 'new',
              label: 'Create a new security group',
              description: 'A new security group will be created with default rules',
            },
            {
              value: 'existing',
              label: 'Select existing security groups',
              description: 'Choose from your existing security groups',
            },
          ]}
        />
      </Container>
      <Container header={<Header variant="h2">Key pair (login)</Header>}>
        <FormField label="Key pair name" description="A key pair is used to securely connect to your instance">
          <Select
            selectedOption={keyPair}
            onChange={({ detail }) => setKeyPair(detail.selectedOption)}
            placeholder="Select a key pair"
            options={[
              { value: 'my-key-pair', label: 'my-key-pair' },
              { value: 'dev-key', label: 'dev-key' },
              { value: 'production-key', label: 'production-key' },
            ]}
          />
        </FormField>
      </Container>
    </SpaceBetween>
  );
}

// Step 4: Add tags (optional)
function Step4Content() {
  const [tagKey, setTagKey] = useState('Name');
  const [tagValue, setTagValue] = useState('');

  return (
    <SpaceBetween size="l">
      <Container header={<Header variant="h2">Tags</Header>}>
        <SpaceBetween size="l">
          <FormField label="Key" description="Tag key">
            <Input value={tagKey} onChange={({ detail }) => setTagKey(detail.value)} />
          </FormField>
          <FormField label="Value" description="Tag value">
            <Input
              value={tagValue}
              onChange={({ detail }) => setTagValue(detail.value)}
              placeholder="Enter tag value"
            />
          </FormField>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}

// Step 5: Review
function Step5Content() {
  return (
    <SpaceBetween size="l">
      <Container header={<Header variant="h2">Review instance configuration</Header>}>
        <ColumnLayout columns={2} variant="text-grid">
          <SpaceBetween size="l">
            <div>
              <Box variant="awsui-key-label">Instance type</Box>
              <div>t3.micro</div>
            </div>
            <div>
              <Box variant="awsui-key-label">Storage</Box>
              <div>30 GiB gp3</div>
            </div>
          </SpaceBetween>
          <SpaceBetween size="l">
            <div>
              <Box variant="awsui-key-label">Security group</Box>
              <div>Create new</div>
            </div>
            <div>
              <Box variant="awsui-key-label">Key pair</Box>
              <div>my-key-pair</div>
            </div>
          </SpaceBetween>
        </ColumnLayout>
      </Container>
    </SpaceBetween>
  );
}

const steps: WizardProps.Step[] = [
  {
    title: 'Choose instance type',
    info: <Link variant="info">Info</Link>,
    description: 'Select the hardware configuration for your instance.',
    content: <Step1Content />,
  },
  {
    title: 'Configure storage',
    info: <Link variant="info">Info</Link>,
    description: 'Configure the storage options for your instance.',
    content: <Step2Content />,
  },
  {
    title: 'Configure security',
    info: <Link variant="info">Info</Link>,
    description: 'Set up security groups and key pairs.',
    content: <Step3Content />,
  },
  {
    title: 'Add tags',
    info: <Link variant="info">Info</Link>,
    description: 'Add tags to help organize and identify your resources.',
    isOptional: true,
    content: <Step4Content />,
  },
  {
    title: 'Review and launch',
    description: 'Review your configuration before launching the instance.',
    content: <Step5Content />,
  },
];

export default function WizardWithAppLayoutPage() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        contentType="wizard"
        ariaLabels={appLayoutLabels}
        navigationHide={true}
        toolsHide={true}
        breadcrumbs={
          <BreadcrumbGroup
            items={[
              { text: 'EC2', href: '#' },
              { text: 'Instances', href: '#' },
              { text: 'Launch instance', href: '#' },
            ]}
          />
        }
        content={
          <Wizard
            steps={steps}
            i18nStrings={i18nStrings}
            activeStepIndex={activeStepIndex}
            onNavigate={({ detail }) => setActiveStepIndex(detail.requestedStepIndex)}
            onCancel={() => console.log('Cancelled')}
            onSubmit={() => console.log('Submitted')}
          />
        }
      />
    </ScreenshotArea>
  );
}
