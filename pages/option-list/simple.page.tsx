// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Dialog from '~components/dialog';
import Header from '~components/header';
import Multiselect from '~components/multiselect';
import OptionList, { OptionListProps } from '~components/option-list';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';

const goals: OptionListProps.Option[] = [
  { value: 'cost', label: 'Reduce cost', description: 'Prioritize cheaper instance types and storage tiers.' },
  { value: 'performance', label: 'Improve performance', description: 'Prioritize latency and throughput.' },
  { value: 'reliability', label: 'Increase reliability', description: 'Add redundancy across Availability Zones.' },
  { value: 'security', label: 'Strengthen security', description: 'Tighten IAM policies and encryption settings.' },
];

const goalLabels: OptionListProps.Option[] = goals.map(({ value, label }) => ({ value, label }));

const goalsWithIcons: OptionListProps.Option[] = goals.map(goal => ({
  ...goal,
  iconName: 'settings',
  labelTag: goal.value === 'cost' ? 'Recommended' : undefined,
  tags: ['Quick win'],
}));

const goalsWithDisabled: OptionListProps.Option[] = goals.map(goal =>
  goal.value === 'reliability'
    ? { ...goal, disabled: true, disabledReason: 'The workload already runs in three Availability Zones.' }
    : goal
);

const services: OptionListProps.Options = [
  { value: 'all-regions', label: 'All Regions' },
  {
    label: 'Compute',
    value: 'compute',
    options: [
      { value: 'ec2', label: 'EC2', description: 'Virtual servers' },
      { value: 'lambda', label: 'Lambda', description: 'Serverless functions' },
    ],
  },
  {
    label: 'Storage',
    value: 'storage',
    options: [
      { value: 's3', label: 'S3', description: 'Object storage' },
      { value: 'ebs', label: 'EBS', description: 'Block storage', disabled: true, disabledReason: 'Not enabled' },
    ],
  },
];

const values = (options: ReadonlyArray<OptionListProps.Option>) => options.map(option => option.value).join(', ');

function FollowUpQuestion() {
  const [selectedOptions, setSelectedOptions] = useState<ReadonlyArray<OptionListProps.Option>>([]);
  const [submitted, setSubmitted] = useState<string | null>(null);
  return (
    <SpaceBetween size="xs">
      <Dialog
        header={<span id="follow-up-question">What should we optimize for?</span>}
        onDismiss={() => setSubmitted('Dismissed')}
        i18nStrings={{ dismissAriaLabel: 'Close' }}
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={() => setSubmitted('Skipped')}>Skip</Button>
              <Button
                variant="primary"
                disabled={selectedOptions.length === 0}
                onClick={() => setSubmitted(`Submitted: ${values(selectedOptions)}`)}
              >
                Continue
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        <OptionList
          ariaLabelledby="follow-up-question"
          options={goalLabels}
          selectionType="single"
          selectedOptions={selectedOptions}
          onChange={({ detail }) => setSelectedOptions(detail.selectedOptions)}
        />
      </Dialog>
      <Box variant="small" data-testid="follow-up-result">
        {submitted ?? 'Not submitted'}
      </Box>
    </SpaceBetween>
  );
}

function Section({
  id,
  title,
  options,
  selectionType,
  initial = [],
}: {
  id: string;
  title: string;
  options: OptionListProps.Options;
  selectionType: OptionListProps.SelectionType;
  initial?: ReadonlyArray<OptionListProps.Option>;
}) {
  const [selectedOptions, setSelectedOptions] = useState(initial);
  return (
    <SpaceBetween size="xs">
      <Header variant="h2" id={`${id}-heading`}>
        {title}
      </Header>
      <OptionList
        data-testid={id}
        ariaLabelledby={`${id}-heading`}
        options={options}
        selectionType={selectionType}
        selectedOptions={selectedOptions}
        onChange={({ detail }) => setSelectedOptions(detail.selectedOptions)}
      />
      <Box variant="small" data-testid={`${id}-value`}>
        Selected: {values(selectedOptions) || 'none'}
      </Box>
    </SpaceBetween>
  );
}

function SharedWithMultiselect() {
  const [selectedOptions, setSelectedOptions] = useState<ReadonlyArray<OptionListProps.Option>>([]);
  return (
    <SpaceBetween size="xs">
      <Header variant="h2" id="shared-heading">
        Same options and selection shared with Multiselect
      </Header>
      <Multiselect
        options={services}
        selectedOptions={selectedOptions}
        onChange={({ detail }) => setSelectedOptions(detail.selectedOptions)}
        placeholder="Choose services"
        ariaLabel="Services"
      />
      <OptionList
        ariaLabelledby="shared-heading"
        options={services}
        selectionType="multi"
        selectedOptions={selectedOptions}
        onChange={({ detail }) => setSelectedOptions(detail.selectedOptions)}
      />
    </SpaceBetween>
  );
}

export default function OptionListSimplePage() {
  return (
    <SimplePage title="Option list">
      <div style={{ maxInlineSize: 520 }}>
        <SpaceBetween size="xl">
          <Section id="single" title="Single selection" options={goals} selectionType="single" />
          <Section id="multi" title="Multi selection" options={goals} selectionType="multi" />
          <Section
            id="icons"
            title="With icons, label tag, tags and a preselected option"
            options={goalsWithIcons}
            selectionType="single"
            initial={[goalsWithIcons[1]]}
          />
          <Section id="disabled" title="With a disabled option" options={goalsWithDisabled} selectionType="multi" />
          <Section id="grouped-single" title="Groups, single selection" options={services} selectionType="single" />
          <Section id="grouped-multi" title="Groups, multi selection" options={services} selectionType="multi" />
          <SharedWithMultiselect />

          <SpaceBetween size="xs">
            <Header variant="h2" id="uncontrolled-heading">
              Uncontrolled
            </Header>
            <OptionList ariaLabelledby="uncontrolled-heading" options={goalLabels} selectionType="multi" />
          </SpaceBetween>

          <SpaceBetween size="xs">
            <Header variant="h2">In the follow-up questions Dialog</Header>
            <FollowUpQuestion />
          </SpaceBetween>
        </SpaceBetween>
      </div>
    </SimplePage>
  );
}
