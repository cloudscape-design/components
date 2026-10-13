// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Header from '~components/header';
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

export default function OptionListSimplePage() {
  return (
    <SimplePage title="Option list" screenshotArea={{}}>
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

          <SpaceBetween size="xs">
            <Header variant="h2" id="uncontrolled-heading">
              Uncontrolled
            </Header>
            <OptionList
              data-testid="uncontrolled"
              ariaLabelledby="uncontrolled-heading"
              options={goalLabels}
              selectionType="multi"
            />
          </SpaceBetween>
        </SpaceBetween>
      </div>
    </SimplePage>
  );
}
