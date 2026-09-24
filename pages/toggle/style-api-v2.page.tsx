// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import { SpaceBetween, Toggle } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

interface StyledToggleProps {
  label: string;
  checked: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  highlightState?: boolean;
}

function StyledToggle({ label, checked: initialChecked, disabled, readOnly, highlightState }: StyledToggleProps) {
  const [checked, setChecked] = useState(initialChecked);
  const isChecked = highlightState && checked;
  return (
    <Toggle
      checked={checked}
      disabled={disabled}
      readOnly={readOnly}
      onChange={({ detail }) => setChecked(detail.checked)}
      description="Get an email when a report is ready"
      {...{
        styleClassNames: {
          control: clsx(
            styles['toggle-control'],
            disabled && styles['toggle-control-disabled'],
            readOnly && styles['toggle-control-readonly']
          ),
          label: clsx(
            styles['toggle-label'],
            disabled && styles['toggle-label-disabled'],
            isChecked && styles['toggle-label-checked']
          ),
          description: clsx(
            styles['toggle-description'],
            disabled && styles['toggle-description-disabled'],
            isChecked && styles['toggle-description-checked']
          ),
        },
      }}
    >
      {label}
    </Toggle>
  );
}

export default function () {
  return (
    <SimplePage title="Toggle - Style API v2" screenshotArea={{}}>
      <SpaceBetween size="m" direction="horizontal">
        <StyledToggle label="Unchecked" checked={false} />
        <StyledToggle label="Unchecked disabled" checked={false} disabled={true} />
        <StyledToggle label="Unchecked read-only" checked={false} readOnly={true} />
      </SpaceBetween>
      <SpaceBetween size="m" direction="horizontal">
        <StyledToggle label="Checked" checked={true} />
        <StyledToggle label="Checked disabled" checked={true} disabled={true} />
        <StyledToggle label="Checked read-only" checked={true} readOnly={true} />
      </SpaceBetween>
      <SpaceBetween size="m" direction="horizontal">
        <StyledToggle label="Highlighted" checked={false} highlightState={true} />
      </SpaceBetween>
    </SimplePage>
  );
}
