// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Header from '~components/header';
import Icon from '~components/icon';
import OptionList, { OptionListProps } from '~components/option-list';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';

const goals: OptionListProps.Option[] = [
  {
    value: 'cost',
    label: 'Reduce cost',
    description: 'Prioritize cheaper instance types and storage tiers.',
    icon: <Icon name="settings" />,
  },
  { value: 'performance', label: 'Improve performance', description: 'Prioritize latency and throughput.' },
  { value: 'reliability', label: 'Increase reliability', description: 'Add redundancy across Availability Zones.' },
  { value: 'security', label: 'Strengthen security', description: 'Tighten IAM policies and encryption settings.' },
];

const services: OptionListProps.Options = [
  {
    value: 'compute',
    label: 'Compute',
    options: [
      { value: 'ec2', label: 'Amazon EC2' },
      { value: 'lambda', label: 'AWS Lambda' },
    ],
  },
  {
    value: 'storage',
    label: 'Storage',
    options: [
      { value: 's3', label: 'Amazon S3' },
      { value: 'efs', label: 'Amazon EFS', disabled: true, disabledReason: 'Not available in this Region.' },
    ],
  },
];

function Section({
  id,
  title,
  options,
  selectionType,
}: {
  id: string;
  title: string;
  options: OptionListProps.Options;
  selectionType: OptionListProps.SelectionType;
}) {
  const [selectedOptions, setSelectedOptions] = useState<ReadonlyArray<OptionListProps.Option>>([]);
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
        Selected: {selectedOptions.map(option => option.value).join(', ') || 'none'}
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
          <Section id="groups" title="Multi selection with groups" options={services} selectionType="multi" />
        </SpaceBetween>
      </div>
    </SimplePage>
  );
}
