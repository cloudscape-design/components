// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import { Checkbox, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

interface StyledCheckboxProps {
  label: string;
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  highlightState?: boolean;
}

function StyledCheckbox({
  label,
  checked: initialChecked,
  indeterminate: initialIndeterminate,
  disabled,
  readOnly,
  highlightState,
}: StyledCheckboxProps) {
  const [state, setState] = useState({ checked: initialChecked, indeterminate: initialIndeterminate });
  const isIndeterminate = highlightState && state.indeterminate;
  const isChecked = highlightState && !state.indeterminate && state.checked;
  return (
    <Checkbox
      checked={state.checked}
      indeterminate={state.indeterminate}
      disabled={disabled}
      readOnly={readOnly}
      onChange={({ detail }) => setState(detail)}
      description="Get an email when a report is ready"
      {...{
        styleClassNames: {
          control: clsx(
            styles['checkbox-control'],
            disabled && styles['checkbox-control-disabled'],
            readOnly && styles['checkbox-control-readonly']
          ),
          label: clsx(
            styles['checkbox-label'],
            disabled && styles['checkbox-label-disabled'],
            isChecked && styles['checkbox-label-checked'],
            isIndeterminate && styles['checkbox-label-indeterminate']
          ),
          description: clsx(
            styles['checkbox-description'],
            disabled && styles['checkbox-description-disabled'],
            isChecked && styles['checkbox-description-checked'],
            isIndeterminate && styles['checkbox-description-indeterminate']
          ),
        },
      }}
    >
      {label}
    </Checkbox>
  );
}

export default function () {
  return (
    <SimplePage title="Checkbox - Style API v2" screenshotArea={{}}>
      <SpaceBetween size="m" direction="horizontal">
        <StyledCheckbox label="Unchecked" checked={false} />
        <StyledCheckbox label="Unchecked disabled" checked={false} disabled={true} />
        <StyledCheckbox label="Unchecked read-only" checked={false} readOnly={true} />
      </SpaceBetween>
      <SpaceBetween size="m" direction="horizontal">
        <StyledCheckbox label="Checked" checked={true} />
        <StyledCheckbox label="Checked disabled" checked={true} disabled={true} />
        <StyledCheckbox label="Checked read-only" checked={true} readOnly={true} />
      </SpaceBetween>
      <SpaceBetween size="m" direction="horizontal">
        <StyledCheckbox label="Indeterminate" checked={true} indeterminate={true} />
        <StyledCheckbox label="Indeterminate disabled" checked={true} indeterminate={true} disabled={true} />
        <StyledCheckbox label="Indeterminate read-only" checked={true} indeterminate={true} readOnly={true} />
      </SpaceBetween>
      <SpaceBetween size="m" direction="horizontal">
        <StyledCheckbox label="Highlighted" checked={false} highlightState={true} />
        <StyledCheckbox label="Highlighted indeterminate" checked={true} indeterminate={true} highlightState={true} />
      </SpaceBetween>
    </SimplePage>
  );
}
