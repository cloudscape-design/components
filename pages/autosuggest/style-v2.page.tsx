// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { Autosuggest, Checkbox, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-v2.scss';

export default function StyleV2AutosuggestPage() {
  const [value, setValue] = useState('');
  const [styled, setStyled] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const computeValues = ['EC2', 'Lambda', 'ECS'];

  const groupedOptions = [
    {
      label: 'Compute',
      options: [{ value: 'EC2' }, { value: 'Lambda' }, { value: 'ECS' }],
    },
    {
      label: 'Storage',
      options: [{ value: 'S3' }, { value: 'EBS' }, { value: 'EFS', disabled: true }],
    },
  ];

  return (
    <SimplePage
      title="Autosuggest with Style API v2"
      screenshotArea={{}}
      settings={
        <SpaceBetween size="xs">
          <Checkbox checked={styled} onChange={({ detail }) => setStyled(detail.checked)}>
            styled
          </Checkbox>
          <Checkbox checked={disabled} onChange={({ detail }) => setDisabled(detail.checked)}>
            disabled
          </Checkbox>
          <Checkbox checked={readOnly} onChange={({ detail }) => setReadOnly(detail.checked)}>
            readOnly
          </Checkbox>
          <Checkbox checked={invalid} onChange={({ detail }) => setInvalid(detail.checked)}>
            invalid
          </Checkbox>
        </SpaceBetween>
      }
    >
      <Autosuggest
        value={value}
        onChange={({ detail }) => setValue(detail.value)}
        placeholder="Search services..."
        enteredTextLabel={v => `Use: ${v}`}
        options={groupedOptions}
        disabled={disabled}
        readOnly={readOnly}
        invalid={invalid}
        classNames={{
          root: styled ? (invalid ? styles['styled-autosuggest-invalid'] : styles['styled-autosuggest']) : undefined,
          options: styled
            ? ({ option }) =>
                computeValues.includes(option.value!) ? styles['option-compute'] : styles['option-storage']
            : undefined,
        }}
      />
    </SimplePage>
  );
}
