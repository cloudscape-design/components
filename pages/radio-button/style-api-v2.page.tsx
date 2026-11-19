// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import { RadioButton, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

interface StyledRadioGroupProps {
  name: string;
  value: string;
  disabled?: boolean;
  readOnly?: boolean;
}

const plans = [
  { value: 'free', label: 'Free plan', description: 'For personal projects' },
  { value: 'pro', label: 'Pro plan', description: 'Best for growing teams' },
  { value: 'enterprise', label: 'Enterprise plan', description: 'Custom limits and support' },
];

function StyledRadioGroup({ name, value: initialValue, disabled, readOnly }: StyledRadioGroupProps) {
  const [value, setValue] = useState(initialValue);
  return (
    <div role="radiogroup" aria-label={name}>
      {plans.map(plan => {
        const checked = plan.value === value;
        return (
          <RadioButton
            key={plan.value}
            name={name}
            value={plan.value}
            checked={checked}
            disabled={disabled}
            readOnly={readOnly}
            onSelect={() => setValue(plan.value)}
            description={plan.description}
            {...{
              styleClassNames: {
                control: clsx(
                  styles['radio-control'],
                  checked && styles['radio-control-checked'],
                  disabled && styles['radio-control-disabled'],
                  readOnly && styles['radio-control-readonly']
                ),
              },
            }}
          >
            {plan.label}
          </RadioButton>
        );
      })}
    </div>
  );
}

export default function () {
  return (
    <SimplePage title="RadioButton - Style API v2" screenshotArea={{}}>
      <SpaceBetween size="l" direction="horizontal">
        <StyledRadioGroup name="default" value="pro" />
        <StyledRadioGroup name="disabled" value="pro" disabled={true} />
        <StyledRadioGroup name="read-only" value="pro" readOnly={true} />
      </SpaceBetween>
    </SimplePage>
  );
}
