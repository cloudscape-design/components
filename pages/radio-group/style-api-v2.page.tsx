// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import { RadioGroup, RadioGroupProps, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

const plans: RadioGroupProps.RadioButtonDefinition[] = [
  { value: 'free', label: 'Free plan', description: 'For personal projects' },
  { value: 'pro', label: 'Pro plan', description: 'Best for growing teams' },
  { value: 'enterprise', label: 'Enterprise plan', description: 'Custom limits and support' },
];

const plansWithDisabled: RadioGroupProps.RadioButtonDefinition[] = [
  plans[0],
  plans[1],
  { ...plans[2], disabled: true },
];

interface StyledRadioGroupProps {
  ariaLabel: string;
  items: RadioGroupProps.RadioButtonDefinition[];
  readOnly?: boolean;
  direction?: RadioGroupProps['direction'];
}

function StyledRadioGroup({ ariaLabel, items, readOnly, direction }: StyledRadioGroupProps) {
  const [value, setValue] = useState('pro');
  return (
    <RadioGroup
      ariaLabel={ariaLabel}
      value={value}
      items={items}
      readOnly={readOnly}
      direction={direction}
      onChange={({ detail }) => setValue(detail.value)}
      {...{
        styleClassNames: {
          radioButton: { control: clsx(styles['radio-control'], readOnly && styles['radio-control-readonly']) },
        },
      }}
    />
  );
}

export default function () {
  return (
    <SimplePage title="RadioGroup - Style API v2" screenshotArea={{}}>
      <SpaceBetween size="l" direction="horizontal">
        <StyledRadioGroup ariaLabel="Default" items={plansWithDisabled} />
        <StyledRadioGroup ariaLabel="Read-only" items={plans} readOnly={true} />
      </SpaceBetween>
      <SpaceBetween size="l" direction="horizontal">
        <StyledRadioGroup ariaLabel="Horizontal" items={plans} direction="horizontal" />
      </SpaceBetween>
    </SimplePage>
  );
}
